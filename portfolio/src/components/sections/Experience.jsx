import { experience } from '../../data/content'
import Reveal from '../ui/Reveal'

function HighlightedText({ text, phrases }) {
  if (!phrases.length) return text

  const pattern = new RegExp(
    `(${phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'g',
  )

  return text.split(pattern).map((part, index) =>
    phrases.includes(part) ? (
      <strong className="experience-highlight" key={index}>
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

export default function Experience() {
  return (
    <div className="experience">
      <Reveal className="experience-heading">
        <h3>Work experience</h3>
      </Reveal>
      <div className="experience-list">
        {experience.map((item, index) => (
          <Reveal
            className="experience-entry"
            delay={index * 0.06}
            key={item.title}
          >
            <article
              className="experience-row"
              aria-labelledby={`experience-title-${index}`}
            >
              <p className="experience-period">
                <span
                  className={`experience-dot ${index === 0 ? 'is-current' : ''}`}
                  aria-hidden="true"
                />
                {item.period}
              </p>
              <div className="experience-content">
                <h4 id={`experience-title-${index}`}>{item.title}</h4>
                <p className="experience-meta">
                  <span className="experience-company">{item.company}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.location}</span>
                </p>
                <p className="experience-description">{item.description}</p>
                <ul className="experience-highlights" role="list">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>
                      <HighlightedText
                        text={highlight}
                        phrases={item.emphasis}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
