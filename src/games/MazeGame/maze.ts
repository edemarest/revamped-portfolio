export type Cell = { r: number; c: number; walls: { top: boolean; left: boolean; right: boolean; bottom: boolean } }
export type Maze = { rows: number; cols: number; grid: Cell[][] }

// Recursive backtracker / DFS maze generator
export function generateMaze(rows = 11, cols = 11): Maze {
  // initialize grid with all walls present
  const grid: Cell[][] = []
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = []
    for (let c = 0; c < cols; c++) {
      row.push({ r, c, walls: { top: true, left: true, right: true, bottom: true } })
    }
    grid.push(row)
  }

  const visited = new Array(rows).fill(0).map(() => new Array(cols).fill(false))

  function neighbors(rr: number, cc: number) {
    const out: Array<[number, number, 'top'|'left'|'right'|'bottom']> = []
    if (rr > 0 && !visited[rr-1][cc]) out.push([rr-1, cc, 'top'])
    if (cc > 0 && !visited[rr][cc-1]) out.push([rr, cc-1, 'left'])
    if (cc < cols-1 && !visited[rr][cc+1]) out.push([rr, cc+1, 'right'])
    if (rr < rows-1 && !visited[rr+1][cc]) out.push([rr+1, cc, 'bottom'])
    return out
  }

  const stack: Array<[number,number]> = []
  let cr = 0, cc = 0
  visited[cr][cc] = true
  stack.push([cr,cc])

  while (stack.length) {
    const [r,c] = stack[stack.length - 1]
    const neigh = neighbors(r,c)
    if (neigh.length === 0) {
      stack.pop()
      continue
    }
    const idx = Math.floor(Math.random() * neigh.length)
    const [nr,nc,dir] = neigh[idx]

    // remove wall between (r,c) and (nr,nc)
    if (dir === 'top') {
      grid[r][c].walls.top = false
      grid[nr][nc].walls.bottom = false
    } else if (dir === 'left') {
      grid[r][c].walls.left = false
      grid[nr][nc].walls.right = false
    } else if (dir === 'right') {
      grid[r][c].walls.right = false
      grid[nr][nc].walls.left = false
    } else if (dir === 'bottom') {
      grid[r][c].walls.bottom = false
      grid[nr][nc].walls.top = false
    }

    visited[nr][nc] = true
    stack.push([nr,nc])
  }

  return { rows, cols, grid }
}

