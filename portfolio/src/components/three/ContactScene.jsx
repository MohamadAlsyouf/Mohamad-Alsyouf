import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 50, color = "#ffffff", size = 0.05, opacity = 0.6 }) {
  const meshRef = useRef()

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = []

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6

      velocities.push({
        x: (Math.random() - 0.5) * 0.004,
        y: (Math.random() - 0.5) * 0.004,
        z: (Math.random() - 0.5) * 0.002,
      })
    }

    return { positions, velocities }
  }, [count])

  useFrame(() => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array

      for (let i = 0; i < count; i++) {
        positions[i * 3] += particles.velocities[i].x
        positions[i * 3 + 1] += particles.velocities[i].y
        positions[i * 3 + 2] += particles.velocities[i].z

        // Wrap around bounds
        if (Math.abs(positions[i * 3]) > 6) particles.velocities[i].x *= -1
        if (Math.abs(positions[i * 3 + 1]) > 6) particles.velocities[i].y *= -1
        if (Math.abs(positions[i * 3 + 2]) > 3) particles.velocities[i].z *= -1
      }

      meshRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
      />
    </points>
  )
}

export default function ContactScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      {/* White stars */}
      <Particles count={80} color="#ffffff" size={0.04} opacity={0.7} />
      {/* Accent colored stars */}
      <Particles count={100} color="#6366f1" size={0.06} opacity={0.6} />
    </>
  )
}
