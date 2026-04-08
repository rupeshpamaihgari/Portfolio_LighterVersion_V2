import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AchievementsSection from './components/AchievementsSection'
import ExperienceSection from './components/ExperienceSection'
import ProjectsSection from './components/ProjectsSection'
import TestimonialsSection from './components/TestimonialsSection'
import DesignProcessSection from './components/DesignProcessSection'
import ServicesSection from './components/ServicesSection'
import ValuesSection from './components/ValuesSection'
import CompanySection from './components/CompanySection'
import FAQSection from './components/FAQSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import CaseStudyPage from './components/CaseStudy/CaseStudyPage'

function App() {
  const [showCaseStudy, setShowCaseStudy] = useState(false)

  if (showCaseStudy) {
    return <CaseStudyPage onClose={() => setShowCaseStudy(false)} />
  }

  return (
    <div
      style={{
        background: 'rgb(234,232,225)',
        minHeight: '100vh',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <Navbar />
      <main>
        <Hero />
        <ExperienceSection />
        <AchievementsSection />
        <ProjectsSection onOpenCaseStudy={() => setShowCaseStudy(true)} />
        <TestimonialsSection />
        <DesignProcessSection />
        <ServicesSection />
        <ValuesSection />
        <CompanySection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
