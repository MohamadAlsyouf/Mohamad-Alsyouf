import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// Original four-seat open cabin, matched to the normalized imported E30 body.
// Nose points -X. Belt line is Y=.878; nothing here closes the open cabin.
function buildInterior() {
  const parts = {}
  const matrix = new THREE.Matrix4()
  const quaternion = new THREE.Quaternion()
  const euler = new THREE.Euler()
  function add(material, geometry, position = [0, 0, 0], rotation = [0, 0, 0]) {
    euler.set(...rotation)
    quaternion.setFromEuler(euler)
    matrix.compose(
      new THREE.Vector3(...position),
      quaternion,
      new THREE.Vector3(1, 1, 1),
    )
    geometry.applyMatrix4(matrix)
    if (geometry.index) geometry = geometry.toNonIndexed()
    ;(parts[material] ||= []).push(geometry)
  }
  function box(material, position, size, radius = 0.01, rotation) {
    const geometry =
      radius < 0.003
        ? new THREE.BoxGeometry(...size)
        : new RoundedBoxGeometry(
            ...size,
            2,
            Math.min(radius, ...size.map((value) => value * 0.45)),
          )
    add(material, geometry, position, rotation)
  }
  function line(material, coordinates, radius = 0.003, segments = 12) {
    add(
      material,
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(
          coordinates.map((point) => new THREE.Vector3(...point)),
        ),
        segments,
        radius,
        5,
        false,
      ),
    )
  }
  function cylinder(
    material,
    position,
    radius,
    length,
    rotation = [0, 0, 0],
    segments = 16,
  ) {
    add(
      material,
      new THREE.CylinderGeometry(radius, radius, length, segments),
      position,
      rotation,
    )
  }
  function sphere(material, position, scale) {
    const geometry = new THREE.SphereGeometry(1, 16, 10)
    geometry.scale(...scale)
    add(material, geometry, position)
  }

  // Recessed floor and transmission tunnel leave a real footwell visible.
  box('carpet', [0.36, 0.568, 0], [1.96, 0.035, 1.29], 0.018)
  box('plastic', [0.16, 0.626, 0], [1.51, 0.127, 0.18], 0.027)
  for (const sign of [-1, 1]) {
    box('mat', [-0.025, 0.592, sign * 0.365], [0.69, 0.014, 0.45], 0.015)
    // Door cards, upper waist, padded grab armrest, recess and chrome release.
    box('leather', [0.24, 0.733, sign * 0.641], [1.61, 0.237, 0.043], 0.017)
    box('plastic', [0.23, 0.854, sign * 0.642], [1.64, 0.041, 0.058], 0.012)
    box('leatherSoft', [0.17, 0.742, sign * 0.614], [0.59, 0.047, 0.056], 0.016)
    box('plastic', [-0.092, 0.796, sign * 0.61], [0.16, 0.035, 0.012], 0.006)
    box('chrome', [-0.092, 0.802, sign * 0.599], [0.109, 0.009, 0.012], 0.004)
    box('plastic', [0.45, 0.685, sign * 0.614], [0.352, 0.065, 0.028], 0.009)
    for (const y of [0.684, 0.812])
      line(
        'seam',
        [
          [-0.45, y, sign * 0.615],
          [0.1, y, sign * 0.612],
          [0.91, y, sign * 0.615],
        ],
        0.0011,
        8,
      )
    // Rear interior quarter panels have curved wheel-housing padding.
    box('leather', [1.015, 0.763, sign * 0.616], [0.52, 0.22, 0.097], 0.033)
    box('plastic', [0.72, 0.842, sign * 0.615], [0.156, 0.059, 0.085], 0.014)
    box('plastic', [0.75, 0.871, sign * 0.613], [0.082, 0.016, 0.05], 0.004)
  }

  // Separate seat cushions, chamfered bolsters and gently reclined backs are
  // intentionally open between them, rather than a dark shell over the cabin.
  for (const sign of [-1, 1]) {
    const z = sign * 0.365
    const backTilt = -0.155
    box('plastic', [0.23, 0.622, z], [0.44, 0.075, 0.37], 0.018)
    for (const rail of [-0.13, 0.13])
      box('chrome', [0.19, 0.602, z + rail], [0.56, 0.017, 0.017], 0.004)
    box(
      'leather',
      [0.2, 0.682, z],
      [0.535, 0.117, 0.443],
      0.043,
      [0, 0, -0.035],
    )
    box(
      'leatherSoft',
      [0.19, 0.723, z],
      [0.438, 0.047, 0.281],
      0.02,
      [0, 0, -0.035],
    )
    for (const side of [-1, 1]) {
      box(
        'leather',
        [0.19, 0.739, z + side * 0.184],
        [0.493, 0.09, 0.083],
        0.034,
      )
      box(
        'leather',
        [0.443, 0.888, z + side * 0.176],
        [0.111, 0.337, 0.089],
        0.036,
        [0, 0, backTilt],
      )
      line(
        'seam',
        [
          [-0.031, 0.758, z + side * 0.15],
          [0.17, 0.772, z + side * 0.15],
          [0.4, 0.757, z + side * 0.15],
        ],
        0.0014,
        8,
      )
      line(
        'seam',
        [
          [0.387, 0.75, z + side * 0.142],
          [0.413, 0.896, z + side * 0.142],
          [0.439, 1.045, z + side * 0.142],
        ],
        0.0014,
        8,
      )
    }
    box('leather', [0.454, 0.888, z], [0.114, 0.348, 0.399], 0.041, [
      0,
      0,
      backTilt,
    ])
    box('leatherSoft', [0.393, 0.892, z], [0.04, 0.281, 0.271], 0.02, [
      0,
      0,
      backTilt,
    ])
    // Fine parallel stitch channels catch just enough light on black leather.
    for (let pleat = -3; pleat <= 3; pleat++) {
      const pz = z + pleat * 0.036
      line(
        'seam',
        [
          [-0.005, 0.748, pz],
          [0.17, 0.754, pz],
          [0.379, 0.744, pz],
        ],
        0.0012,
        6,
      )
      line(
        'seam',
        [
          [0.369, 0.778, pz],
          [0.391, 0.9, pz],
          [0.413, 1.013, pz],
        ],
        0.0012,
        6,
      )
    }
    // Adjustable headrest, visible metal posts and the side recliner wheel.
    for (const post of [-0.071, 0.071])
      cylinder(
        'chrome',
        [0.488, 1.069, z + post],
        0.006,
        0.095,
        [0, 0, backTilt],
        10,
      )
    box('leather', [0.502, 1.133, z], [0.104, 0.137, 0.263], 0.03, [
      0,
      0,
      backTilt,
    ])
    line(
      'seam',
      [
        [0.445, 1.108, z - 0.106],
        [0.444, 1.159, z - 0.106],
        [0.455, 1.194, z],
        [0.444, 1.159, z + 0.106],
        [0.445, 1.108, z + 0.106],
      ],
      0.0012,
      10,
    )
    cylinder(
      'plastic',
      [0.43, 0.735, z + sign * 0.223],
      0.026,
      0.016,
      [Math.PI / 2, 0, 0],
      16,
    )
    box(
      'plastic',
      [0.37, 0.716, sign * 0.116],
      [0.061, 0.068, 0.035],
      0.006,
      [0, 0, -0.15],
    )
    box('red', [0.361, 0.751, sign * 0.116], [0.039, 0.01, 0.025], 0.002)
    // Retracted three-point belt lies against the quarter trim, not mid-air.
    line(
      'plastic',
      [
        [0.72, 0.86, sign * 0.605],
        [0.66, 0.725, sign * 0.56],
        [0.59, 0.626, sign * 0.47],
      ],
      0.011,
      8,
    )
  }

  // The full-width two-place rear bench sits below the tonneau, with separate
  // shoulder pads, stitched vertical channels and rear head restraints.
  box('leather', [0.957, 0.674, 0], [0.414, 0.118, 1.19], 0.038)
  box('leatherSoft', [0.93, 0.723, 0], [0.319, 0.037, 1.061], 0.015)
  box(
    'leather',
    [1.157, 0.858, 0],
    [0.114, 0.328, 1.202],
    0.033,
    [0, 0, -0.105],
  )
  box(
    'leatherSoft',
    [1.099, 0.861, 0],
    [0.035, 0.268, 1.024],
    0.013,
    [0, 0, -0.105],
  )
  for (let i = -10; i <= 10; i++) {
    const z = i * 0.048
    line(
      'seam',
      [
        [0.792, 0.742, z],
        [0.927, 0.746, z],
        [1.106, 0.733, z],
      ],
      0.0012,
      5,
    )
    line(
      'seam',
      [
        [1.073, 0.733, z],
        [1.085, 0.854, z],
        [1.099, 0.978, z],
      ],
      0.0012,
      5,
    )
  }
  for (const sign of [-1, 1]) {
    box(
      'leather',
      [1.172, 1.057, sign * 0.365],
      [0.092, 0.122, 0.242],
      0.03,
      [0, 0, -0.105],
    )
    for (const post of [-0.062, 0.062])
      cylinder(
        'chrome',
        [1.163, 0.994, sign * 0.365 + post],
        0.005,
        0.056,
        [0, 0, -0.105],
        8,
      )
    box('plastic', [1.028, 0.747, sign * 0.21], [0.053, 0.017, 0.032], 0.004)
    box('red', [1.028, 0.758, sign * 0.21], [0.035, 0.005, 0.022], 0.001)
  }

  // The painted rear cover only spans the folded soft-top well, behind the
  // back seats. Thin seams define it as a flush panel in the body shell.
  box('paint', [1.365, 0.884, 0], [0.273, 0.027, 1.326], 0.012)
  line(
    'plastic',
    [
      [1.218, 0.897, -0.59],
      [1.215, 0.9, 0],
      [1.218, 0.897, 0.59],
    ],
    0.004,
    16,
  )
  line(
    'seam',
    [
      [1.48, 0.898, -0.62],
      [1.48, 0.902, 0],
      [1.48, 0.898, 0.62],
    ],
    0.0013,
    16,
  )
  for (const sign of [-1, 1])
    box('paint', [1.18, 0.877, sign * 0.632], [0.243, 0.034, 0.074], 0.015)

  // Dashboard padding follows the original raked windscreen, with a separate
  // binnacle rather than a broad grey slab crossing the passenger compartment.
  box('plastic', [-0.516, 0.852, 0], [0.32, 0.156, 1.241], 0.025)
  box('leather', [-0.457, 0.755, 0], [0.18, 0.139, 1.234], 0.021)
  box('leatherSoft', [-0.498, 0.927, 0], [0.327, 0.025, 1.255], 0.01)
  box(
    'plastic',
    [-0.406, 0.957, 0.365],
    [0.12, 0.139, 0.382],
    0.018,
    [0, 0, 0.06],
  )
  // Passenger glovebox seam and latch.
  line(
    'seam',
    [
      [-0.36, 0.813, -0.56],
      [-0.352, 0.813, -0.25],
      [-0.352, 0.736, -0.25],
      [-0.36, 0.736, -0.56],
    ],
    0.0013,
    4,
  )
  box('chrome', [-0.347, 0.805, -0.4], [0.006, 0.009, 0.062], 0.002)
  for (const z of [-0.51, -0.14, 0.073, 0.551]) {
    box('plastic', [-0.346, 0.876, z], [0.017, 0.053, 0.109], 0.007)
    for (let slit = -2; slit <= 2; slit++)
      box(
        'seam',
        [-0.335, 0.876 + slit * 0.009, z],
        [0.004, 0.0015, 0.091],
        0.0005,
      )
  }
  // Slightly driver-facing centre stack, cassette radio and heater controls.
  box(
    'plastic',
    [-0.296, 0.783, -0.019],
    [0.06, 0.208, 0.235],
    0.01,
    [0, 0, 0.1],
  )
  box('instrument', [-0.257, 0.818, -0.019], [0.005, 0.036, 0.195], 0.002)
  for (const z of [-0.085, -0.005, 0.065])
    cylinder(
      'plastic',
      [-0.247, 0.755, z],
      0.019,
      0.013,
      [0, 0, Math.PI / 2],
      14,
    )
  box('red', [-0.249, 0.865, 0.041], [0.007, 0.015, 0.028], 0.002)
  box('plastic', [-0.009, 0.724, 0], [0.393, 0.05, 0.171], 0.013)
  box('leather', [-0.064, 0.759, 0], [0.111, 0.021, 0.112], 0.018)
  for (let fold = 0; fold < 5; fold++)
    box(
      'leather',
      [-0.061, 0.768 + fold * 0.008, 0],
      [0.091 - fold * 0.009, 0.008, 0.086 - fold * 0.008],
      0.005,
    )
  cylinder('chrome', [-0.054, 0.823, 0], 0.01, 0.073, [0, 0, 0.06], 12)
  sphere('plastic', [-0.051, 0.864, 0], [0.029, 0.032, 0.026])
  box(
    'plastic',
    [0.268, 0.744, 0.051],
    [0.217, 0.029, 0.025],
    0.01,
    [0, 0, -0.08],
  )
  box('plastic', [0.11, 0.75, -0.053], [0.091, 0.014, 0.026], 0.003)

  // Original 3-spoke sports wheel, black-rubber rim, centre pad and stalks.
  cylinder('plastic', [-0.294, 0.911, 0.368], 0.025, 0.18, [0, 0, -1.22], 16)
  add(
    'leather',
    new THREE.TorusGeometry(0.111, 0.012, 7, 48),
    [-0.203, 0.987, 0.368],
    [0, Math.PI / 2, -0.18],
  )
  for (const angle of [0, Math.PI * 0.72, Math.PI * 1.28]) {
    const y = 0.987 + Math.sin(angle) * 0.096
    const z = 0.368 + Math.cos(angle) * 0.096
    line(
      'plastic',
      [
        [-0.203, 0.987, 0.368],
        [-0.203, y, z],
      ],
      0.011,
      1,
    )
  }
  cylinder(
    'plastic',
    [-0.203, 0.987, 0.368],
    0.036,
    0.027,
    [0, 0, Math.PI / 2],
    20,
  )
  cylinder(
    'chrome',
    [-0.186, 0.987, 0.368],
    0.011,
    0.002,
    [0, 0, Math.PI / 2],
    20,
  )
  line(
    'plastic',
    [
      [-0.28, 0.957, 0.28],
      [-0.26, 0.957, 0.201],
    ],
    0.005,
    2,
  )
  line(
    'plastic',
    [
      [-0.28, 0.957, 0.455],
      [-0.26, 0.957, 0.528],
    ],
    0.005,
    2,
  )

  const result = {}
  for (const [name, geometries] of Object.entries(parts)) {
    result[name] = mergeGeometries(geometries)
    geometries.forEach((geometry) => geometry.dispose())
  }
  return result
}

function createLeatherGrain() {
  const size = 128
  const pixels = new Uint8Array(size * size * 4)
  for (let i = 0; i < size * size; i++) {
    const noise = ((i * 16807 + 173) % 65536) / 65535
    const value = Math.round(110 + noise * 100)
    pixels.set([value, value, value, 255], i * 4)
  }
  const texture = new THREE.DataTexture(pixels, size, size)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 3)
  texture.needsUpdate = true
  return texture
}

function InstrumentCluster() {
  const map = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 768
    canvas.height = 256
    const c = canvas.getContext('2d')
    c.fillStyle = '#080a0b'
    c.fillRect(0, 0, 768, 256)
    for (const [cx, radius, max] of [
      [103, 65, 80],
      [284, 104, 240],
      [514, 104, 7],
      [686, 59, 100],
    ]) {
      c.strokeStyle = '#444a4c'
      c.lineWidth = 3
      c.beginPath()
      c.arc(cx, 126, radius + 4, 0, Math.PI * 2)
      c.stroke()
      for (let tick = 0; tick <= 30; tick++) {
        const angle = Math.PI * 0.73 + (tick / 30) * Math.PI * 1.54
        const long = tick % 5 === 0
        c.strokeStyle = '#d5d5ca'
        c.lineWidth = long ? 3 : 1.6
        c.beginPath()
        c.moveTo(
          cx + Math.cos(angle) * radius * 0.94,
          126 + Math.sin(angle) * radius * 0.94,
        )
        c.lineTo(
          cx + Math.cos(angle) * radius * (long ? 0.79 : 0.87),
          126 + Math.sin(angle) * radius * (long ? 0.79 : 0.87),
        )
        c.stroke()
        if (long && radius > 80) {
          c.fillStyle = '#c7c8bd'
          c.font = '18px Arial'
          c.textAlign = 'center'
          c.fillText(
            String(Math.round((tick / 30) * max)),
            cx + Math.cos(angle) * radius * 0.64,
            132 + Math.sin(angle) * radius * 0.64,
          )
        }
      }
      const angle = cx === 514 ? 3.2 : 3.65
      c.strokeStyle = '#cf6641'
      c.lineWidth = 4
      c.beginPath()
      c.moveTo(cx, 126)
      c.lineTo(
        cx + Math.cos(angle) * radius * 0.75,
        126 + Math.sin(angle) * radius * 0.75,
      )
      c.stroke()
      c.fillStyle = '#24292a'
      c.beginPath()
      c.arc(cx, 126, 9, 0, Math.PI * 2)
      c.fill()
    }
    c.fillStyle = '#b8aa8b'
    c.font = '19px monospace'
    c.textAlign = 'center'
    c.fillText('0 8 9 2 4 5', 284, 176)
    c.font = '13px Arial'
    c.fillText('km/h', 284, 206)
    c.fillText('1/min × 1000', 514, 202)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])
  useEffect(() => () => map.dispose(), [map])
  return (
    <mesh position={[-0.339, 0.958, 0.365]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[0.351, 0.118]} />
      <meshStandardMaterial
        map={map}
        roughness={0.38}
        emissive="#b3a178"
        emissiveIntensity={0.045}
      />
    </mesh>
  )
}

export default function E30Interior({ paint = '#b71920', ...props }) {
  const batches = useMemo(buildInterior, [])
  const grain = useMemo(createLeatherGrain, [])
  useEffect(() => () => grain.dispose(), [grain])
  const materials = {
    leather: {
      color: '#101214',
      roughness: 0.67,
      metalness: 0,
      bumpMap: grain,
      bumpScale: 0.0011,
    },
    leatherSoft: {
      color: '#151719',
      roughness: 0.73,
      metalness: 0,
      bumpMap: grain,
      bumpScale: 0.0013,
    },
    plastic: { color: '#090c0e', roughness: 0.83, metalness: 0.02 },
    chrome: { color: '#949ca1', roughness: 0.26, metalness: 0.92 },
    seam: { color: '#34383a', roughness: 0.91, metalness: 0 },
    carpet: { color: '#101111', roughness: 1, metalness: 0 },
    mat: { color: '#0b0c0d', roughness: 1, metalness: 0 },
    paint: { color: paint, roughness: 0.33, metalness: 0.05 },
    red: { color: '#a12726', roughness: 0.57, metalness: 0.03 },
    instrument: {
      color: '#10130f',
      roughness: 0.4,
      metalness: 0.03,
      emissive: '#a56c35',
      emissiveIntensity: 0.055,
    },
  }
  return (
    <group name="E30-black-leather-open-cabin" {...props}>
      {Object.entries(batches).map(([name, geometry]) => (
        <mesh
          key={name}
          name={`cabin-${name}`}
          geometry={geometry}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial {...materials[name]} />
        </mesh>
      ))}
      <InstrumentCluster />
    </group>
  )
}
