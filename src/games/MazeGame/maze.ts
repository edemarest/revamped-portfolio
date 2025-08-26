export type Cell = {
  r: number
  c: number
  walls: { top: boolean; bottom: boolean; left: boolean; right: boolean }
}

export type Maze = {
  rows: number
  cols: number
  grid: Cell[][]
}

// Kruskal's algorithm-based maze generator
export function generateMaze(rows: number, cols: number): Maze {
  // ensure odd sizes for proper walls if desired; but we'll accept any
  const grid: Cell[][] = []
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = []
    for (let c = 0; c < cols; c++) {
      row.push({ r, c, walls: { top: true, bottom: true, left: true, right: true } })
    }
    grid.push(row)
  }

  // Disjoint set for cells
  const parent = new Array(rows * cols).fill(0).map((_, i) => i)
  function find(a: number): number { return parent[a] === a ? a : (parent[a] = find(parent[a])) }
  function union(a: number, b: number) { parent[find(a)] = find(b) }

  type Edge = { a: number, b: number, dir: 'H'|'V', ar: number, ac: number, br: number, bc: number }
  const edges: Edge[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = r * cols + c
      if (c + 1 < cols) edges.push({ a: id, b: id + 1, dir: 'H', ar: r, ac: c, br: r, bc: c + 1 })
      if (r + 1 < rows) edges.push({ a: id, b: id + cols, dir: 'V', ar: r, ac: c, br: r + 1, bc: c })
    }
  }

  // shuffle edges
  for (let i = edges.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = edges[i]; edges[i] = edges[j]; edges[j] = tmp
  }

  for (const e of edges) {
    if (find(e.a) !== find(e.b)) {
      union(e.a, e.b)
      // remove wall between cells
      const A = grid[e.ar][e.ac]
      const B = grid[e.br][e.bc]
      if (e.dir === 'H') {
        A.walls.right = false
        B.walls.left = false
      } else {
        A.walls.bottom = false
        B.walls.top = false
      }
    }
  }

  return { rows, cols, grid }
}
