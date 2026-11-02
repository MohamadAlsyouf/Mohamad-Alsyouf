import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Dependency-free browser smoke test. Run against an existing Vite preview:
// npm run preview -- --host 127.0.0.1
// node scripts/browser-check.mjs [http://127.0.0.1:4173]
// Opt-in source asset generation: node scripts/browser-check.mjs --render-assets
const projectDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const artifactsDirectory = path.join(projectDirectory, '.qa')
const profileDirectory = path.join(
  artifactsDirectory,
  `chrome-profile-${process.pid}-${Date.now()}`,
)
const argumentsList = process.argv.slice(2)
const baseUrl =
  argumentsList.find((argument) => !argument.startsWith('--')) ||
  'http://127.0.0.1:4173'
const renderAssetsRequested = argumentsList.includes('--render-assets')
const layoutOnly = argumentsList.includes('--layout-only')
const reportFilename = renderAssetsRequested
  ? 'assets-report.json'
  : layoutOnly
    ? 'layout-report.json'
    : 'browser-report.json'
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

if (!browserPath) {
  throw new Error(
    'Chrome or Edge was not found. Set CHROME_PATH to a browser executable.',
  )
}

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))
const checks = []
const runtimeErrors = []
const assetErrors = []
const networkFailures = []
const networkRequests = new Map()
const conversionWarnings = []
let phase = 'app'
let browser
let cdp
let browserOutput = ''

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
      }, 15_000)
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
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  })
  if (result.exceptionDetails) {
    throw new Error(
      result.exceptionDetails.exception?.description ||
        result.exceptionDetails.text,
    )
  }
  return result.result.value
}

async function waitFor(expression, description, timeout = 12_000) {
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
    `${condition ? 'PASS' : 'FAIL'} ${description}${detail === undefined ? '' : `: ${JSON.stringify(detail)}`}`,
  )
}

const buttonNameExpression = `(button.getAttribute('aria-label') || button.innerText || button.getAttribute('title') || '').trim()`

async function clickButton(name, { optional = false } = {}) {
  const found = await evaluate(`(() => {
    const name = ${JSON.stringify(name)};
    const button = Array.from(document.querySelectorAll('button')).find(button => ${buttonNameExpression} === name);
    if (!button) return false;
    button.scrollIntoView({block:'center', behavior:'instant'});
    button.focus(); button.click(); return true;
  })()`)
  if (!found && !optional) throw new Error(`Button was not found: ${name}`)
  await delay(450)
  return found
}

async function pressEscape() {
  await cdp.send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
  })
  await cdp.send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
  })
  await delay(450)
}

async function navigate() {
  await cdp.send('Page.navigate', { url: baseUrl })
  await waitFor(
    `document.readyState === 'complete' && document.querySelector('h1') && document.querySelector('#root')?.children.length`,
    'the application',
  )
  await evaluate(
    `Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 2500))]).then(() => true)`,
  )
  await delay(1000)
}

async function screenshot(name, { top = true } = {}) {
  await cdp.send('Page.bringToFront')
  if (top) await evaluate(`window.scrollTo({top:0,behavior:'instant'})`)
  await delay(350)
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  })
  const filename = path.join(artifactsDirectory, `${name}.png`)
  await writeFile(filename, Buffer.from(data, 'base64'))
  console.log(`SCREENSHOT ${filename}`)
}

async function sectionScreenshots() {
  for (const section of ['work', 'workbench', 'about', 'approach', 'contact']) {
    await evaluate(
      `document.getElementById(${JSON.stringify(section)})?.scrollIntoView({block:'start',behavior:'instant'})`,
    )
    await delay(800)
    await screenshot(`desktop-${section}`, { top: false })
  }
  const pageHeight = await evaluate(`document.documentElement.scrollHeight`)
  for (let offset = 0; offset < pageHeight; offset += 600) {
    await evaluate(`window.scrollTo({top:${offset},behavior:'instant'})`)
    await delay(150)
  }
  await evaluate(`window.scrollTo({top:0,behavior:'instant'})`)
  await delay(600)
  const { cssContentSize } = await cdp.send('Page.getLayoutMetrics')
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: 1440,
      height: Math.min(cssContentSize.height, 12_000),
      scale: 1,
    },
  })
  const filename = path.join(artifactsDirectory, 'desktop-full.png')
  await writeFile(filename, Buffer.from(data, 'base64'))
  console.log(`SCREENSHOT ${filename}`)
}

async function checkLayout(label) {
  const layout = await evaluate(`(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
    offenders: Array.from(document.querySelectorAll('main *')).filter(element => {
      if (element.closest('[aria-hidden="true"], .project-visual, .art-grid, .car-scene')) return false;
      const bounds = element.getBoundingClientRect();
      return bounds.width && (bounds.left < -1 || bounds.right > document.documentElement.clientWidth + 1);
    }).slice(0,12).map(element => ({tag:element.tagName,class:element.className?.baseVal ?? element.className,width:Math.round(element.getBoundingClientRect().width),text:element.textContent.trim().slice(0,70)})),
    brokenImages: Array.from(document.images).filter(image => image.complete && !image.naturalWidth).map(image => image.src),
  }))()`)
  assert(
    layout.page <= layout.viewport + 1,
    `${label}: no horizontal page overflow`,
    layout,
  )
  assert(
    layout.brokenImages.length === 0,
    `${label}: image assets load`,
    layout.brokenImages,
  )
  const smallText = await evaluate(`(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const failures = [];
    while (walker.nextNode()) {
      const node = walker.currentNode, element = node.parentElement;
      if (!node.textContent.trim() || !element || element.closest('[aria-hidden="true"],script,style,svg')) continue;
      const style = getComputedStyle(element), size = parseFloat(style.fontSize);
      if (size > 0 && size < 14 && style.visibility !== 'hidden' && element.getClientRects().length)
        failures.push({text:node.textContent.trim().slice(0,60),size});
    }
    return failures.slice(0,12);
  })()`)
  assert(
    smallText.length === 0,
    `${label}: reading text is at least 14px`,
    smallText,
  )
}

async function setTheme(theme) {
  const current = await evaluate(`document.documentElement.dataset.theme`)
  if (current !== theme) await clickButton(`Switch to ${theme} mode`)
  await waitFor(
    `document.documentElement.dataset.theme === ${JSON.stringify(theme)}`,
    `${theme} theme`,
  )
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

  let debuggingPort
  const launchDeadline = Date.now() + 15_000
  while (Date.now() < launchDeadline) {
    try {
      debuggingPort = Number(
        (
          await readFile(
            path.join(profileDirectory, 'DevToolsActivePort'),
            'utf8',
          )
        ).split('\n')[0],
      )
      if (debuggingPort) break
    } catch {
      /* Chrome writes its port after its browser process is ready. */
    }
    await delay(150)
  }
  if (!debuggingPort) throw new Error(`Chrome did not start. ${browserOutput}`)
  const pages = await (
    await fetch(`http://127.0.0.1:${debuggingPort}/json`)
  ).json()
  const page = pages.find((candidate) => candidate.type === 'page')
  if (!page) throw new Error('Chrome did not create a page target.')
  const socket = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  cdp = new Connection(socket)
  cdp.on('Runtime.exceptionThrown', ({ exceptionDetails }) =>
    runtimeErrors.push(
      exceptionDetails.exception?.description || exceptionDetails.text,
    ),
  )
  cdp.on('Runtime.consoleAPICalled', ({ type, args }) => {
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
  cdp.on('Network.responseReceived', ({ response: resource }) => {
    if (resource.url.startsWith(origin) && resource.status >= 400) {
      // A standalone SVG has no HTML favicon link. During initial asset generation,
      // Chrome may request the ICO that this mode is about to create.
      if (
        phase === 'render-assets' &&
        new URL(resource.url).pathname === '/favicon.ico' &&
        resource.status === 404
      )
        conversionWarnings.push({ url: resource.url, status: resource.status })
      else
        assetErrors.push({ phase, url: resource.url, status: resource.status })
    }
  })
  cdp.on('Network.requestWillBeSent', ({ requestId, request }) =>
    networkRequests.set(requestId, request.url),
  )
  cdp.on('Network.loadingFailed', (failure) =>
    networkFailures.push({
      url: networkRequests.get(failure.requestId),
      error: failure.errorText,
      canceled: failure.canceled,
    }),
  )
  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  await cdp.send('Network.enable')
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  })
  if (layoutOnly) {
    await navigate()
    for (const width of [320, 375, 390, 768, 1024, 1440]) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: width < 768,
      })
      await delay(200)
      await checkLayout(`Layout ${width}px`)
    }
  }
  if (!renderAssetsRequested && !layoutOnly) {
    await navigate()
    await cdp.send('Page.bringToFront')
    await waitFor(
      `document.visibilityState === 'visible'`,
      'the browser tab to be visible',
    )
    await setTheme('dark')
    await screenshot('desktop-dark')
    await sectionScreenshots()
    await checkLayout('Desktop dark')
    const studies = await evaluate(
      `Array.from(document.querySelectorAll('.bench-study')).map(figure => ({name:figure.querySelector('h3')?.textContent,diagram:Boolean(figure.querySelector('svg[aria-hidden="true"]'))}))`,
    )
    assert(
      studies.length === 7 &&
        studies.every((study) => study.name && study.diagram),
      'Seven technical studies have readable captions and decorative diagrams',
      studies,
    )
    await evaluate(
      `document.getElementById('workbench').scrollIntoView({block:'center',behavior:'instant'})`,
    )
    await waitFor(
      `document.querySelector('.workbench').dataset.active === 'true'`,
      'workbench animation to start in view',
    )
    assert(
      await evaluate(
        `getComputedStyle(document.querySelector('.bench-drawing > svg')).animationPlayState === 'running'`,
      ),
      'Workbench floats while visible',
    )
    await screenshot('desktop-workbench-detail', { top: false })
    await evaluate(`window.scrollTo({top:0,behavior:'instant'})`)
    await waitFor(
      `document.querySelector('.workbench').dataset.active === 'false'`,
      'workbench animation to pause offscreen',
    )
    assert(
      await evaluate(
        `getComputedStyle(document.querySelector('.bench-drawing > svg')).animationPlayState === 'paused'`,
      ),
      'Workbench pauses offscreen',
    )

    const initial = await evaluate(
      `({title:document.title,h1:document.querySelector('h1').innerText,h1Count:document.querySelectorAll('h1').length,canvas:document.querySelectorAll('canvas').length})`,
    )
    assert(initial.h1Count === 1, 'Exactly one primary heading', initial)
    const fonts = await evaluate(
      `({grotesk:document.fonts.check('500 20px "Space Grotesk"'),sans:document.fonts.check('400 20px "DM Sans"'),mono:document.fonts.check('400 20px "IBM Plex Mono"'),faces:Array.from(document.fonts).map(face=>({family:face.family,status:face.status}))})`,
    )
    assert(
      fonts.grotesk &&
        fonts.sans &&
        fonts.mono &&
        ['Space Grotesk', 'DM Sans', 'IBM Plex Mono'].every((family) =>
          fonts.faces.some(
            (face) =>
              face.family.replace(/["']/g, '') === family &&
              face.status === 'loaded',
          ),
        ),
      'Brand fonts load',
      fonts,
    )
    const badAnchors = await evaluate(
      `Array.from(document.querySelectorAll('a[href^="#"]')).filter(link => link.hash && !document.getElementById(decodeURIComponent(link.hash.slice(1)))).map(link => link.getAttribute('href'))`,
    )
    assert(
      badAnchors.length === 0,
      'Navigation anchors have destinations',
      badAnchors,
    )
    const unnamedButtons = await evaluate(
      `Array.from(document.querySelectorAll('button')).filter(button => !(${buttonNameExpression}) && !button.getAttribute('aria-labelledby')).map(button => button.outerHTML.slice(0,250))`,
    )
    assert(
      unnamedButtons.length === 0,
      'Buttons have accessible names',
      unnamedButtons,
    )

    const caseButtons = await evaluate(
      `Array.from(document.querySelectorAll('button')).map(button => ${buttonNameExpression}).filter(name => name.startsWith('Explore '))`,
    )
    assert(caseButtons.length > 0, 'Case studies can be opened', caseButtons)
    for (const [index, name] of caseButtons.entries()) {
      await clickButton(name)
      await waitFor(
        `document.querySelector('dialog[open], [role="dialog"]')`,
        'case study dialog',
      )
      assert(
        await evaluate(
          `Boolean(document.querySelector('dialog:modal, [role="dialog"][aria-modal="true"]'))`,
        ),
        `Case study ${index + 1} has modal dialog semantics`,
      )
      assert(
        await evaluate(
          `(() => {const dialog=document.querySelector('dialog[open], [role="dialog"]');return Boolean(document.getElementById(dialog.getAttribute('aria-labelledby'))?.textContent.trim())})()`,
        ),
        `Case study ${index + 1} has an accessible title`,
      )
      if (index === 0) await screenshot('case-study')
      await pressEscape()
      await waitFor(
        `!document.querySelector('dialog[open], [role="dialog"]')`,
        'case study to close',
      )
      assert(
        await evaluate(
          `document.activeElement?.getAttribute('aria-label') === ${JSON.stringify(name)}`,
        ),
        `Closing case study ${index + 1} restores trigger focus`,
      )
    }

    const accordion = await evaluate(`(() => {
    const button=document.querySelector('.workflow-item button[aria-expanded="false"]');
    if (!button) return null;
    const name=${buttonNameExpression}; button.click(); return name;
  })()`)
    if (accordion) {
      await delay(400)
      assert(
        await evaluate(
          `Array.from(document.querySelectorAll('.workflow-item button')).some(button => ${buttonNameExpression} === ${JSON.stringify(accordion)} && button.getAttribute('aria-expanded') === 'true')`,
        ),
        'Workflow accordion expands',
        accordion,
      )
      await clickButton(accordion)
      assert(
        await evaluate(
          `Array.from(document.querySelectorAll('.workflow-item button')).some(button => ${buttonNameExpression} === ${JSON.stringify(accordion)} && button.getAttribute('aria-expanded') === 'false')`,
        ),
        'Workflow accordion collapses',
      )
    } else {
      const details = await evaluate(
        `(() => {const details=document.querySelector('details'); if(!details)return null; details.querySelector('summary').click(); return details.open})()`,
      )
      assert(details === true, 'An accordion expands')
    }

    const currentRole = await evaluate(
      `(() => {const details=document.querySelector('.experience-details');return {open:details?.open,highlights:details?.querySelectorAll('li').length || 0}})()`,
    )
    assert(
      currentRole.open && currentRole.highlights > 0,
      'Current role responsibilities are visible by default',
      currentRole,
    )
    const priorRole = await evaluate(
      `(() => {const details=document.querySelectorAll('.experience-details')[1];if(!details)return null;details.querySelector('summary').click();return {open:details.open,highlights:details.querySelectorAll('li').length}})()`,
    )
    assert(
      priorRole?.open && priorRole.highlights > 0,
      'Earlier role responsibilities can be expanded',
      priorRole,
    )

    await clickButton('Pause motion')
    await waitFor(
      `document.documentElement.dataset.motion === 'reduced'`,
      'the manual motion pause',
    )
    assert(
      await evaluate(
        `getComputedStyle(document.documentElement).scrollBehavior === 'auto'`,
      ),
      'Manual motion pause disables smooth document scrolling',
    )
    assert(
      await evaluate(`localStorage.getItem('portfolio-motion') === 'off'`),
      'Manual motion pause is saved',
    )
    await navigate()
    assert(
      await evaluate(`document.documentElement.dataset.motion === 'reduced'`),
      'Motion pause survives reload',
    )
    await clickButton('Motion off')
    await waitFor(
      `document.documentElement.dataset.motion === 'full'`,
      'motion to resume',
    )
    assert(
      await evaluate(`localStorage.getItem('portfolio-motion') === 'on'`),
      'Motion can be resumed',
    )

    await evaluate(`(() => {
    window.__qaClipboard = navigator.clipboard;
    Object.defineProperty(navigator, 'clipboard', {configurable:true,value:{writeText:async value => {window.__qaCopiedValue=value}}});
  })()`)
    await clickButton('Copy email address')
    await waitFor(
      `document.querySelector('.copy-status')?.textContent.includes('copied')`,
      'copy feedback',
    )
    assert(
      await evaluate(
        `window.__qaCopiedValue === document.querySelector('.contact-email').textContent.trim()`,
      ),
      'Copy email passes the actual address to the clipboard API',
    )
    await evaluate(
      `Object.defineProperty(navigator, 'clipboard', {configurable:true,value:{writeText:async () => {throw new Error('Clipboard unavailable during QA')}}})`,
    )
    await clickButton('Copy email address')
    assert(
      await evaluate(
        `document.querySelector('.copy-status')?.textContent.includes('Copy unavailable')`,
      ),
      'Clipboard failure provides useful fallback feedback',
    )
    await evaluate(
      `Object.defineProperty(navigator, 'clipboard', {configurable:true,value:window.__qaClipboard});delete window.__qaClipboard;delete window.__qaCopiedValue`,
    )

    await setTheme('light')
    await screenshot('desktop-light')
    await checkLayout('Desktop light')
    await evaluate(
      `document.getElementById('workbench').scrollIntoView({block:'start',behavior:'instant'})`,
    )
    await screenshot('desktop-workbench-light', { top: false })
    await navigate()
    assert(
      await evaluate(`document.documentElement.dataset.theme === 'light'`),
      'Theme preference survives reload',
    )
    await setTheme('dark')

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    })
    await screenshot('mobile-dark')
    await checkLayout('Mobile dark')
    await evaluate(
      `document.getElementById('workbench').scrollIntoView({block:'start',behavior:'instant'})`,
    )
    await screenshot('mobile-workbench', { top: false })
    await evaluate(`window.scrollTo({top:0,behavior:'instant'})`)
    await clickButton('Open menu')
    assert(
      await evaluate(
        `Array.from(document.querySelectorAll('button')).some(button => ${buttonNameExpression} === 'Close menu' && button.getAttribute('aria-expanded') === 'true')`,
      ),
      'Mobile menu opens',
    )
    await pressEscape()
    assert(
      await evaluate(
        `Array.from(document.querySelectorAll('button')).some(button => ${buttonNameExpression} === 'Open menu')`,
      ),
      'Escape closes mobile menu',
    )
    await clickButton('Open menu')
    const menuLink = await evaluate(`(() => {
    const button=Array.from(document.querySelectorAll('button')).find(button => ${buttonNameExpression} === 'Close menu');
    const menu=document.getElementById(button?.getAttribute('aria-controls'));
    const link=menu?.querySelector('a[href^="#"]');
    if(!link)return null; const destination=link.hash; link.click(); return destination;
  })()`)
    await delay(600)
    assert(
      Boolean(menuLink),
      'Mobile menu has a working section link',
      menuLink,
    )
    assert(
      await evaluate(
        `Array.from(document.querySelectorAll('button')).some(button => ${buttonNameExpression} === 'Open menu')`,
      ),
      'Following a mobile navigation link closes menu',
    )
    await setTheme('light')
    await screenshot('mobile-light')
    await checkLayout('Mobile light')

    for (const width of [320, 375, 390, 768, 1024, 1440]) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: width < 768,
      })
      await delay(200)
      await checkLayout(`Responsive ${width}px`)
      if ([320, 768, 1024].includes(width))
        await screenshot(`responsive-${width}`)
    }
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    })

    const hadWebGL = await evaluate(`(() => {
      const canvas=document.querySelector('.hero-art canvas');
      if(!canvas)return false;
      canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));
      return true;
    })()`)
    assert(hadWebGL, 'Hero uses a real WebGL canvas')
    await waitFor(
      `document.querySelector('.hero-art .scene-fallback')`,
      'WebGL context-loss fallback',
    )
    assert(
      await evaluate(
        `Boolean(document.querySelector('h1')?.textContent.trim() && document.querySelector('.hero-art .scene-fallback'))`,
      ),
      'WebGL context loss preserves the page and displays a fallback',
    )

    await cdp.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    })
    await navigate()
    assert(
      await evaluate(`matchMedia('(prefers-reduced-motion: reduce)').matches`),
      'Reduced motion preference is emulated',
    )
    assert(
      await evaluate(`document.documentElement.dataset.motion === 'reduced'`),
      'App honors the reduced motion preference',
    )
    assert(
      await evaluate(
        `Array.from(document.querySelectorAll('button')).some(button => button.textContent.trim() === 'System reduced motion' && button.disabled)`,
      ),
      'System reduced motion is clearly indicated and cannot be overridden',
    )
    const runningAnimations = await evaluate(
      `document.getAnimations().filter(animation=>animation.playState==='running' && animation.effect?.getComputedTiming().duration > 20).map(animation=>({name:animation.animationName || 'Web Animation',duration:animation.effect.getComputedTiming().duration,iterations:animation.effect.getComputedTiming().iterations,target:animation.effect.target?.className}))`,
    )
    assert(
      runningAnimations.length === 0,
      'Reduced motion disables ongoing animations',
      runningAnimations,
    )
    await checkLayout('Mobile reduced motion')

    const resumeHref = await evaluate(
      `Array.from(document.querySelectorAll('a[href]')).find(link => new URL(link.href).pathname.toLowerCase().endsWith('.pdf'))?.href`,
    )
    assert(Boolean(resumeHref), 'Résumé PDF has a download link')
    if (resumeHref) {
      const resume = await fetch(resumeHref)
      const header = Buffer.from(await resume.arrayBuffer())
        .subarray(0, 5)
        .toString()
      assert(resume.ok && header === '%PDF-', 'Résumé link serves a PDF', {
        status: resume.status,
        header,
      })
    }

    assert(
      assetErrors.length === 0,
      'Local assets return successful responses',
      assetErrors,
    )
    assert(
      runtimeErrors.length === 0,
      'No browser exceptions or console errors',
      runtimeErrors,
    )
  } else if (renderAssetsRequested) {
    phase = 'render-assets'
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1200,
      height: 630,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await cdp.send('Page.navigate', {
      url: new URL('/social-card.svg', baseUrl).href,
    })
    await waitFor(
      `document.documentElement.tagName.toLowerCase() === 'svg' && document.readyState === 'complete'`,
      'the social card SVG',
    )
    const bounds = await evaluate(
      `(() => {const r=document.documentElement.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})()`,
    )
    assert(
      bounds.x === 0 &&
        bounds.y === 0 &&
        bounds.width === 1200 &&
        bounds.height === 630,
      'Social card fills its 1200×630 raster',
      bounds,
    )
    const { data: socialData } = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
      clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 },
    })
    const socialBuffer = Buffer.from(socialData, 'base64')
    await writeFile(
      path.join(projectDirectory, 'public', 'social-card.png'),
      socialBuffer,
    )
    assert(
      socialBuffer.readUInt32BE(16) === 1200 &&
        socialBuffer.readUInt32BE(20) === 630,
      'Social preview PNG generated at 1200×630',
    )

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 32,
      height: 32,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await cdp.send('Emulation.setDefaultBackgroundColorOverride', {
      color: { r: 0, g: 0, b: 0, a: 0 },
    })
    await cdp.send('Page.navigate', {
      url: new URL('/favicon.svg', baseUrl).href,
    })
    await waitFor(
      `document.documentElement.tagName.toLowerCase() === 'svg' && document.readyState === 'complete'`,
      'the favicon SVG',
    )
    const { data: iconData } = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
      clip: { x: 0, y: 0, width: 32, height: 32, scale: 1 },
    })
    const iconPng = Buffer.from(iconData, 'base64')
    const ico = Buffer.alloc(22 + iconPng.length)
    ico.writeUInt16LE(1, 2)
    ico.writeUInt16LE(1, 4)
    ico.writeUInt8(32, 6)
    ico.writeUInt8(32, 7)
    ico.writeUInt16LE(1, 10)
    ico.writeUInt16LE(32, 12)
    ico.writeUInt32LE(iconPng.length, 14)
    ico.writeUInt32LE(22, 18)
    iconPng.copy(ico, 22)
    await writeFile(path.join(projectDirectory, 'public', 'favicon.ico'), ico)
    assert(
      iconPng.readUInt32BE(16) === 32 &&
        iconPng.readUInt32BE(20) === 32 &&
        ico.readUInt32LE(18) === 22,
      'Legacy favicon ICO generated with a 32×32 PNG image',
    )
    await cdp.send('Emulation.setDefaultBackgroundColorOverride')
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    })
    phase = 'app'
    await navigate()
    assert(
      assetErrors.length === 0,
      'Asset generation and restored application have no failed resources',
      assetErrors,
    )
    assert(
      runtimeErrors.length === 0,
      'Asset generation and restored application have no runtime errors',
      runtimeErrors,
    )
  }
} catch (error) {
  assert(false, 'Browser check completed', error.stack || String(error))
} finally {
  const report = {
    url: baseUrl,
    checkedAt: new Date().toISOString(),
    checks,
    runtimeErrors,
    assetErrors,
    networkFailures,
    conversionWarnings,
  }
  await mkdir(artifactsDirectory, { recursive: true })
  await writeFile(
    path.join(artifactsDirectory, reportFilename),
    JSON.stringify(report, null, 2) + '\n',
  )
  if (cdp) {
    try {
      await cdp.send('Browser.close')
    } catch {
      /* Chrome may close its socket before answering. */
    }
    cdp.socket.close()
  }
  if (browser && browser.exitCode === null) {
    await Promise.race([
      new Promise((resolve) => browser.once('exit', resolve)),
      delay(2000),
    ])
    if (browser.exitCode === null) browser.kill()
  }
  // Only delete the temporary browser profile created by this invocation.
  const resolvedProfile = path.resolve(profileDirectory)
  const resolvedArtifacts = path.resolve(artifactsDirectory) + path.sep
  if (
    resolvedProfile.startsWith(resolvedArtifacts) &&
    path.basename(resolvedProfile).startsWith(`chrome-profile-${process.pid}-`)
  ) {
    await rm(resolvedProfile, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 200,
    }).catch(() => {})
  }
  const failed = checks.filter((check) => !check.passed).length
  console.log(
    `\n${checks.length - failed}/${checks.length} checks passed. Report: ${path.join(artifactsDirectory, reportFilename)}`,
  )
  process.exitCode = failed ? 1 : 0
}
