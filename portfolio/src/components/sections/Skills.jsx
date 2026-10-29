import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { stackGroups, workflow } from '../../data/content'
import Reveal, { SectionLabel } from '../ui/Reveal'
import Icon from '../ui/Icon'
import { useTheme } from '../../context/ThemeContext'
function Workflow() {
  const { reducedMotion } = useTheme()
  const [open, setOpen] = useState(0)
  return (
    <div className="workflow">
      {workflow.map((step, index) => (
        <div
          className={`workflow-item ${open === index ? 'is-open' : ''}`}
          key={step.number}
        >
          <h3>
            <button
              id={`workflow-title-${index}`}
              aria-expanded={open === index}
              aria-controls={`workflow-panel-${index}`}
              onClick={() => setOpen(open === index ? null : index)}
            >
              <span className="workflow-number mono">{step.number}</span>
              <span>{step.title}</span>
              <Icon name="plus" size={20} />
            </button>
          </h3>
          <AnimatePresence initial={false}>
            {open === index && (
              <motion.div
                id={`workflow-panel-${index}`}
                role="region"
                aria-labelledby={`workflow-title-${index}`}
                initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
              >
                <p>{step.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
function AITerminal() {
  return (
    <div className="ai-terminal">
      <div className="terminal-top">
        <span className="terminal-dots">
          <i />
          <i />
          <i />
        </span>
        <span>the-way-i-work.ts</span>
        <Icon name="code" size={14} />
      </div>
      <div className="terminal-code">
        <div className="code-line">
          <span>01</span>
          <code className="code-comment">
            // More intention. Less busywork.
          </code>
        </div>
        <div className="code-line">
          <span>02</span>
          <code>
            <b>const</b> builder = {'{'}
          </code>
        </div>
        <div className="code-line">
          <span>03</span>
          <code>
            {' '}
            mindset: <em>"systems first"</em>,
          </code>
        </div>
        <div className="code-line">
          <span>04</span>
          <code>
            {' '}
            tools: [<em>"Cursor"</em>, <em>"Claude"</em>, <em>"Codex"</em>],
          </code>
        </div>
        <div className="code-line">
          <span>05</span>
          <code>
            {' '}
            superpower: <em>"connecting the dots"</em>,
          </code>
        </div>
        <div className="code-line">
          <span>06</span>
          <code>
            {' '}
            accountability: <em>"always human"</em>
          </code>
        </div>
        <div className="code-line">
          <span>07</span>
          <code>{'}'};</code>
        </div>
        <div className="code-line">
          <span>08</span>
          <code> </code>
        </div>
        <div className="code-line">
          <span>09</span>
          <code>
            builder.<strong>turnIntentIntoImpact</strong>();
            <span className="terminal-cursor">▌</span>
          </code>
        </div>
      </div>
      <div className="terminal-bottom">
        <span className="status-dot" />
        <span>AI-ASSISTED. HUMAN-OWNED.</span>
        <Icon name="spark" size={14} />
      </div>
    </div>
  )
}
export default function Skills() {
  return (
    <section
      id="approach"
      className="approach-section section-space page-width"
    >
      <Reveal>
        <SectionLabel number="03">HOW I WORK</SectionLabel>
        <div className="section-heading-row">
          <h2>
            Human at the core.
            <br />
            <span className="muted-heading">AI in the loop.</span>
          </h2>
          <p>
            Better tools. Sharper thinking.
            <br />
            The same ownership of the outcome.
          </p>
        </div>
      </Reveal>
      <div className="approach-grid">
        <Reveal className="ai-story">
          <AITerminal />
          <p className="ai-caption">
            AI is part of my process, from understanding a codebase to exploring
            solutions and accelerating delivery. Architecture, validation, and
            the final call stay with me.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Workflow />
        </Reveal>
      </div>
      <Reveal className="stack-section">
        <div className="stack-heading">
          <h3>
            A practical toolkit.
            <br />
            <span className="muted-heading">Picked for the problem.</span>
          </h3>
          <span className="mono">THE STACK BEHIND THE WORK</span>
        </div>
        <div className="stack-groups">
          {stackGroups.map((group) => (
            <div className="stack-group" key={group.label}>
              <span className="mono">{group.label}</span>
              <div>
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
