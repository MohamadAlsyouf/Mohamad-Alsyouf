import { useRef } from 'react'
import { interests } from '../../data/interests'
import useSceneActivity from '../../hooks/useSceneActivity'
import { CircuitTraces } from '../ui/SystemsBackdrop'
import Reveal, { SectionLabel } from '../ui/Reveal'

export default function Workbench() {
  const board = useRef(null)
  useSceneActivity(board)
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
            {interests.map((study, index) => (
              <figure
                className={`bench-study bench-${study.kind}`}
                id={`interest-${study.kind}`}
                key={study.kind}
              >
                <div className="bench-drawing">
                  <img
                    src={study.image}
                    srcSet={`${study.imageSmall} 480w, ${study.image} 960w`}
                    sizes="(max-width: 600px) 85vw, (max-width: 900px) 42vw, 380px"
                    width="960"
                    height="960"
                    alt={study.alt}
                    loading="lazy"
                    decoding="async"
                  />
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
