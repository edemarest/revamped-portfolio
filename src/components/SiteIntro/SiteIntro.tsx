import styles from './SiteIntro.module.css'
import { FaHandSparkles, FaGraduationCap } from 'react-icons/fa'

const SiteIntro = () => (
    <section className={`${styles.siteIntro} section`}>
        <div className={styles.bannerText}>
            <div className={styles.bannerHeadline}>
                <FaHandSparkles className={styles.reactIcon} />
                <b>Welcome to my 2025 Portfolio!</b>
            </div>
            <div className={styles.bannerSubtext}>
                <span className={styles.dot}>•</span>
                <FaGraduationCap className={styles.gradIcon} />
                <span className={styles.subText}>
                    Graduating with a B.S. in Computer Science May 2026 &amp; seeking new grad software roles
                </span>
            </div>
        </div>
    </section>
)

export default SiteIntro

