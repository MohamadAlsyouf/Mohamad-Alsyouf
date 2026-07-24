import { motion } from 'framer-motion'
import CanvasWrapper from '../three/CanvasWrapper'
import HeroScene from '../three/HeroScene'
import ContactScene from '../three/ContactScene'
import { useTheme } from '../../context/ThemeContext'
import { personalInfo } from '../../data/content'

export default function Hero() {
  const { isLightMode } = useTheme()

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background-secondary" />

      {/* Stars background */}
      <div className={`absolute inset-0 ${isLightMode ? 'opacity-70' : 'opacity-50'}`}>
        <CanvasWrapper className="w-full h-full">
          <ContactScene primaryCount={180} accentCount={240} />
        </CanvasWrapper>
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <motion.p
              className="text-accent text-lg sm:text-2xl font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Hello, I'm
            </motion.p>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {personalInfo.name}
            </motion.h1>

            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl text-muted font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {personalInfo.title}
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg text-muted max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {personalInfo.tagline}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 sm:gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a
                href="#projects"
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors text-sm sm:text-base"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="rounded-lg border border-border bg-background-surface/40 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-background-surface/70 sm:px-6 sm:py-3 sm:text-base"
              >
                Get in Touch
              </a>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View my GitHub profile"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background-surface/40 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-background-surface/70 sm:px-6 sm:py-3 sm:text-base"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub</span>
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
