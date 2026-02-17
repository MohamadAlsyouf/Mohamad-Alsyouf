import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function FollowMouse() {
  const meshRef = useRef()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const targetPos = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state) => {
    if (meshRef.current) {
      // Get normalized mouse position from state
      const { mouse } = state

      // Update target position based on mouse
      targetPos.current.x = mouse.x * 1.5
      targetPos.current.y = mouse.y * 1.5

      // Lerp towards target for smooth following
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        targetPos.current.x,
        0.05
      )
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetPos.current.y,
        0.05
      )

      // Subtle rotation based on movement
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.y += 0.008
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={0.8}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#6366f1"
          roughness={0.5}
          metalness={0.2}
          distort={0.3}
          speed={3}
          wireframe={false}
        />
      </mesh>
    </Float>
  )
}

export default function AboutScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#6366f1" />
      <FollowMouse />
    </>
  )
}
