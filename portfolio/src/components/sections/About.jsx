import { aboutText, capabilities, personalInfo } from '../../data/content'
import portrait from '../../assets/meeee.jpg'
import Reveal, { SectionLabel } from '../ui/Reveal'
import Icon from '../ui/Icon'
import Experience from './Experience'
export default function About() {
  return (
    <section id="about" className="about-section section-space">
      <div className="page-width">
        <Reveal>
          <SectionLabel number="01">ABOUT</SectionLabel>
        </Reveal>
        <div className="about-intro">
          <Reveal className="portrait-composition">
            <div className="portrait-frame">
              <img
                src={portrait}
                alt="Mohamad Alsyouf"
                loading="lazy"
                width="400"
                height="400"
              />
              <div className="portrait-corner">MA /</div>
              <div className="portrait-caption">
                <span>
                  <span className="status-dot" /> FOCUS 360
                </span>
                <span>ANAHEIM, CA</span>
              </div>
            </div>
            <div className="portrait-note">
              <span className="handdrawn-arrow">↳</span> Senior Full Stack
              Engineer
            </div>
          </Reveal>
          <Reveal className="about-copy" delay={0.1}>
            <h2>
              Engineering &
              <br />
              <span className="accent-text">experience.</span>
            </h2>
            <p>{aboutText}</p>
            <p>
              I work with sales, project management, and production teams to
              define requirements, plan releases, and maintain the systems they
              use. I also lead sprints and mentor developers.
            </p>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              View LinkedIn profile
              <Icon size={16} />
            </a>
          </Reveal>
        </div>
        <div className="capabilities-grid">
          {capabilities.map((item, index) => (
            <Reveal
              className="capability"
              key={item.number}
              delay={index * 0.05}
            >
              <div className="capability-top">
                <Icon
                  name={item.icon === 'orbit' ? 'layers' : item.icon}
                  size={23}
                />
                <span className="mono">{item.number}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Reveal>
          ))}
        </div>
        <Experience />
      </div>
    </section>
  )
}
