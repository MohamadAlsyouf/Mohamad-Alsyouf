import { motion } from 'framer-motion'
import CanvasWrapper from '../three/CanvasWrapper'
import HeroScene from '../three/HeroScene'
import ContactScene from '../three/ContactScene'
import { personalInfo } from '../../data/content'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-[#0d0d14]" />

      {/* Stars background */}
      <div className="absolute inset-0 opacity-50">
        <CanvasWrapper className="w-full h-full">
          <ContactScene />
        </CanvasWrapper>
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <motion.p
              className="text-accent font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Hello, I'm
            </motion.p>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {personalInfo.name}
            </motion.h1>

            <motion.h2
              className="text-2xl md:text-3xl text-muted font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {personalInfo.title}
            </motion.h2>

            <motion.p
              className="text-lg text-muted max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {personalInfo.tagline}
            </motion.p>

            <motion.div
              className="flex gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a
                href="#projects"
                className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="px-6 py-3 border border-[#2a2a35] text-foreground rounded-lg font-medium hover:border-accent/50 transition-colors"
              >
                Get in Touch
              </a>
            </motion.div>
          </div>

          {/* 3D BMW E30 Model */}
          <motion.div
            className="hidden lg:block h-[500px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <CanvasWrapper className="w-full h-full">
              <HeroScene />
            </CanvasWrapper>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-muted"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
