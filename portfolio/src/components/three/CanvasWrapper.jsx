import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function CanvasWrapper({ children, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <Suspense fallback={<Loader />}>
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, 5], fov: 45 }}
        >
          {children}
        </Canvas>
      </Suspense>
    </div>
  )
}
