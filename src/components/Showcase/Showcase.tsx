<<<<<<< Updated upstream
import styles from './Showcase.module.css'
import { FaRegLightbulb, FaTools } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { showcaseGames } from './games';
=======
import { FaRegLightbulb } from 'react-icons/fa'
import GamesGallery from './GamesGallery'
>>>>>>> Stashed changes

export default function Showcase() {
  // Showcase header + games gallery

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
<<<<<<< Updated upstream
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
=======
  <GamesGallery />
      {/* Uncomment below when ready to show tools */}
      {/* <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        <FunFact />
        <PetPainter />
      </Masonry> */}
>>>>>>> Stashed changes
    </section>
  )
}
