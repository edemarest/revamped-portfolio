import { useState, useEffect } from 'react'
import './startscreen.css'
import { AVAILABLE_THEMES } from './theme'

export default function StartScreen({ onStart, selectedAvatar, onSelectAvatar }: { onStart: (rows: number, cols: number, theme?: string, avatarId?: string) => void, selectedAvatar?: string | null, onSelectAvatar?: (a: string) => void }) {
  const [size, setSize] = useState<number>(11)
  const [theme, setTheme] = useState<string>('forest')

  const AVATARS = ['frog','armadillo','dragonfly']

  function assetUrl(name: string){
  try { return new URL(`../../assets/game-assets/maze-game/${name}.png`, import.meta.url).href }
  catch {}
  try { return new URL(`../../assets/game-assets/maze-game/${name}.svg`, import.meta.url).href }
  catch { return '' }
  }

  useEffect(() => {
    // default theme
    setTheme('forest')
  }, [])

  return (
    <div className="ss-root">
      <div className="ss-header">
        <h2 className="ss-title">Wild Paths</h2>
        <p className="ss-sub">Play as an animal and traverse different terrains — pick a theme and grid size, then press Start.</p>
      </div>

      <div className="ss-topbar">
        <div className="ss-topbar-inner">
          <div className="ss-grid-label">Difficulty</div>
          <div className="ss-sizes">
            {[7,9,11,13,15].map(s => {
              const difficulty = s <= 9 ? 'easy' : s <= 11 ? 'medium' : 'hard'
              return (
                <button
                  key={s}
                  type="button"
                  className={`ss-size difficulty-${difficulty} ${s === size ? 'active' : ''}`}
                  onClick={() => setSize(s)}
                  aria-pressed={s === size}
                >{s}×{s}</button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="ss-body">
        <div className="ss-left">
          {(() => {
            const previewAvatar = assetUrl((selectedAvatar || 'frog'))
            return (
              <div className={`ss-preview ${theme}`}>
                {/* avatar overlay top-right */}
                <div className="preview-avatar" style={previewAvatar ? { backgroundImage: `url(${previewAvatar})` } : undefined} />
                {/* preview badge bottom-left */}
                <div className="preview-overlay"><div className="preview-text">Preview</div></div>
              </div>
            )
          })()}
        </div>
        <div className="ss-right">
          {/* grid size moved to top bar */}

          <div className="ss-row">
            <label className="ss-label">Theme</label>
            <div className="ss-swatches">
              {AVAILABLE_THEMES.map((t: string) => (
                <button key={t} className={`ss-swatch ${t === theme ? 'selected' : ''}`} onClick={() => setTheme(t)} aria-label={`Theme ${t}`} aria-pressed={t === theme}>
                  <div className={`swatch-thumb ${t}`} />
                  <div className="swatch-label">{t}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="ss-row">
            <label className="ss-label">Avatar</label>
            <div className="ss-swatches">
              {AVATARS.map(a => {
                const src = assetUrl(a)
                const sel = a === (selectedAvatar || 'frog')
                return (
                  <button key={a} type="button" className={`ss-swatch ${sel ? 'selected' : ''}`} onClick={() => onSelectAvatar && onSelectAvatar(a)} aria-label={`Avatar ${a}`} aria-pressed={sel}>
                    <div className={`swatch-thumb avatar-${a}`} style={{ backgroundImage: src ? `url(${src})` : undefined }} />
                    <div className="swatch-label">{a}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="ss-row ss-actions">
            <button className="ss-start" onClick={() => onStart(size, size, theme, (selectedAvatar as unknown) as string | undefined)}>Start</button>
            <button className="ss-secondary" onClick={() => {
              const s = [9,11,13,15][Math.floor(Math.random()*4)]
              const t = AVAILABLE_THEMES[Math.floor(Math.random()*AVAILABLE_THEMES.length)]
              setSize(s); setTheme(t); onStart(s, s, t, (selectedAvatar as unknown) as string | undefined)
            }} aria-hidden>Random</button>
          </div>
        </div>
      </div>
    </div>
  )
}
