import React, { useState, useEffect } from 'react'
import styles from './Art.module.css'
import Tag from '../Work/Tag'
import { FaTools, FaPaintBrush } from 'react-icons/fa'
import { SiAdobe } from 'react-icons/si'

// Dynamically import all images from assets/art
const artImages = Object.values(
  import.meta.glob('../../assets/art/*.{png,jpg,jpeg,gif}', { eager: true, as: 'url' })
)

const artTags = [
  { label: "Procreate", icon: <FaPaintBrush /> },
  { label: "Adobe Photoshop", icon: <SiAdobe /> },
  { label: "Adobe Illustrator", icon: <FaPaintBrush /> }
];

export default function Art() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="art" className="section">
      <div className="section-header">
        <h2 className="section-title">
          <FaPaintBrush className="section-title-icon" />
          Art
        </h2>
        <p className="section-body">
          I've been selling artwork commissions since 5th grade, steadily raising my skills, prices, and client base over the years. Along the way I expanded into vector art, UI design, animation, and painting. These days I focus more on programming and rarely take commissions, but I still draw on Procreate regularly -- mostly horror-themed pieces and characters from shows I love.
        </p>
        <div className={styles.sectionSubtitleTech}>
          <FaTools className={styles.sectionSubtitleIcon} />
          <span className={styles.sectionSubtitleText}>
            <b style={{ color: "#fff" }}>Applications</b>
          </span>
        </div>
        <div className={styles.tagBar}>
          {artTags.map(tag => (
            <Tag
              key={tag.label}
              tag={tag.label}
              icon={tag.icon}
              variant="filter-static" // static filter style
            />
          ))}
        </div>
      </div>
      {isMobile ? (
        <div className={styles.artGridMobile}>
          {artImages.map((src, i) => (
            <div className={styles.artItemMobile} key={i}>
              <span className={styles.tapeTop} />
              <img src={src} alt={`Art ${i + 1}`} className={styles.artImg} />
              <span className={styles.tapeBottom} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.artGrid}>
          {artImages.map((src, i) => (
            <div className={styles.artItem} key={i} style={{ '--random': `${Math.random() * 12 - 6}deg` } as React.CSSProperties}>
              <span className={styles.tapeTop} />
              <img src={src} alt={`Art ${i + 1}`} className={styles.artImg} />
              <span className={styles.tapeBottom} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}