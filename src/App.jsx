import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AchievementsSection from './components/AchievementsSection'
import ExperienceSection from './components/ExperienceSection'
import ProjectsSection from './components/ProjectsSection'
import ProjectsSection_2 from './components/ProjectsSection_2'
import TestimonialsSection from './components/TestimonialsSection'
import DesignProcessSection from './components/DesignProcessSection'
import AIProcessSection from './components/AIProcessSection'
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
        <ServicesSection />
        <AchievementsSection />
        <ExperienceSection />
        <ProjectsSection onOpenCaseStudy={() => setShowCaseStudy(true)} />
        <ProjectsSection_2 onOpenCaseStudy={() => setShowCaseStudy(true)} />
        <TestimonialsSection />
        <DesignProcessSection />
        <AIProcessSection />
        <ValuesSection />
        <CompanySection />
        <FAQSection />
        <ContactSection />
      </main>
    </div>
  )
}

export default App
