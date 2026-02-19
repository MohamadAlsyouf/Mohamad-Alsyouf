import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function Stars({ count = 80 }) {
  const meshRef = useRef()

  const stars = useMemo(() => {
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2
    }

    return positions
  }, [count])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={stars}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffffff"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  )
}

function SpeedStars({ count = 50, isHovering }) {
  const meshRef = useRef()

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
    }

    return positions
  }, [count])

  useFrame(() => {
    if (meshRef.current && isHovering) {
      const positions = meshRef.current.geometry.attributes.position.array

      for (let i = 0; i < count; i++) {
        // Move stars downward slowly
        positions[i * 3 + 1] -= 0.04

        // Reset stars that go below the view
        if (positions[i * 3 + 1] < -6) {
          positions[i * 3] = (Math.random() - 0.5) * 8
          positions[i * 3 + 1] = 6 + Math.random() * 2
          positions[i * 3 + 2] = (Math.random() - 0.5) * 4
        }
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
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isHovering ? 0.05 : 0.02}
        color="#ffffff"
        transparent
        opacity={isHovering ? 0.8 : 0}
        sizeAttenuation
      />
    </points>
  )
}

function Rocket({ isHovering, isMoving }) {
  const groupRef = useRef()
  const targetPos = useRef(new THREE.Vector3(0, 0, 0))
  const targetRotation = useRef({ x: 0, z: 0 })
  const flameRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      const { mouse } = state

      // Update target position - center when not hovering
      if (isHovering) {
        targetPos.current.x = mouse.x * 2.5
        targetPos.current.y = mouse.y * 2
      } else {
        targetPos.current.x = 0
        targetPos.current.y = 0
      }

      // Lerp position for smooth following
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetPos.current.x,
        0.08
      )
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetPos.current.y,
        0.08
      )

      // Calculate velocity for tilt
      const velocityX = targetPos.current.x - groupRef.current.position.x
      const velocityY = targetPos.current.y - groupRef.current.position.y

      // Tilt rocket based on movement direction
      targetRotation.current.z = -velocityX * 0.8
      targetRotation.current.x = velocityY * 0.5

      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetRotation.current.z,
        0.1
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        0.1
      )

      // Animate flame - bigger when moving
      if (flameRef.current) {
        const baseScale = isMoving ? 1.2 : 0.8
        flameRef.current.scale.y = baseScale + Math.sin(state.clock.elapsedTime * 20) * 0.2
        flameRef.current.scale.x = isMoving ? 1.1 : 1
        flameRef.current.scale.z = isMoving ? 1.1 : 1
      }
    }
  })

  const bodyColor = "#e8e8e8"
  const accentColor = "#6366f1"
  const windowColor = "#61dafb"

  return (
    <group ref={groupRef} scale={0.5} rotation={[0, 0, 0]}>
      {/* Rocket body - main cylinder */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 2, 16]} />
        <meshStandardMaterial color={bodyColor} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Nose cone */}
      <mesh position={[0, 1.4, 0]}>
        <coneGeometry args={[0.4, 0.8, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Window */}
      <mesh position={[0, 0.3, 0.42]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial
          color={windowColor}
          emissive={windowColor}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Window rim */}
      <mesh position={[0, 0.3, 0.41]}>
        <ringGeometry args={[0.2, 0.26, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Accent stripe */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.15, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Fins */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(angle) * 0.5,
            -0.8,
            Math.cos(angle) * 0.5,
          ]}
          rotation={[0, -angle, 0]}
        >
          <boxGeometry args={[0.02, 0.6, 0.4]} />
          <meshStandardMaterial color={accentColor} metalness={0.4} roughness={0.3} />
        </mesh>
      ))}

      {/* Engine base */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.35, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Flame */}
      <group ref={flameRef} position={[0, -1.5, 0]}>
        <mesh>
          <coneGeometry args={[0.25, 0.8, 16]} />
          <meshStandardMaterial
            color="#ff6b35"
            emissive="#ff4500"
            emissiveIntensity={isMoving ? 1 : 0.6}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[0, -0.2, 0]} scale={0.6}>
          <coneGeometry args={[0.2, 0.5, 16]} />
          <meshStandardMaterial
            color="#ffdd00"
            emissive="#ffaa00"
            emissiveIntensity={isMoving ? 1.2 : 0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </group>
  )
}

function Scene() {
  const [isHovering, setIsHovering] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const moveTimeout = useRef(null)
  const { gl } = useThree()

  useEffect(() => {
    const canvas = gl.domElement

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => {
      setIsHovering(false)
      setIsMoving(false)
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      const dx = Math.abs(x - lastMousePos.current.x)
      const dy = Math.abs(y - lastMousePos.current.y)

      if (dx > 0.01 || dy > 0.01) {
        setIsMoving(true)
        lastMousePos.current = { x, y }

        // Clear existing timeout
        if (moveTimeout.current) {
          clearTimeout(moveTimeout.current)
        }

        // Set moving to false after mouse stops
        moveTimeout.current = setTimeout(() => {
          setIsMoving(false)
        }, 150)
      }
    }

    canvas.addEventListener('mouseenter', handleMouseEnter)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('mousemove', handleMouseMove)

    return () => {
      canvas.removeEventListener('mouseenter', handleMouseEnter)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('mousemove', handleMouseMove)
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current)
      }
    }
  }, [gl])

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#6366f1" />
      <Stars count={100} />
      <SpeedStars count={50} isHovering={isHovering} />
      <Rocket isHovering={isHovering} isMoving={isMoving} />
    </>
  )
}

export default function AboutScene() {
  return <Scene />
}
