import React from "react";
import styles from "./FrogMazeGame.module.css";

interface FrogMazeGameScreenProps {
  renderMaze: () => React.ReactNode;
  win: boolean;
  selectedPlayer: 'frog' | 'fox' | 'turtle';
}

const FrogMazeGameScreen: React.FC<FrogMazeGameScreenProps> = ({ renderMaze, win, selectedPlayer }) => (
  <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        {renderMaze()}
      </div>
    </div>
    {win && <div className={styles["win-message"]}>You win! 🎉</div>}
    <div className={styles.instructions}>
      Use <b>WASD</b> keys to move the {selectedPlayer} to the finish!
    </div>
  </div>
);

export default FrogMazeGameScreen;
