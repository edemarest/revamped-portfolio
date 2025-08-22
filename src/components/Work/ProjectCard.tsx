
import styles from './ProjectCard.module.css'
import Tag from './Tag'
import { tagIconMap } from './TagIcons'
import { FaSearch } from 'react-icons/fa'
import { useState } from 'react'

type MediaItem = 
  | { type: "image"; fileSrc: string }
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

type Props = {
    project: Project
    isExpanded: boolean
    onOpen: () => void
    onClose: () => void
}

export default function ProjectCard({ project, isExpanded, onOpen, onClose }: Props) {
    const [expandedImgIdx, setExpandedImgIdx] = useState<number | null>(null);

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
                                {project.media?.map((media, i) => {
                                    if (media.type === "image") {
                                        return (
                                            <div key={i} className={styles.imageWrapper}>
                                                <img
                                                    src={media.fileSrc}
                                                    alt={`Screenshot ${i + 1}`}
                                                    className={styles.projectImage}
                                                />
                                                <button
                                                    className={styles.expandImgBtn}
                                                    onClick={() => setExpandedImgIdx(i)}
                                                    aria-label="Expand image"
                                                    type="button"
                                                >
                                                    <FaSearch style={{ verticalAlign: 'middle', fontSize: '1.2rem' }} />
                                                </button>
                                            </div>
                                        );
                                    }
                                    if (media.type === "youtube") {
                                        return (
                                            <div key={i} className={styles.videoWrapper}>
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${media.id}`}
                                                    title={`YouTube video ${i + 1}`}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className={styles.embeddedVideo}
                                                />
                                            </div>
                                        );
                                    }
                                    if (media.type === "slides") {
                                        return (
                                            <div key={i} className={styles.slidesWrapper}>
                                                <iframe
                                                    src={`https://docs.google.com/presentation/d/${media.id}/embed?start=false&loop=false&delayms=3000`}
                                                    title={`Slides ${i + 1}`}
                                                    frameBorder="0"
                                                    allowFullScreen
                                                    className={styles.embeddedSlides}
                                                />
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            <div className={styles.textColumn}>
                                <h3>{project.title}</h3>
                                <div className={styles.cardTags}>
                                    {project.tags.map(tag => (
                                        <span key={tag} className={styles.modalTag}>
                                            {tagIconMap[tag]} {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className={styles.cardDescription}>{project.details}</p>
                            </div>
                        </div>
                        {/* Move View Project button into its own flex row at the bottom of modal */}
                        {project.link && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.viewProjectButton}
                                >
                                    View Project
                                </a>
                            </div>
                        )}
                        {/* Expanded image overlay */}
                        {expandedImgIdx !== null && (
                            <div className={styles.expandedImgOverlay} onClick={() => setExpandedImgIdx(null)}>
                                <div
                                    className={styles.expandedImgContainer}
                                    onClick={e => e.stopPropagation()}
                                >
                                    <img
                                        src={
                                            project.media && expandedImgIdx !== null &&
                                            project.media[expandedImgIdx]?.type === "image"
                                                ? (project.media[expandedImgIdx] as { type: "image"; fileSrc: string }).fileSrc
                                                : ''
                                        }
                                        alt={`Screenshot ${expandedImgIdx !== null ? expandedImgIdx + 1 : ''}`}
                                        className={styles.expandedImg}
                                    />
                                    <button
                                        className={styles.closeExpandedImgBtn}
                                        onClick={() => setExpandedImgIdx(null)}
                                        aria-label="Close expanded image"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
