import { motion } from 'framer-motion'

export default function SkillCard({ skill, index }) {
  return (
    <motion.div
      className="bg-[#12121a] border border-[#1f1f2e] rounded-lg p-4 flex items-center gap-3 hover:border-accent/30 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="w-2 h-2 rounded-full bg-accent" />
      <span className="text-foreground font-medium">{skill.name}</span>
      <span className="text-xs text-muted ml-auto">{skill.category}</span>
    </motion.div>
  )
}
