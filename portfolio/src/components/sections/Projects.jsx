import { projects, personalInfo } from '../../data/content'
import ProjectCard from '../ui/ProjectCard'
import Reveal, { SectionLabel } from '../ui/Reveal'
import Icon from '../ui/Icon'
export default function Projects() {
  return <section id="work" className="work-section section-space page-width"><Reveal><SectionLabel number="01">SELECTED WORK</SectionLabel><div className="section-heading-row"><h2>Built with purpose.<br /><span className="muted-heading">Measured in impact.</span></h2><p>A few things I’ve helped take<br className="desktop-break" /> from “what if” to the real world.</p></div></Reveal><div className="projects-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} featured={index === 0} />)}</div><div className="work-footnote"><p><span className="tiny-cross">✳</span> Real projects. Real outcomes. Interface visuals are illustrative.</p><a className="text-link" href={personalInfo.github} target="_blank" rel="noopener noreferrer">More on GitHub<Icon size={15} /></a></div></section>
}
