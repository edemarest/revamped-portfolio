import React, { useMemo, useState } from 'react';
import Slider from 'react-slick';
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
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

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
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const settings = useMemo(() => ({
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    swipe: true,
    touchMove: true,
    lazyLoad: 'ondemand' as const,
    className: styles.slickSlider,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
    appendDots: (dots: React.ReactNode) => <ul className={styles.slickDots}>{dots}</ul>,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
  }), [isMobile]);

  if (loading) {
    return <div className={styles.carouselWrapper}>Loading models...</div>;
  }

  if (isMobile) {
    return <MobileModelViewer models={models} />;
  }

  // Calculate indices for left, center, right
  const leftIdx = (currentSlide - 1 + models.length) % models.length;
  const rightIdx = (currentSlide + 1) % models.length;

  return (
    <div style={{ position: 'relative' }}>
      {/* Absolutely positioned ModelViewer over the center slide */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          width: '380px',
          height: '380px',
          pointerEvents: 'auto'
        }}
        className={styles.centerSlide}
      >
        <ErrorBoundary>
          <React.Suspense fallback={<img src={models[currentSlide].thumbnail} alt={models[currentSlide].url} className={styles.staticImg} />}>
            <ModelViewer
              modelPath={models[currentSlide].url}
              cameraConfig={models[currentSlide].camera}
              scale={models[currentSlide].scale}
            />
          </React.Suspense>
        </ErrorBoundary>
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
        {/* Center Slide (empty, just for layout) */}
        <div className={styles.centerSlide} style={{ opacity: 0, pointerEvents: 'none' }}>
          {/* Empty, ModelViewer is absolutely positioned above */}
        </div>
        {/* Right Slide (static image only, clickable) */}
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
    </div>
  );
};

export default ModelsCarousel;