import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

// Original E30 cabin, normalized to the imported body's open aperture. Nose is
// -X, driver's side is +Z. All surfaces retain UVs for the shared trim textures.
export function createCockpit() {
  const parts = []
  const matrix = new THREE.Matrix4()
  const quaternion = new THREE.Quaternion()
  const euler = new THREE.Euler()

  const add = (
    material,
    input,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    transform,
  ) => {
    let geometry = input
    euler.set(...rotation)
    quaternion.setFromEuler(euler)
    matrix.compose(
      new THREE.Vector3(...position),
      quaternion,
      new THREE.Vector3(1, 1, 1),
    )
    geometry.applyMatrix4(matrix)
    if (transform) geometry.applyMatrix4(transform)
    if (geometry.index) {
      const indexed = geometry
      geometry = indexed.toNonIndexed()
      indexed.dispose()
    }
    parts.push({ material, geometry })
    return geometry
  }

  const box = (material, position, size, radius = 0.004, rotation, transform) =>
    add(
      material,
      new RoundedBoxGeometry(
        ...size,
        Math.max(...size) < 0.08 ? 1 : 2,
        Math.min(radius, ...size.map((value) => value * 0.46)),
      ),
      position,
      rotation,
      transform,
    )

  const tube = (material, points, radius = 0.001, segments = 24, transform) =>
    add(
      material,
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(
          points.map((point) => new THREE.Vector3(...point)),
        ),
        segments,
        radius,
        6,
        false,
      ),
      undefined,
      undefined,
      transform,
    )

  const cylinder = (
    material,
    position,
    radius,
    depth,
    rotation,
    transform,
    segments = 24,
  ) =>
    add(
      material,
      new THREE.CylinderGeometry(radius, radius, depth, segments),
      position,
      rotation,
      transform,
    )

  const ellipsoid = (material, position, scale, transform) => {
    const geometry = new THREE.SphereGeometry(1, 24, 16)
    geometry.scale(...scale)
    return add(material, geometry, position, undefined, transform)
  }

  function roundedShape(points, radius = 0.01) {
    const shape = new THREE.Shape()
    const corners = points.map((point, index) => {
      const p = new THREE.Vector2(...point)
      const before = new THREE.Vector2(
        ...points[(index + points.length - 1) % points.length],
      ).sub(p)
      const after = new THREE.Vector2(
        ...points[(index + 1) % points.length],
      ).sub(p)
      const distance = Math.min(
        radius,
        before.length() * 0.4,
        after.length() * 0.4,
      )
      return {
        p,
        before: before.normalize().multiplyScalar(distance).add(p),
        after: after.normalize().multiplyScalar(distance).add(p),
      }
    })
    shape.moveTo(corners[0].before.x, corners[0].before.y)
    corners.forEach(({ p, before, after }) => {
      shape.lineTo(before.x, before.y)
      shape.quadraticCurveTo(p.x, p.y, after.x, after.y)
    })
    shape.closePath()
    return shape
  }

  function extrude(
    material,
    points,
    depth,
    position,
    radius = 0.008,
    bevel = 0.003,
    rotation,
    transform,
  ) {
    const geometry = new THREE.ExtrudeGeometry(roundedShape(points, radius), {
      depth,
      steps: 1,
      bevelEnabled: bevel > 0,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 3,
      curveSegments: 6,
    })
    return add(material, geometry, position, rotation, transform)
  }

  // A grid of explicit cross sections gives upholstery/padding continuous
  // tangents. U follows the section; V follows the sweep, with closed end caps.
  function loft(material, rings, closed = true) {
    const positions = []
    const uvs = []
    const indices = []
    const columns = rings[0].length
    const count = closed ? columns + 1 : columns
    rings.forEach((ring, row) => {
      for (let column = 0; column < count; column++) {
        positions.push(...ring[column % columns])
        uvs.push(column / (count - 1), row / (rings.length - 1))
      }
    })
    for (let row = 0; row < rings.length - 1; row++) {
      for (let column = 0; column < count - 1; column++) {
        const a = row * count + column
        const b = a + count
        indices.push(a, b, a + 1, b, b + 1, a + 1)
      }
    }
    if (closed) {
      // Caps are triangle fans; these sections are deliberately convex.
      for (const row of [0, rings.length - 1]) {
        const center = new THREE.Vector3()
        rings[row].forEach((point) => center.add(new THREE.Vector3(...point)))
        center.divideScalar(columns)
        const centerIndex = positions.length / 3
        positions.push(center.x, center.y, center.z)
        uvs.push(0.5, 0.5)
        for (let column = 0; column < columns; column++) {
          const a = row * count + column
          if (row === 0) indices.push(centerIndex, a, a + 1)
          else indices.push(centerIndex, a + 1, a)
        }
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    )
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()
    return add(material, geometry)
  }

  // One upholstered crown wraps continuously from the windshield foot to the
  // gently rounded lower fascia. No stacked rectangular dashboard volumes.
  const dashProfile = new THREE.CatmullRomCurve3(
    [
      [-0.893, 0.795],
      [-0.91, 0.851],
      [-0.874, 0.886],
      [-0.723, 0.905],
      [-0.51, 0.925],
      [-0.43, 0.926],
      [-0.353, 0.913],
      [-0.312, 0.878],
      [-0.306, 0.823],
      [-0.341, 0.765],
      [-0.428, 0.736],
      [-0.736, 0.747],
      [-0.872, 0.767],
    ].map(([x, y]) => new THREE.Vector3(x, y, 0)),
    true,
    'catmullrom',
    0.2,
  )
  const dashSections = []
  for (let strip = 0; strip <= 32; strip++) {
    const z = -0.625 + (strip / 32) * 1.25
    const end = Math.pow(Math.abs(z) / 0.625, 5)
    dashSections.push(
      Array.from({ length: 80 }, (_, index) => {
        const p = dashProfile.getPoint(index / 80)
        return [p.x - end * 0.016, p.y - end * 0.022, z]
      }),
    )
  }
  loft('vinyl', dashSections)

  // Long narrow defroster slots sit flush in the crown at the glass foot.
  for (const sign of [-1, 1]) {
    box('plastic', [-0.775, 0.903, sign * 0.324], [0.032, 0.003, 0.397], 0.0015)
    for (let slit = -2; slit <= 2; slit++) {
      box(
        'seam',
        [-0.775 + slit * 0.005, 0.905, sign * 0.324],
        [0.0013, 0.001, 0.363],
        0.0004,
      )
    }
  }

  // Thin arched instrument brow, open underneath and in front. Its maximum
  // height is .981: a small protective lip, rather than a box above the dash.
  const browOuter = [
    [-0.207, 0.84],
    [-0.207, 0.917],
    [-0.185, 0.965],
    [-0.14, 0.981],
    [0.14, 0.981],
    [0.185, 0.965],
    [0.207, 0.917],
    [0.207, 0.84],
  ]
  const browInner = [
    [0.195, 0.84],
    [0.195, 0.915],
    [0.176, 0.955],
    [0.136, 0.969],
    [-0.136, 0.969],
    [-0.176, 0.955],
    [-0.195, 0.915],
    [-0.195, 0.84],
  ]
  // Shape horizontal coordinates map to -Z after the +90-degree Y rotation.
  extrude(
    'vinyl',
    [...browOuter, ...browInner],
    0.153,
    [-0.439, 0, 0.355],
    0.009,
    0.0025,
    [0, Math.PI / 2, 0],
  )
  box('plastic', [-0.294, 0.902, 0.355], [0.021, 0.131, 0.379], 0.012)
  add(
    'gauges',
    new THREE.PlaneGeometry(0.35, 0.115),
    [-0.275, 0.903, 0.355],
    [0, Math.PI / 2, 0],
  )

  // Passenger glovebox follows the rounded fascia. The dark seam is a very
  // shallow groove and a small black latch, rather than contrasting piping.
  tube(
    'seam',
    [
      [-0.313, 0.851, -0.57],
      [-0.303, 0.852, -0.4],
      [-0.309, 0.85, -0.2],
      [-0.325, 0.778, -0.2],
      [-0.343, 0.758, -0.4],
      [-0.337, 0.778, -0.57],
    ],
    0.0009,
    34,
  )
  box('plastic', [-0.299, 0.84, -0.389], [0.009, 0.016, 0.061], 0.004)

  function vent(position, size, transform) {
    box('plastic', position, size, 0.006, undefined, transform)
    for (let slat = -2; slat <= 2; slat++) {
      box(
        'vinyl',
        [
          position[0] + size[0] * 0.51,
          position[1] + slat * size[1] * 0.155,
          position[2],
        ],
        [0.003, 0.0018, size[2] * 0.85],
        0.0007,
        [0, 0, -0.12],
        transform,
      )
    }
    box(
      'plastic',
      [position[0] + size[0] * 0.63, position[1], position[2]],
      [0.003, size[1] * 0.6, 0.005],
      0.001,
      undefined,
      transform,
    )
  }
  vent([-0.311, 0.88, -0.555], [0.018, 0.051, 0.091])
  vent([-0.31, 0.875, 0.585], [0.018, 0.049, 0.066])

  // The entire narrow centre stack is angled toward the driver (+Z). Heater
  // rotaries and temperature slider retain the simple late-eighties layout.
  const stack = new THREE.Matrix4().makeRotationY(-0.19)
  stack.setPosition(-0.296, 0.795, -0.025)
  extrude(
    'plastic',
    [
      [-0.123, -0.114],
      [0.123, -0.114],
      [0.125, 0.111],
      [0.109, 0.123],
      [-0.109, 0.123],
      [-0.125, 0.111],
    ],
    0.046,
    [-0.021, 0, 0],
    0.009,
    0.003,
    [0, Math.PI / 2, 0],
    stack,
  )
  for (const z of [-0.058, 0.046])
    vent([0.028, 0.087, z], [0.014, 0.043, 0.089], stack)
  box(
    'plastic',
    [0.037, 0.047, -0.005],
    [0.008, 0.012, 0.198],
    0.002,
    undefined,
    stack,
  )
  box(
    'badgeBlue',
    [0.042, 0.047, -0.062],
    [0.001, 0.0016, 0.064],
    0.0003,
    undefined,
    stack,
  )
  box(
    'red',
    [0.042, 0.047, 0.037],
    [0.001, 0.0016, 0.062],
    0.0003,
    undefined,
    stack,
  )
  box(
    'plastic',
    [0.044, 0.047, -0.015],
    [0.006, 0.01, 0.018],
    0.0015,
    undefined,
    stack,
  )
  for (const z of [-0.073, 0, 0.073]) {
    cylinder(
      'plastic',
      [0.043, 0.005, z],
      0.0185,
      0.013,
      [0, 0, Math.PI / 2],
      stack,
    )
    cylinder(
      'vinyl',
      [0.051, 0.005, z],
      0.0155,
      0.004,
      [0, 0, Math.PI / 2],
      stack,
    )
    box(
      'badgeWhite',
      [0.054, 0.014, z],
      [0.001, 0.006, 0.0016],
      0.0003,
      undefined,
      stack,
    )
    for (let tick = 0; tick < 7; tick++) {
      const angle = -Math.PI * 0.7 + (tick * Math.PI * 1.4) / 6
      box(
        'seam',
        [0.033, 0.005 + Math.cos(angle) * 0.024, z + Math.sin(angle) * 0.024],
        [0.001, 0.0025, 0.0014],
        0.0003,
        [angle, 0, 0],
        stack,
      )
    }
  }
  box(
    'plastic',
    [0.034, -0.062, 0],
    [0.012, 0.044, 0.214],
    0.003,
    undefined,
    stack,
  )
  add(
    'radio',
    new THREE.PlaneGeometry(0.191, 0.034),
    [0.042, -0.062, 0],
    [0, Math.PI / 2, 0],
    stack,
  )
  for (const z of [-0.094, 0.094])
    cylinder(
      'plastic',
      [0.046, -0.062, z],
      0.009,
      0.007,
      [0, 0, Math.PI / 2],
      stack,
      20,
    )
  box(
    'plastic',
    [0.044, -0.057, -0.005],
    [0.003, 0.004, 0.079],
    0.0008,
    undefined,
    stack,
  )
  for (let button = -2; button <= 2; button++)
    box(
      'vinyl',
      [0.047, -0.073, button * 0.018],
      [0.004, 0.006, 0.012],
      0.0008,
      undefined,
      stack,
    )
  box(
    'red',
    [0.04, 0.112, 0.104],
    [0.01, 0.013, 0.019],
    0.002,
    undefined,
    stack,
  )

  // Low tapered transmission tunnel. Each transverse section is softly
  // rounded; its narrow rear end leaves space between the seat bolsters.
  const consoleSections = [
    [-0.3, 0.113, 0.73],
    [-0.22, 0.112, 0.739],
    [-0.1, 0.106, 0.729],
    [0.035, 0.099, 0.704],
    [0.2, 0.087, 0.683],
    [0.37, 0.079, 0.663],
    [0.51, 0.069, 0.643],
  ].map(([x, halfWidth, top]) =>
    Array.from({ length: 48 }, (_, index) => {
      const angle = (index / 48) * Math.PI * 2
      const cosine = Math.cos(angle)
      const sine = Math.sin(angle)
      return [
        x,
        0.58 +
          (top - 0.58) *
            (0.5 + Math.sign(sine) * Math.pow(Math.abs(sine), 0.48) * 0.5),
        Math.sign(cosine) * Math.pow(Math.abs(cosine), 0.45) * halfWidth,
      ]
    }),
  )
  loft('plastic', consoleSections)

  // Recessed shifter aperture with an actual folded, tapered leather gaiter.
  const surround = roundedShape(
    [
      [-0.085, -0.076],
      [0.085, -0.076],
      [0.085, 0.076],
      [-0.085, 0.076],
    ],
    0.017,
  )
  const hole = roundedShape(
    [
      [-0.069, -0.059],
      [-0.069, 0.059],
      [0.069, 0.059],
      [0.069, -0.059],
    ],
    0.014,
  )
  surround.holes.push(hole)
  add(
    'vinyl',
    new THREE.ExtrudeGeometry(surround, {
      depth: 0.004,
      bevelEnabled: true,
      bevelSize: 0.0015,
      bevelThickness: 0.0015,
      bevelSegments: 2,
      curveSegments: 6,
    }),
    [-0.047, 0.726, 0],
    [-Math.PI / 2, 0, 0],
  )
  loft(
    'leatherInset',
    Array.from({ length: 12 }, (_, level) => {
      const t = level / 11
      return Array.from({ length: 48 }, (_, index) => {
        const angle = (index / 48) * Math.PI * 2
        const fold =
          1 + Math.sin(angle * 7 + t * 1.5) * 0.075 * Math.sin(t * Math.PI)
        const cosine = Math.cos(angle)
        const sine = Math.sin(angle)
        return [
          -0.047 +
            Math.sign(cosine) *
              Math.pow(Math.abs(cosine), 0.63 + t * 0.37) *
              (0.067 - t * 0.052) *
              fold,
          0.729 + t * 0.056 + Math.sin(angle * 5) * 0.0018 * (1 - t),
          Math.sign(sine) *
            Math.pow(Math.abs(sine), 0.63 + t * 0.37) *
            (0.057 - t * 0.045) *
            fold,
        ]
      })
    }),
  )
  cylinder('chrome', [-0.043, 0.797, 0], 0.005, 0.033, [0, 0, -0.11])
  ellipsoid('leather', [-0.041, 0.822, 0], [0.02, 0.025, 0.019])
  tube(
    'seam',
    [
      [-0.055, 0.836, -0.012],
      [-0.06, 0.837, 0],
      [-0.055, 0.836, 0.012],
    ],
    0.00065,
    12,
  )
  for (const z of [-0.094, 0.094]) {
    box('vinyl', [-0.049, 0.731, z], [0.041, 0.007, 0.019], 0.003)
    box('badgeWhite', [-0.049, 0.735, z], [0.013, 0.0009, 0.001], 0.0003)
  }
  box('vinyl', [-0.215, 0.742, 0], [0.052, 0.006, 0.163], 0.004)
  tube(
    'seam',
    [
      [-0.215, 0.746, -0.066],
      [-0.213, 0.746, 0],
      [-0.215, 0.746, 0.066],
    ],
    0.0008,
    10,
  )
  ellipsoid('leatherEdge', [0.367, 0.679, 0.043], [0.062, 0.02, 0.027])
  tube(
    'plastic',
    [
      [0.386, 0.68, 0.043],
      [0.29, 0.704, 0.043],
      [0.166, 0.731, 0.043],
    ],
    0.0115,
    18,
  )
  tube(
    'vinyl',
    [
      [0.268, 0.71, 0.043],
      [0.216, 0.722, 0.043],
      [0.163, 0.734, 0.043],
    ],
    0.013,
    14,
  )
  ellipsoid('chrome', [0.153, 0.736, 0.043], [0.004, 0.005, 0.005])

  // Compact M Technic I wheel: broad three spokes, padded rectangular centre,
  // discreet roundel, and a slim leather rim. The upper rim leans toward -X.
  const rake = 0.27
  const wheel = new THREE.Matrix4().makeBasis(
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(-Math.sin(rake), Math.cos(rake), 0),
    new THREE.Vector3(Math.cos(rake), Math.sin(rake), 0),
  )
  wheel.setPosition(-0.146, 0.94, 0.355)
  add(
    'leather',
    new THREE.TorusGeometry(0.145, 0.0115, 10, 72),
    undefined,
    undefined,
    wheel,
  )
  add(
    'seam',
    new THREE.TorusGeometry(0.14, 0.00065, 4, 72),
    [0, 0, 0.009],
    undefined,
    wheel,
  )
  for (const sign of [-1, 1])
    extrude(
      'vinyl',
      [
        [sign * 0.043, -0.017],
        [sign * 0.137, 0.014],
        [sign * 0.128, 0.051],
        [sign * 0.046, 0.039],
      ],
      0.017,
      [0, 0, -0.008],
      0.008,
      0.004,
      undefined,
      wheel,
    )
  extrude(
    'vinyl',
    [
      [-0.026, -0.027],
      [-0.038, -0.13],
      [0.038, -0.13],
      [0.026, -0.027],
    ],
    0.017,
    [0, 0, -0.008],
    0.01,
    0.004,
    undefined,
    wheel,
  )
  box(
    'leatherEdge',
    [0, 0.003, 0.011],
    [0.149, 0.079, 0.032],
    0.015,
    undefined,
    wheel,
  )
  add(
    'plastic',
    new THREE.CircleGeometry(0.018, 32),
    [0, 0.009, 0.028],
    undefined,
    wheel,
  )
  for (let quadrant = 0; quadrant < 4; quadrant++)
    add(
      quadrant % 2 === 0 ? 'badgeBlue' : 'badgeWhite',
      new THREE.CircleGeometry(
        0.0126,
        12,
        (quadrant * Math.PI) / 2,
        Math.PI / 2,
      ),
      [0, 0.009, 0.0287],
      undefined,
      wheel,
    )
  for (const [index, material] of ['badgeBlue', 'badgeWhite', 'red'].entries())
    box(
      material,
      [-0.009 + index * 0.008, -0.064, 0.015],
      [0.004, 0.012, 0.0012],
      0.0005,
      [0, 0, -0.3],
      wheel,
    )
  tube(
    'plastic',
    [
      [-0.352, 0.861, 0.355],
      [-0.273, 0.891, 0.355],
      [-0.165, 0.934, 0.355],
    ],
    0.023,
    18,
  )
  for (const sign of [-1, 1]) {
    tube(
      'plastic',
      [
        [-0.26, 0.914, 0.355 + sign * 0.025],
        [-0.246, 0.928, 0.355 + sign * 0.093],
        [-0.235, 0.925, 0.355 + sign * 0.139],
      ],
      0.0042,
      12,
    )
    box(
      'vinyl',
      [-0.235, 0.926, 0.355 + sign * 0.143],
      [0.028, 0.012, 0.025],
      0.004,
    )
  }

  // Door panels: recessed field, continuous padded waist, a horizontal armrest
  // connected to a substantial diagonal pull, and an open lower map pocket.
  for (const side of [-1, 1]) {
    // Mirror the side, then reverse triangle winding as well as its attributes.
    const sideMatrix = new THREE.Matrix4().makeScale(1, 1, side)
    const sideAdd = (material, geometry, position, rotation) => {
      const result = add(material, geometry, position, rotation, sideMatrix)
      if (side === -1) {
        for (const attribute of Object.values(result.attributes)) {
          const array = attribute.array
          const size = attribute.itemSize
          for (let vertex = 0; vertex < attribute.count; vertex += 3) {
            for (let component = 0; component < size; component++) {
              const a = vertex * size + component
              const b = (vertex + 2) * size + component
              const value = array[a]
              array[a] = array[b]
              array[b] = value
            }
          }
        }
      }
      return result
    }
    const panel = (
      material,
      points,
      z,
      depth,
      radius = 0.018,
      bevel = 0.003,
    ) => {
      const geometry = new THREE.ExtrudeGeometry(roundedShape(points, radius), {
        depth,
        bevelEnabled: true,
        bevelSize: bevel,
        bevelThickness: bevel,
        bevelSegments: 3,
        curveSegments: 6,
      })
      return sideAdd(material, geometry, [0, 0, z])
    }
    panel(
      'vinyl',
      [
        [-0.546, 0.822],
        [-0.443, 0.869],
        [0.575, 0.866],
        [0.758, 0.815],
        [0.748, 0.619],
        [0.55, 0.588],
        [-0.447, 0.59],
        [-0.55, 0.631],
      ],
      0.618,
      0.025,
      0.025,
    )
    panel(
      'leatherInset',
      [
        [-0.402, 0.811],
        [0.532, 0.813],
        [0.633, 0.778],
        [0.611, 0.681],
        [-0.418, 0.681],
        [-0.452, 0.723],
      ],
      0.607,
      0.01,
      0.027,
      0.002,
    )
    panel(
      'leatherEdge',
      [
        [-0.527, 0.835],
        [-0.421, 0.863],
        [0.566, 0.861],
        [0.741, 0.818],
        [0.711, 0.807],
        [0.55, 0.838],
        [-0.425, 0.84],
        [-0.529, 0.817],
      ],
      0.594,
      0.036,
      0.016,
    )
    panel(
      'vinyl',
      [
        [-0.159, 0.717],
        [-0.097, 0.749],
        [0.472, 0.742],
        [0.583, 0.718],
        [0.548, 0.697],
        [-0.143, 0.696],
      ],
      0.568,
      0.039,
      0.016,
      0.005,
    )
    panel(
      'leatherEdge',
      [
        [-0.329, 0.801],
        [-0.303, 0.818],
        [-0.068, 0.748],
        [-0.113, 0.71],
        [-0.15, 0.728],
      ],
      0.565,
      0.028,
      0.011,
      0.005,
    )
    panel(
      'plastic',
      [
        [-0.361, 0.803],
        [-0.361, 0.832],
        [-0.231, 0.832],
        [-0.231, 0.803],
      ],
      0.588,
      0.01,
      0.005,
      0.0015,
    )
    panel(
      'chrome',
      [
        [-0.344, 0.815],
        [-0.343, 0.821],
        [-0.256, 0.82],
        [-0.266, 0.812],
      ],
      0.584,
      0.004,
      0.002,
      0.0008,
    )
    panel(
      'plastic',
      [
        [-0.248, 0.668],
        [0.615, 0.668],
        [0.62, 0.615],
        [-0.229, 0.611],
      ],
      0.594,
      0.02,
      0.015,
    )
    panel(
      'vinyl',
      [
        [-0.226, 0.651],
        [0.609, 0.653],
        [0.609, 0.607],
        [-0.207, 0.603],
      ],
      0.57,
      0.013,
      0.015,
      0.003,
    )
    // Flush, fine speaker slots are dark cuts rather than bright wire mesh.
    sideAdd(
      'plastic',
      new THREE.CylinderGeometry(0.043, 0.043, 0.006, 40),
      [-0.393, 0.651, 0.598],
      [Math.PI / 2, 0, 0],
    )
    for (let slot = -5; slot <= 5; slot++) {
      const y = slot * 0.006
      const width = Math.sqrt(Math.max(0, 0.036 ** 2 - y ** 2)) * 2
      sideAdd(
        'seam',
        new RoundedBoxGeometry(width, 0.0013, 0.0012, 1, 0.0004),
        [-0.393, 0.651 + y, 0.594],
      )
    }
    // A softly inset rear-quarter panel and round recessed grille match the
    // open-top cabin reference; their top edges stay below the belt line.
    panel(
      'vinyl',
      [
        [0.748, 0.837],
        [1.185, 0.851],
        [1.24, 0.79],
        [1.22, 0.622],
        [0.759, 0.615],
        [0.723, 0.684],
      ],
      0.595,
      0.044,
      0.036,
      0.005,
    )
    panel(
      'leatherInset',
      [
        [0.807, 0.807],
        [1.151, 0.82],
        [1.18, 0.776],
        [1.158, 0.66],
        [0.8, 0.663],
        [0.775, 0.715],
      ],
      0.585,
      0.009,
      0.033,
      0.002,
    )
    sideAdd(
      'plastic',
      new THREE.CylinderGeometry(0.056, 0.056, 0.004, 40),
      [1.082, 0.743, 0.579],
      [Math.PI / 2, 0, 0],
    )
    for (let row = -5; row <= 5; row++)
      for (let column = -5; column <= 5; column++) {
        if (row * row + column * column > 27) continue
        sideAdd(
          'seam',
          new THREE.CircleGeometry(0.0017, 5),
          [1.082 + column * 0.0085, 0.743 + row * 0.0085, 0.5765],
          [0, Math.PI, 0],
        )
      }
    panel(
      'plastic',
      [
        [0.704, 0.85],
        [0.8, 0.85],
        [0.809, 0.817],
        [0.714, 0.816],
      ],
      0.587,
      0.047,
      0.008,
      0.002,
    )
  }

  // Footwells remain visible below the low fascia. Carpet and mats are separate
  // shallow skins, and modest pedal ribs read at close inspection.
  box('carpet', [0.3, 0.546, 0], [1.87, 0.018, 1.25], 0.01)
  for (const z of [-0.36, 0.36])
    box('carpet', [-0.11, 0.559, z], [0.69, 0.008, 0.414], 0.016)
  for (const [z, height, width] of [
    [0.496, 0.052, 0.035],
    [0.383, 0.05, 0.041],
    [0.255, 0.079, 0.022],
  ]) {
    box(
      'plastic',
      [-0.458, 0.631, z],
      [0.013, height, width],
      0.005,
      [0, 0, -0.29],
    )
    for (let rib = -2; rib <= 2; rib++)
      box(
        'seam',
        [-0.449, 0.631 + (rib * height) / 7, z],
        [0.002, 0.0012, width * 0.8],
        0.0004,
        [0, 0, -0.29],
      )
  }

  return parts
}
