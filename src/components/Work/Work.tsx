import styles from './Work.module.css'
import { useState, useMemo, useEffect } from 'react'
import ProjectCard from './ProjectCard'
import projectData from '../../projects.json'
import Tag from './Tag'
import { FaFilter, FaCode } from 'react-icons/fa'

type MediaItem =
  | { type: "image"; fileSrc: string }
  | { type: "video"; fileSrc: string; poster?: string }
  | { type: "youtube"; id: string }
  | { type: "slides"; id: string }

type Project = {
  id: string
  title: string
  short: string
  details: string
  media?: MediaItem[]
  cover?: string
  link?: string
  tags: string[]
}

// Convert legacy media format to MediaItem[]
function normalizeMedia(media: any): MediaItem[] | undefined {
  if (!media) return undefined;
  // If already in correct format
  if (Array.isArray(media) && typeof media[0] === 'object' && 'type' in media[0]) {
    return media as MediaItem[];
  }
  // If array of strings (legacy)
  if (Array.isArray(media) && typeof media[0] === 'string') {
    return media.map((fileSrc: string) => ({ type: "image", fileSrc }));
  }
  return undefined;
}

const projects: Project[] = projectData.map((p: any) => ({
  ...p,
  media: normalizeMedia(p.media),
  cover: p.cover,
  link: p.link,
  tags: p.tags,
}))

export default function Work() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700)
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  // For mobile, close filter when clicking outside
  useEffect(() => {
    if (!showMobileFilter) return
    const handleClick = (e: MouseEvent) => {
      const el = document.getElementById('mobileTagFilter')
      if (el && !el.contains(e.target as Node)) setShowMobileFilter(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showMobileFilter])

  return (
    <section id="projects" className="section">
      <div className="section-header">
        <h2 className="section-title">
          <FaCode className="section-title-icon" />
          Projects
        </h2>
        <p className="section-body">
          Throughout the years I have worked on dozens of programming projects for school, work, and myself. I have a strong design background and extensive front end experience, but I also love the problem solving and data science knowledge that comes with developing the back end. Though I cannot make some of my best projects public since they are for work, here are a few that I can share. Lately I have been developing in React and am hoping to add more projects soon!
        </p>
        {/* Hide filter subtitle on mobile */}
        {!isMobile && (
          <div className="section-subtitle">
            <FaFilter className="section-subtitle-icon" style={{ color: "#fff" }} />
            <span className="section-subtitle-text" style={{ fontWeight: 700, color: "#fff" }}>
              <b>Filter projects by technology or stack.</b>
            </span>
          </div>
        )}
      </div>
      {isMobile ? (
        <div className={styles.mobileTagBarWrapper}>
          {/* Show selected tags as removable chips when filter bar is closed */}
          {!showMobileFilter && selectedTags.length > 0 && (
            <div className={styles.mobileSelectedTags}>
              {selectedTags.map(tag => (
                <span key={tag} className={styles.mobileSelectedTagChip}>
                  {tag}
                  <button
                    className={styles.mobileTagRemoveBtn}
                    aria-label={`Remove ${tag} filter`}
                    onClick={() => handleTagClick(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <button
            className={styles.mobileTagBarButton}
            onClick={() => setShowMobileFilter(true)}
            aria-label="Filter projects"
            style={{ display: showMobileFilter ? 'none' : 'flex' }}
          >
            <FaFilter style={{ marginRight: 8 }} />
            Filter
          </button>
          <div
            id="mobileTagFilter"
            className={`${styles.mobileTagBar} ${showMobileFilter ? styles.mobileTagBarOpen : ''}`}
            style={{ display: showMobileFilter ? 'block' : 'none' }}
          >
            <div className={styles.mobileTagList}>
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
            <button
              className={styles.mobileTagDone}
              onClick={() => setShowMobileFilter(false)}
            >
              Done
            </button>
          </div>
        </div>
      ) : (
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
      )}
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
