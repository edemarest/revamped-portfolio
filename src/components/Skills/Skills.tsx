import styles from './Skills.module.css'
import skillsData from '../../skills.json'
import * as LucideIcons from 'lucide-react'
import { useEffect, useState, type JSX } from 'react'

const iconMap: Record<string, JSX.Element> = {
  "Programming & Development": <LucideIcons.Code2 className={styles.skillsCategoryIcon} size={28} />,
  "Frameworks, Tools & Libraries": <LucideIcons.Wrench className={styles.skillsCategoryIcon} size={28} />,
  "Database Design": <LucideIcons.Database className={styles.skillsCategoryIcon} size={28} />,
  "Design & Creative": <LucideIcons.Palette className={styles.skillsCategoryIcon} size={28} />,
  "Specialized": <LucideIcons.Star className={styles.skillsCategoryIcon} size={28} />
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = () => setReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

// Type for a skill chip
type SkillChip = {
  label: string
  emphasized: boolean
}

// Type for a skill category
type SkillCategory = {
  category: string
  icon: string
  skills: SkillChip[]
}

export default function Skills() {
  const reducedMotion = usePrefersReducedMotion()
  const speeds = [44, 56, 36, 52, 40]
  const directions = ['ltr', 'rtl', 'ltr', 'rtl', 'ltr']

  // Ensure skillsData.skills is an array
  const skillCategories: SkillCategory[] = Array.isArray(skillsData.skills) ? skillsData.skills : []

  return (
    <section id="skills" className={`section ${styles.skillsSection}`}>
      <div className="section-header">
        <h2 className="section-title">
          <LucideIcons.BadgeCheck className="section-title-icon" size={28} />
          Skills
        </h2>
        <p className="section-body">
          Here are some of the technologies, frameworks, and practices I use most often. I love learning new tools and approaches, and I’m always expanding my skillset!
        </p>
      </div>
      <div className={styles.skillsTableWrapper}>
        {skillCategories.map((cat: SkillCategory, idx: number) => {
          const repeatCount = 4
          const chips: SkillChip[] = Array(repeatCount).fill(cat.skills).flat()
          return (
            <div className={styles.skillsRow} key={cat.category}>
              <div className={styles.skillsCategoryCol}>
                <div className={styles.skillsCategoryHeader}>
                  {iconMap[cat.category]}
                  <span>{cat.category}</span>
                </div>
              </div>
              <div className={styles.skillsMarqueeCol}>
                {reducedMotion ? (
                  <div className={styles.skillsMarqueeTrack} style={{gap: '1rem'}}>
                    {cat.skills.map((skill: SkillChip) => (
                      <span
                        className={`${styles.skillsChip}${skill.emphasized ? ' ' + styles.skillsChipEmphasized : ''}`}
                        tabIndex={0}
                        key={skill.label}
                      >
                        {skill.label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div
                    className={styles.skillsMarqueeTrack}
                    data-direction={directions[idx % directions.length]}
                    style={{
                      // Use type assertion to allow CSS custom property
                      ['--marquee-speed' as any]: `${speeds[idx % speeds.length]}s`,
                      gap: '1rem'
                    }}
                  >
                    {chips.map((skill: SkillChip, i: number) => (
                      <span
                        className={`${styles.skillsChip}${skill.emphasized ? ' ' + styles.skillsChipEmphasized : ''}`}
                        tabIndex={0}
                        key={skill.label + i}
                      >
                        {skill.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
