import { motion } from 'framer-motion'
import CanvasWrapper from '../three/CanvasWrapper'
import AboutScene from '../three/AboutScene'
import { aboutText } from '../../data/content'

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          {/* 3D Scene */}
          <div className="hidden lg:block relative min-h-[500px] w-[640px] order-2 lg:order-1 self-stretch">
            <CanvasWrapper className="w-full h-full">
              <AboutScene />
            </CanvasWrapper>
          </div>

          {/* Text content */}
          <div className="space-y-6 order-1 lg:order-2">
            <motion.span
              className="text-accent font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              About Me
            </motion.span>

            <motion.h2
              className="text-3xl md:text-4xl font-bold text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Crafting digital experiences with code
            </motion.h2>

            <motion.p
              className="text-muted leading-relaxed text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {aboutText}
            </motion.p>

            <motion.div
              className="flex items-center gap-6 pt-4 text-nowrap"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div>
                <div className="text-3xl font-bold text-foreground">3+</div>
                <div className="text-sm text-muted">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">1M+</div>
                <div className="text-sm text-muted">Monthly Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">100+</div>
                <div className="text-sm text-muted">Employees Supported</div>
              </div>
              <a
                href="src/assets/Mohamad-Alsyouf-Resume.pdf"
                download
                className="px-5 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors ml-2"
              >
                Download Resume
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
