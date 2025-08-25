// Utility functions for maze generation
// Maze cell values: 0 = wall, 1 = path

type MazeCell = 0 | 1;

export interface MazeOptions {
	rows: number;
	cols: number;
	complexity?: number; // 0 (easy, open) to 1 (hard, dense)
	branchFactor?: number; // 0 (few branches) to 1 (many branches)
	start?: [number, number];
	end?: [number, number];
}

// Kruskal's algorithm for maze generation
export function generateMaze(options: MazeOptions): MazeCell[][] {
	const {
		rows,
		cols,
		start = [1, 1],
		end = [rows - 2, cols - 2],
	} = options;
	// Ensure odd dimensions for proper maze
	const mazeRows = rows % 2 === 0 ? rows - 1 : rows;
	const mazeCols = cols % 2 === 0 ? cols - 1 : cols;
	const maze: MazeCell[][] = Array.from({ length: mazeRows }, () => Array(mazeCols).fill(0));

	// Kruskal's algorithm for maze generation
	// Each cell is a set, walls are edges
	let sets: number[][] = Array.from({ length: mazeRows }, () => Array(mazeCols).fill(-1));
	let setId = 0;
	// Mark all cells as walls, then mark odd cells as passages and assign set ids
	for (let i = 1; i < mazeRows; i += 2) {
		for (let j = 1; j < mazeCols; j += 2) {
			maze[i][j] = 1;
			sets[i][j] = setId++;
		}
	}
	// List all walls between passages
	let walls: [number, number, number, number][] = [];
	for (let i = 1; i < mazeRows; i += 2) {
		for (let j = 1; j < mazeCols; j += 2) {
			for (const [dx, dy] of [[0, 2], [2, 0]]) {
				const ni = i + dx;
				const nj = j + dy;
				if (ni < mazeRows && nj < mazeCols) {
					walls.push([i, j, ni, nj]);
				}
			}
		}
	}
	// Shuffle walls
	for (let i = walls.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[walls[i], walls[j]] = [walls[j], walls[i]];
	}
	// Kruskal's: remove walls between different sets
	for (const [x1, y1, x2, y2] of walls) {
		if (maze[x2][y2] === 1 && sets[x1][y1] !== sets[x2][y2]) {
			// Remove wall
			maze[(x1 + x2) / 2][(y1 + y2) / 2] = 1;
			// Merge sets
			const oldSet = sets[x2][y2];
			const newSet = sets[x1][y1];
			for (let i = 1; i < mazeRows; i += 2) {
				for (let j = 1; j < mazeCols; j += 2) {
					if (sets[i][j] === oldSet) sets[i][j] = newSet;
				}
			}
		}
	}

	// Ensure start and end are open
	maze[start[0]][start[1]] = 1;
	maze[end[0]][end[1]] = 1;
	return maze;
}
// ...existing code...
// Will move implementation here next.
