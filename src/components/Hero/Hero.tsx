import { useEffect, useState } from 'react'
import styles from './Hero.module.css'
import heroGif from '../../assets/hero-bg.gif'
import heroAvatar from '../../assets/hero-avatar.png'
import { FaDownload, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa'
import bipLogo from '../../assets/company-logos/bip-logo.png'
import regeneronLogo from '../../assets/company-logos/regeneron-logo.png'
import remixLogo from '../../assets/company-logos/remix-logo.png'
import vueLogo from '../../assets/company-logos/vue-logo.svg'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

const Hero = () => {
  const taglines = [
    "Game dev roots, full-stack focus",
    "Eye for design, mind for complex systems",
    "Building for others since childhood",
    "Honors CS student at Northeastern"
  ];

  // Typing effect for name
  const fullName = "ELLA DEMAREST";
  const [typedName, setTypedName] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setTypedName(""); // Start immediately
    const typeInterval = setInterval(() => {
      if (i < fullName.length) {
        setTypedName(fullName.substring(0, i + 1));
        i++;
        if (i === fullName.length) {
          clearInterval(typeInterval);
          setTimeout(() => setIsTypingDone(true), 150); // shorter pause
        }
      }
    }, 50); // faster typing

    // Fallback: after 3 seconds, show full name if not done
    const fallbackTimeout = setTimeout(() => {
      setTypedName(fullName);
      setIsTypingDone(true);
      clearInterval(typeInterval);
    }, 3000);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  // Tagline rotation
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const isMobile = useIsMobile();

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
      {/* ---- Red Gradient Avatar Blend (desktop only) ---- */}
      {!isMobile && <div className={styles.avatarRedBlend} />}
      <div className={styles.fadeOverlay} />

      {/* ---- Media Background Layer ---- */}
      <div className={styles.mediaContainer}>
        <img src={heroGif} alt="hero background" className={styles.backgroundGif} loading="eager" />
        <div className={styles.gradientOverlay} />
      </div>

      {/* ---- Avatar Layer ---- */}
      <img src={heroAvatar} alt="Ella Demarest Avatar" className={styles.avatar} loading="eager" />
      {/* ---- Company Logos ---- */}
      {!isMobile && (
        <div className={styles.companyDiamondContainer}>
          <div className={styles.companyDiamond}>
            <a href="https://www.remixtx.com/" target="_blank" rel="noopener noreferrer" className={styles.companyLogo}>
              <img src={remixLogo} alt="Remix Therapeutics" />
            </a>
            <a href="https://vuehealth.com/" target="_blank" rel="noopener noreferrer" className={styles.companyLogo}>
              <img src={vueLogo} alt="Vue Health" />
            </a>
            <a href="https://www.bip-group.com/en-us/" target="_blank" rel="noopener noreferrer" className={styles.companyLogo}>
              <img src={bipLogo} alt="BIP" />
            </a>
            <a href="https://www.regeneron.com/" target="_blank" rel="noopener noreferrer" className={styles.companyLogo}>
              <img src={regeneronLogo} alt="Regeneron" />
            </a>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.textBlock}>
          <h1
            className={`${styles.name} ${styles.typing} ${isTypingDone ? styles.done : ''}`}
            aria-label={fullName}
          >
            {typedName}
          </h1>

          <h2 className={`${styles.title} ${isTypingDone ? styles.fadeIn : styles.hidden} ${styles.staticGradientText}`}>
            Full-Stack Developer
          </h2>

          <div className={styles.subtitleBlock}>
            {!isMobile && (
              <p
                key={animationKey}
                className={`${styles.subtitle} ${styles.taglineTransition}`}
              >
                {taglines[taglineIndex]}
              </p>
            )}
          </div>

          {/* ---- Mobile Company Logos Row ---- */}
          {isMobile && (
            <div className={styles.mobileCompanyLogos} style={{ margin: '0 auto 0.7rem auto' }}>
              <a href="https://www.remixtx.com/" target="_blank" rel="noopener noreferrer" className={styles.companyLogo}>
                <img src={remixLogo} alt="Remix Therapeutics" />
              </a>
              <a href="https://vuehealth.com/" target="_blank" rel="noopener noreferrer" className={styles.companyLogo}>
                <img src={vueLogo} alt="Vue Health" />
              </a>
              <a href="https://www.bip-group.com/en-us/" target="_blank" rel="noopener noreferrer" className={styles.companyLogo}>
                <img src={bipLogo} alt="BIP" />
              </a>
              <a href="https://www.regeneron.com/" target="_blank" rel="noopener noreferrer" className={styles.companyLogo}>
                <img src={regeneronLogo} alt="Regeneron" />
              </a>
            </div>
          )}

          {/* ---- Connection Icons ---- */}
          <div className={`${styles.connectionButtons} connection-buttons`}>
            {/* Resume button with icon and text */}
            <a
              href="/assets/ella_demarest_resume.pdf"
              className={styles.resumeButton}
              download
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FaDownload className={`animatedGradientText ${styles.circleGradientIcon}`} />
              <span className={styles.resumeText}>Resume</span>
            </a>
            <a
              href="https://www.linkedin.com/in/ella-demarest-b48553189/"
              className={styles.circleGradientButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className={`animatedGradientText ${styles.circleGradientIcon}`} />
            </a>
            <a
              href="https://github.com/edemarest"
              className={styles.circleGradientButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className={`animatedGradientText ${styles.circleGradientIcon}`} />
            </a>
            <a
              href="https://twitter.com/PhantomMisty"
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

export default Hero;

