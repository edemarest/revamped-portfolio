import styles from './SiteIntro.module.css'
import { FaHandSparkles } from 'react-icons/fa'

const SiteIntro = () => (
    <section className={`${styles.siteIntro} section`}>
        <div className={styles.bannerText}>
            <div className={styles.bannerHeadline}>
                <FaHandSparkles className={styles.reactIcon} />
                <b>Full-stack AI engineer • Start within 3 weeks of offer • Relocating to SF Bay Area</b>
            </div>
        </div>
    </section>
)

export default SiteIntro

