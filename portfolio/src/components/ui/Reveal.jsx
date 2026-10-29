import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
export default function Reveal({
  children,
  className = '',
  delay = 0,
  ...props
}) {
  const { reducedMotion } = useTheme()
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
export function SectionLabel({ number, children }) {
  return (
    <div className="section-label">
      <span className="label-index">{number}</span>
      <span>{children}</span>
    </div>
  )
}
