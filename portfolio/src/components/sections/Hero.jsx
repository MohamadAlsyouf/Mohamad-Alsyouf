import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { personalInfo, metrics } from '../../data/content'
import Icon from '../ui/Icon'
import InterestShowcase from '../ui/InterestShowcase'
export default function Hero() {
  const { reducedMotion } = useTheme()
  const entrance = {
    initial: reducedMotion ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
  }
  return (
    <section id="hero" className="hero page-width">
      <div className="hero-topline">
        <span className="mono">
          <span className="tiny-cross">✳</span> FULL STACK SOFTWARE ENGINEER
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
            {personalInfo.name}
          </motion.p>
          <motion.h1 {...entrance} transition={{ duration: 0.8, delay: 0.08 }}>
            Full stack
            <br />
            software
            <br />
            <span className="hero-accent">
              engineer<span className="heading-period">.</span>
            </span>
          </motion.h1>
          <motion.p
            {...entrance}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="hero-description"
          >
            I build enterprise systems, customer-facing web applications, and
            mobile apps with React, TypeScript, Node.js, and AWS.
          </motion.p>
          <motion.div
            {...entrance}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="hero-actions"
          >
            <a className="button button-primary" href="#work">
              View projects <Icon name="down" size={18} />
            </a>
            <a className="text-link" href={personalInfo.resume} download>
              Download résumé <Icon name="download" size={17} />
            </a>
          </motion.div>
          <motion.div
            {...entrance}
            transition={{ duration: 0.8, delay: 0.32 }}
            className="hero-location"
          >
            <Icon name="globe" size={14} />
            <span>{personalInfo.location}</span>
          </motion.div>
        </div>
        <InterestShowcase />
      </div>
      <div className="hero-bottom">
        <span className="mono">SELECTED EXPERIENCE & RESULTS</span>
        <a href="#about" className="scroll-cue">
          ABOUT & EXPERIENCE
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
