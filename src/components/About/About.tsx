import styles from './About.module.css'
import FunFactCarousel from './FunFactCarousel'
import type { FunFact } from './FunFactCarousel'
import { FaUserAstronaut, FaCode, FaTools, FaDatabase, FaPaintBrush, FaStar, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import aboutMe from '../../aboutMe.json'


// Use carouselImages from aboutMe.json
const aboutImages = Array.isArray(aboutMe.carouselImages)
  ? aboutMe.carouselImages
  : [
      { src: '/assets/about/me.png', caption: 'Ella Demarest' },
      { src: '/assets/about/misty-and-sandy.jpg', caption: 'Misty & Sandy' },
      { src: '/assets/about/walter.jpg', caption: 'Walter' },
      { src: '/assets/about/ember.jpg', caption: 'Ember' }
    ];

function AboutImageCarousel() {
  const [idx, setIdx] = useState(0)
  const total = aboutImages.length

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % total), 4000)
    return () => clearInterval(timer)
  }, [total])

  const prev = () => setIdx(i => (i - 1 + total) % total)
  const next = () => setIdx(i => (i + 1) % total)

  return (
    <div className={styles.aboutImageCarousel}>
      <div className={styles.aboutImageCarouselImages}>
        <button className={styles.aboutImageCarouselBtn} onClick={prev} aria-label="Previous image">
          <FaChevronLeft />
        </button>
        <img src={aboutImages[idx].src} alt={aboutImages[idx].caption} className={styles.aboutImage} />
        <button className={styles.aboutImageCarouselBtn} onClick={next} aria-label="Next image">
          <FaChevronRight />
        </button>
      </div>
      <div className={styles.aboutImageCaption}>
        {aboutImages[idx].caption}
      </div>
    </div>
  )
}

export default function About() {

  // Icon mapping for skill categories
  const iconMap = {
    "Programming & Development": <FaCode />,
    "Frameworks, Tools & Libraries": <FaTools />,
    "Data & Bioinformatics": <FaDatabase />,
    "Design & Creative": <FaPaintBrush />,
    "Specialized": <FaStar />,
  }

  // Map category to color class
  const skillClassMap: Record<string, string> = {
    "Programming & Development": "programming",
    "Frameworks, Tools & Libraries": "tools",
    "Data & Bioinformatics": "database",
    "Design & Creative": "design",
    "Specialized": "specialized",
  }

  const [skillsOpen, setSkillsOpen] = useState(true)
  const [funFactsOpen, setFunFactsOpen] = useState(true)

  return (
    <section id="about" className="section">
      <div className={styles.aboutIntroGrid}>
        <div className={styles.introCol}>
          <h2 className="section-title">
            <FaUserAstronaut className="section-title-icon" />
            About Me
          </h2>
          <p className={styles.introBody}>
            {aboutMe.background.text}
          </p>
          <AboutImageCarousel />
        </div>
        <div className={styles.skillsCol}>
          {/* Collapsible Skills */}
          <div className={styles.sectionBlock}>
            <button
              className={styles.collapseToggle}
              onClick={() => setSkillsOpen(o => !o)}
              aria-expanded={skillsOpen}
              aria-controls="skills-collapse"
              type="button"
            >
              <h3 className={styles.colHeading}>Skills</h3>
              {skillsOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div
              id="skills-collapse"
              className={styles.collapsibleSection}
              style={{
                maxHeight: skillsOpen ? '1200px' : '0',
                overflow: skillsOpen ? 'visible' : 'hidden',
                transition: 'max-height 0.35s cubic-bezier(.5,1.5,.5,1)'
              }}
            >
              <div className={styles.skillsCategoryGrid}>
                {aboutMe.skills.map(cat => (
                  <div className={styles.skillsCategoryCol} key={cat.category}>
                    <div className={`${styles.skillsCategoryHeader} ${styles[skillClassMap[cat.category] || '']}`}>
                      {iconMap[cat.category as keyof typeof iconMap]}
                      <span>{cat.category}</span>
                    </div>
                    <div className={styles.skillsTagBar}>
                      {cat.skills.map((skill: string) => (
                        <span
                          className={`${styles.skillTag} ${styles[skillClassMap[cat.category] || '']}`}
                          key={skill}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.sectionDivider} />
          {/* Collapsible Fun Facts */}
          <div className={styles.sectionBlock}>
            <button
              className={styles.collapseToggle}
              onClick={() => setFunFactsOpen(o => !o)}
              aria-expanded={funFactsOpen}
              aria-controls="funfacts-collapse"
              type="button"
            >
              <h3 className={styles.colHeading} style={{ marginBottom: '0.7rem' }}>
                Fun Facts
              </h3>
              {funFactsOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div
              id="funfacts-collapse"
              className={styles.collapsibleSection}
              style={{
                maxHeight: funFactsOpen ? '800px' : '0',
                overflow: funFactsOpen ? 'visible' : 'hidden',
                transition: 'max-height 0.35s cubic-bezier(.5,1.5,.5,1)'
              }}
            >
              {funFactsOpen && (
                <FunFactCarousel funFacts={aboutMe.funFacts as FunFact[]} intervalMs={5000} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}