import styles from './ProjectCard.module.css'
import Tag from './Tag'
import { tagIconMap } from './TagIcons'

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

type Props = {
    project: Project
    isExpanded: boolean
    onOpen: () => void
    onClose: () => void
}

export default function ProjectCard({ project, isExpanded, onOpen, onClose }: Props) {
    return (
        <>
            <div className={styles.card} onClick={onOpen}>
                {project.cover && (
                    <img src={project.cover} alt={project.title} className={styles.projectImage} />
                )}
                <h3 className={styles.title}>{project.title}</h3>
                <div className={styles.cardTags}>
                    {project.tags.map(tag => (
                        <Tag key={tag} tag={tag} variant="card" />
                    ))}
                </div>
                <p className={styles.cardDescription}>{project.short}</p>
            </div>

            {isExpanded && (
                <div className={styles.modalOverlay} onClick={onClose}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeModal} onClick={onClose}>✕</button>
                        <div className={styles.expandedGrid}>
                            <div className={styles.mediaColumn}>
                                {project.media?.map((src, i) => (
                                    <img key={i} src={src} alt={`Screenshot ${i + 1}`} className={styles.projectImage} />
                                ))}
                            </div>
                            <div className={styles.textColumn}>
                                <h3>{project.title}</h3>
                                <div className={styles.cardTags}>
                                    {project.tags.map(tag => (
                                        <span key={tag} className={styles.tag}>
                                            {tagIconMap[tag]} {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className={styles.cardDescription}>{project.details}</p>
                                {project.link && (
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.viewProjectButton}>
                                        View Project
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
