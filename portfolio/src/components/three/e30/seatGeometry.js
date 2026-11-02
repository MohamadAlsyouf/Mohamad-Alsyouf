import * as THREE from 'three'

// Original geometry, studied from the OEM E30 Cabriolet sport seats. Upholstery
// is a continuous loft with a sewn centre insert, not an assembly of box pads.
// World-space convention: nose -X, up +Y, front-seat centres Z +/- .355.
const TAU = Math.PI * 2
const clamp = THREE.MathUtils.clamp
const smooth = (a, b, t) => {
  const x = clamp((t - a) / (b - a), 0, 1)
  return x * x * (3 - 2 * x)
}
const signedPower = (n, exponent) =>
  Math.sign(n) * Math.pow(Math.abs(n), exponent)

function profile(points, t) {
  for (let i = 1; i < points.length; i++) {
    if (t <= points[i][0]) {
      const a = points[i - 1]
      const b = points[i]
      return THREE.MathUtils.lerp(a[1], b[1], smooth(a[0], b[0], t))
    }
  }
  return points.at(-1)[1]
}

function makeGrid(point, rows, columns, reverse = false) {
  const vertices = []
  const uvs = []
  const indices = []
  for (let row = 0; row <= rows; row++) {
    for (let column = 0; column <= columns; column++) {
      vertices.push(...point(column / columns, row / rows))
      uvs.push(column / columns, row / rows)
    }
  }
  const width = columns + 1
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const a = row * width + column
      const b = a + width
      const face = reverse
        ? [a, a + 1, b, a + 1, b + 1, b]
        : [a, b, a + 1, a + 1, b, b + 1]
      indices.push(...face)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3),
  )
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

// Rounded rectangular cross-sections give the leather a broad soft face and
// a real rolled return, with smooth normals all the way around the seat.
function makeLoft(point, axis = 'y', rows = 30, columns = 56) {
  const geometry = makeGrid(
    (u, v) => point(v, u * TAU),
    rows,
    columns,
    axis === 'x',
  )
  const normal = geometry.attributes.normal
  for (let row = 0; row <= rows; row++) {
    const a = row * (columns + 1)
    const b = a + columns
    const n = new THREE.Vector3()
      .fromBufferAttribute(normal, a)
      .add(new THREE.Vector3().fromBufferAttribute(normal, b))
      .normalize()
    normal.setXYZ(a, n.x, n.y, n.z)
    normal.setXYZ(b, n.x, n.y, n.z)
  }

  // Close the ends with UV-mapped soft crown fans. These small caps follow the
  // shoulder/thigh profile, and do not create floating open upholstery shells.
  const positions = Array.from(geometry.attributes.position.array)
  const normals = Array.from(geometry.attributes.normal.array)
  const uv = Array.from(geometry.attributes.uv.array)
  const indices = Array.from(geometry.index.array)
  for (const end of [0, 1]) {
    const loop = Array.from({ length: columns }, (_, i) =>
      point(end, (i / columns) * TAU),
    )
    const centre = loop.reduce(
      (sum, p) => sum.map((value, i) => value + p[i] / columns),
      [0, 0, 0],
    )
    const start = positions.length / 3
    positions.push(...centre)
    normals.push(0, 0, 0)
    uv.push(0.5, 0.5)
    for (let i = 0; i <= columns; i++) {
      positions.push(...loop[i % columns])
      normals.push(0, 0, 0)
      uv.push(
        0.5 + Math.cos((i / columns) * TAU) * 0.5,
        0.5 + Math.sin((i / columns) * TAU) * 0.5,
      )
      if (i < columns) {
        const forward =
          (axis === 'x' && end === 1) || (axis === 'y' && end === 0)
        indices.push(
          ...(forward
            ? [start, start + i + 1, start + i + 2]
            : [start, start + i + 2, start + i + 1]),
        )
      }
    }
  }
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  )
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geometry.setIndex(indices)
  // The caps append vertices after the side surface was built. Reallocate the
  // normal buffer too: computeVertexNormals otherwise reuses its shorter array.
  geometry.deleteAttribute('normal')
  geometry.computeVertexNormals()
  const closedNormals = geometry.attributes.normal
  for (let row = 0; row <= rows; row++) {
    const a = row * (columns + 1)
    const b = a + columns
    const n = new THREE.Vector3()
      .fromBufferAttribute(closedNormals, a)
      .add(new THREE.Vector3().fromBufferAttribute(closedNormals, b))
      .normalize()
    closedNormals.setXYZ(a, n.x, n.y, n.z)
    closedNormals.setXYZ(b, n.x, n.y, n.z)
  }
  return geometry
}

function padCrown(t, breaks, height) {
  for (let i = 1; i < breaks.length; i++) {
    if (t <= breaks[i]) {
      const u = clamp((t - breaks[i - 1]) / (breaks[i] - breaks[i - 1]), 0, 1)
      return Math.pow(Math.sin(u * Math.PI), 0.7) * height
    }
  }
  return 0
}

export function createSeats() {
  const parts = []
  const add = (material, geometry) => parts.push({ material, geometry })
  function tube(material, points, radius = 0.0009, segments = 20) {
    const curve = new THREE.CatmullRomCurve3(
      points.map((point) => new THREE.Vector3(...point)),
    )
    add(material, new THREE.TubeGeometry(curve, segments, radius, 5, false))
  }
  function rod(material, a, b, radius, segments = 12) {
    const start = new THREE.Vector3(...a)
    const end = new THREE.Vector3(...b)
    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      start.distanceTo(end),
      segments,
    )
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      end.clone().sub(start).normalize(),
    )
    geometry
      .applyQuaternion(quaternion)
      .translate(...start.add(end).multiplyScalar(0.5).toArray())
    add(material, geometry)
  }
  function hardBox(material, centre, dimensions) {
    const geometry = new THREE.BoxGeometry(...dimensions)
    geometry.translate(...centre)
    add(material, geometry)
  }
  function backDimensions(v) {
    return {
      y: 0.723 + v * 0.304,
      x: 0.443 + 0.086 * v + 0.006 * Math.sin(v * Math.PI),
      width: profile(
        [
          [0, 0.205],
          [0.11, 0.218],
          [0.4, 0.208],
          [0.82, 0.188],
          [0.94, 0.178],
          [1, 0.153],
        ],
        v,
      ),
      depth: profile(
        [
          [0, 0.044],
          [0.08, 0.06],
          [0.4, 0.058],
          [0.85, 0.051],
          [0.97, 0.036],
          [1, 0.014],
        ],
        v,
      ),
    }
  }
  function backFront(v, u) {
    const d = backDimensions(v)
    const front = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u), 3.3333)), 0.3)
    // Continuous wing rolls, gently flared at the hips, are the signature of
    // the factory sport seat. These are part of its surface, not separate rods.
    const wing =
      Math.exp(-Math.pow((Math.abs(u) - 0.8) / 0.19, 2)) *
      0.061 *
      (smooth(0.01, 0.14, v) - smooth(0.86, 1, v)) *
      (1 - smooth(0.94, 1, Math.abs(u)))
    return d.x - d.depth * front - wing
  }
  function cushionDimensions(v) {
    const x = -0.084 + v * 0.541
    const top = profile(
      [
        [0, 0.71],
        [0.1, 0.727],
        [0.27, 0.711],
        [0.59, 0.688],
        [0.86, 0.694],
        [1, 0.715],
      ],
      v,
    )
    return {
      x,
      top,
      y: top - 0.051,
      width: profile(
        [
          [0, 0.175],
          [0.09, 0.21],
          [0.35, 0.216],
          [0.78, 0.211],
          [0.95, 0.194],
          [1, 0.177],
        ],
        v,
      ),
      depth: profile(
        [
          [0, 0.035],
          [0.1, 0.051],
          [0.83, 0.05],
          [0.97, 0.039],
          [1, 0.022],
        ],
        v,
      ),
    }
  }
  function cushionTop(v, u) {
    const d = cushionDimensions(v)
    const cross = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u), 3.3333)), 0.3)
    const bolster =
      0.045 *
      Math.exp(-Math.pow((Math.abs(u) - 0.8) / 0.18, 2)) *
      (smooth(0, 0.11, v) - smooth(0.87, 1, v)) *
      (1 - smooth(0.94, 1, Math.abs(u)))
    const pulloutSeam =
      0.0025 * Math.exp(-Math.pow((v - 0.27) / 0.018, 2)) * (1 - u * u)
    return d.y + d.depth * cross + bolster - pulloutSeam
  }

  for (const sign of [-1, 1]) {
    const centreZ = sign * 0.355
    const backPoint = (v, angle) => {
      const d = backDimensions(v)
      const u = signedPower(Math.sin(angle), 0.6)
      const isFront = Math.cos(angle) < 0
      const x = isFront
        ? backFront(v, u)
        : d.x + d.depth * signedPower(Math.cos(angle), 0.6)
      return [x, d.y, centreZ + d.width * u]
    }
    add('leather', makeLoft(backPoint, 'y', 38, 64))
    const cushionPoint = (v, angle) => {
      const d = cushionDimensions(v)
      const u = signedPower(Math.sin(angle), 0.6)
      const isTop = Math.cos(angle) > 0
      const y = isTop
        ? cushionTop(v, u)
        : d.y + d.depth * signedPower(Math.cos(angle), 0.6)
      return [d.x, y, centreZ + d.width * u]
    }
    add('leather', makeLoft(cushionPoint, 'x', 42, 64))

    // One gently crowned sewn insert, divided into three broad horizontal
    // back panels and the short lumbar strip visible on the original seats.
    const backBreaks = [0, 0.115, 0.41, 0.705, 1]
    const backInsert = (u, t) => {
      const v = 0.045 + t * 0.89
      const d = backDimensions(v)
      const panelWidth = profile(
        [
          [0, 0.126],
          [0.35, 0.132],
          [0.8, 0.129],
          [1, 0.12],
        ],
        t,
      )
      const transverse = (u * 2 - 1) * panelWidth
      const normalisedZ = transverse / d.width
      const crown =
        padCrown(t, backBreaks, 0.0038) * (1 - Math.pow(u * 2 - 1, 4))
      return [
        backFront(v, normalisedZ) - 0.0018 - crown,
        d.y,
        centreZ + transverse,
      ]
    }
    add('leatherInset', makeGrid(backInsert, 72, 32, true))
    for (const t of backBreaks.slice(1, -1)) {
      tube(
        'seam',
        Array.from({ length: 15 }, (_, i) => {
          const point = backInsert(i / 14, t)
          return [point[0] - 0.0003, point[1], point[2]]
        }),
        0.00068,
        16,
      )
    }
    for (const u of [0, 1])
      tube(
        'seam',
        Array.from({ length: 19 }, (_, i) => backInsert(u, i / 18)),
        0.00072,
        20,
      )

    const seatBreaks = [0, 0.27, 0.61, 1]
    const seatInsert = (u, t) => {
      const v = 0.025 + t * 0.94
      const d = cushionDimensions(v)
      const panelWidth = profile(
        [
          [0, 0.154],
          [0.25, 0.151],
          [0.8, 0.132],
          [1, 0.125],
        ],
        t,
      )
      const z = (u * 2 - 1) * panelWidth
      const crown =
        padCrown(t, seatBreaks, 0.0035) * (1 - Math.pow(u * 2 - 1, 4))
      return [d.x, cushionTop(v, z / d.width) + 0.0014 + crown, centreZ + z]
    }
    add('leatherInset', makeGrid(seatInsert, 68, 32, true))
    for (const t of seatBreaks.slice(1, -1))
      tube(
        'seam',
        Array.from({ length: 15 }, (_, i) => seatInsert(i / 14, t)),
        0.00065,
        16,
      )
    for (const u of [0, 1])
      tube(
        'seam',
        Array.from({ length: 21 }, (_, i) => seatInsert(u, i / 20)),
        0.0007,
        24,
      )

    // Soft trapezoidal headrest, wide at its bottom and narrower at the crown.
    // The low two-post gap and squat shape are deliberately OEM E30, not Vader.
    const headPoint = (v, angle) => {
      const width = profile(
        [
          [0, 0.105],
          [0.1, 0.129],
          [0.3, 0.128],
          [0.78, 0.114],
          [0.94, 0.106],
          [1, 0.092],
        ],
        v,
      )
      const depth = profile(
        [
          [0, 0.017],
          [0.12, 0.041],
          [0.45, 0.045],
          [0.82, 0.037],
          [1, 0.013],
        ],
        v,
      )
      const x = 0.542 + 0.013 * v + depth * signedPower(Math.cos(angle), 0.65)
      const z = centreZ + width * signedPower(Math.sin(angle), 0.6)
      return [x, 1.06 + v * 0.114, z]
    }
    add('leatherEdge', makeLoft(headPoint, 'y', 24, 56))
    for (const dz of [-0.065, 0.065])
      rod(
        'chrome',
        [0.541, 1.015, centreZ + dz],
        [0.55, 1.078, centreZ + dz],
        0.0052,
        12,
      )
    for (const side of [-1, 1]) {
      const points = Array.from({ length: 22 }, (_, i) =>
        headPoint(0.11 + (i / 21) * 0.8, Math.PI + side * 0.95),
      )
      tube('seam', points, 0.00063, 22)
    }

    // Rear upholstery return and shallow sewn map pocket, visible when the
    // turntable reveals the back of the front seats.
    const pocket = (u, t) => {
      const v = 0.15 + t * 0.48
      const d = backDimensions(v)
      const z = (u * 2 - 1) * (0.142 - 0.009 * t)
      const a = z / d.width
      const x =
        d.x +
        d.depth * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(a), 3.333)), 0.3)
      return [
        x + 0.0014 + 0.004 * Math.sin(t * Math.PI) * Math.sin(u * Math.PI),
        d.y,
        centreZ + z,
      ]
    }
    add('leatherEdge', makeGrid(pocket, 20, 24))
    tube(
      'seam',
      Array.from({ length: 15 }, (_, i) => pocket(i / 14, 1)),
      0.0008,
      16,
    )

    // Real metal sliders, pull-out adjuster, side hinge and small release lever.
    for (const dz of [-0.132, 0.132]) {
      hardBox('plastic', [0.19, 0.598, centreZ + dz], [0.545, 0.024, 0.027])
      hardBox('chrome', [0.19, 0.612, centreZ + dz], [0.503, 0.008, 0.012])
    }
    tube(
      'plastic',
      [
        [-0.06, 0.615, centreZ - 0.1],
        [-0.092, 0.607, centreZ - 0.1],
        [-0.092, 0.607, centreZ + 0.1],
        [-0.06, 0.615, centreZ + 0.1],
      ],
      0.007,
      6,
    )
    rod(
      'plastic',
      [0.43, 0.713, centreZ + sign * 0.204],
      [0.43, 0.713, centreZ + sign * 0.225],
      0.025,
      24,
    )
    tube(
      'plastic',
      [
        [0.43, 0.735, centreZ + sign * 0.221],
        [0.493, 0.747, centreZ + sign * 0.221],
        [0.522, 0.766, centreZ + sign * 0.22],
      ],
      0.009,
      8,
    )
    rod(
      'plastic',
      [0.358, 0.635, sign * 0.115],
      [0.335, 0.703, sign * 0.115],
      0.012,
      12,
    )
    hardBox('plastic', [0.334, 0.709, sign * 0.115], [0.053, 0.054, 0.032])
    hardBox('red', [0.328, 0.739, sign * 0.115], [0.034, 0.006, 0.023])
  }

  // Convertible rear bench: two shallow recesses and the raised central spine.
  // The original rear silhouette has no headrests; the cover stays visible.
  const rearBase = (v, angle) => {
    const u = signedPower(Math.sin(angle), 0.6)
    const z = 0.605 * u
    const front = 0.796 + v * 0.401
    const base = 0.671 + 0.015 * Math.cos(v * Math.PI)
    const depression =
      -0.014 *
      Math.exp(-Math.pow((Math.abs(z) - 0.32) / 0.16, 2)) *
      Math.sin(v * Math.PI)
    const middle = 0.018 * Math.exp(-Math.pow(z / 0.12, 2))
    const side = 0.017 * Math.exp(-Math.pow((Math.abs(z) - 0.52) / 0.09, 2))
    const y =
      base +
      0.046 * signedPower(Math.cos(angle), 0.6) +
      (Math.cos(angle) > 0
        ? (depression + middle + side) * (1 - smooth(0.94, 1, Math.abs(u)))
        : 0)
    return [front, y, z]
  }
  add('leather', makeLoft(rearBase, 'x', 32, 72))
  const rearBack = (v, angle) => {
    const u = signedPower(Math.sin(angle), 0.6)
    const width = profile(
      [
        [0, 0.589],
        [0.14, 0.608],
        [0.83, 0.597],
        [0.96, 0.574],
        [1, 0.547],
      ],
      v,
    )
    const z = width * u
    const depth = profile(
      [
        [0, 0.033],
        [0.12, 0.044],
        [0.86, 0.04],
        [1, 0.017],
      ],
      v,
    )
    let x = 1.139 + 0.031 * v + depth * signedPower(Math.cos(angle), 0.6)
    if (Math.cos(angle) < 0) x -= 0.018 * Math.exp(-Math.pow(z / 0.12, 2))
    return [x, 0.709 + v * 0.247, z]
  }
  add('leather', makeLoft(rearBack, 'y', 30, 72))
  for (const sign of [-1, 1]) {
    const backPanel = (u, t) => {
      const v = 0.07 + t * 0.83
      const z = sign * 0.321 + (u * 2 - 1) * 0.219
      const d = 0.044 - 0.003 * t
      const normalizedZ = z / 0.6
      const front =
        1.139 +
        0.031 * v -
        d *
          Math.pow(Math.max(0, 1 - Math.pow(Math.abs(normalizedZ), 3.333)), 0.3)
      return [
        front - 0.0018 - padCrown(t, [0, 0.34, 0.68, 1], 0.003),
        0.709 + v * 0.247,
        z,
      ]
    }
    add('leatherInset', makeGrid(backPanel, 42, 28, true))
    for (const t of [0.34, 0.68])
      tube(
        'seam',
        Array.from({ length: 15 }, (_, i) => backPanel(i / 14, t)),
        0.00065,
        16,
      )
    const basePanel = (u, t) => {
      const v = 0.04 + t * 0.87
      const z = sign * 0.321 + (u * 2 - 1) * 0.217
      // Resolve the top half directly so fractional powers never see negatives.
      const cross = Math.pow(
        Math.max(0, 1 - Math.pow(Math.abs(z / 0.605), 3.333)),
        0.3,
      )
      const depression =
        -0.014 *
        Math.exp(-Math.pow((Math.abs(z) - 0.32) / 0.16, 2)) *
        Math.sin(v * Math.PI)
      const middle = 0.018 * Math.exp(-Math.pow(z / 0.12, 2))
      const side = 0.017 * Math.exp(-Math.pow((Math.abs(z) - 0.52) / 0.09, 2))
      const y =
        0.671 +
        0.015 * Math.cos(v * Math.PI) +
        0.046 * cross +
        depression +
        middle +
        side
      return [
        0.796 + v * 0.401,
        y + 0.0017 + padCrown(t, [0, 0.4, 0.73, 1], 0.0027),
        z,
      ]
    }
    add('leatherInset', makeGrid(basePanel, 42, 28, true))
    for (const t of [0.4, 0.73])
      tube(
        'seam',
        Array.from({ length: 15 }, (_, i) => basePanel(i / 14, t)),
        0.00065,
        16,
      )
    // Bench buckle stalks sit against the raised middle section.
    hardBox('plastic', [1.071, 0.736, sign * 0.095], [0.051, 0.024, 0.031])
    hardBox('red', [1.064, 0.75, sign * 0.095], [0.032, 0.004, 0.02])
  }

  return parts
}
