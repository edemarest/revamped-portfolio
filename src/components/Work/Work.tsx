import styles from './Work.module.css'
import { useState, useMemo } from 'react'
import ProjectCard from './ProjectCard'
import projectData from '../../projects.json'
import Tag from './Tag'
import { FaFilter } from 'react-icons/fa'

type Project = {
  id: string
  title: string
  short: string
  details: string
  media?: string[]
  cover?: string
  link?: string
  tags: string[]
}

const projects: Project[] = projectData.map((p: any) => ({
  ...p,
  media: p.media?.map((m: any) => typeof m === 'string' ? m : m.fileSrc),
}))

export default function Work() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    projects.forEach(p => p.tags.forEach(tag => tagSet.add(tag)))
    return Array.from(tagSet).sort()
  }, [])

  const filteredProjects = useMemo(() => {
    if (!selectedTags.length) return projects
    return projects.filter(p => p.tags.some(tag => selectedTags.includes(tag)))
  }, [selectedTags])

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <section id="projects" className="section">
      <div className="section-header">
        <h2 className="section-title">Projects</h2>
        <p className="section-body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod.
        </p>
        <div className="section-subtitle">
          <FaFilter className="section-subtitle-icon" />
          <span className="section-subtitle-text">
            Filter projects by technology or stack.
          </span>
        </div>
      </div>
      <div className={styles.tagBar}>
        {allTags.map(tag => (
          <Tag
            key={tag}
            tag={tag}
            variant="filter"
            selected={selectedTags.includes(tag)}
            onClick={() => handleTagClick(tag)}
          />
        ))}
      </div>
      <div className={styles.cardGrid}>
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            isExpanded={expandedId === project.id}
            onOpen={() => setExpandedId(project.id)}
            onClose={() => setExpandedId(null)}
          />
        ))}
      </div>
    </section>
  )
}
