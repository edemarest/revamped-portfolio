import { useEffect, useState } from 'react'
import styles from './Hero.module.css'
import heroGif from '../../assets/hero-bg.gif'
import heroAvatar from '../../assets/hero-avatar.png'
import { FaDownload, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa'
import bipLogo from '../../assets/company-logos/bip-logo.png'
import regeneronLogo from '../../assets/company-logos/regeneron-logo.png'
import remixLogo from '../../assets/company-logos/remix-logo.png'
import vueLogo from '../../assets/company-logos/vue-logo.svg'

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
      <div className={styles.avatarRedBlend} />
      <div className={styles.fadeOverlay} />

      {/* ---- Media Background Layer ---- */}
      <div className={styles.mediaContainer}>
        <img src={heroGif} alt="hero background" className={styles.backgroundGif} />
        <div className={styles.gradientOverlay} />
      </div>

      {/* ---- Avatar Layer ---- */}
      <img src={heroAvatar} alt="Ella Demarest Avatar" className={styles.avatar} />

      {/* ---- Company Diamond Logos ---- */}
      <div className={styles.companyDiamondContainer}>
        {/* <div className={styles.companyLabel}>Companies I’ve Worked With</div> */}
        <div className={styles.companyDiamond}>
          <a href="https://remix.com" target="_blank" rel="noopener noreferrer" className={styles.companyLogo}>
            <img src={remixLogo} alt="Remix Therapeutics" />
          </a>
          <a href="https://vue.com" target="_blank" rel="noopener noreferrer" className={styles.companyLogo}>
            <img src={vueLogo} alt="Vue Health" />
          </a>
          <a href="https://bip.com" target="_blank" rel="noopener noreferrer" className={styles.companyLogo}>
            <img src={bipLogo} alt="BIP" />
          </a>
          <a href="https://regeneron.com" target="_blank" rel="noopener noreferrer" className={styles.companyLogo}>
            <img src={regeneronLogo} alt="Regeneron" />
          </a>
        </div>
      </div>

      {/* ---- Foreground Text ---- */}
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <h1
            className={`${styles.name} ${styles.typing} ${isTypingDone ? styles.done : ''}`}
          >
            ELLA DEMAREST
          </h1>

          <h2 className={`${styles.title} ${isTypingDone ? styles.fadeIn : styles.hidden} ${styles.staticGradientText}`}>
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
            <a href="/resume.pdf" className={styles.circleGradientButton} download>
              <FaDownload className={`animatedGradientText ${styles.circleGradientIcon}`} />
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              className={styles.circleGradientButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className={`animatedGradientText ${styles.circleGradientIcon}`} />
            </a>
            <a
              href="https://github.com/yourusername"
              className={styles.circleGradientButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className={`animatedGradientText ${styles.circleGradientIcon}`} />
            </a>
            <a
              href="https://twitter.com/yourusername"
              className={styles.circleGradientButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className={`animatedGradientText ${styles.circleGradientIcon}`} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
