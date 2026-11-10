import { useEffect, useRef, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { interests } from '../../data/interests'
import useSceneActivity from '../../hooks/useSceneActivity'
import Icon from './Icon'

export default function InterestShowcase() {
  const scene = useRef(null)
  const { reducedMotion } = useTheme()
  const [active, setActive] = useState(null)
  const rotateX = useSpring(0, { stiffness: 90, damping: 24 })
  const rotateY = useSpring(0, { stiffness: 90, damping: 24 })
  useSceneActivity(scene)

  useEffect(() => {
    if (reducedMotion) {
      rotateX.jump(0)
      rotateY.jump(0)
    }
  }, [reducedMotion, rotateX, rotateY])

  function move(event) {
    if (reducedMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    rotateX.set((0.5 - (event.clientY - bounds.top) / bounds.height) * 7)
    rotateY.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 7)
  }

  function reset() {
    rotateX.set(0)
    rotateY.set(0)
    setActive(null)
  }

  return (
    <motion.div
      className="interest-showcase"
      ref={scene}
      data-active="false"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 1.1 }}
    >
      <div className="showcase-topline mono">
        <span>
          <span className="status-dot" /> BEYOND THE CODE
        </span>
        <span>{String(interests.length).padStart(2, '0')} / EXPLORATIONS</span>
      </div>
      <div
        className="interest-stage"
        onPointerMove={move}
        onPointerLeave={reset}
      >
        <div className="showcase-grid" aria-hidden="true" />
        <div className="showcase-orbit orbit-outer" aria-hidden="true" />
        <div className="showcase-orbit orbit-inner" aria-hidden="true" />
        <span className="showcase-cross showcase-cross-one" aria-hidden="true">
          +
        </span>
        <span className="showcase-cross showcase-cross-two" aria-hidden="true">
          +
        </span>
        <motion.div
          className="constellation-depth"
          style={{ rotateX, rotateY }}
        >
          {interests.map((interest, index) => (
            <div
              className={`interest-object interest-${interest.kind}`}
              key={interest.kind}
              onPointerEnter={() => setActive(interest)}
              style={{ '--float-delay': `${index * -1.7}s` }}
            >
              <span className="interest-float">
                <img
                  src={interest.image}
                  srcSet={`${interest.imageSmall} 480w, ${interest.image} 960w`}
                  sizes={
                    interest.kind === 'e30'
                      ? '(max-width: 600px) 85vw, 480px'
                      : '(max-width: 600px) 220px, 320px'
                  }
                  width="960"
                  height="960"
                  alt={interest.alt}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  draggable="false"
                />
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="showcase-bottomline">
        <div className="showcase-readout">
          <span className="readout-mark" aria-hidden="true">
            ↳
          </span>
          <span>{active ? active.name : 'Curiosity doesn’t clock out.'}</span>
        </div>
        <a
          href="#about"
          className="showcase-explore"
          aria-label="Meet the person behind the code"
        >
          <Icon name="down" size={20} />
        </a>
      </div>
    </motion.div>
  )
}
