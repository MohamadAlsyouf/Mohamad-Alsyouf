import EngineeringDiagram from './EngineeringDiagram'
import { useEffect, useRef } from 'react'

export function CircuitTraces({ className = '' }) {
  return (
    <svg
      className={`circuit-traces ${className}`}
      viewBox="0 0 1280 700"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1">
        <path d="M0 125h127l68 68h187l65-65h262l80 80h192l75-75h224M0 578h159l86-86h238l60 60h275l75-75h387M76 0v68l70 70v146l-63 63v353M1210 0v104l-79 79v192l73 73v252M530 0v76l66 66v149l-65 65v344" />
        <path
          d="M0 137h122l68 68h197l65-65h250l80 80h204l75-75h219M0 590h164l86-86h228l60 60h285l75-75h382"
          className="trace-secondary"
        />
        {[
          [127, 125],
          [382, 193],
          [709, 128],
          [981, 208],
          [159, 578],
          [483, 492],
          [818, 552],
          [1131, 375],
          [531, 356],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="5" />
        ))}
      </g>
      <path
        className="trace-signal"
        d="M0 125h127l68 68h187l65-65h262l80 80h192l75-75h224"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}

export default function SystemsBackdrop() {
  const diagrams = useRef(null)
  useEffect(() => {
    const elements = [...diagrams.current.children]
    const visible = new Set()
    const update = () =>
      elements.forEach((element) => {
        element.dataset.active = String(
          visible.has(element) && !document.hidden,
        )
      })
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      })
      update()
    })
    elements.forEach((element) => observer.observe(element))
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])
  return (
    <div className="systems-backdrop" aria-hidden="true">
      <div className="systems-grid" />
      <div className="systems-diagrams" ref={diagrams}>
        {['pi', 'engine', 'sword', 'phone', 'wheel', 'fishing'].map((kind) => (
          <EngineeringDiagram
            key={kind}
            kind={kind}
            className={`background-${kind}`}
          />
        ))}
      </div>
      <div className="code-stream code-stream-one">
        01001001
        <br />
        00101110
        <br />
        10110001
        <br />
        01101000
        <br />
        11000110
      </div>
      <div className="code-stream code-stream-two">
        SYS / 01
        <br />
        0x00FF
        <br />
        010101
        <br />
        I/O →
      </div>
    </div>
  )
}
