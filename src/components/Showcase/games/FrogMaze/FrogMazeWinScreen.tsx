import React from "react";
import styles from "./FrogMazeGame.module.css";

interface FrogMazeWinScreenProps {
  onRestart: () => void;
}

const FrogMazeWinScreen: React.FC<FrogMazeWinScreenProps> = ({ onRestart }) => (
  <div className={styles.previewContainer}>
    <div className={styles["win-message"]} style={{ marginTop: 0 }}>You win! 🎉</div>
    <button className={styles.startButton} onClick={onRestart} style={{ marginTop: 24 }}>
      Play Again
    </button>
  </div>
);

export default FrogMazeWinScreen;
