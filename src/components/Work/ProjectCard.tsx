
import styles from './ProjectCard.module.css'
import Tag from './Tag'
import { tagIconMap } from './TagIcons'
import { FaSearch } from 'react-icons/fa'
import { useEffect, useMemo, useState } from 'react'

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
    coverFallback?: string
    link?: string
    tags: string[]
}

type Props = {
    project: Project
    isExpanded: boolean
    onOpen: () => void
    onClose: () => void
}

function buildImageFallbacks(src?: string, explicitFallback?: string): string[] {
    if (!src) return explicitFallback ? [explicitFallback] : [];

    const normalizedSrc = src.split('?')[0];
    const fallbacks: string[] = [];

    if (explicitFallback && explicitFallback !== src) fallbacks.push(explicitFallback);

    if (/\.gif$/i.test(normalizedSrc)) {
        fallbacks.push(src.replace(/\.gif(\?.*)?$/i, '.png$1'));
        fallbacks.push(src.replace(/\.gif(\?.*)?$/i, '.jpg$1'));
        fallbacks.push(src.replace(/\.gif(\?.*)?$/i, '.jpeg$1'));
    } else if (/\.png$/i.test(normalizedSrc)) {
        fallbacks.push(src.replace(/\.png(\?.*)?$/i, '.jpg$1'));
        fallbacks.push(src.replace(/\.png(\?.*)?$/i, '.jpeg$1'));
    } else if (/\.(jpe?g)$/i.test(normalizedSrc)) {
        fallbacks.push(src.replace(/\.(jpe?g)(\?.*)?$/i, '.png$2'));
    }

    return Array.from(new Set(fallbacks)).filter(f => f && f !== src);
}

function getVideoMimeType(src: string): string | undefined {
    const normalized = src.split('?')[0].toLowerCase();
    if (normalized.endsWith('.mp4')) return 'video/mp4';
    if (normalized.endsWith('.webm')) return 'video/webm';
    if (normalized.endsWith('.mov')) return 'video/quicktime';
    return undefined;
}

function FallbackImage(props: {
    src: string
    fallbackSrc?: string
    alt: string
    className?: string
    onClick?: React.MouseEventHandler<HTMLImageElement>
}) {
    const { src, fallbackSrc, alt, className, onClick } = props;
    const fallbacks = useMemo(() => buildImageFallbacks(src, fallbackSrc), [src, fallbackSrc]);
    const [currentSrc, setCurrentSrc] = useState(src);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        setCurrentSrc(src);
        setAttempt(0);
    }, [src]);

    const handleError = () => {
        if (attempt >= fallbacks.length) return;
        const next = fallbacks[attempt];
        setAttempt(attempt + 1);
        setCurrentSrc(next);
    };

    return (
        <img
            src={currentSrc}
            alt={alt}
            className={className}
            loading="lazy"
            onError={handleError}
            onClick={onClick}
        />
    );
}

function renderDetails(details: string, projectId: string) {
    const highlightUrl = projectId === 'lineslight' ? 'https://lineslight.live' : null;

    const withLink = (text: string) => {
        if (!highlightUrl || !text.includes(highlightUrl)) return text;
        const parts = text.split(highlightUrl);
        return (
            <>
                {parts.map((part, idx) => (
                    <span key={idx}>
                        {part}
                        {idx < parts.length - 1 && (
                            <a
                                href={highlightUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.inlineLink}
                            >
                                {highlightUrl}
                            </a>
                        )}
                    </span>
                ))}
            </>
        );
    };

    return details.split('\n').map((line, idx, arr) => (
        <span key={idx}>
            {withLink(line)}
            {idx < arr.length - 1 && <br />}
        </span>
    ));
}

export default function ProjectCard({ project, isExpanded, onOpen, onClose }: Props) {
    const [expandedImgIdx, setExpandedImgIdx] = useState<number | null>(null);
    const isCoverGif = Boolean(project.cover && /\.gif(\?.*)?$/i.test(project.cover));

    return (
        <>
            <div className={styles.card} onClick={onOpen}>
                {project.cover && (
                    <FallbackImage
                        src={project.cover}
                        fallbackSrc={project.coverFallback}
                        alt={project.title}
                        className={
                            isCoverGif
                                ? `${styles.projectCoverImage} ${styles.projectCoverImageCropped}`
                                : styles.projectCoverImage
                        }
                    />
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
                                        const isGif = /\.gif(\?.*)?$/i.test(media.fileSrc);
                                        return (
                                            <div key={i} className={styles.imageWrapper}>
                                                <FallbackImage
                                                    src={media.fileSrc}
                                                    alt={`Screenshot ${i + 1}`}
                                                    className={
                                                        isGif
                                                            ? `${styles.projectMediaImage} ${styles.projectMediaImageCropped}`
                                                            : styles.projectMediaImage
                                                    }
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
                                    if (media.type === "video") {
                                        const mimeType = getVideoMimeType(media.fileSrc);
                                        return (
                                            <div key={i} className={styles.videoWrapper}>
                                                <video
                                                    className={styles.embeddedVideo}
                                                    controls
                                                    playsInline
                                                    preload="metadata"
                                                    poster={media.poster}
                                                >
                                                    <source src={media.fileSrc} type={mimeType} />
                                                </video>
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
                                <p className={styles.cardDescription}>{renderDetails(project.details, project.id)}</p>
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
                                    {project.media &&
                                        expandedImgIdx !== null &&
                                        project.media[expandedImgIdx]?.type === 'image' && (
                                            <FallbackImage
                                                src={(project.media[expandedImgIdx] as { type: 'image'; fileSrc: string }).fileSrc}
                                                alt={`Screenshot ${expandedImgIdx + 1}`}
                                                className={styles.expandedImg}
                                            />
                                        )}
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
