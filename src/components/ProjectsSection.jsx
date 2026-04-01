import { useState } from 'react'
import useInView from '../hooks/useInView'

const projectTabs = [
  {
    id: 'sensehq',
    label: 'SenseHQ',
    overview:
      "At Sense, I've had the chance to shape 5 out of the 7 core pods — work that powers roughly 80% of the company's revenue. I started as the first designer in India and helped grow a 7-designer org.",
    projects: [
      {
        title: 'Evolution of AI Automation Suites',
        description:
          "I worked on six individual core products, taking each from concept to launch. These weren't just design deliverables — they were full product experiences.",
        tags: ['AI/Agent Design', 'Systems Design', 'UX Strategy'],
        status: 'case-study',
        link: null,
      },
      {
        title: 'Data Management and People Segmentation',
        description:
          'At Sense, data lives in many places — especially across ATS integrations. I helped design tools to tame this complexity.',
        tags: ['Data Design', 'Enterprise UX'],
        status: 'coming-soon',
        link: null,
      },
      {
        title: 'Platform Analytics',
        description:
          "I've led the design for 15 of Sense's 22 dashboards — from recruitment metrics to campaign performance.",
        tags: ['Dashboard Design', 'Data Visualization'],
        status: 'coming-soon',
        link: null,
      },
      {
        title: "'Genesis' Design System",
        description:
          "I am a key contributor to Genesis — Sense's design system. A shared library of components, tokens, and patterns.",
        tags: ['Design System', 'Component Library'],
        status: 'external',
        link: 'https://spaced-out.github.io/ui-design-system/',
      },
      {
        title: 'Website Builder for Sourcing',
        description:
          'Attracting the right talent starts with a great first impression. Companies needed career sites that reflect their brand.',
        tags: ['Website Builder', 'Sourcing'],
        status: 'coming-soon',
        link: null,
      },
    ],
  },
  {
    id: 'betterplace',
    label: 'Betterplace',
    overview:
      "At Betterplace Safety Solutions, I designed for India's blue-collar workforce — building products that matter at scale.",
    projects: [
      {
        title: 'Attendance Mobile App',
        description:
          'A mobile-first attendance tracking solution designed for simplicity and reliability in the field.',
        tags: ['Mobile Design', 'Blue Collar UX'],
        status: 'external',
        link: 'https://drive.google.com/file/d/1UN6BaK7dSt8rmJYjToqBcL2AKPWkUI8y/view?usp=sharing',
      },
      {
        title: 'Attendance Admin Portal',
        description:
          'A comprehensive admin portal for managing workforce attendance at enterprise scale.',
        tags: ['Admin Portal', 'Enterprise UX'],
        status: 'external',
        link: 'https://drive.google.com/file/d/15sQIwlmsFu4vE2eL0k2qlx88zra7964r/view?usp=sharing',
      },
      {
        title: 'Jobs Application',
        description:
          'A job discovery and application platform designed for accessibility and simplicity.',
        tags: ['Job Platform', 'Mobile Design'],
        status: 'external',
        link: 'https://drive.google.com/file/d/1yP_ZKInS5wyR9sSHFiFICL2eZ_piUHel/view?usp=sharing',
      },
      {
        title: 'Employee Background Verification',
        description:
          'Streamlined verification workflows to ensure compliance and trust in workforce management.',
        tags: ['Verification', 'Workflow Design'],
        status: 'coming-soon',
        link: null,
      },
    ],
  },
  {
    id: 'unisys',
    label: 'Unisys',
    overview:
      "At Unisys, I designed for high-stakes travel and logistics — supporting AirSewa, a passenger-facing experience for Indian airports.",
    projects: [
      {
        title: "Indian Airport's AirSewa",
        description:
          'A passenger-facing digital experience for Indian airports, improving traveler satisfaction and operational efficiency.',
        tags: ['Travel UX', 'Government'],
        status: 'viewable',
        link: null,
      },
      {
        title: 'Digipet Mobile App',
        description:
          'A mobile application designed for pet management and digital engagement.',
        tags: ['Mobile Design', 'Consumer App'],
        status: 'viewable',
        link: null,
      },
      {
        title: 'USFN',
        description:
          'An enterprise solution designed for the United States Forensic Network.',
        tags: ['Enterprise UX', 'Forensics'],
        status: 'viewable',
        link: null,
      },
      {
        title: 'SAS Cargo Mobile App',
        description:
          'A cargo tracking and management application for SAS Airlines logistics operations.',
        tags: ['Logistics', 'Mobile Design'],
        status: 'viewable',
        link: null,
      },
    ],
  },
  {
    id: 'arvr',
    label: 'AR/VR',
    overview:
      "AR/VR has always been my playground — where storytelling becomes something you can step into. From hackathons to enterprise prototypes.",
    projects: [
      {
        title: 'Hololens – Automated Home Designer',
        description:
          'A HoloLens experience that lets you design interior spaces in the air — placing furniture at true scale.',
        tags: ['HoloLens', 'Mixed Reality', 'Interior Design'],
        status: 'viewable',
        link: null,
      },
      {
        title: "Bayer's Digital Label",
        description:
          'An intelligent mobile assistant for farmers — built to scan crops, identify diseases, and read product labels using AR.',
        tags: ['AR', 'Agriculture', 'AI'],
        status: 'viewable',
        link: null,
      },
      {
        title: 'Alina – Intelligent Assistant',
        description:
          'A simple AI assistant for smart homes — built to monitor IoT-connected devices, spot issues early, and automate routines.',
        tags: ['IoT', 'Smart Home', 'AI Assistant'],
        status: 'viewable',
        link: null,
      },
      {
        title: 'Accudrive – Driver Assistant',
        description:
          'Inspired by my "Reality Virtually" work on safer roads, Accudrive explored how XR can coach better drivers.',
        tags: ['XR', 'Safety', 'Driver Coaching'],
        status: 'viewable',
        link: null,
      },
      {
        title: 'Game – Where Is My Way',
        description:
          "My game-dev roots still show up here — this project grew from the same competitive energy that helped win HackerEarth's first game dev hackathon.",
        tags: ['Game Dev', 'Unity', 'Creative'],
        status: 'viewable',
        link: null,
      },
    ],
  },
]

function ProjectCard({ project, index, onOpenCaseStudy }) {
  const [hovered, setHovered] = useState(false)
  const isCaseStudy = project.status === 'case-study'
  const isComingSoon = project.status === 'coming-soon'

  const handleClick = () => {
    if (isCaseStudy && onOpenCaseStudy) {
      onOpenCaseStudy()
    } else if (project.link) {
      window.open(project.link, '_blank', 'noopener,noreferrer')
    }
  }

  const getButtonLabel = () => {
    switch (project.status) {
      case 'case-study': return 'Read Case Study'
      case 'external': return 'View Project'
      case 'coming-soon': return 'Coming Soon'
      case 'viewable': return 'View Project'
      default: return 'View'
    }
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '28px 28px',
        boxShadow: hovered && !isComingSoon ? '0 16px 48px rgba(0,0,0,0.1)' : '0 2px 16px rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '24px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: hovered && !isComingSoon ? 'translateY(-2px)' : 'translateY(0)',
        cursor: isComingSoon ? 'default' : 'pointer',
        opacity: isComingSoon ? 0.65 : 1,
      }}
      className="flex-col sm:flex-row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={!isComingSoon ? handleClick : undefined}
    >
      {/* Left — content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Number + Tags row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#ccc',
              letterSpacing: '0.06em',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: '#f5f4f1',
                borderRadius: '999px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 500,
                color: '#555',
                letterSpacing: '-0.01em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 650,
            letterSpacing: '-0.02em',
            color: '#111',
            marginBottom: '8px',
            lineHeight: 1.3,
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.65,
            color: '#666',
            fontWeight: 400,
            letterSpacing: '-0.01em',
          }}
        >
          {project.description}
        </p>
      </div>

      {/* Right — action button */}
      <div style={{ flexShrink: 0, paddingTop: '8px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 500,
            color: isComingSoon ? '#bbb' : '#111',
            border: `1.5px solid ${isComingSoon ? '#e8e8e8' : '#e0e0e0'}`,
            borderRadius: '999px',
            padding: '8px 18px',
            transition: 'border-color 0.2s ease, background 0.2s ease, color 0.2s ease',
            whiteSpace: 'nowrap',
            background: hovered && !isComingSoon ? '#111' : 'transparent',
            ...(hovered && !isComingSoon ? { color: '#fff', borderColor: '#111' } : {}),
          }}
        >
          {getButtonLabel()} {!isComingSoon && <span>{isCaseStudy ? '→' : '↗'}</span>}
        </span>
      </div>
    </div>
  )
}

export default function ProjectsSection({ onOpenCaseStudy }) {
  const [activeTab, setActiveTab] = useState(0)
  const { ref: headRef } = useInView()

  const currentTab = projectTabs[activeTab]

  return (
    <section
      id="projects"
      style={{
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
    >
      <div className="section-container">
        {/* Section header */}
        <div
          ref={headRef}
          className="reveal"
          style={{ marginBottom: '48px' }}
        >
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '12px',
            }}
          >
            Selected Work
          </p>
          <h2
            style={{
              fontSize: 'clamp(30px, 3.5vw, 48px)',
              fontWeight: 650,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#111',
              marginBottom: '32px',
            }}
          >
            Projects
          </h2>

          {/* Tab pills */}
          <div
            style={{
              display: 'inline-flex',
              gap: '6px',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '999px',
              padding: '5px',
              border: '1px solid rgba(0,0,0,0.08)',
              flexWrap: 'wrap',
            }}
          >
            {projectTabs.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(i)}
                style={{
                  background: activeTab === i ? '#111' : 'transparent',
                  color: activeTab === i ? '#fff' : '#555',
                  borderRadius: '999px',
                  padding: '9px 20px',
                  fontSize: '13.5px',
                  fontWeight: activeTab === i ? 600 : 450,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.25s ease, color 0.25s ease',
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== i) {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.06)'
                    e.currentTarget.style.color = '#111'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== i) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#555'
                  }
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div
          key={currentTab.id}
          className="animate-fadeInUp"
        >
          {/* Overview */}
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.7,
              color: '#555',
              maxWidth: '700px',
              marginBottom: '32px',
              letterSpacing: '-0.01em',
            }}
          >
            {currentTab.overview}
          </p>

          {/* Project cards list */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {currentTab.projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                onOpenCaseStudy={onOpenCaseStudy}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
