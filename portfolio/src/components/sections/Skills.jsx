import { motion } from 'framer-motion'
import SkillCard from '../ui/SkillCard'
import { skills } from '../../data/content'

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-[#0c0c12]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            className="text-accent font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Tech Stack
          </motion.span>

          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Technologies I Work With
          </motion.h2>

          <motion.p
            className="text-muted max-w-2xl mx-auto mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A curated collection of technologies and tools I use to bring ideas to life.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <SkillCard key={skill.name} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
