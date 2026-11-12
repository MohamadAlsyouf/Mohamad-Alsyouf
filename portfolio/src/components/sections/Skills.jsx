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
function DevelopmentTools() {
  return (
    <div className="ai-terminal">
      <div className="terminal-top">
        <span>Development tools</span>
        <Icon name="code" size={14} />
      </div>
      <dl className="development-tools">
        <div>
          <dt>AI-assisted coding</dt>
          <dd>Cursor, Claude, Codex</dd>
        </div>
        <div>
          <dt>Testing</dt>
          <dd>Cypress, Postman</dd>
        </div>
        <div>
          <dt>Project planning</dt>
          <dd>JIRA, Agile sprints</dd>
        </div>
      </dl>
      <div className="terminal-bottom">
        <span className="status-dot" />
        <span>CODE REVIEW & TESTING</span>
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
            Development
            <br />
            <span className="muted-heading">process & tools.</span>
          </h2>
          <p>Requirements, implementation, testing, and production delivery.</p>
        </div>
      </Reveal>
      <div className="approach-grid">
        <Reveal className="ai-story">
          <DevelopmentTools />
          <p className="ai-caption">
            I use AI tools to navigate codebases, explore implementation
            options, and debug issues. I review generated code and test changes
            before deployment.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Workflow />
        </Reveal>
      </div>
      <Reveal className="stack-section">
        <div className="stack-heading">
          <h3>Technologies</h3>
          <span className="mono">BY AREA</span>
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
