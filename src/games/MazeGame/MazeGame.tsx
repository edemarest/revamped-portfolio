import { useState } from 'react'
import type { ThemeId } from './theme'
import StartScreen from './StartScreen'
import GameScreen from './GameScreen'
import EndScreen from './EndScreen'
import GameFrame from './GameFrame'
import type { Maze } from './maze'
import { generateMaze } from './maze'

export default function MazeGame() {
  const [phase, setPhase] = useState<'start'|'playing'|'end'>('start')
  const [maze, setMaze] = useState<Maze | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [theme, setTheme] = useState<ThemeId | null>(null)

  function startGame(rows = 15, cols = 15, themeId?: string) {
    const m = generateMaze(rows, cols)
    setMaze(m)
    setTheme((themeId as ThemeId) || null)
    setPhase('playing')
  }

  function endGame(result: any) {
    setStats(result)
    setPhase('end')
  }

  return (
    <GameFrame>
      {phase === 'start' && <StartScreen onStart={startGame} />}
      {phase === 'playing' && maze && <GameScreen maze={maze} onEnd={endGame} theme={theme ?? 'forest'} />}
      {phase === 'end' && <EndScreen stats={stats} onRestart={() => { setMaze(null); setStats(null); setPhase('start') }} />}
    </GameFrame>
  )
}
