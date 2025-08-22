import styles from './About.module.css'
import FunFactCarousel from './FunFactCarousel'
import type { FunFact } from './FunFactCarousel'
import { FaUserAstronaut, FaLightbulb } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import aboutMe from '../../aboutMe.json'


// Use carouselImages from aboutMe.json
const aboutImages = [
  { src: '/assets/about/me.png', caption: 'Me!' },
  { src: '/assets/about/misty-and-sandy.jpg', caption: 'Misty & Sandy' },
  { src: '/assets/about/walter.jpg', caption: 'Walter' },
  { src: '/assets/about/ember.jpg', caption: 'Ember' }
];

function AboutImageCarousel() {
  const [idx, setIdx] = useState(0)
  const total = aboutImages.length
  const [animIdx, setAnimIdx] = useState(0)
  const [animState, setAnimState] = useState<'in' | 'out'>('in')

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimState('out')
      setTimeout(() => {
        setAnimIdx(i => (i + 1) % total)
        setIdx(i => (i + 1) % total)
        setAnimState('in')
      }, 50)
    }, 4000)
    return () => clearInterval(timer)
  }, [total])

  const showImage = (i: number) => {
    if (i === idx) return
    setAnimState('out')
    setTimeout(() => {
      setAnimIdx(i)
      setIdx(i)
      setAnimState('in')
    }, 400)
  }

  return (
    <div className={styles.aboutImageCarousel}>
      <div className={styles.aboutImageCarouselImagesRow}>
        <div className={styles.aboutImagePreviewBarVertical}>
          {aboutImages.map((img, i) => (
            <button
              key={img.src}
              className={`${styles.aboutImagePreviewBtn} ${i === idx ? styles.aboutImagePreviewBtnActive : ''}`}
              onClick={() => showImage(i)}
              aria-label={`Show image: ${img.caption}`}
              tabIndex={0}
            >
              <img
                src={img.src}
                alt={img.caption}
                className={styles.aboutImagePreviewImgSmall}
              />
            </button>
          ))}
        </div>
        <div className={styles.aboutImageMainCol}>
          <div className={styles.aboutImagePostcard}>
            <div className={styles.aboutImagePostcardBackdrop} />
            <div
              className={
                animState === 'in'
                  ? styles.aboutImagePostcardAnimIn
                  : styles.aboutImagePostcardAnimOut
              }
            >
              <div className={styles.aboutImagePostcardOuter}>
                <img
                  src={aboutImages[animIdx].src}
                  alt={aboutImages[animIdx].caption}
                  className={styles.aboutImage}
                />
                <div className={styles.aboutImageCaption}>
                  {aboutImages[animIdx].caption}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="section">
      <div className={styles.aboutIntroGrid}>
        <div className={styles.introCol}>
          <h2 className="section-title">
            <FaUserAstronaut className="section-title-icon" />
            About Me
          </h2>
          <p className={styles.introBody}>
            I’m Ella! Though I’ve studied and worked all over the place the past few years, I’m originally from San Diego, California. Boston has become my home during college, but after spending a summer in New York for my internship at Regeneron, I’ve found myself torn between two cities I love. I don’t yet know where I’ll end up, but I know I thrive in places full of energy, creativity, and innovation.<br /><br />
            Ever since I was young, I’ve been drawn to making things—whether that’s coding an app, designing an interface, or experimenting with new tech. That curiosity has carried me through projects ranging from building a conversational engine at Northeastern’s IoT Lab, to full-stack development at Regeneron, to bioinformatics at Remix Therapeutics. I love starting with an idea, grinding through the details, and seeing something come to life end-to-end.<br /><br />
            Even though much of my work involves sitting at a computer, I spend a lot of time outside. I walk everywhere—not just for the steps, but because I play Pokémon Go. It keeps me exploring new neighborhoods, and I’ve hit level 50 while joining a weekly Cambridge walking group. I also take health and fitness seriously, working out six days a week, but balance it with my favorite ritual: trying a new dessert every Saturday. (Right now, edible cookie dough from Little Miss Cupcape is undefeated.)<br /><br />
            At the end of the day, I’m happiest when I’m building—projects, experiences, or connections—and finding little ways to make each week an adventure.
          </p>
        </div>
        <div className={styles.skillsCol}>
          <div className={styles.sectionBlock}>
            <h3 className={styles.colHeading} style={{ marginBottom: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.6em', paddingBottom: '0.5em' }}>
              <FaLightbulb style={{ color: 'var(--color-accent)', fontSize: '1.3em' }} />
              Fun Facts
            </h3>
            <div
              id="funfacts-collapse"
              className={styles.collapsibleSection}
              style={{
                maxHeight: 'none',
                overflow: 'visible',
                transition: 'none'
              }}
            >
              <FunFactCarousel funFacts={aboutMe.funFacts as FunFact[]} intervalMs={5000} />
            </div>
          </div>
          <AboutImageCarousel />
        </div>
      </div>
    </section>
  )
}