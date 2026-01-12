import { FaBolt } from 'react-icons/fa'
import styles from './ToolsRow.module.css'

const tools = [
  {
    name: 'RBLXStats',
    logo: '/assets/project-logos/rblxstats_logo.png',
    className: styles.rblxstatsButton,
    href: 'https://rblxstats.live',
  },
  {
    name: 'LinesLight',
    logo: '/assets/project-logos/lineslight_logo.png',
    className: styles.lineslightButton,
    href: 'https://lineslight.live',
  },
  {
    name: 'Inkdrop Studio',
    logo: '/assets/project-logos/inkdrop_studio-logo.png',
    className: styles.inkdropButton,
    href: 'https://inkdrop-studio.com',
  },
]

const ToolsRow = () => (
  <section className={styles.toolsRow} aria-label="My Tools and Products">
    <div className={styles.toolsTitle}>
      <FaBolt className={styles.toolsIcon} />
      <span>My Tools &amp; Products:</span>
    </div>
    <div className={styles.toolsList}>
      {tools.map(tool => (
        <a
          key={tool.name}
          href={tool.href}
          className={`${styles.toolButton} ${tool.className}`}
          aria-label={tool.name}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={tool.logo} alt={`${tool.name} logo`} className={styles.toolLogo} loading="lazy" />
        </a>
      ))}
    </div>
  </section>
)

export default ToolsRow
