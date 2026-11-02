import assert from 'node:assert/strict'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { createSeats } from '../src/components/three/e30/seatGeometry.js'
import { createCockpit } from '../src/components/three/e30/cockpitGeometry.js'

// Check the actual buffers sent to WebGL. A closed surface can look hollow
// when added cap vertices have no corresponding normals, even with no NaNs.
const parts = [...createSeats(), ...createCockpit()]
const groups = new Map()
const bounds = new THREE.Box3()
let triangles = 0

for (const { material, geometry } of parts) {
  const { position, normal, uv } = geometry.attributes
  assert.ok(
    position && normal && uv,
    `${material}: missing a required attribute`,
  )
  assert.equal(
    normal.count,
    position.count,
    `${material}: vertices without normals`,
  )
  assert.equal(uv.count, position.count, `${material}: vertices without UVs`)
  for (const [name, attribute] of Object.entries(geometry.attributes)) {
    assert.ok(
      Array.from(attribute.array).every(Number.isFinite),
      `${material}: invalid ${name}`,
    )
  }
  if (geometry.index) {
    assert.ok(
      Array.from(geometry.index.array).every(
        (index) => index >= 0 && index < position.count,
      ),
      `${material}: index outside the vertex buffers`,
    )
  }
  geometry.computeBoundingBox()
  bounds.union(geometry.boundingBox)
  triangles += (geometry.index?.count ?? position.count) / 3
  const expanded = geometry.index ? geometry.toNonIndexed() : geometry
  if (expanded !== geometry) geometry.dispose()
  if (!groups.has(material)) groups.set(material, [])
  groups.get(material).push(expanded)
}

// The cabin must stay inside the body and below the windshield header.
assert.ok(
  bounds.min.y >= 0.4 && bounds.max.y <= 1.32,
  'Cabin exceeds the vertical body envelope',
)
assert.ok(
  bounds.min.z >= -0.7 && bounds.max.z <= 0.7,
  'Cabin extends through the doors',
)
for (const [material, geometries] of groups) {
  const merged = mergeGeometries(geometries)
  assert.ok(merged, `${material}: cannot merge the rendering buffers`)
  assert.equal(
    merged.attributes.normal.count,
    merged.attributes.position.count,
    `${material}: merged normals are incomplete`,
  )
  geometries.forEach((geometry) => geometry.dispose())
  merged.dispose()
}
console.log(
  `PASS: ${parts.length} interior parts, ${groups.size} material batches, ${triangles.toLocaleString()} triangles; complete finite buffers and valid cabin bounds.`,
)
