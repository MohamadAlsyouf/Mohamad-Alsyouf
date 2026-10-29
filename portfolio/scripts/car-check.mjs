import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Focused WebGL visual regression check. Start Vite separately, then run:
// node scripts/car-check.mjs [http://127.0.0.1:4173]
// Screenshots and diagnostics are written only to the ignored .qa directory.
const projectDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const artifactsDirectory = path.join(projectDirectory, '.qa')
const profileDirectory = path.join(
  artifactsDirectory,
  `car-profile-${process.pid}-${Date.now()}`,
)
const baseUrl = process.argv[2] || 'http://127.0.0.1:4173'
const origin = new URL(baseUrl).origin
const browserPath = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]
  .filter(Boolean)
  .find(existsSync)
if (!browserPath)
  throw new Error(
    'Chrome or Edge was not found. Set CHROME_PATH to its executable.',
  )

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))
const checks = []
const runtimeErrors = []
const assetErrors = []
const networkFailures = []
const requests = new Map()
let browser
let connection
let browserOutput = ''
const sceneSelector = '.e30-scene, .hero-scene'
const canvasSelector = '.e30-scene canvas, .hero-scene canvas'

class Connection {
  constructor(socket) {
    this.socket = socket
    this.sequence = 0
    this.pending = new Map()
    this.listeners = new Map()
    socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data)
      if (message.id) {
        const pending = this.pending.get(message.id)
        if (!pending) return
        clearTimeout(pending.timeout)
        this.pending.delete(message.id)
        if (message.error)
          pending.reject(new Error(JSON.stringify(message.error)))
        else pending.resolve(message.result)
      } else {
        for (const listener of this.listeners.get(message.method) || [])
          listener(message.params)
      }
    })
    socket.addEventListener('close', () => {
      for (const pending of this.pending.values()) {
        clearTimeout(pending.timeout)
        pending.reject(new Error('Browser connection closed.'))
      }
      this.pending.clear()
    })
  }
  send(method, params = {}) {
    const id = ++this.sequence
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error(`Browser command timed out: ${method}`))
      }, 20_000)
      this.pending.set(id, { resolve, reject, timeout })
      this.socket.send(JSON.stringify({ id, method, params }))
    })
  }
  on(method, listener) {
    const listeners = this.listeners.get(method) || []
    listeners.push(listener)
    this.listeners.set(method, listeners)
  }
}

async function evaluate(expression) {
  const result = await connection.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  })
  if (result.exceptionDetails)
    throw new Error(
      result.exceptionDetails.exception?.description ||
        result.exceptionDetails.text,
    )
  return result.result.value
}
async function waitFor(expression, description, timeout = 30_000) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (await evaluate(`Boolean(${expression})`)) return
    await delay(125)
  }
  throw new Error(`Timed out waiting for ${description}.`)
}
function assert(condition, description, detail) {
  checks.push({
    passed: Boolean(condition),
    description,
    ...(detail === undefined ? {} : { detail }),
  })
  console.log(
    `${condition ? 'PASS' : 'FAIL'} ${description}${detail === undefined ? '' : ': ' + JSON.stringify(detail)}`,
  )
}
async function settleCanvas() {
  await connection.send('Page.bringToFront')
  await evaluate(
    `document.querySelector(${JSON.stringify(sceneSelector)})?.scrollIntoView({block:'center',behavior:'instant'})`,
  )
  await waitFor(
    `document.visibilityState === 'visible' && document.querySelector(${JSON.stringify(canvasSelector)})`,
    'the visible car canvas',
  )
  await evaluate(
    `new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(true))))`,
  )
  await delay(500)
}
async function navigate() {
  await connection.send('Page.navigate', { url: baseUrl })
  await waitFor(
    `document.readyState === 'complete' && document.querySelector('h1')`,
    'the application',
  )
  await evaluate(`document.fonts.ready.then(() => true)`)
  await waitFor(
    `document.querySelector(${JSON.stringify(canvasSelector)})`,
    'the WebGL car renderer',
  )
  await waitFor(
    `document.querySelector('[data-model-ready="true"], [data-model-state="ready"]')`,
    'the car geometry to finish loading',
  )
  await settleCanvas()
}
async function setTheme(theme) {
  const current = await evaluate(`document.documentElement.dataset.theme`)
  if (current !== theme) {
    await evaluate(
      `document.querySelector('[aria-label="Switch to ${theme} mode"]')?.click()`,
    )
    await waitFor(
      `document.documentElement.dataset.theme === ${JSON.stringify(theme)}`,
      `${theme} theme`,
    )
    await delay(800)
  }
  await settleCanvas()
}
async function capture(name, { canvasOnly = false, top = false } = {}) {
  await connection.send('Page.bringToFront')
  if (top) {
    await evaluate(`window.scrollTo({top:0,behavior:'instant'})`)
    await delay(300)
  }
  const clip = canvasOnly
    ? await evaluate(
        `(() => {const rect=document.querySelector(${JSON.stringify(canvasSelector)}).getBoundingClientRect();return {x:rect.left,y:rect.top+scrollY,width:rect.width,height:rect.height,scale:1}})()`,
      )
    : undefined
  const { data } = await connection.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: Boolean(clip),
    ...(clip ? { clip } : {}),
  })
  const bytes = Buffer.from(data, 'base64')
  const filename = path.join(artifactsDirectory, `${name}.png`)
  await writeFile(filename, bytes)
  console.log(`SCREENSHOT ${filename}`)
  return createHash('sha256').update(bytes).digest('hex')
}
async function checkScene(label) {
  const state = await evaluate(
    `(() => {const scene=document.querySelector(${JSON.stringify(sceneSelector)});const canvas=scene?.querySelector('canvas');const rect=canvas?.getBoundingClientRect();return {canvas:Boolean(canvas),fallback:Array.from(scene?.querySelectorAll('.scene-fallback')||[]).some(element=>!element.closest('canvas')),width:canvas?.width,height:canvas?.height,rect:rect?{left:rect.left,right:rect.right,width:rect.width,height:rect.height}:null,page:document.documentElement.scrollWidth,viewport:innerWidth}})()`,
  )
  assert(
    state.canvas && !state.fallback && state.width > 0 && state.height > 0,
    `${label}: actual car WebGL canvas is present`,
    state,
  )
  assert(state.page <= state.viewport + 1, `${label}: no horizontal overflow`)
  return state
}

try {
  await mkdir(profileDirectory, { recursive: true })
  const response = await fetch(baseUrl)
  if (!response.ok) throw new Error(`Preview returned HTTP ${response.status}.`)
  browser = spawn(
    browserPath,
    [
      '--headless=new',
      '--no-sandbox',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-component-update',
      '--remote-debugging-port=0',
      `--user-data-dir=${profileDirectory}`,
      '--window-size=1440,1000',
      'about:blank',
    ],
    { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] },
  )
  browser.stderr.on('data', (chunk) => {
    browserOutput = (browserOutput + chunk.toString()).slice(-12_000)
  })
  browser.on('error', (error) => {
    browserOutput += error.stack
  })
  let port
  const launchDeadline = Date.now() + 15_000
  while (Date.now() < launchDeadline) {
    try {
      port = Number(
        (
          await readFile(
            path.join(profileDirectory, 'DevToolsActivePort'),
            'utf8',
          )
        ).split('\n')[0],
      )
      if (port) break
    } catch {}
    await delay(150)
  }
  if (!port) throw new Error(`Chrome did not start. ${browserOutput}`)
  const pages = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
  const page = pages.find((candidate) => candidate.type === 'page')
  if (!page) throw new Error('Chrome did not create a page target.')
  const socket = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  connection = new Connection(socket)
  connection.on('Runtime.exceptionThrown', ({ exceptionDetails }) =>
    runtimeErrors.push(
      exceptionDetails.exception?.description || exceptionDetails.text,
    ),
  )
  connection.on('Runtime.consoleAPICalled', ({ type, args }) => {
    if (type === 'error')
      runtimeErrors.push(
        args
          .map(
            (argument) =>
              argument.value ?? argument.description ?? argument.type,
          )
          .join(' '),
      )
  })
  connection.on('Network.requestWillBeSent', ({ requestId, request }) =>
    requests.set(requestId, request.url),
  )
  connection.on('Network.responseReceived', ({ response: resource }) => {
    if (resource.url.startsWith(origin) && resource.status >= 400)
      assetErrors.push({ url: resource.url, status: resource.status })
  })
  connection.on('Network.loadingFailed', (failure) => {
    if (!failure.canceled)
      networkFailures.push({
        url: requests.get(failure.requestId),
        error: failure.errorText,
      })
  })
  await connection.send('Page.enable')
  await connection.send('Runtime.enable')
  await connection.send('Network.enable')
  await connection.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await navigate()
  await setTheme('dark')
  await checkScene('Desktop dark')
  await capture('e30-desktop-dark', { top: true })
  await settleCanvas()
  const initial = await capture('e30-car-initial', { canvasOnly: true })
  await delay(10_000)
  const rotated = await capture('e30-car-rotated', { canvasOnly: true })
  assert(
    initial !== rotated,
    'Car rendering advances while normal motion is enabled',
  )
  await capture('e30-desktop-rotated', { top: true })
  await setTheme('light')
  await checkScene('Desktop light')
  await capture('e30-desktop-light', { top: true })

  await connection.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  })
  await settleCanvas()
  await checkScene('Mobile light')
  await capture('e30-mobile-light')
  await setTheme('dark')
  await capture('e30-mobile-dark')

  await connection.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  })
  await navigate()
  await waitFor(
    `document.documentElement.dataset.motion === 'reduced'`,
    'reduced motion',
  )
  await delay(1000)
  const staticInitial = await capture('e30-reduced-motion', {
    canvasOnly: true,
  })
  await delay(1000)
  const staticLater = await capture('e30-reduced-motion-later', {
    canvasOnly: true,
  })
  assert(
    staticInitial === staticLater,
    'Car stays visually static when reduced motion is requested',
  )
  await checkScene('Reduced motion')

  await evaluate(
    `document.querySelector(${JSON.stringify(canvasSelector)}).dispatchEvent(new Event('webglcontextlost',{cancelable:true}))`,
  )
  await waitFor(
    `Array.from(document.querySelector(${JSON.stringify(sceneSelector)})?.querySelectorAll('.scene-fallback')||[]).some(element=>!element.closest('canvas'))`,
    'the WebGL failure fallback',
  )
  assert(
    await evaluate(
      `!document.querySelector(${JSON.stringify(canvasSelector)})`,
    ),
    'WebGL context loss replaces the renderer with a fallback',
  )
  await capture('e30-webgl-fallback')
  assert(
    runtimeErrors.length === 0,
    'No browser exceptions or console errors',
    runtimeErrors,
  )
  assert(
    assetErrors.length === 0,
    'All local car assets return successful responses',
    assetErrors,
  )
  assert(
    networkFailures.length === 0,
    'No failed network requests',
    networkFailures,
  )
} catch (error) {
  assert(false, 'Car browser check completed', error.stack || String(error))
} finally {
  await mkdir(artifactsDirectory, { recursive: true })
  await writeFile(
    path.join(artifactsDirectory, 'car-report.json'),
    JSON.stringify(
      {
        url: baseUrl,
        checkedAt: new Date().toISOString(),
        checks,
        runtimeErrors,
        assetErrors,
        networkFailures,
      },
      null,
      2,
    ) + '\n',
  )
  if (connection) {
    try {
      await connection.send('Browser.close')
    } catch {}
    connection.socket.close()
  }
  if (browser && browser.exitCode === null) {
    await Promise.race([
      new Promise((resolve) => browser.once('exit', resolve)),
      delay(2000),
    ])
    if (browser.exitCode === null) browser.kill()
  }
  // Delete only the isolated profile created by this invocation inside .qa.
  const resolvedProfile = path.resolve(profileDirectory)
  if (
    resolvedProfile.startsWith(path.resolve(artifactsDirectory) + path.sep) &&
    path.basename(resolvedProfile).startsWith(`car-profile-${process.pid}-`)
  ) {
    await rm(resolvedProfile, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 200,
    }).catch(() => {})
  }
  const passed = checks.filter((check) => check.passed).length
  console.log(
    `\n${passed}/${checks.length} car checks passed. Report: ${path.join(artifactsDirectory, 'car-report.json')}`,
  )
  process.exitCode = passed === checks.length ? 0 : 1
}
