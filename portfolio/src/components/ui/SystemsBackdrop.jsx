import EngineeringDiagram from './EngineeringDiagram'
import { useEffect, useRef } from 'react'

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
