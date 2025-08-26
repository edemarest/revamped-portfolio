import { useState, useEffect } from 'react'
import './startscreen.css'
import { AVAILABLE_THEMES } from './theme'

export default function StartScreen({ onStart }: { onStart: (rows: number, cols: number, theme?: string) => void }) {
  const [size, setSize] = useState<number>(11)
  const [theme, setTheme] = useState<string>('forest')

  useEffect(() => {
    // default theme
    setTheme('forest')
  }, [])

  return (
    <div className="ss-root">
      <div className="ss-header">
        <h2 className="ss-title">Maze — find the exit</h2>
        <p className="ss-sub">Choose a theme and grid size, then press Start.</p>
      </div>

      <div className="ss-body">
        <div className="ss-left">
          <div className={`ss-preview ${theme}`}>Preview</div>
        </div>
        <div className="ss-right">
          <div className="ss-row">
            <label className="ss-label">Grid size</label>
            <div className="ss-sizes">
              {[9,11,13,15].map(s => (
                <button key={s} className={`ss-size ${s === size ? 'active' : ''}`} onClick={() => setSize(s)}>{s}×{s}</button>
              ))}
            </div>
          </div>

          <div className="ss-row">
            <label className="ss-label">Theme</label>
            <div className="ss-swatches">
              {AVAILABLE_THEMES.map((t: string) => (
                <button key={t} className={`ss-swatch ${t === theme ? 'selected' : ''}`} onClick={() => setTheme(t)} aria-label={`Theme ${t}`}>
                  <div className={`swatch-thumb ${t}`} />
                  <div className="swatch-label">{t}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="ss-row ss-actions">
            <button className="ss-start" onClick={() => onStart(size, size, theme)}>Start</button>
            <button className="ss-secondary" onClick={() => {
              const s = [9,11,13,15][Math.floor(Math.random()*4)]
              const t = AVAILABLE_THEMES[Math.floor(Math.random()*AVAILABLE_THEMES.length)]
              setSize(s); setTheme(t); onStart(s, s, t)
            }} aria-hidden>Random</button>
          </div>
        </div>
      </div>
    </div>
  )
}
