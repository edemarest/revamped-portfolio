import React, { useState, useEffect } from 'react'
import styles from './Art.module.css'
import Tag from '../Work/Tag'
import { FaFilter, FaPaintBrush } from 'react-icons/fa'
import { SiAdobe } from 'react-icons/si'
import { GiStoneBlock } from 'react-icons/gi'

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

  // Tag selection logic (optional, for filtering)
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const handleTagClick = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Art</h2>
        <p className="section-body">
          I have been drawing since I was in elementary school, and picked up digital art very early. I have been selling artwork commissions since I was in 5th grade and steadily increased my skills, prices, and marketing since then. I expanded my expertise into vector art and UI design, animation, painting, and more. While I focus more on programming now and rarely take commissions, I like to sit down and draw on Procreate now and then to destress. I enjoy painting horror-themed pieces and drawing characters from my favorite shows.
        </p>
        <div className="section-subtitle">
          <FaFilter className="section-subtitle-icon" />
          <span className="section-subtitle-text">
            Filter art by tool or technique.
          </span>
        </div>
        <div className={styles.tagBar}>
          {artTags.map(tag => (
            <Tag
              key={tag.label}
              tag={tag.label}
              icon={tag.icon}
              variant="filter"
              selected={selectedTags.includes(tag.label)}
              onClick={() => handleTagClick(tag.label)}
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
