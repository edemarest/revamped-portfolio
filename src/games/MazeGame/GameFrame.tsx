import React from 'react'
import './maze-tokens.css'
import './gameframe.css'

export default function GameFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mg-root">
      <div className="mg-backdrop" aria-hidden />
      <div className="mg-frame">{children}</div>
    </div>
  )
}
