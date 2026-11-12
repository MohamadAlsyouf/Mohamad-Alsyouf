import { projects, personalInfo } from '../../data/content'
import ProjectCard from '../ui/ProjectCard'
import Reveal, { SectionLabel } from '../ui/Reveal'
import Icon from '../ui/Icon'
export default function Projects() {
  return (
    <section id="work" className="work-section section-space page-width">
      <Reveal>
        <SectionLabel number="02">SELECTED WORK</SectionLabel>
        <div className="section-heading-row">
          <h2>
            Enterprise systems &
            <br />
            <span className="muted-heading">applications.</span>
          </h2>
          <p>Selected projects, my role, and the results.</p>
        </div>
      </Reveal>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            featured={index === 0}
          />
        ))}
      </div>
      <div className="work-footnote">
        <p>
          <span className="tiny-cross">✳</span> Interface visuals are
          illustrative.
        </p>
        <a
          className="text-link"
          href={personalInfo.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          More on GitHub
          <Icon size={15} />
        </a>
      </div>
    </section>
  )
}
