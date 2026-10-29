import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ThemeToggleButton from '../ui/ThemeToggleButton'
import Icon, { BrandMark } from '../ui/Icon'
import { personalInfo } from '../../data/content'
const links = [{ name: 'Work', id: 'work' }, { name: 'About', id: 'about' }, { name: 'Approach', id: 'approach' }]
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')
  const menuButton = useRef(null)
  const navRef = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id) })
    }, { rootMargin: '-20% 0px -55% 0px' })
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!menuOpen) return
    const keydown = event => { if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus() } }
    const outside = event => { if (!navRef.current?.contains(event.target)) setMenuOpen(false) }
    const resize = () => { if (window.innerWidth > 760) setMenuOpen(false) }
    document.addEventListener('keydown', keydown)
    document.addEventListener('pointerdown', outside)
    window.addEventListener('resize', resize)
    return () => { document.removeEventListener('keydown', keydown); document.removeEventListener('pointerdown', outside); window.removeEventListener('resize', resize) }
  }, [menuOpen])
  return <header className="site-header" ref={navRef}>
    <nav className="navigation page-width" aria-label="Main navigation">
      <a className="brand" href="#hero" aria-label="Mohamad Alsyouf home" onClick={() => setMenuOpen(false)}><BrandMark /><span>mohamad<span className="accent-dot">.</span></span></a>
      <div className="desktop-nav">{links.map(link => <a href={`#${link.id}`} key={link.id} className={active === link.id ? 'active' : ''} aria-current={active === link.id ? 'location' : undefined}>{link.name}</a>)}</div>
      <div className="nav-actions"><ThemeToggleButton /><a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>Let’s talk <Icon size={15} /></a><button ref={menuButton} className="icon-button menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(current => !current)}><Icon name={menuOpen ? 'close' : 'menu'} /></button></div>
    </nav>
    <AnimatePresence>{menuOpen && <motion.div id="mobile-navigation" className="mobile-nav" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}><div>{[...links, { name: 'Contact', id: 'contact' }].map((link, index) => <a key={link.id} href={`#${link.id}`} onClick={() => setMenuOpen(false)}><span className="mono">0{index + 1}</span>{link.name}<Icon /></a>)}<a href={personalInfo.resume} download>Download résumé <Icon name="download" /></a></div></motion.div>}</AnimatePresence>
  </header>
}
