import { useEffect, useMemo } from 'react'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { E30_PAINT } from './e30Paint'
import { createSeats } from './e30/seatGeometry'
import { createCockpit } from './e30/cockpitGeometry'
import {
  createInteriorMaterials,
  createInteriorTextures,
} from './e30/interiorMaterials'

// Reference-led 1989 E30 cabin: continuous upholstered sport seats, a low
// driver-oriented dashboard, and a two-place rear bench without headrests.
function buildInterior() {
  const groups = new Map()
  for (const { material, geometry } of [...createSeats(), ...createCockpit()]) {
    const mesh = geometry.index ? geometry.toNonIndexed() : geometry
    if (mesh !== geometry) geometry.dispose()
    if (!groups.has(material)) groups.set(material, [])
    groups.get(material).push(mesh)
  }
  return [...groups].map(([material, parts]) => {
    const geometry = mergeGeometries(parts)
    parts.forEach((part) => part.dispose())
    if (!geometry)
      throw new Error(`Cannot merge E30 interior material: ${material}`)
    return { material, geometry }
  })
}

export default function E30Interior({ paint = E30_PAINT.color, ...props }) {
  const batches = useMemo(buildInterior, [])
  const textures = useMemo(createInteriorTextures, [])
  const materials = useMemo(
    () => createInteriorMaterials(textures, paint),
    [textures, paint],
  )
  useEffect(
    () => () => {
      Object.values(materials).forEach((material) => material.dispose())
    },
    [materials],
  )
  useEffect(
    () => () => {
      Object.values(textures).forEach((texture) => texture.dispose())
    },
    [textures],
  )
  return (
    <group name="E30-OEM-style-black-leather-cabin" {...props}>
      {batches.map(({ material, geometry }) => (
        <mesh
          key={material}
          name={`cabin-${material}`}
          geometry={geometry}
          material={materials[material]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  )
}
