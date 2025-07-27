import styles from './Work.module.css'
import { useState, useMemo } from 'react'
import ProjectCard from './ProjectCard'
import { tagIconMap } from './TagIcons'
import projectData from '../../projects.json'
import Tag from './Tag'

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
    <section id="projects" className={styles.work}>
      <h2 className="section-header">Projects</h2>
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
