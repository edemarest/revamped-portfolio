import { useState } from 'react'
import type { ThemeId } from './theme'
import StartScreen from './StartScreen'
import GameScreen from './GameScreen'
import EndScreen from './EndScreen'
import GameFrame from './GameFrame'
import type { Maze } from './maze'
import { generateMaze } from './maze'

export default function MazeGame({ onClose }: { onClose?: () => void }) {
  const [phase, setPhase] = useState<'start'|'playing'|'end'>('start')
  const [maze, setMaze] = useState<Maze | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [theme, setTheme] = useState<ThemeId | null>(null)
  const [avatar, setAvatar] = useState<string | null>('frog')

  function startGame(rows = 15, cols = 15, themeId?: string, avatarId?: string) {
    const m = generateMaze(rows, cols)
    setMaze(m)
    setTheme((themeId as ThemeId) || null)
    if (avatarId) setAvatar(avatarId)
    setPhase('playing')
  }

  function endGame(result: any) {
    setStats(result)
    setPhase('end')
  }

  function handleClose() {
    // prefer parent-provided closer, otherwise reset to start
  if (onClose) return onClose()
  // reset all local state so reopening starts fresh
  setMaze(null)
  setStats(null)
  setTheme(null)
  setAvatar('frog')
  setPhase('start')
  }

  function goBackToStart() {
  setMaze(null)
  setStats(null)
  setTheme(null)
  setAvatar('frog')
  setPhase('start')
  }

  return (
    <GameFrame>
      {/* close X visible in all states */}
      <button className="mg-close" onClick={handleClose} aria-label="Close">✕</button>

      {/* optional in-game Quit -> back to start */}
      {phase === 'playing' && (
        <button className="mg-quit" onClick={goBackToStart} aria-label="Quit to start">Quit</button>
      )}

  {phase === 'start' && <StartScreen onStart={startGame} selectedAvatar={avatar} onSelectAvatar={(a) => setAvatar(a)} />}
  {phase === 'playing' && maze && <GameScreen maze={maze} onEnd={endGame} theme={theme ?? 'forest'} avatar={avatar ?? 'frog'} />}
  {phase === 'end' && <EndScreen stats={stats} avatar={avatar ?? 'frog'} onRestart={() => { setMaze(null); setStats(null); setTheme(null); setAvatar('frog'); setPhase('start') }} onClose={handleClose} />}
    </GameFrame>
  )
}
