import { useEffect, useRef, useState } from 'react'
import { personalInfo } from '../../data/content'
import { useTheme } from '../../context/ThemeContext'
import Reveal from '../ui/Reveal'
import Icon, { BrandMark } from '../ui/Icon'
export default function Contact() {
  const [copyState, setCopyState] = useState('idle')
  const resetTimer = useRef()
  const { reducedMotion, systemReducedMotion, toggleMotion } = useTheme()
  useEffect(() => () => clearTimeout(resetTimer.current), [])
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setCopyState('idle'), 4000)
  }
  return (
    <section id="contact" tabIndex={-1} className="contact-section page-width">
      <Reveal className="contact-panel">
        <div className="contact-top">
          <span className="mono">
            <span className="status-dot" />
            OPEN TO THE RIGHT OPPORTUNITY
          </span>
          <span className="mono">04 / WHAT’S NEXT</span>
        </div>
        <div className="contact-main">
          <div>
            <h2>
              Let’s build
              <br />
              what’s next<span>.</span>
            </h2>
            <p>
              Have a hard problem, a big idea, or a team
              <br className="desktop-break" /> that could use a builder? I’d
              love to hear it.
            </p>
          </div>
          <a
            className="contact-arrow"
            href={`mailto:${personalInfo.email}`}
            aria-label="Email Mohamad Alsyouf"
          >
            <Icon size={58} />
          </a>
        </div>
        <div className="contact-bottom">
          <a className="contact-email" href={`mailto:${personalInfo.email}`}>
            {personalInfo.email}
          </a>
          <button
            className="copy-button"
            onClick={copyEmail}
            aria-label="Copy email address"
          >
            <Icon name={copyState === 'copied' ? 'check' : 'copy'} size={17} />
            <span>{copyState === 'copied' ? 'Copied!' : 'Copy email'}</span>
          </button>
          <span className="copy-status" role="status">
            {copyState === 'copied'
              ? 'Email address copied.'
              : copyState === 'failed'
                ? 'Copy unavailable. Use the email link to get in touch.'
                : ''}
          </span>
        </div>
      </Reveal>
      <footer className="site-footer">
        <a className="footer-brand" href="#hero" aria-label="Back to top">
          <BrandMark />
          <span>
            Thoughtfully engineered.
            <br />
            <strong>By Mohamad Alsyouf.</strong>
          </span>
        </a>
        <div className="footer-links">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <Icon size={13} />
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
            <Icon size={13} />
          </a>
          <a href={personalInfo.resume} download>
            Résumé
            <Icon name="download" size={13} />
          </a>
        </div>
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} Mohamad Alsyouf</span>
          <button
            onClick={toggleMotion}
            aria-pressed={!reducedMotion}
            disabled={systemReducedMotion}
            title={
              systemReducedMotion
                ? 'Animations follow your device’s reduced-motion preference'
                : undefined
            }
          >
            <Icon name={reducedMotion ? 'play' : 'pause'} size={12} />
            {systemReducedMotion
              ? 'System reduced motion'
              : reducedMotion
                ? 'Motion off'
                : 'Pause motion'}
          </button>
        </div>
      </footer>
    </section>
  )
}
