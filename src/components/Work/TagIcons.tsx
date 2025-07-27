import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDiscord,
  faNodeJs,
  faReact,
  faPython,
  faJava,
  faJs,
} from '@fortawesome/free-brands-svg-icons'
import {
  faFlask,
  faServer as faExpress,
  faLeaf
} from '@fortawesome/free-solid-svg-icons'
import { faFire as faFirebase } from '@fortawesome/free-solid-svg-icons'

const tagIconStyle = { marginRight: 6, fontSize: 18, verticalAlign: 'middle' }

export const tagIconMap: Record<string, React.ReactNode> = {
  'Discord SDK': <FontAwesomeIcon icon={faDiscord} style={tagIconStyle} />,
  'Express': <FontAwesomeIcon icon={faExpress} style={tagIconStyle} />,
  'Firebase': <FontAwesomeIcon icon={faFirebase} style={tagIconStyle} />,
  'Flask': <FontAwesomeIcon icon={faFlask} style={tagIconStyle} />,
  'Java': <FontAwesomeIcon icon={faJava} style={tagIconStyle} />,
  'JavaScript': <FontAwesomeIcon icon={faJs} style={tagIconStyle} />,
  'MongoDB': <FontAwesomeIcon icon={faLeaf} style={tagIconStyle} />,
  'Python': <FontAwesomeIcon icon={faPython} style={tagIconStyle} />,
  'React': <FontAwesomeIcon icon={faReact} style={tagIconStyle} />,
  'Node.js': <FontAwesomeIcon icon={faNodeJs} style={tagIconStyle} />
}
