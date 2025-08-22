import ModelsCarousel from './ModelsCarousel';
import Tag from '../Work/Tag';
import { FaTools, FaCube } from 'react-icons/fa';
import { SiBlender, SiAdobe } from 'react-icons/si';
import { GiStoneBlock } from 'react-icons/gi';
import { SiRoblox } from 'react-icons/si';
import styles from './ModelsSection.module.css';

const modelTags = [
  { label: "Blender", icon: <SiBlender /> },
  { label: "Substance Painter", icon: <SiAdobe /> },
  { label: "ZBrush", icon: <GiStoneBlock /> },
  { label: "Roblox Studio", icon: <SiRoblox /> }
];

export default function ModelsSection() {
  return (
    <section id="models" className="section">
      <div className="section-header">
        <h2 className="section-title">
          <FaCube className="section-title-icon" />
          3D Models
        </h2>
        <p className="section-body">
          I am advanced at modeling and texturing 3D assets and do commissions for them as well as sell wearable assets on the Roblox Marketplace. I have extensive experience creating both stylized and realistic clothing, character accessories, environment assets, vehicles, and more.
        </p>
        <div className={styles.sectionSubtitleTech}>
          <FaTools className={styles.sectionSubtitleIcon} />
          <span className={styles.sectionSubtitleText}>
            <b style={{ color: "#fff" }}>Applications</b>
          </span>
        </div>
        <div className={styles.tagBar}>
          {modelTags.map(tag => (
            <Tag
              key={tag.label}
              tag={tag.label}
              icon={tag.icon}
              variant="filter-static" // static filter style
            />
          ))}
        </div>
      </div>
      <ModelsCarousel />
    </section>
  );
}