import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import E30Body from './ImportedE30'
import E30Interior from './E30Interior'
import E30Fallback from './E30Fallback'

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <E30Fallback /> : this.props.children
  }
}

function StudioEnvironment({ lightMode }) {
  const { gl, scene } = useThree()
  useEffect(() => {
    const room = new RoomEnvironment()
    const generator = new THREE.PMREMGenerator(gl)
    const environment = generator.fromScene(room, 0.2)
    const previous = scene.environment
    scene.environment = environment.texture
    return () => {
      scene.environment = previous
      environment.dispose()
      generator.dispose()
      room.dispose()
    }
  }, [gl, scene])
  return (
    <>
      <ambientLight intensity={lightMode ? 0.55 : 0.3} />
      <hemisphereLight args={['#eee8fb', '#201a2b', 0.9]} />
      <directionalLight
        position={[-4, 7, 5]}
        intensity={lightMode ? 2.4 : 2.1}
        color="#fff9e9"
      />
      <directionalLight position={[3, 4, -5]} intensity={1.5} color="#e5efff" />
      <directionalLight position={[4, 1, 4]} intensity={0.55} color="#c9c0ff" />
    </>
  )
}

function Framing() {
  const { camera, size, invalidate } = useThree()
  useEffect(() => {
    // Keep a full turn of the car in frame on both tall phones and wide displays.
    const target = new THREE.Vector3(0, 0.59, 0)
    const distance = camera.position.distanceTo(target)
    const aspect = size.width / size.height
    const visibleWidth = Math.max(5.25, 3.75 * aspect)
    camera.fov = THREE.MathUtils.radToDeg(
      2 * Math.atan(visibleWidth / aspect / (2 * distance)),
    )
    camera.lookAt(target)
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, size.width, size.height, invalidate])
  return null
}

function Ground({ lightMode }) {
  const texture = useMemo(() => {
    const surface = document.createElement('canvas')
    surface.width = surface.height = 128
    const context = surface.getContext('2d')
    const gradient = context.createRadialGradient(64, 64, 5, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(0,0,0,.65)')
    gradient.addColorStop(0.45, 'rgba(0,0,0,.32)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(surface)
  }, [])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <group>
      <mesh
        position={[0, -0.016, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[5.65, 3.3, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={lightMode ? 0.5 : 0.85}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, -0.023, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.54, 2.548, 128]} />
        <meshBasicMaterial
          color={lightMode ? '#8665c7' : '#9171e2'}
          transparent
          opacity={0.24}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function Turntable({ paused }) {
  const car = useRef()
  useFrame((_, delta) => {
    if (car.current && !paused)
      car.current.rotation.y += Math.min(delta, 0.05) * 0.16
  })
  return (
    <group ref={car} rotation={[0, -0.22, 0]}>
      <E30Body />
      <E30Interior />
    </group>
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
    return () =>
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost)
  }, [renderer, onFailure])
  return null
}

function SceneReady({ onReady }) {
  useEffect(() => {
    onReady(true)
  }, [onReady])
  return null
}

export default function HeroScene({ reducedMotion = false, theme = 'dark' }) {
  const container = useRef()
  const [visible, setVisible] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const [contextLost, setContextLost] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const paused = reducedMotion || !visible || !pageVisible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '80px' },
    )
    if (container.current) observer.observe(container.current)
    const onVisibility = () =>
      setPageVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', onVisibility)
    onVisibility()
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])
  return (
    <div
      ref={container}
      className="hero-scene e30-scene"
      data-model-ready={modelReady && !contextLost ? 'true' : 'false'}
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    >
      <SceneBoundary>
        {contextLost ? (
          <E30Fallback />
        ) : (
          <Canvas
            dpr={[1, 1.5]}
            camera={{
              position: [-5.4, 3.25, 5.4],
              fov: 32,
              near: 0.1,
              far: 40,
            }}
            gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
            frameloop={paused ? 'demand' : 'always'}
            fallback={<E30Fallback />}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping
              gl.toneMappingExposure = 1.15
            }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <ContextHealth onFailure={setContextLost} />
              <Framing />
              <StudioEnvironment lightMode={theme === 'light'} />
              <Ground lightMode={theme === 'light'} />
              <Turntable paused={paused} />
              <SceneReady onReady={setModelReady} />
            </Suspense>
          </Canvas>
        )}
      </SceneBoundary>
    </div>
  )
}
