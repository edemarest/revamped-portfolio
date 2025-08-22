import styles from './About.module.css'
import FunFactCarousel from './FunFactCarousel'
import type { FunFact } from './FunFactCarousel'
import { FaUserAstronaut, FaBookOpen, FaCode, FaTools, FaDatabase, FaPaintBrush, FaStar } from 'react-icons/fa'
import aboutMe from '../../aboutMe.json'


export default function About() {

  // Icon mapping for skill categories
  const iconMap = {
    FaCode: <FaCode />,
    FaTools: <FaTools />,
    FaDatabase: <FaDatabase />,
    FaPaintBrush: <FaPaintBrush />,
    FaStar: <FaStar />,
  }

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
        </div>
        <div className={styles.skillsCol}>
          <div className={styles.sectionBlock}>
            <h3 className={styles.colHeading}><FaCode /> Skills</h3>
            <div className={styles.skillsCategoryGrid}>
              {aboutMe.skills.map((cat: any) => (
                <div className={styles.skillsCategoryCol} key={cat.category}>
                  <div className={styles.skillsCategoryHeader}>
                    {iconMap[cat.icon as keyof typeof iconMap]}
                    <span>{cat.category}</span>
                  </div>
                  <div className={styles.skillsTagBar}>
                    {cat.skills.map((skill: string) => (
                      <span className={styles.skillTag} key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.sectionDivider} />
          <div className={styles.sectionBlock}>
            <h3 className={styles.colHeading} style={{ marginBottom: '0.7rem' }}>
              <FaUserAstronaut style={{ marginRight: '0.5em' }} /> Fun Facts
            </h3>
            <FunFactCarousel funFacts={aboutMe.funFacts as FunFact[]} intervalMs={5000} />
          </div>
        </div>
      </div>
    </section>
  )
}