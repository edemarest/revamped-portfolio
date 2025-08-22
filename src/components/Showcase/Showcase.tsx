import styles from './Showcase.module.css'
import { FaRegLightbulb, FaTools } from 'react-icons/fa'
import { useEffect, useState } from 'react'

export default function Showcase() {
  const fullText = "Coming Soon";
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1));
        i++;
        if (i === fullText.length) {
          clearInterval(typeInterval);
          setTimeout(() => setTypingDone(true), 300);
        }
      }
    }, 90);
    return () => clearInterval(typeInterval);
  }, []);

  return (
    <section id="showcase" className="section">
      <div className="section-header">
        <h2 className="section-title">
          <FaRegLightbulb className="section-title-icon" />
          Showcase
        </h2>
        <p className="section-body">
          Interactive games, puzzles, and demos utilizing AI and neat algorithms.
        </p>
      </div>
      <div className={styles.comingSoonWrapper}>
        <div className={styles.comingSoonGrid}>
          <div className={styles.constructionIcon}>
            <FaTools size={32} />
          </div>
          <div className={styles.comingSoonButton}>
            {typedText}
          </div>
        </div>
        <div className={styles.gridBackground} />
      </div>
      {/* Uncomment below when ready to show tools */}
      {/* <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        <FunFact />
        <PetPainter />
      </Masonry> */}
    </section>
  )
}
