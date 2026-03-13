import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../../context/ThemeContext'

function BMWLogo({ scale = 1 }) {
  const bmwBlue = "#0066b1"
  const bmwWhite = "#ffffff"
  const bmwBlack = "#1a1a1a"

  return (
    <group scale={scale}>
      {/* Front face */}
      <group>
        {/* Outer silver ring */}
        <mesh>
          <ringGeometry args={[1, 1.15, 64]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} side={THREE.FrontSide} />
        </mesh>
        {/* Outer black ring */}
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[0.85, 1, 64]} />
          <meshStandardMaterial color={bmwBlack} side={THREE.FrontSide} />
        </mesh>
        {/* Inner circle base (white) */}
        <mesh position={[0, 0, 0.02]}>
          <circleGeometry args={[0.85, 64]} />
          <meshStandardMaterial color={bmwWhite} side={THREE.FrontSide} />
        </mesh>
        {/* Blue quadrant - top left */}
        <mesh position={[0, 0, 0.03]}>
          <circleGeometry args={[0.84, 64, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color={bmwBlue} side={THREE.FrontSide} />
        </mesh>
        {/* Blue quadrant - bottom right */}
        <mesh position={[0, 0, 0.03]}>
          <circleGeometry args={[0.84, 64, -Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color={bmwBlue} side={THREE.FrontSide} />
        </mesh>
      </group>

      {/* Back face - rotated 180° on Y axis */}
      <group rotation={[0, Math.PI, 0]}>
        {/* Outer silver ring */}
        <mesh>
          <ringGeometry args={[1, 1.15, 64]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} side={THREE.FrontSide} />
        </mesh>
        {/* Outer black ring */}
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[0.85, 1, 64]} />
          <meshStandardMaterial color={bmwBlack} side={THREE.FrontSide} />
        </mesh>
        {/* Inner circle base (white) */}
        <mesh position={[0, 0, 0.02]}>
          <circleGeometry args={[0.85, 64]} />
          <meshStandardMaterial color={bmwWhite} side={THREE.FrontSide} />
        </mesh>
        {/* Blue quadrant - top left */}
        <mesh position={[0, 0, 0.03]}>
          <circleGeometry args={[0.84, 64, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color={bmwBlue} side={THREE.FrontSide} />
        </mesh>
        {/* Blue quadrant - bottom right */}
        <mesh position={[0, 0, 0.03]}>
          <circleGeometry args={[0.84, 64, -Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color={bmwBlue} side={THREE.FrontSide} />
        </mesh>
      </group>
    </group>
  )
}

function EllipticalOrbit({ color, rotationZ = 0 }) {
  // Create an elliptical torus shape
  const geometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(
      0, 0,           // center
      1.8, 0.6,         // xRadius, yRadius (ellipse)
      0, 2 * Math.PI, // start/end angle
      false,          // clockwise
      0               // rotation
    )
    const points = curve.getPoints(100)
    const shape = new THREE.BufferGeometry().setFromPoints(points)

    // Create a tube along the ellipse path
    const path = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(p.x, p.y, 0)),
      true // closed
    )
    return new THREE.TubeGeometry(path, 100, 0.04, 8, true)
  }, [])

  return (
    <group rotation={[0, 0, rotationZ]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  )
}

function ReactLogo({ color }) {
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.003
    }
  })

  return (
    <group ref={groupRef}>
      {/* Three elliptical orbits at 60° intervals */}
      <EllipticalOrbit color={color} rotationZ={0} />
      <EllipticalOrbit color={color} rotationZ={Math.PI / 3} />
      <EllipticalOrbit color={color} rotationZ={(2 * Math.PI) / 3} />
    </group>
  )
}

function ReactBMWLogo({ orbitColor }) {
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
      <group ref={groupRef} scale={1} rotation={[0.3, 0, 0]}>
        {/* BMW Logo as nucleus in the center */}
        <group scale={0.28}>
          <BMWLogo />
        </group>

        {/* React orbits around it */}
        <ReactLogo color={orbitColor} />
      </group>
    </Float>
  )
}

export default function HeroScene() {
  const { themePalette } = useTheme()
  const heroPalette = themePalette.canvas.hero

  return (
    <>
      <ambientLight intensity={heroPalette.ambientIntensity} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={heroPalette.directionalIntensity}
        color={heroPalette.directionalColor}
      />
      <pointLight
        position={[-5, 3, -5]}
        intensity={heroPalette.primaryLightIntensity}
        color={heroPalette.primaryLightColor}
      />
      <pointLight
        position={[5, -2, 5]}
        intensity={heroPalette.secondaryLightIntensity}
        color={heroPalette.secondaryLightColor}
      />
      <ReactBMWLogo orbitColor={heroPalette.orbitColor} />
    </>
  )
}
