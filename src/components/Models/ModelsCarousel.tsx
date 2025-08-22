import React, { useState } from 'react';
import ModelViewer from './ModelViewer';
import ErrorBoundary from './ErrorBoundary';
import MobileModelViewer from './MobileModelViewer';
import styles from './ModelsCarousel.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaRegHandPointer, FaChevronLeft, FaChevronRight, FaCube } from 'react-icons/fa';

type Model = {
  url: string;
  camera: { position: [number, number, number]; fov: number };
  thumbnail: string;
  tags: string[];
  scale?: number;
};

const ModelsCarousel: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isCompact, setIsCompact] = useState(window.innerWidth <= 700);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [contextLost, setContextLost] = useState(false);

  React.useEffect(() => {
    fetch('/assets/models.json')
      .then(res => res.json())
      .then(data => {
        setModels(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsCompact(window.innerWidth <= 700);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handler for WebGL context loss
  const handleContextLoss = () => setContextLost(true);

  // Reset contextLost when slide changes
  React.useEffect(() => {
    setContextLost(false);
  }, [currentSlide]);

  if (loading) {
    return <div className={styles.carouselWrapper}>Loading models...</div>;
  }

  if (isMobile || isCompact) {
    // Mobile: 1 main image/model, previews below, no arrows
    return (
      <div className={styles.carouselBgWrapper} style={{ position: 'relative' }}>
        <div className={styles.infoBoxMobile}>
          <FaRegHandPointer className={styles.infoIcon} />
          <span className={styles.infoText}>
            Click and drag to rotate and examine the 3D model
          </span>
        </div>
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '380px',
            minWidth: '260px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Main slide only, no arrows */}
          <div className={styles.mobileSlideRow}>
            <div className={styles.centerSlide} style={{ position: 'relative', flex: '1 1 0' }}>
              <ErrorBoundary>
                <React.Suspense fallback={<img src={models[currentSlide].thumbnail} alt={models[currentSlide].url} className={styles.staticImg} />}>
                  <ModelViewer
                    modelPath={models[currentSlide].url}
                    cameraConfig={models[currentSlide].camera}
                    scale={models[currentSlide].scale}
                    onContextLost={handleContextLoss}
                  />
                </React.Suspense>
              </ErrorBoundary>
              <div className={styles.centerPanIcon}>
                <FaCube size={28} />
              </div>
            </div>
          </div>
          {/* Preview thumbnails row */}
          <div className={styles.mobilePreviewRow}>
            {models.map((model, idx) => (
              <button
                key={idx}
                className={`${styles.mobilePreviewThumb} ${idx === currentSlide ? styles.mobilePreviewActive : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Preview model ${idx + 1}`}
              >
                <img src={model.thumbnail} alt={model.url} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate indices for left, center, right
  const leftIdx = (currentSlide - 1 + models.length) % models.length;
  const rightIdx = (currentSlide + 1) % models.length;

  return (
    <div className={styles.carouselBgWrapper} style={{ position: 'relative' }}>
      {/* Info box in top right on desktop */}
      <div className={styles.infoBoxDesktop}>
        <FaRegHandPointer className={styles.infoIcon} />
        <span className={styles.infoText}>
          Click and drag to rotate and examine the 3D model
        </span>
      </div>
      {/* Absolutely positioned ModelViewer over the center slide */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          width: 'var(--center-slide-size)',
          height: 'var(--center-slide-size)',
          pointerEvents: 'auto'
        }}
        className={styles.centerSlide}
      >
        {/* Only show ModelViewer if context is not lost, otherwise show fallback image */}
        {!contextLost ? (
          <ErrorBoundary>
            <React.Suspense fallback={<img src={models[currentSlide].thumbnail} alt={models[currentSlide].url} className={styles.staticImg} />}>
              <ModelViewer
                modelPath={models[currentSlide].url}
                cameraConfig={models[currentSlide].camera}
                scale={models[currentSlide].scale}
                onContextLost={handleContextLoss}
              />
            </React.Suspense>
          </ErrorBoundary>
        ) : (
          <img
            src={models[currentSlide].thumbnail}
            alt={models[currentSlide].url}
            className={styles.staticImg}
            style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }}
          />
        )}
        {/* Overlay rotation/box icon in bottom-right */}
        <div className={styles.centerPanIcon}>
          <FaCube size={28} />
        </div>
      </div>
      {/* Carousel grid for navigation and thumbnails */}
      <div className={styles.customCarousel}>
        {/* Left Arrow */}
        <button
          className={`${styles.carouselArrow} ${styles.left}`}
          aria-label="Previous"
          onClick={() => setCurrentSlide(leftIdx)}
        >
          <FaChevronLeft size={28} />
        </button>
        {/* Left Slide (static image only, clickable) */}
        {!isCompact && (
          <div
            className={styles.sideSlide}
            style={{ cursor: 'pointer' }}
            onClick={() => setCurrentSlide(leftIdx)}
          >
            <img src={models[leftIdx].thumbnail} alt={models[leftIdx].url} className={styles.staticImg} />
            <button
              className={styles.rotateBtn}
              aria-label="Select this model"
              onClick={e => { e.stopPropagation(); setCurrentSlide(leftIdx); }}
            >
              <FaRegHandPointer size={24} />
            </button>
          </div>
        )}
        {/* Center Slide (empty, just for layout) */}
        <div className={styles.centerSlide} style={{ opacity: 0, pointerEvents: 'none' }}>
          {/* Empty, ModelViewer is absolutely positioned above */}
        </div>
        {/* Right Slide (static image only, clickable) */}
        {!isCompact && (
          <div
            className={styles.sideSlide}
            style={{ cursor: 'pointer' }}
            onClick={() => setCurrentSlide(rightIdx)}
          >
            <img src={models[rightIdx].thumbnail} alt={models[rightIdx].url} className={styles.staticImg} />
            <button
              className={styles.rotateBtn}
              aria-label="Select this model"
              onClick={e => { e.stopPropagation(); setCurrentSlide(rightIdx); }}
            >
              <FaRegHandPointer size={24} />
            </button>
          </div>
        )}
        {/* Right Arrow */}
        <button
          className={`${styles.carouselArrow} ${styles.right}`}
          aria-label="Next"
          onClick={() => setCurrentSlide(rightIdx)}
        >
          <FaChevronRight size={28} />
        </button>
      </div>
      {/* Dots navigation */}
      {!isCompact && (
        <ul className={styles.slickDots}>
          {models.map((_, idx) => (
            <li key={idx} className={idx === currentSlide ? styles.activeDot : ''}>
              <button
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setCurrentSlide(idx)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModelsCarousel;