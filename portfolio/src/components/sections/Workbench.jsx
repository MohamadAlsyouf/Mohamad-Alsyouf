import { useEffect, useRef } from 'react'
import EngineeringDiagram from '../ui/EngineeringDiagram'
import { CircuitTraces } from '../ui/SystemsBackdrop'
import Reveal, { SectionLabel } from '../ui/Reveal'

const studies = [
  {
    kind: 'pi',
    name: 'Raspberry Pi 5',
    detail: 'Small board. Endless possibilities.',
  },
  {
    kind: 'camera',
    name: 'Camera Module 3',
    detail: 'A different way to see.',
  },
  {
    kind: 'engine',
    name: 'BMW M50B25',
    detail: 'Six cylinders. One great system.',
  },
  {
    kind: 'drone',
    name: 'Compact reconnaissance drone',
    detail: 'Where sensing meets software.',
  },
  {
    kind: 'sword',
    name: 'Lava Spine / World of Warcraft',
    detail: 'A little time in another world.',
  },
  {
    kind: 'wheel',
    name: 'BBS RS / three-piece',
    detail: 'The beauty is in the assembly.',
  },
  {
    kind: 'fishing',
    name: 'Rod, reel, lure & rainbow trout',
    detail: 'Sometimes the best reset is outside.',
  },
]

export default function Workbench() {
  const board = useRef(null)
  useEffect(() => {
    const element = board.current
    let inView = false
    const update = () => {
      element.dataset.active = String(inView && !document.hidden)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        update()
      },
      { rootMargin: '60px' },
    )
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])
  return (
    <section
      id="workbench"
      className="workbench-section section-space"
      aria-labelledby="workbench-title"
    >
      <div className="page-width">
        <Reveal>
          <SectionLabel number="+">OFF THE CLOCK. STILL CURIOUS.</SectionLabel>
          <div className="section-heading-row workbench-heading">
            <h2 id="workbench-title">
              Code. Circuits.
              <br />
              <span className="accent-text">Everything in between.</span>
            </h2>
            <p>
              From a circuit board to an engine bay, I love understanding how
              things fit together. A few things that keep my curiosity running.
            </p>
          </div>
        </Reveal>
        <div className="workbench" ref={board} data-active="false">
          <div className="workbench-topline">
            <span className="mono">
              <span className="status-dot" /> THE CURIOSITY WORKBENCH
            </span>
            <span className="mono">SOFTWARE ↔ HARDWARE ↔ LIFE</span>
          </div>
          <CircuitTraces />
          <div className="workbench-studies">
            {studies.map((study, index) => (
              <figure
                className={`bench-study bench-${study.kind}`}
                key={study.kind}
              >
                <div className="bench-drawing">
                  <EngineeringDiagram kind={study.kind} />
                  <span className="bench-cross" aria-hidden="true">
                    +
                  </span>
                </div>
                <figcaption>
                  <span className="bench-index mono">0{index + 1}</span>
                  <div>
                    <h3>{study.name}</h3>
                    <p>{study.detail}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="workbench-bottomline">
            <span className="mono">FOLLOW THE CONNECTIONS.</span>
            <span className="mono">ALWAYS SOMETHING TO FIGURE OUT ↗</span>
          </div>
        </div>
      </div>
    </section>
  )
}
