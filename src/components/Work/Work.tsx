import styles from './Work.module.css'
import { useState } from 'react'

type Project = {
  id: string
  title: string
  short: string
  details: string
  image?: string
  videoUrl?: string
  link?: string
}

const projects: Project[] = [
  {
    id: 'chatbot',
    title: 'AI Chatbot',
    short: 'Conversational assistant using OpenAI APIs.',
    details: 'Built with Node.js, Express, and OpenAI, this chatbot supports contextual memory and dynamic prompt chaining.',
    link: 'https://github.com/example/chatbot'
  },
  {
    id: 'dashboard',
    title: 'Admin Dashboard',
    short: 'Visual dashboard for user and task management.',
    details: 'Built in React with Chart.js and Firebase integration.',
    image: '/assets/dashboard.png'
  },
  {
    id: 'generator',
    title: 'Image Generator',
    short: 'Text-to-image project using stable diffusion.',
    details: 'Built with Python and Flask backend.',
    videoUrl: 'https://www.youtube.com/embed/example'
  }
]

export default function Work() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  const getCardStyles = (projectId: string, index: number) => {
    if (!expandedId) return { order: index }
    
    if (projectId === expandedId) {
      // Expanded card should appear first (order 0) and span full width
      return { 
        order: 0,
        gridColumn: '1 / -1'
      }
    } else {
      // ALL other cards get pushed below the expanded card
      return { order: 100 + index }
    }
  }

  return (
    <section id="projects" className={styles.work}>
      <h2 className="section-header">Projects</h2>
      <div className={styles.cardGrid}>
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`${styles.card} ${
              expandedId === project.id ? styles.expanded : ''
            }`}
            style={getCardStyles(project.id, index)}
            onClick={() => toggleExpand(project.id)}
          >
            <h3>{project.title}</h3>
            <p>{project.short}</p>

            {expandedId === project.id && (
              <div className={styles.details}>
                <button
                  className={styles.close}
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpandedId(null)
                  }}
                >
                  ✕
                </button>

                <p>{project.details}</p>

                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className={styles.projectImage}
                  />
                )}

                {project.videoUrl && (
                  <div className={styles.videoWrapper}>
                    <iframe
                      src={project.videoUrl}
                      title={project.title}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
