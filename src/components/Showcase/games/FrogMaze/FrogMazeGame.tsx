import React, { useEffect, useState, useCallback } from "react";
import FrogMazeStartScreen from "./FrogMazeStartScreen";
import FrogMazeGameScreen from "./FrogMazeGameScreen";
import FrogMazeWinScreen from "./FrogMazeWinScreen";
import styles from "./FrogMazeGame.module.css";
import { generateMaze } from "./mazeUtils";
import type { MazeOptions } from "./mazeUtils";

interface FrogMazeGameProps {
	rows?: number;
	cols?: number;
	complexity?: number;
}

const DEFAULT_ROWS = 15;
const DEFAULT_COLS = 15;
const DEFAULT_COMPLEXITY = 0.7;

const FrogMazeGame: React.FC<FrogMazeGameProps> = ({ rows = DEFAULT_ROWS, cols = DEFAULT_COLS, complexity = DEFAULT_COMPLEXITY }) => {
	 const [maze, setMaze] = useState<number[][]>([]);
	 const [frogPos, setFrogPos] = useState<[number, number]>([1, 1]);
	 const [endPos, setEndPos] = useState<[number, number]>([rows - 2, cols - 2]);
	 const [error, setError] = useState<string | null>(null);
	 const [screen, setScreen] = useState<'start' | 'game' | 'win'>('start');
	 const [selectedPlayer, setSelectedPlayer] = useState<'frog' | 'fox' | 'turtle'>('frog');
	 const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
	 const [environment, setEnvironment] = useState<'swamp' | 'forest' | 'desert'>('swamp');
	 const [frogDir, setFrogDir] = useState<'up' | 'down' | 'left' | 'right'>('down');
	 const gameRef = React.useRef<HTMLDivElement>(null);

	// Generate maze on mount or when params change
	useEffect(() => {
			 try {
				 const options: MazeOptions = {
					 rows,
					 cols,
					 complexity,
					 start: [1, 1],
					 end: [rows - 2, cols - 2],
				 };
				 const generatedMaze = generateMaze(options);
				 setMaze(generatedMaze);
				 setFrogPos([1, 1]);
				 setEndPos([rows - 2, cols - 2]);
				 setError(null);
				 setScreen('start');
			 } catch (e: any) {
				 setError("Maze generation failed. Try different parameters.");
			 }
		 }, [rows, cols, complexity]);

	// Handle key presses for movement
	const handleKeyDown = useCallback((e: KeyboardEvent) => {
			if (screen !== 'game' || error) return;
		const [x, y] = frogPos;
		let nx = x, ny = y;
		let dir: 'up' | 'down' | 'left' | 'right' = frogDir;
		if (e.key === "w" || e.key === "W") {
			nx -= 1;
			dir = 'up';
		} else if (e.key === "s" || e.key === "S") {
			nx += 1;
			dir = 'down';
		} else if (e.key === "a" || e.key === "A") {
			ny -= 1;
			dir = 'left';
		} else if (e.key === "d" || e.key === "D") {
			ny += 1;
			dir = 'right';
		} else {
			return;
		}
		e.preventDefault();
		// Bounds check
		if (nx < 0 || nx >= maze.length || ny < 0 || ny >= maze[0].length) return;
		// Wall check
		if (maze[nx][ny] !== 1) return;
		setFrogPos([nx, ny]);
		setFrogDir(dir);
		if (nx === endPos[0] && ny === endPos[1]) {
			setScreen('win');
		}
	}, [frogPos, maze, error, endPos, rows, cols, complexity, frogDir, screen]);

	useEffect(() => {
		const ref = gameRef.current;
		if (!ref) return;
		const listener = (e: KeyboardEvent) => {
			// Only handle if this game is focused
			if (document.activeElement === ref) {
				handleKeyDown(e);
			}
		};
		ref.addEventListener("keydown", listener);
		return () => {
			ref.removeEventListener("keydown", listener);
		};
	}, [handleKeyDown]);

	// Get dynamic cell size based on grid size, no fixed container size
	const DEFAULT_CELL_SIZE = 32;
	const cellSize = maze.length > 0 ? DEFAULT_CELL_SIZE : 32;

	// Render maze grid
	// Placeholder images for animals
	const playerImages: Record<string, string> = {
		frog: "/public/assets/funfacts/frog.png",
		fox: "/public/assets/art/dabi.png", // Replace with fox image later
		turtle: "/public/assets/art/titan.png", // Replace with turtle image later
	};
	const frogImg = playerImages[selectedPlayer];
	const finishImg = "/public/assets/model-icons/chest.png"; // Replace with a finish flag image if available

	const getRotation = (dir: 'up' | 'down' | 'left' | 'right') => {
		switch (dir) {
			case 'up': return 'rotate(-90deg)';
			case 'down': return 'rotate(90deg)';
			case 'left': return 'rotate(180deg)';
			case 'right': return 'none';
			default: return 'none';
		}
	};

	const renderMaze = () => {
		if (!maze || maze.length === 0) return null;
		 return (
			 <div
				 className={styles["maze-container"]}
				 style={{
					 gridTemplateRows: `repeat(${maze.length}, ${cellSize}px)`,
					 gridTemplateColumns: `repeat(${maze[0].length}, ${cellSize}px)`,
					 width: maze[0].length * cellSize,
					 height: maze.length * cellSize,
					 margin: 0,
					 padding: 0,
					 boxSizing: "content-box"
				 }}
			 >
				 {maze.map((row, i) =>
					 row.map((cell, j) => {
						 let cellClass = cell === 1 ? styles.path : styles.wall;
						 let content = null;
						 if (i === frogPos[0] && j === frogPos[1]) {
							 cellClass = styles.frog;
							 content = (
								 <img
									 src={frogImg}
									 alt="Frog"
									 className={styles.playerImg}
									 style={{ transform: getRotation(frogDir), width: cellSize - 6, height: cellSize - 6 }}
								 />
							 );
						 } else if (i === endPos[0] && j === endPos[1]) {
							 cellClass = styles.end;
							 content = <img src={finishImg} alt="Finish" className={styles.playerImg} style={{ width: cellSize - 6, height: cellSize - 6 }} />;
						 }
						 return (
							 <div
								 key={`${i}-${j}`}
								 className={`${styles.cell} ${cellClass}`}
								 style={{ width: cellSize, height: cellSize, margin: 0, padding: 0 }}
							 >
								 {content}
							 </div>
						 );
					 })
				 )}
			 </div>
		 );
	};

	return (
		 <div
			 ref={gameRef}
			 tabIndex={0}
			 className={styles.gameRoot}
			 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 0, margin: 0, background: '#111' }}
			 onClick={() => gameRef.current?.focus()}
		 >
					 {screen === 'start' && (
						 <FrogMazeStartScreen
							 selectedPlayer={selectedPlayer}
							 setSelectedPlayer={setSelectedPlayer}
							 difficulty={difficulty}
							 setDifficulty={setDifficulty}
							 environment={environment}
							 setEnvironment={setEnvironment}
							 onStart={() => setScreen('game')}
						 />
					 )}
					 {screen === 'game' && (
						 error ? (
							 <div style={{ color: "red" }}>{error}</div>
						 ) : (
							 <FrogMazeGameScreen
								 renderMaze={renderMaze}
								 win={false}
								 selectedPlayer={selectedPlayer}
							 />
						 )
					 )}
					 {screen === 'win' && (
						 <FrogMazeWinScreen
							 onRestart={() => {
								 // Reset maze and go to start screen
								 const options: MazeOptions = {
									 rows,
									 cols,
									 complexity,
									 start: [1, 1],
									 end: [rows - 2, cols - 2],
								 };
								 setMaze(generateMaze(options));
								 setFrogPos([1, 1]);
								 setEndPos([rows - 2, cols - 2]);
								 setFrogDir('down');
								 setScreen('start');
							 }}
						 />
					 )}
		 </div>
	);
};

export default FrogMazeGame;
