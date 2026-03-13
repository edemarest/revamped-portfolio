import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import SiteIntro from './components/SiteIntro/SiteIntro'
import ToolsRow from './components/ToolsRow/ToolsRow'
import Work from './components/Work/Work'
import Showcase from './components/Showcase/Showcase'
import Art from './components/Art/Art'
import ModelsSection from './components/Models/ModelsSection'
import About from './components/About/About'
import Footer from './components/Footer/Footer'
import Skills from './components/Skills/Skills'
import FloatingEmailButton from './components/FloatingEmailButton/FloatingEmailButton'
import { ConsentBanner } from './components/ConsentBanner'
import { useVisitorTracking } from './hooks/useVisitorTracking'

function App() {
  useVisitorTracking()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ConsentBanner />
      <Navbar />
      <Hero />

      <div className="body-gradient-line" />
      <div style={{ flex: 1 }}>
        <SiteIntro />
        <ToolsRow />
        <Work />
        <div id="skills">
          <Skills />
        </div>
        <Showcase />
        <ModelsSection />
        <Art />
        <About />
      </div>
      <Footer />
      <FloatingEmailButton />
    </div>
  )
}

export default App
