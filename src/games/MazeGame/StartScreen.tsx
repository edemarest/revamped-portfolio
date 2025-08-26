import { useState } from 'react'
import type { ThemeId } from './theme'
import { AVAILABLE_THEMES as THEME_IDS } from './theme'

export default function StartScreen({ onStart }: { onStart: (rows?: number, cols?: number, theme?: ThemeId) => void }) {
  const [theme, setTheme] = useState<ThemeId>('forest')
  return (
    <div style={{ padding: 16, color: '#fff' }}>
      <h3>MazeGame</h3>
      <p>Generate a maze and guide your avatar to the exit.</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => onStart(9, 9, theme)}>Start (9x9)</button>
        <button onClick={() => onStart(11, 11, theme)}>Start (11x11)</button>
        <button onClick={() => onStart(13, 13, theme)}>Start (13x13)</button>
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ marginBottom: 6 }}>Theme</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {THEME_IDS.map(t => (
            <button key={t} onClick={() => setTheme(t as any)} style={{ padding: '6px 10px', background: theme === t ? '#ff7' : '#222', color: '#fff', borderRadius: 6 }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 12, color: '#ddd' }}>
        <small>Tip: use arrow keys or WASD. Smaller maps are easier to test.</small>
      </div>
    </div>
  )
}
