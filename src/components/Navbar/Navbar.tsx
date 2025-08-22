import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      // Update sections to match App.tsx anchors
  const sections = ['hero', 'projects', 'skills', 'showcase', 'art', 'models', 'about']
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();
    const el = document.getElementById(section);
    if (el) {
      const yOffset = -80; // Adjust for fixed navbar height
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`${styles.nav} ${isScrolled ? 'scrolled' : ''}`}>
      <ul className={styles.navList}>
        <li>
          <a
            href="#hero"
            className={getLinkClasses('hero')}
            onClick={e => handleNavClick(e, 'hero')}
          >Home</a>
        </li>
        <li>
          <a
            href="#projects"
            className={getLinkClasses('projects')}
            onClick={e => handleNavClick(e, 'projects')}
          >Projects</a>
        </li>
        <li>
          <a
            href="#skills"
            className={getLinkClasses('skills')}
            onClick={e => handleNavClick(e, 'skills')}
          >Skills</a>
        </li>
        <li>
          <a
            href="#showcase"
            className={getLinkClasses('showcase')}
            onClick={e => handleNavClick(e, 'showcase')}
          >Showcase</a>
        </li>
        <li>
          <a
            href="#models"
            className={getLinkClasses('models')}
            onClick={e => handleNavClick(e, 'models')}
          >3D Models</a>
        </li>
        <li>
          <a
            href="#art"
            className={getLinkClasses('art')}
            onClick={e => handleNavClick(e, 'art')}
          >Art</a>
        </li>
        <li>
          <a
            href="#about"
            className={getLinkClasses('about')}
            onClick={e => handleNavClick(e, 'about')}
          >About</a>
        </li>
      </ul>
    </nav>
  )
}

