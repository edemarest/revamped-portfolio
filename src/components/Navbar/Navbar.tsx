import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Check if page is scrolled
      setIsScrolled(window.scrollY > 10)

      // Find active section
      const sections = ['hero', 'projects', 'playground', 'art', 'about']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      
      if (current) {
        setActiveSection(current)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getLinkClasses = (section: string) => {
    const baseClasses = `${styles.link} glow-on-hover`
    return activeSection === section 
      ? `${baseClasses} nav-link-active`
      : baseClasses
  }

  return (
    <nav className={`${styles.nav} ${isScrolled ? 'scrolled' : ''}`}>
      <ul className={styles.navList}>
        <li><a href="#hero" className={getLinkClasses('hero')}>Home</a></li>
        <li><a href="#projects" className={getLinkClasses('projects')}>Projects</a></li>
        <li><a href="#playground" className={getLinkClasses('playground')}>Playground</a></li>
        <li><a href="#art" className={getLinkClasses('art')}>Art</a></li>
        <li><a href="#about" className={getLinkClasses('about')}>About</a></li>
      </ul>
    </nav>
  )
}
