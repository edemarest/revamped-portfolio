import React from "react";
import styles from "./FrogMazeGame.module.css";

interface FrogMazeStartScreenProps {
  selectedPlayer: 'frog' | 'fox' | 'turtle';
  setSelectedPlayer: (player: 'frog' | 'fox' | 'turtle') => void;
  difficulty: 'easy' | 'medium' | 'hard';
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  environment: 'swamp' | 'forest' | 'desert';
  setEnvironment: (env: 'swamp' | 'forest' | 'desert') => void;
  onStart: () => void;
}

const playerImages: Record<string, string> = {
  frog: "/public/assets/funfacts/frog.png",
  fox: "/public/assets/art/dabi.png",
  turtle: "/public/assets/art/titan.png",
};

const FrogMazeStartScreen: React.FC<FrogMazeStartScreenProps> = ({
  selectedPlayer,
  setSelectedPlayer,
  difficulty,
  setDifficulty,
  environment,
  setEnvironment,
  onStart,
}) => (
  <div className={styles.previewContainer}>
    <h3 style={{ color: '#0d443bff', fontFamily: 'Michroma, Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.08em', marginBottom: 10 }}>Frog Maze Game</h3>
    <div className={styles.playerImagesContainer}>
      {['frog', 'fox', 'turtle'].map(animal => (
        <img
          key={animal}
          src={playerImages[animal]}
          alt={animal}
          className={styles.playerImg}
        />
      ))}
    </div>
    <div className={styles.difficultySelect}>
      <b>Difficulty:</b>
      <div className={styles.difficultyOptions}>
        {['easy', 'medium', 'hard'].map(level => (
          <button
            key={level}
            className={`${styles.difficultyButton} ${difficulty === level ? styles.selected : ''}`}
            onClick={() => setDifficulty(level as any)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    </div>
    <div className={styles.environmentSelect}>
      <b>Map Environment:</b>
      <div className={styles.environmentOptions}>
        {['swamp', 'forest', 'desert'].map(env => (
          <button
            key={env}
            className={`${styles.environmentButton} ${environment === env ? styles.selected : ''}`}
            onClick={() => setEnvironment(env as any)}
          >
            {env.charAt(0).toUpperCase() + env.slice(1)}
          </button>
        ))}
      </div>
    </div>
    <button
      onClick={onStart}
      className={styles.startButton}
    >
      Start Game
    </button>
  </div>
);

export default FrogMazeStartScreen;
