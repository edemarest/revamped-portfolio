import { useEffect, useState } from 'react'
import styles from './Hero.module.css'
import heroGif from '../../assets/hero-bg.gif'
import heroAvatar from '../../assets/hero-avatar.png'
import { FaDownload, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa'

export default function Hero() {
  const taglines = [
    "Specializing in front-end, back-end, and AI-driven systems.",
    "Turning complex problems into clean solutions.",
    "Lover of clean code, cute cats, and beautiful UI."
  ];

  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      setIsTypingDone(true);
    }, 2500); // match typing animation duration
    return () => clearTimeout(typingTimer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1); // Trigger CSS animation
      setTimeout(() => {
        setTaglineIndex((prev) => (prev + 1) % taglines.length);
      }, 300); // Change text at halfway point of animation
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.fadeOverlay} />

      {/* ---- Media Background Layer ---- */}
      <div className={styles.mediaContainer}>
        <img src={heroGif} alt="hero background" className={styles.backgroundGif} />
        <div className={styles.gradientOverlay} />
      </div>

      {/* ---- Avatar Layer ---- */}
      <img src={heroAvatar} alt="Ella Demarest Avatar" className={styles.avatar} />

      {/* ---- Foreground Text ---- */}
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <h1
            className={`${styles.name} ${styles.typing} ${isTypingDone ? styles.done : ''}`}
          >
            ELLA DEMAREST
          </h1>

          <h2 className={`${styles.title} ${isTypingDone ? styles.fadeIn : styles.hidden} animatedGradientText`}>
            Full-Stack Developer
          </h2>

          <div className={styles.subtitleBlock}>
            <p 
              key={animationKey}
              className={`${styles.subtitle} ${styles.taglineTransition}`}
            >
              {taglines[taglineIndex]}
            </p>
          </div>

          <div className={`${styles.connectionButtons} connection-buttons`}>
            <a href="/resume.pdf" className="btn-red-glow" download>
              <FaDownload />
              Resume
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              className="icon-circle"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/yourusername"
              className="icon-circle"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
            <a
              href="https://twitter.com/yourusername"
              className="icon-circle"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
