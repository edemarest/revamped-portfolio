import React, { useEffect } from 'react'
import './maze-tokens.css'
import './gameframe.css'

export default function GameFrame({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div className="mg-root" role="dialog" aria-modal="true">
      <div className="mg-backdrop" aria-hidden />
      <div className="mg-frame">{children}</div>
    </div>
  )
}
