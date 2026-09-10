import styles from './SiteIntro.module.css'
import { FaHandSparkles } from 'react-icons/fa'

const SiteIntro = () => (
    <section className={`${styles.siteIntro} section`}>
        <div className={styles.bannerText}>
            <div className={styles.bannerHeadline}>
                <FaHandSparkles className={styles.reactIcon} />
                <b>Building Scientific Authoring at Eli Lilly's Frontier AI Labs • Based in Boston, MA</b>
            </div>
        </div>
    </section>
)

export default SiteIntro

