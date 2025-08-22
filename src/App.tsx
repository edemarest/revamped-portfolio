import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Work from './components/Work/Work'
import Showcase from './components/Showcase/Showcase'
import Art from './components/Art/Art'
import ModelsSection from './components/Models/ModelsSection'
import About from './components/About/About'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <div className="body-gradient-line" />
      <div style={{ flex: 1 }}>
        <Work />
        <Showcase />
        <ModelsSection />
        <Art />
        <About />
      </div>
      <Footer />
    </div>
  )
}

export default App
