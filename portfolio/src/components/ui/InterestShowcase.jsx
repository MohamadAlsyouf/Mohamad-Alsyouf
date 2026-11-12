import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { interests } from '../../data/interests'
import useSceneActivity from '../../hooks/useSceneActivity'
import Icon from './Icon'
import InterestStory from './InterestStory'

export default function InterestShowcase() {
  const scene = useRef(null)
  const panel = useRef(null)
  const triggers = useRef(new Map())
  const suppressFocus = useRef(false)
  const storyId = useId()
  const { reducedMotion } = useTheme()
  const [active, setActive] = useState(null)
  const rotateX = useSpring(0, { stiffness: 90, damping: 24 })
  const rotateY = useSpring(0, { stiffness: 90, damping: 24 })
  useSceneActivity(scene)

  const dismiss = useCallback(() => {
    const restoreFocus = panel.current?.contains(document.activeElement)
    setActive(null)
    if (restoreFocus && active) {
      suppressFocus.current = true
      triggers.current.get(active.kind)?.focus({ preventScroll: true })
      suppressFocus.current = false
    }
  }, [active])

  useEffect(() => {
    if (!active) return
    const keydown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        dismiss()
      }
    }
    const outside = (event) => {
      if (!scene.current?.contains(event.target)) setActive(null)
    }
    document.addEventListener('keydown', keydown)
    document.addEventListener('pointerdown', outside)
    return () => {
      document.removeEventListener('keydown', keydown)
      document.removeEventListener('pointerdown', outside)
    }
  }, [active, dismiss])

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
  }

  return (
    <motion.div
      className="interest-showcase"
      ref={scene}
      data-active="false"
      data-expanded={Boolean(active)}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 1.1 }}
      onPointerLeave={(event) => {
        if (
          event.pointerType === 'mouse' &&
          !scene.current.contains(document.activeElement)
        )
          setActive(null)
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActive(null)
      }}
    >
      {/* <div className="showcase-topline mono">
        <span>
          <span className="status-dot" /> PERSONAL INTERESTS
        </span>
        <span>{String(interests.length).padStart(2, '0')} / INTERESTS</span>
      </div> */}
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
            <button
              type="button"
              className={`interest-object interest-${interest.kind}`}
              key={interest.kind}
              ref={(element) => {
                if (element) triggers.current.set(interest.kind, element)
                else triggers.current.delete(interest.kind)
              }}
              aria-label={`About ${interest.name}`}
              aria-expanded={active?.kind === interest.kind}
              aria-controls={
                active?.kind === interest.kind ? storyId : undefined
              }
              aria-describedby={`${storyId}-${interest.kind}-summary`}
              data-selected={active?.kind === interest.kind}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setActive(interest)
              }}
              onFocus={() => {
                if (!suppressFocus.current) setActive(interest)
              }}
              onClick={() => setActive(interest)}
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
            </button>
          ))}
        </motion.div>
      </div>
      {active && (
        <InterestStory
          key={active.kind}
          interest={active}
          anchor={triggers.current.get(active.kind)}
          scene={scene}
          panel={panel}
          id={storyId}
          onClose={dismiss}
        />
      )}
      <div className="showcase-bottomline">
        <div className="showcase-readout">
          <span className="readout-mark" aria-hidden="true">
            ↳
          </span>
          <span>
            {active ? active.name : 'Hover or tap an item for details.'}
          </span>
        </div>
        <a
          href="#about"
          className="showcase-explore"
          aria-label="About Mohamad"
        >
          <Icon name="down" size={20} />
        </a>
      </div>
      {interests.map((interest) => (
        <span
          key={interest.kind}
          id={`${storyId}-${interest.kind}-summary`}
          className="sr-only"
        >
          {interest.detail}
          {interest.background ? ` ${interest.background}` : ''}
        </span>
      ))}
    </motion.div>
  )
}
