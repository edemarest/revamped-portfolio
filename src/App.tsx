import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Work from './components/Work/Work'
import Showcase from './components/Showcase/Showcase'
import Art from './components/Art/Art'
import ModelsSection from './components/Models/ModelsSection'
import About from './components/About/About'
import Footer from './components/Footer/Footer'



import ModelViewer from './components/Models/ModelViewer';

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="body-gradient-line" />
      <Work />
      <Showcase />
      <Art />
      <ModelsSection />
      <About />
      <Footer />
    </>
  )
}

export default App
