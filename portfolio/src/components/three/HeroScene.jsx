import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const LIME = '#d5ff63'

function SceneFallback() {
  return (
    <div className="scene-fallback" aria-hidden="true" style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
      <div style={{ width: '58%', aspectRatio: '1', borderRadius: '50%', border: '1px solid #a9ce5d', boxShadow: 'inset -30px -25px 60px #000, inset 12px 10px 35px #526331, 0 0 70px #b2dc4520', background: 'repeating-radial-gradient(ellipse at 38% 32%, #9fbe5330 0 1px, transparent 2px 11px), #151b12' }} />
    </div>
  )
}

class SceneBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? <SceneFallback /> : this.props.children
  }
}

function Core({ reducedMotion }) {
  const core = useRef()
  const { lattice, bands } = useMemo(() => {
    const latticeParts = []
    const bandParts = []

    for (let index = 0; index < 23; index++) {
      const angle = ((index - 11) / 25) * Math.PI
      const radius = Math.cos(angle) * 1.14
      const y = Math.sin(angle) * 1.14
      latticeParts.push(new THREE.TorusGeometry(radius, 0.0032, 4, 96).rotateX(Math.PI / 2).translate(0, y, 0))
      bandParts.push(new THREE.TorusGeometry(radius + 0.002, 0.008, 5, 64, Math.PI * (index % 3 === 0 ? 1.45 : 0.74))
        .rotateX(Math.PI / 2).rotateY(index * 0.63).translate(0, y, 0))
    }

    for (let index = 0; index < 16; index++) {
      latticeParts.push(new THREE.TorusGeometry(1.142, 0.0025, 4, 96).rotateY((index / 16) * Math.PI))
    }

    // Each static surface takes one draw call instead of one per latitude.
    // The declarative bufferGeometry below owns the GPU resource lifecycle.
    const merge = (parts) => {
      const merged = mergeGeometries(parts)
      const data = { index: merged.index, attributes: merged.attributes }
      parts.forEach((geometry) => geometry.dispose())
      merged.dispose()
      return data
    }

    return { lattice: merge(latticeParts), bands: merge(bandParts) }
  }, [])

  useFrame((_, delta) => {
    if (!reducedMotion && core.current) core.current.rotation.y += Math.min(delta, 0.05) * 0.075
  })

  return (
    <group ref={core} rotation={[0.16, 0.3, -0.24]}>
      <mesh>
        <sphereGeometry args={[1.128, 64, 48]} />
        <meshStandardMaterial color="#151b12" metalness={0.68} roughness={0.36} />
      </mesh>

      {/* A real spherical lattice: the solid core naturally occludes its far side. */}
      <mesh>
        <bufferGeometry {...lattice} />
        <meshBasicMaterial color="#89a950" transparent opacity={0.5} />
      </mesh>
      <mesh>
        <bufferGeometry {...bands} />
        <meshBasicMaterial color={LIME} toneMapped={false} />
      </mesh>

      <mesh position={[0, 1.145, 0]}>
        <sphereGeometry args={[0.038, 12, 8]} />
        <meshBasicMaterial color={LIME} toneMapped={false} />
      </mesh>
      <mesh position={[0, -1.145, 0]}>
        <sphereGeometry args={[0.038, 12, 8]} />
        <meshBasicMaterial color={LIME} toneMapped={false} />
      </mesh>
    </group>
  )
}

function OrbitalRail({ radius, rotation, speed, phase, reducedMotion, lightMode }) {
  const satellite = useRef()

  useFrame(({ clock }) => {
    if (!satellite.current || reducedMotion) return
    const angle = clock.elapsedTime * speed + phase
    satellite.current.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
  })

  return (
    <group rotation={rotation}>
      <mesh>
        <torusGeometry args={[radius, 0.008, 6, 160]} />
        <meshBasicMaterial color={lightMode ? '#71805b' : '#6f7c54'} transparent opacity={0.65} />
      </mesh>
      <mesh rotation={[0, 0, phase]}>
        <torusGeometry args={[radius, 0.016, 6, 80, Math.PI * 0.34]} />
        <meshBasicMaterial color={LIME} toneMapped={false} />
      </mesh>
      <group ref={satellite} position={[Math.cos(phase) * radius, Math.sin(phase) * radius, 0]}>
        <mesh>
          <sphereGeometry args={[0.064, 20, 16]} />
          <meshStandardMaterial color="#e1ff9b" emissive={LIME} emissiveIntensity={0.65} metalness={0.4} roughness={0.25} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.105, 12, 8]} />
          <meshBasicMaterial color={LIME} transparent opacity={0.09} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}

function Dust({ lightMode }) {
  const points = useMemo(() => {
    const positions = new Float32Array(42 * 3)
    // Deterministic placement keeps the composition stable across rerenders.
    for (let i = 0; i < 42; i++) {
      const angle = i * 2.399963
      const radius = 2.05 + ((i * 17) % 11) / 12
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.8
      positions[i * 3 + 2] = ((i * 7) % 13) / 8 - 1.2
    }
    return positions
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={points} count={42} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color={lightMode ? '#5e7841' : '#b8d18b'} transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function Sculpture({ reducedMotion, lightMode }) {
  const sculpture = useRef()

  useFrame(({ pointer, clock }, delta) => {
    if (!sculpture.current || reducedMotion) return
    const ease = 1 - Math.exp(-Math.min(delta, 0.05) * 3)
    sculpture.current.rotation.y = THREE.MathUtils.lerp(sculpture.current.rotation.y, pointer.x * 0.16, ease)
    sculpture.current.rotation.x = THREE.MathUtils.lerp(sculpture.current.rotation.x, -pointer.y * 0.12, ease)
    sculpture.current.position.y = Math.sin(clock.elapsedTime * 0.55) * 0.065
  })

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[-3, 4, 4]} color="#efffd7" intensity={3.1} />
      <directionalLight position={[3, -1, -2]} color={LIME} intensity={2.5} />
      <pointLight position={[-2, -2, 2]} color="#b1cc75" intensity={3} distance={8} />
      <group ref={sculpture} rotation={[0, 0, -0.12]}>
        <Core reducedMotion={reducedMotion} />
        <OrbitalRail radius={1.78} rotation={[0.88, 0.35, -0.35]} speed={0.13} phase={0.45} reducedMotion={reducedMotion} lightMode={lightMode} />
        <OrbitalRail radius={2.04} rotation={[-0.5, 0.58, 0.8]} speed={-0.095} phase={3.8} reducedMotion={reducedMotion} lightMode={lightMode} />
        <OrbitalRail radius={1.57} rotation={[0.25, -1.05, 0.3]} speed={0.16} phase={2.2} reducedMotion={reducedMotion} lightMode={lightMode} />
        <Dust lightMode={lightMode} />
      </group>
    </>
  )
}

function ContextHealth({ onFailure }) {
  const renderer = useThree((state) => state.gl)

  useEffect(() => {
    const onContextLost = (event) => {
      event.preventDefault()
      onFailure(true)
    }
    renderer.domElement.addEventListener('webglcontextlost', onContextLost)
    return () => renderer.domElement.removeEventListener('webglcontextlost', onContextLost)
  }, [renderer, onFailure])

  return null
}

export default function HeroScene({ reducedMotion = false, theme = 'dark' }) {
  const container = useRef()
  const [visible, setVisible] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const [contextLost, setContextLost] = useState(false)
  const paused = reducedMotion || !visible || !pageVisible

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '80px' })
    if (container.current) observer.observe(container.current)
    const onVisibility = () => setPageVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', onVisibility)
    onVisibility()
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div ref={container} className="hero-scene" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
      <SceneBoundary>
        {contextLost ? <SceneFallback /> : <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6.3], fov: 46, near: 0.1, far: 30 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          frameloop={paused ? 'demand' : 'always'}
          fallback={<SceneFallback />}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <ContextHealth onFailure={setContextLost} />
            <Sculpture reducedMotion={paused} lightMode={theme === 'light'} />
          </Suspense>
        </Canvas>}
      </SceneBoundary>
    </div>
  )
}
