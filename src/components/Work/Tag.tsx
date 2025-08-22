// Tag.tsx
import './Tag.css'
import { tagIconMap } from './TagIcons'

type TagProps = {
  tag: string
  selected?: boolean
  onClick?: () => void
  variant?: 'filter' | 'card' | 'filter-static'
  icon?: React.ReactNode
}

export default function Tag({ tag, icon, variant, selected, onClick }: TagProps) {
  const defaultIcon = tagIconMap[tag]
  const cardClass = variant === 'card' ? 'tag-card tag-card-small' : variant === 'filter' ? 'tag-filter' : ''
  if (variant === "filter-static") {
    return (
      <span className="tag-filter-static">
        {icon && <span className="tag-icon">{icon}</span>}
        {tag}
      </span>
    );
  }
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
