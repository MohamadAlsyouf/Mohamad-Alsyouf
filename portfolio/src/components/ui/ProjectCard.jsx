import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useTheme } from '../../context/ThemeContext'
import ProjectPreview from './ProjectPreview'
import Reveal from './Reveal'
import Icon from './Icon'

function CaseStudy({ project, onClose }) {
  const dialog = useRef(null)
  useEffect(() => {
    const element = dialog.current
    element.showModal()
    const onCancel = (event) => {
      event.preventDefault()
      onClose()
    }
    element.addEventListener('cancel', onCancel)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      element.removeEventListener('cancel', onCancel)
      document.body.style.overflow = previousOverflow
      element.close()
    }
  }, [onClose])
  return createPortal(
    <dialog
      ref={dialog}
      className="case-dialog"
      aria-labelledby={`case-title-${project.id}`}
      onClick={(event) => {
        if (event.target === dialog.current) onClose()
      }}
    >
      <div className="case-content">
        <button
          autoFocus
          className="icon-button case-close"
          onClick={onClose}
          aria-label="Close case study"
        >
          <Icon name="close" />
        </button>
        <span className="mono case-eyebrow">{project.eyebrow}</span>
        <h2 id={`case-title-${project.id}`}>{project.title}</h2>
        <p className="case-description">{project.description}</p>
        <div className="case-impact">
          <Icon name="arrow" />
          {project.impact}
        </div>
        <h3>My role</h3>
        <p>{project.role}</p>
        <h3>Implementation & results</h3>
        <ul className="case-details">
          {project.details.map((detail) => (
            <li key={detail}>
              <Icon name="check" size={16} />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
        <div className="tech-list">
          {project.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <p className="case-note">
          Project visuals are illustrative interface studies.{' '}
          {project.liveUrl
            ? 'Explore the product for its current experience.'
            : 'Production interfaces and source code are proprietary.'}
        </p>
        {project.liveUrl ? (
          <a
            className="button button-primary"
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit {project.kind === 'arkan' ? 'Arkan' : 'project'}
            <Icon />
          </a>
        ) : (
          <a
            className="button button-primary"
            href="#contact"
            onClick={() => onClose(false)}
          >
            Contact me
            <Icon />
          </a>
        )}
      </div>
    </dialog>,
    document.body,
  )
}

export default function ProjectCard({ project, featured = false }) {
  const [open, setOpen] = useState(false)
  const trigger = useRef(null)
  const { reducedMotion } = useTheme()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(x, { stiffness: 150, damping: 25 })
  const rotateY = useSpring(y, { stiffness: 150, damping: 25 })
  const move = (event) => {
    if (reducedMotion || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set(((event.clientY - rect.top) / rect.height - 0.5) * -3)
    y.set(((event.clientX - rect.left) / rect.width - 0.5) * 3)
  }
  const close = useCallback((restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus !== false)
      requestAnimationFrame(() =>
        trigger.current?.focus({ preventScroll: true }),
      )
  }, [])
  return (
    <Reveal
      className={`project-card ${featured ? 'featured-project' : ''} project-${project.kind}`}
    >
      <motion.div
        className="project-visual"
        onPointerMove={move}
        onPointerLeave={() => {
          x.set(0)
          y.set(0)
        }}
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          transformPerspective: 1200,
        }}
      >
        <ProjectPreview kind={project.kind} />
        <span className="project-visual-index mono">
          {project.number} / SELECTED WORK
        </span>
      </motion.div>
      <div className="project-info">
        <p className="project-eyebrow mono">{project.eyebrow}</p>
        <h3>{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-impact">
          <span className="status-dot" />
          {project.impact}
        </div>
        <div className="tech-list">
          {project.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <button
          ref={trigger}
          className="project-open"
          aria-label={`Explore ${project.title.replace(/\n/g, ' ')}`}
          onClick={() => setOpen(true)}
        >
          <span>View project details</span>
          <span className="project-open-icon">
            <Icon />
          </span>
        </button>
      </div>
      {open && <CaseStudy project={project} onClose={close} />}
    </Reveal>
  )
}
