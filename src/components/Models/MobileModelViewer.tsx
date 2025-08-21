import React, { useState } from 'react';
import styles from './MobileModelViewer.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type Model = {
  url: string;
  thumbnail: string;
  camera: { position: [number, number, number]; fov: number };
  tags: string[];
};

interface Props {
  models: Model[];
}

const MobileModelViewer: React.FC<Props> = ({ models }) => {
  const [current, setCurrent] = useState(0);

  if (!models.length) return null;

  const prevIdx = (current - 1 + models.length) % models.length;
  const nextIdx = (current + 1) % models.length;

  return (
    <div className={styles.carouselWrapper}>
      <button
        className={styles.arrow}
        aria-label="Previous"
        onClick={() => setCurrent(prevIdx)}
      >
        <FaChevronLeft size={22} />
      </button>
      <div className={styles.imageFrame}>
        <img
          src={models[current].thumbnail}
          alt={models[current].url}
          className={styles.image}
        />
      </div>
      <button
        className={styles.arrow}
        aria-label="Next"
        onClick={() => setCurrent(nextIdx)}
      >
        <FaChevronRight size={22} />
      </button>
    </div>
  );
};

export default MobileModelViewer;
