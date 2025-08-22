import React, { useState, useEffect } from 'react';
import styles from './FunFactCarousel.module.css';

export type FunFact = {
  img: string;
  text: string;
};

function getFunFactGroups(facts: FunFact[], groupSize = 3) {
  const groups = [];
  for (let i = 0; i < facts.length; i += groupSize) {
    groups.push(facts.slice(i, i + groupSize));
  }
  return groups;
}

interface FunFactCarouselProps {
  funFacts: FunFact[];
  intervalMs?: number; // default 5000
}

const FunFactCarousel: React.FC<FunFactCarouselProps> = ({ funFacts, intervalMs = 5000 }) => {
  const funFactGroups = getFunFactGroups(funFacts, 3);
  const [groupIdx, setGroupIdx] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setGroupIdx(idx => (idx + 1) % funFactGroups.length);
        setFadeState('in');
      }, 500);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [funFactGroups.length, intervalMs]);

  return (
    <div className={styles.funFactCarousel}>
      {funFactGroups.map((group, idx) => {
        let groupClass = styles.funFactGroupInactive;
        if (idx === groupIdx && fadeState === 'in') groupClass = styles.funFactGroupFadeIn;
        else if (idx === groupIdx && fadeState === 'out') groupClass = styles.funFactGroupFadeOut;
        return (
          <div
            key={idx}
            className={groupClass}
            aria-hidden={idx !== groupIdx}
          >
            {group.map((fact, i) => (
              <div className={styles.funFactCard} key={i}>
                <img src={fact.img} alt="" className={styles.funFactImg} />
                <span className={styles.funFactText}>{fact.text}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default FunFactCarousel;
