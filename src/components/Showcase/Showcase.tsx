import styles from './Showcase.module.css'
import { FaRegLightbulb, FaTools } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { showcaseGames } from './games';

export default function Showcase() {
  const fullText = "Coming Soon";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1));
        i++;
        if (i === fullText.length) {
          clearInterval(typeInterval);
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
        {showcaseGames.length > 0 ? (
          <>
            <div className={styles.frogMazeWrapper}>
              {(() => {
                const FrogMazeComponent = showcaseGames[0].component;
                return <FrogMazeComponent />;
              })()}
            </div>
            <div className={styles.gamesGrid}>
              {showcaseGames.slice(1).map(game => {
                const GameComponent = game.component;
                return (
                  <div key={game.id} className={styles.gameContainer}>
                    <GameComponent />
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className={styles.comingSoonGrid}>
            <div className={styles.constructionIcon}>
              <FaTools size={32} />
            </div>
            <div className={styles.comingSoonButton}>
              {typedText}
            </div>
          </div>
        )}
        <div className={styles.gridBackground} />
      </div>
    </section>
  )
}
