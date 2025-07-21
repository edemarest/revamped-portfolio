import Masonry from 'react-masonry-css'
import PetPainter from './tools/PetPainter'
import FunFact from './tools/FunFact'
// import other tools...

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1
}

export default function Playground() {
  return (
    <section id="playground" style={{ padding: '2rem' }}>
      <h2>🧪 Playground</h2>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        <FunFact />
        <PetPainter />
      </Masonry>
    </section>
  )
}
