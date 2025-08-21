// Tag.tsx
import './Tag.css'
import { tagIconMap } from './TagIcons'

type TagProps = {
  tag: string
  selected?: boolean
  onClick?: () => void
  variant?: 'filter' | 'card'
  icon?: React.ReactNode
}

export default function Tag({ tag, selected, onClick, variant = 'card', icon }: TagProps) {
  const defaultIcon = tagIconMap[tag]
  const cardClass = variant === 'card' ? 'tag-card tag-card-small' : variant === 'filter' ? 'tag-filter' : ''
  return (
    <span
      className={`tag-base ${cardClass} ${selected ? 'tag-selected' : ''}`}
      onClick={onClick}
    >
      {(icon ?? defaultIcon) && <span className="tag-icon">{icon ?? defaultIcon}</span>}
      {tag}
    </span>
  )
}
