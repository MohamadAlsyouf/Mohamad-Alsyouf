import { Component, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { personalInfo, metrics } from '../../data/content'
import Icon from '../ui/Icon'
import E30Fallback from '../three/E30Fallback'
const HeroScene = lazy(() => import('../three/HeroScene'))
function CoreFallback() {
  return <E30Fallback />
}
class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <CoreFallback /> : this.props.children
  }
}
export default function Hero() {
  const { theme, reducedMotion } = useTheme()
  const entrance = {
    initial: reducedMotion ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
  }
  return (
    <section id="hero" className="hero page-width">
      <div className="hero-topline">
        <span className="mono">
          <span className="tiny-cross">✳</span> SOFTWARE ENGINEER & CREATIVE
          PROBLEM SOLVER
        </span>
        <a className="availability" href="#contact">
          <span className="status-dot" />
          Open to the right opportunity
          <Icon size={12} />
        </a>
      </div>
      <div className="hero-main">
        <div className="hero-copy">
          <motion.p
            {...entrance}
            transition={{ duration: 0.65 }}
            className="hero-intro"
          >
            Hey, I’m Mohamad Alsyouf <span className="wave">↗</span>
          </motion.p>
          <motion.h1 {...entrance} transition={{ duration: 0.8, delay: 0.08 }}>
            Big ideas.
            <br />
            Real systems.
            <br />
            <span className="hero-accent">
              Lasting impact<span className="heading-period">.</span>
            </span>
          </motion.h1>
          <motion.p
            {...entrance}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="hero-description"
          >
            Senior full-stack engineer. AI-native builder.
            <br className="desktop-break" /> I connect people, product, and code
            to turn complex problems into things that work beautifully.
          </motion.p>
          <motion.div
            {...entrance}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="hero-actions"
          >
            <a className="button button-primary" href="#work">
              Explore my work <Icon name="down" size={18} />
            </a>
            <a className="text-link" href={personalInfo.resume} download>
              Grab my résumé <Icon name="download" size={17} />
            </a>
          </motion.div>
          <motion.div
            {...entrance}
            transition={{ duration: 0.8, delay: 0.32 }}
            className="hero-location"
          >
            <Icon name="globe" size={14} />
            <span>Based in Southern California. Building beyond it.</span>
          </motion.div>
        </div>
        <motion.div
          className="hero-art hero-car-art"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: reducedMotion ? 0 : 1.2,
            delay: reducedMotion ? 0 : 0.12,
          }}
        >
          <div className="art-grid" />
          <div className="art-cross cross-top">+</div>
          <div className="art-cross cross-bottom">+</div>
          <div className="art-label art-label-top">
            <span className="status-dot" />
            OFF THE CLOCK<span>1989 / E30</span>
          </div>
          <div className="car-scene" aria-hidden="true">
            <SceneBoundary>
              <Suspense fallback={<CoreFallback />}>
                <HeroScene theme={theme} reducedMotion={reducedMotion} />
              </Suspense>
            </SceneBoundary>
          </div>
          <div className="orbit-tag tag-one">
            <span className="tag-bracket">[</span>timeless by design
            <span className="tag-bracket">]</span>
          </div>
          <div className="orbit-tag tag-two">
            <span className="mini-spark">✦</span> made to move
          </div>
          <div className="art-label art-label-bottom">
            <span>BMW E30 CONVERTIBLE / TOP DOWN</span>
            <span className="coordinate">A LOVE FOR THE DETAILS</span>
          </div>
          <p className="model-credit">
            E30 model by{' '}
            <a
              href="https://sketchfab.com/3d-models/free-bmw-m3-e30-ac3c7013434e403e8faff87948caf422"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Trafas
            </a>
            {' · '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY 4.0
            </a>
            {' · adapted'}
          </p>
        </motion.div>
      </div>
      <div className="hero-bottom">
        <span className="mono">LESS FRICTION. MORE FORWARD.</span>
        <a href="#work" className="scroll-cue">
          A LITTLE SCROLL GOES A LONG WAY
          <Icon name="down" size={15} />
        </a>
      </div>
      <div className="metrics" aria-label="Selected career impact">
        {metrics.map((metric, index) => (
          <div className="metric" key={metric.label}>
            <span className="metric-number mono">0{index + 1} /</span>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
