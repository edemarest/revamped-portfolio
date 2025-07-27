// Tag.tsx
import './Tag.css'
import { tagIconMap } from './TagIcons'

type TagProps = {
  tag: string
  selected?: boolean
  onClick?: () => void
  variant?: 'filter' | 'card' // "filter" = top bar, "card" = project tag
}

export default function Tag({ tag, selected, onClick, variant = 'card' }: TagProps) {
  const icon = tagIconMap[tag]

  return (
    <span
      className={`tag-base ${variant === 'filter' ? 'tag-filter' : 'tag-card'} ${selected ? 'tag-selected' : ''}`}
      onClick={onClick}
    >
      {icon && <span className="tag-icon">{icon}</span>}
      {tag}
    </span>
  )
}
