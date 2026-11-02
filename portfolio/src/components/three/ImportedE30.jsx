import { useEffect, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { E30_PAINT } from './e30Paint'

// Based on "[FREE] BMW M3 E30" by Martin Trafas, CC BY 4.0.
// The derived open-top mesh retains the artist's UVs, normals and PBR textures.
const BELT_HEIGHT = 0.878
const WINDSCREEN_REAR = 0.247

function clipPolygon(polygon, distance) {
  if (!polygon.length) return []
  const result = []
  for (let i = 0; i < polygon.length; i++) {
    const previous = polygon[(i + polygon.length - 1) % polygon.length]
    const current = polygon[i]
    const a = distance(previous.position)
    const b = distance(current.position)
    if (a >= 0 !== b >= 0) {
      const t = a / (a - b)
      const intersection = {}
      for (const name of Object.keys(previous)) {
        intersection[name] = previous[name].map(
          (value, channel) => value + (current[name][channel] - value) * t,
        )
      }
      result.push(intersection)
    }
    if (b >= 0) result.push(current)
  }
  return result
}

function clipBehindWindscreen(triangle) {
  const front = clipPolygon(triangle, (p) => p[2] - WINDSCREEN_REAR)
  const cabin = clipPolygon(
    clipPolygon(
      clipPolygon(triangle, (p) => WINDSCREEN_REAR - p[2]),
      (p) => p[2] + 1.42,
    ),
    (p) => BELT_HEIGHT - p[1],
  )
  // Preserve the original boot deck without keeping the coupe's C-pillars.
  const boot = clipPolygon(
    clipPolygon(triangle, (p) => -1.42 - p[2]),
    (p) => 0.91 - p[1],
  )
  return [front, cabin, boot]
}

function componentMap(geometry, positions) {
  const parent = positions.map((_, i) => i)
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])))
  const union = (a, b) => {
    parent[find(a)] = find(b)
  }
  const welded = new Map()
  for (let i = 0; i < positions.length; i++) {
    const key = positions[i].map((v) => Math.round(v * 10000)).join(',')
    if (welded.has(key)) union(i, welded.get(key))
    else welded.set(key, i)
  }
  const index = geometry.index
    ? Array.from(geometry.index.array)
    : positions.map((_, i) => i)
  for (let i = 0; i < index.length; i += 3) {
    union(index[i], index[i + 1])
    union(index[i], index[i + 2])
  }
  const boxes = new Map()
  positions.forEach((point, i) => {
    const root = find(i)
    if (!boxes.has(root)) boxes.set(root, new THREE.Box3())
    boxes.get(root).expandByPoint(new THREE.Vector3(...point))
  })
  return { index, find, boxes }
}

function bakeUnchangedGeometry(source, positions, normalMatrix) {
  const geometry = new THREE.BufferGeometry()
  const vector = new THREE.Vector3()
  for (const [name, attribute] of Object.entries(source.attributes)) {
    if (name === 'position') {
      geometry.setAttribute(
        name,
        new THREE.Float32BufferAttribute(positions.flat(), 3),
      )
    } else if (name === 'normal' || name === 'tangent') {
      const values = new Float32Array(attribute.count * attribute.itemSize)
      for (let i = 0; i < attribute.count; i++) {
        vector.fromBufferAttribute(attribute, i).applyNormalMatrix(normalMatrix)
        values[i * attribute.itemSize] = vector.x
        values[i * attribute.itemSize + 1] = vector.y
        values[i * attribute.itemSize + 2] = vector.z
        if (attribute.itemSize === 4) values[i * 4 + 3] = attribute.getW(i)
      }
      geometry.setAttribute(
        name,
        new THREE.Float32BufferAttribute(values, attribute.itemSize),
      )
    } else {
      geometry.setAttribute(name, attribute.clone())
    }
  }
  if (source.index) geometry.setIndex(source.index.clone())
  geometry.groups = source.groups.map((group) => ({ ...group }))
  geometry.computeBoundingBox()
  geometry.computeBoundingSphere()
  return geometry
}

function convertGeometry(mesh) {
  const source = mesh.geometry
  const positions = []
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld)
  const point = new THREE.Vector3()
  for (let i = 0; i < source.attributes.position.count; i++) {
    positions.push(
      point
        .fromBufferAttribute(source.attributes.position, i)
        .applyMatrix4(mesh.matrixWorld)
        .toArray(),
    )
  }
  const materialName = mesh.material.name
  const needsClipping = ['_WINDOWS', '_PAINT', '_PLASTIC', '_BLACKOUT'].some(
    (suffix) => materialName.endsWith(suffix),
  )
  // Wheels, brakes, emblems and lamps retain their original indexed geometry.
  // Only body components need topology analysis and polygon clipping.
  if (!needsClipping)
    return bakeUnchangedGeometry(source, positions, normalMatrix)
  const { index, find, boxes } = componentMap(source, positions)
  const attributes = Object.keys(source.attributes).filter((name) =>
    ['position', 'normal', 'uv', 'uv1', 'uv2', 'color'].includes(name),
  )
  const output = Object.fromEntries(attributes.map((name) => [name, []]))
  const vertex = (i) => {
    const result = { position: positions[i] }
    for (const name of attributes) {
      if (name === 'position') continue
      const attribute = source.attributes[name]
      if (name === 'normal') {
        result[name] = point
          .fromBufferAttribute(attribute, i)
          .applyNormalMatrix(normalMatrix)
          .toArray()
      } else {
        result[name] = Array.from(
          { length: attribute.itemSize },
          (_, channel) =>
            [attribute.getX, attribute.getY, attribute.getZ, attribute.getW][
              channel
            ].call(attribute, i),
        )
      }
    }
    return result
  }
  const emit = (polygon) => {
    for (let i = 1; i < polygon.length - 1; i++) {
      for (const v of [polygon[0], polygon[i], polygon[i + 1]]) {
        for (const name of attributes) {
          const value =
            name === 'normal'
              ? point.fromArray(v.normal).normalize().toArray()
              : v[name]
          output[name].push(...value)
        }
      }
    }
  }
  for (let i = 0; i < index.length; i += 3) {
    const box = boxes.get(find(index[i]))
    const triangle = [
      vertex(index[i]),
      vertex(index[i + 1]),
      vertex(index[i + 2]),
    ]
    if (materialName.endsWith('_WINDOWS')) {
      // A separate connected component: side and rear glass can be removed cleanly.
      if (box.min.z > 0.27 && box.min.x < -0.4 && box.max.x > 0.4)
        emit(triangle)
    } else if (materialName.endsWith('_PAINT')) {
      // The coupe's rear wing is also a separate component.
      if (box.min.y > 0.87 && box.max.z < -1.7) continue
      clipBehindWindscreen(triangle).forEach(emit)
    } else if (materialName.endsWith('_PLASTIC')) {
      const rearGlassTrim =
        box.min.y > 0.84 && box.max.z < -1 && box.max.y > 1.1
      const wingLip = box.min.y > 0.9 && box.max.z < -1.9
      const sideGlassTrim =
        box.min.y > 0.8 &&
        box.max.y > 1.2 &&
        (box.min.x > 0.49 || box.max.x < -0.49)
      if (rearGlassTrim || wingLip) continue
      if (sideGlassTrim) emit(clipPolygon(triangle, (p) => BELT_HEIGHT - p[1]))
      else emit(triangle)
    } else if (materialName.endsWith('_BLACKOUT')) {
      const cabinShell = box.max.y > 1.25 && box.min.z < -1 && box.max.z > 0.8
      const cabinParts =
        box.min.z > -1.8 && box.max.z < 0.75 && box.max.y > 0.65
      // A proper open cabin is supplied separately. The coupe's shell includes
      // a flat interior lid, which must be removed rather than shortened.
      if (!cabinShell && !cabinParts) emit(triangle)
    } else emit(triangle)
  }
  if (!output.position.length) return null
  const geometry = new THREE.BufferGeometry()
  for (const name of attributes) {
    geometry.setAttribute(
      name,
      new THREE.Float32BufferAttribute(
        output[name],
        source.attributes[name].itemSize,
      ),
    )
  }
  geometry.computeBoundingBox()
  geometry.computeBoundingSphere()
  return geometry
}

export function createConvertible(source, paint = E30_PAINT.color) {
  source.updateMatrixWorld(true)
  const result = new THREE.Group()
  const materials = new Map()
  source.traverse((object) => {
    if (!object.isMesh) return
    if (object.material.name === 'Logo_Plane') return
    const geometry = convertGeometry(object)
    if (!geometry) return
    if (!materials.has(object.material)) {
      const material = object.material.clone()
      if (material.name.endsWith('_PAINT')) {
        material.color.set(paint)
        material.roughnessMap = null
        material.metalnessMap = null
        material.metalness = E30_PAINT.metalness
        material.roughness = E30_PAINT.roughness
        material.clearcoat = E30_PAINT.clearcoat
        material.clearcoatRoughness = E30_PAINT.clearcoatRoughness
      } else if (material.name.endsWith('_BLACKOUT')) {
        material.color.set('#171819')
        material.roughness = 0.62
        material.metalness = 0
      } else if (material.name.endsWith('_WINDOWS')) {
        material.color.set('#c0d9df')
        material.opacity = 0.22
        material.transparent = true
        material.depthWrite = false
        material.roughness = 0.08
      }
      materials.set(object.material, material)
    }
    const mesh = new THREE.Mesh(geometry, materials.get(object.material))
    mesh.name = object.material.name
    mesh.castShadow = true
    mesh.receiveShadow = true
    result.add(mesh)
  })
  const paintMaterial = [...materials.values()].find((material) =>
    material.name.endsWith('_PAINT'),
  )
  if (paintMaterial) {
    const tonneau = new THREE.Mesh(
      new RoundedBoxGeometry(1.32, 0.035, 0.56, 3, 0.012),
      paintMaterial,
    )
    tonneau.position.set(0, 0.895, -1.48)
    tonneau.name = 'E30_CONVERTIBLE_TONNEAU'
    tonneau.castShadow = true
    tonneau.receiveShadow = true
    result.add(tonneau)
  }
  // Author mesh is front +Z. Present the car front -X, centred, resting on Y=0.
  const oriented = new THREE.Group()
  result.position.set(0, 0.000914, 0.058875)
  oriented.add(result)
  oriented.rotation.y = -Math.PI / 2
  return oriented
}

export default function ImportedE30({ paint = E30_PAINT.color, ...props }) {
  const gltf = useLoader(GLTFLoader, '/models/bmw-e30.glb', (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder)
  })
  const model = useMemo(
    () => createConvertible(gltf.scene, paint),
    [gltf, paint],
  )
  useEffect(
    () => () => {
      const materials = new Set()
      model.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose()
          materials.add(object.material)
        }
      })
      materials.forEach((material) => material.dispose())
    },
    [model],
  )
  return (
    <group {...props}>
      <primitive object={model} />
    </group>
  )
}
