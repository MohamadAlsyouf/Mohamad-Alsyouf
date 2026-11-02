import * as THREE from 'three'
import { E30_PAINT } from '../e30Paint'

// Fine, deterministic surface detail. These maps describe material relief;
// the seat shapes and upholstery channels are actual geometry.
function surfaceTexture(sample, repeat) {
  const size = 256
  const values = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value = THREE.MathUtils.clamp(Math.round(sample(x, y)), 0, 255)
      values.set([value, value, value, 255], (y * size + x) * 4)
    }
  }
  const texture = new THREE.DataTexture(values, size, size)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(repeat, repeat)
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.generateMipmaps = true
  texture.needsUpdate = true
  return texture
}

function noise(x, y, seed = 0) {
  let value =
    Math.imul(x + seed * 157, 374761393) ^ Math.imul(y + 7919, 668265263)
  value = Math.imul(value ^ (value >>> 13), 1274126177)
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295
}

function canvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  draw(canvas.getContext('2d'), width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function drawDial(c, cx, cy, radius, labels, needleAngle) {
  const face = c.createRadialGradient(
    cx - radius * 0.2,
    cy - radius * 0.4,
    0,
    cx,
    cy,
    radius,
  )
  face.addColorStop(0, '#17191b')
  face.addColorStop(1, '#060708')
  c.fillStyle = face
  c.beginPath()
  c.arc(cx, cy, radius, 0, Math.PI * 2)
  c.fill()
  c.strokeStyle = '#383a3d'
  c.lineWidth = 3
  c.stroke()
  for (let tick = 0; tick <= 40; tick++) {
    const angle = Math.PI * (0.75 + (tick / 40) * 1.5)
    const major = tick % 5 === 0
    c.strokeStyle = tick > 35 && cx > 512 ? '#ba493a' : '#dddcd1'
    c.lineWidth = major ? 3 : 1.3
    c.beginPath()
    c.moveTo(
      cx + Math.cos(angle) * radius * 0.92,
      cy + Math.sin(angle) * radius * 0.92,
    )
    c.lineTo(
      cx + Math.cos(angle) * radius * (major ? 0.78 : 0.86),
      cy + Math.sin(angle) * radius * (major ? 0.78 : 0.86),
    )
    c.stroke()
  }
  c.font = radius > 75 ? '22px Arial' : '17px Arial'
  c.fillStyle = '#deddd4'
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  labels.forEach((label, i) => {
    const angle = Math.PI * (0.75 + (i / (labels.length - 1)) * 1.5)
    c.fillText(
      label,
      cx + Math.cos(angle) * radius * 0.64,
      cy + Math.sin(angle) * radius * 0.64,
    )
  })
  c.strokeStyle = '#d65b40'
  c.lineWidth = radius > 75 ? 4 : 3
  c.lineCap = 'round'
  c.beginPath()
  c.moveTo(
    cx - Math.cos(needleAngle) * radius * 0.13,
    cy - Math.sin(needleAngle) * radius * 0.13,
  )
  c.lineTo(
    cx + Math.cos(needleAngle) * radius * 0.77,
    cy + Math.sin(needleAngle) * radius * 0.77,
  )
  c.stroke()
  c.fillStyle = '#17191a'
  c.beginPath()
  c.arc(cx, cy, radius * 0.085, 0, Math.PI * 2)
  c.fill()
}

export function createInteriorTextures() {
  return {
    leather: surfaceTexture(
      (x, y) =>
        128 +
        noise(x, y, 17) * 42 +
        noise(Math.floor(x / 3), Math.floor(y / 3), 29) * 18,
      12,
    ),
    roughness: surfaceTexture((x, y) => 205 + noise(x, y, 71) * 28, 8),
    vinyl: surfaceTexture((x, y) => 130 + noise(x, y, 31) * 32, 15),
    carpet: surfaceTexture((x, y) => 95 + noise(x, y, 43) * 100, 18),
    gauges: canvasTexture(1024, 384, (c, w, h) => {
      c.fillStyle = '#090b0c'
      c.fillRect(0, 0, w, h)
      drawDial(c, 104, 169, 72, ['E', '½', 'F'], 3.9)
      drawDial(
        c,
        330,
        169,
        139,
        ['0', '40', '80', '120', '160', '200', '240', '260', ''],
        2.6,
      )
      drawDial(
        c,
        665,
        169,
        139,
        ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
        2.95,
      )
      drawDial(c, 921, 169, 72, ['C', '', 'H'], -Math.PI / 2)
      c.fillStyle = '#b2ae98'
      c.fillRect(274, 216, 112, 29)
      c.fillStyle = '#151615'
      c.font = '24px monospace'
      c.textAlign = 'center'
      c.fillText('089245', 330, 233)
      c.fillStyle = '#c5c5b8'
      c.font = '17px Arial'
      c.fillText('km/h', 330, 276)
      c.fillText('1/min × 1000', 665, 276)
      c.font = '13px Arial'
      c.fillText('OIL TEMP', 665, 242)
      for (let i = 0; i < 7; i++) {
        c.fillStyle = i < 5 ? '#407445' : i === 5 ? '#9f8b36' : '#8f3e33'
        c.fillRect(433 + i * 23, 322, 18, 9)
      }
      c.fillStyle = '#6d2924'
      for (const x of [110, 180, 770, 850, 920]) c.fillRect(x, 328, 22, 13)
    }),
    radio: canvasTexture(512, 160, (c, w, h) => {
      c.fillStyle = '#101112'
      c.fillRect(0, 0, w, h)
      c.fillStyle = '#16191a'
      c.fillRect(70, 26, 238, 44)
      c.fillStyle = '#b18b54'
      c.font = '22px monospace'
      c.fillText('FM  89.5', 88, 57)
      c.fillStyle = '#5a5d5c'
      c.font = '13px Arial'
      c.fillText('BMW BAVARIA C', 327, 48)
      c.fillStyle = '#050607'
      c.fillRect(123, 87, 242, 20)
      c.fillStyle = '#747570'
      c.font = '15px Arial'
      for (let i = 1; i <= 6; i++) c.fillText(String(i), 93 + i * 47, 141)
      c.strokeStyle = '#363938'
      c.lineWidth = 3
      c.beginPath()
      c.arc(31, 48, 19, 0, Math.PI * 2)
      c.stroke()
    }),
  }
}

export function createInteriorMaterials(textures, paint = E30_PAINT.color) {
  const leather = {
    color: '#0d0e10',
    roughness: 0.74,
    metalness: 0,
    bumpMap: textures.leather,
    bumpScale: 0.00024,
    roughnessMap: textures.roughness,
    envMapIntensity: 0.3,
    specularIntensity: 0.65,
    clearcoat: 0,
    clearcoatRoughness: 0.5,
  }
  return {
    leather: new THREE.MeshPhysicalMaterial(leather),
    leatherInset: new THREE.MeshPhysicalMaterial({
      ...leather,
      color: '#111214',
      roughness: 0.8,
    }),
    leatherEdge: new THREE.MeshPhysicalMaterial({
      ...leather,
      color: '#090a0b',
      roughness: 0.72,
    }),
    seam: new THREE.MeshStandardMaterial({ color: '#101113', roughness: 0.65 }),
    plastic: new THREE.MeshStandardMaterial({
      color: '#08090b',
      roughness: 0.53,
      envMapIntensity: 0.4,
    }),
    vinyl: new THREE.MeshStandardMaterial({
      color: '#0b0c0e',
      roughness: 0.64,
      bumpMap: textures.vinyl,
      bumpScale: 0.00013,
      envMapIntensity: 0.35,
    }),
    chrome: new THREE.MeshStandardMaterial({
      color: '#788086',
      roughness: 0.24,
      metalness: 0.9,
    }),
    carpet: new THREE.MeshStandardMaterial({
      color: '#090a0b',
      roughness: 1,
      bumpMap: textures.carpet,
      bumpScale: 0.00045,
    }),
    red: new THREE.MeshStandardMaterial({ color: '#8e211b', roughness: 0.55 }),
    gauges: new THREE.MeshStandardMaterial({
      map: textures.gauges,
      roughness: 0.7,
      emissiveMap: textures.gauges,
      emissive: '#ffffff',
      emissiveIntensity: 0.06,
    }),
    radio: new THREE.MeshStandardMaterial({
      map: textures.radio,
      roughness: 0.66,
      emissiveMap: textures.radio,
      emissive: '#ffffff',
      emissiveIntensity: 0.045,
    }),
    badgeBlue: new THREE.MeshStandardMaterial({
      color: '#2c6792',
      roughness: 0.35,
      metalness: 0.15,
    }),
    badgeWhite: new THREE.MeshStandardMaterial({
      color: '#bfc3c4',
      roughness: 0.35,
      metalness: 0.15,
    }),
    paint: new THREE.MeshPhysicalMaterial({
      color: paint,
      roughness: E30_PAINT.roughness,
      metalness: E30_PAINT.metalness,
      clearcoat: E30_PAINT.clearcoat,
      clearcoatRoughness: E30_PAINT.clearcoatRoughness,
    }),
  }
}
