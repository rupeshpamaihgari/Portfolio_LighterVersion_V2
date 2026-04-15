import { useState, useEffect, useRef } from 'react'
import useInView from '../hooks/useInView'

const tabs = [
  {
    id: 'domains',
    label: 'Domains',
    heading: 'Experienced across different domains',
    subtext: 'From HR automation to public sector infrastructure, I\'ve shipped products that solve real challenges across diverse industries and global user bases.',
    features: [
      'HR Tech & Talent Platforms',
      'Travel & Transportation',
      'Public Sector & Government',
      'Productivity & Enterprise Tools',
      'Gaming & Spatial Computing',
    ],
    background: `
      linear-gradient(to bottom, rgb(234,232,225) 0%, transparent 18%),
      linear-gradient(to right, transparent 50%, rgb(234,232,225) 92%),
      radial-gradient(ellipse at 5% 55%, rgba(200,180,255,0.52) 0%, transparent 55%),
      radial-gradient(ellipse at 78% 42%, rgba(150,220,200,0.38) 0%, transparent 50%),
      rgb(234,232,225)
    `,
    cardBg: 'linear-gradient(135deg, #D4B8F8 0%, #B8D4F8 50%, #E8F4FF 100%)',
    cardIcon: '🌍',
    domainRows: [
      { heading: 'HR Tech',                   chips: ['Contributed to 80% revenue @SenseHQ'],                              color: '#F4A58A' },
      { heading: 'Travel & Transportation',   chips: ['DigiYatra', 'SaS Cargo', 'Singapore Airport', 'Delta Airlines'],   color: '#B8D4F8' },
      { heading: 'Gaming & Spatial Computing',chips: ['3x International Awards', '500K+ User Downloads'],                 color: '#B8F4D4' },
    ],
  },
  {
    id: 'product',
    label: 'Product Design',
    heading: 'Crafting products people love to use',
    subtext: 'From initial concept to pixel-perfect execution, I design intuitive product experiences that balance business goals with genuine user needs.',
    features: [
      'End-to-end product design',
      'Information architecture',
      'Interaction design patterns',
      'Usability testing',
      'Design documentation',
    ],
    background: `
      linear-gradient(to bottom, rgb(234,232,225) 0%, transparent 18%),
      linear-gradient(to right, transparent 50%, rgb(234,232,225) 92%),
      radial-gradient(ellipse at 5% 60%, rgba(255,200,150,0.7) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 40%, rgba(200,180,255,0.45) 0%, transparent 50%),
      rgb(234,232,225)
    `,
    cardBg: 'linear-gradient(135deg, #F4A58A 0%, #F8D4B8 50%, #FFF5EE 100%)',
    cardIcon: '🎨',
    domainRows: [
      { heading: 'Tools Expertise', chips: ['Figma', 'Miro', 'Lovable', 'Claude', 'Cursor', 'NotebookLM', 'Maze', 'ProtoPie'], color: '#F4A58A' },
    ],
  },
  {
    id: 'ux',
    label: 'UX Research',
    heading: 'Understanding users drives every decision',
    subtext: 'Evidence-based research methodologies that uncover deep user insights, validate assumptions, and reduce the risk of building the wrong things.',
    features: [
      'User interviews & surveys',
      'Usability testing',
      'Heuristic evaluation',
      'Persona development',
      'Journey mapping',
    ],
    background: `
      linear-gradient(to bottom, rgb(234,232,225) 0%, transparent 18%),
      linear-gradient(to right, transparent 50%, rgb(234,232,225) 92%),
      radial-gradient(ellipse at 5% 50%, rgba(150,200,255,0.65) 0%, transparent 55%),
      radial-gradient(ellipse at 75% 75%, rgba(180,150,255,0.4) 0%, transparent 50%),
      rgb(234,232,225)
    `,
    cardBg: 'linear-gradient(135deg, #B8D4F8 0%, #D4C5F8 50%, #F0ECFF 100%)',
    cardIcon: '🔍',
    domainRows: [
      { heading: 'Tools and Expertise', chips: ['Usertesting.com', 'Maze', 'Claude', 'NotebookLM', 'Amplitude', 'Sigma', 'Microsoft Clarity'], color: '#B8D4F8' },
    ],
  },
  {
    id: 'leadership',
    label: 'Leadership',
    heading: 'Building and scaling design teams',
    subtext: 'Strategic design leadership that aligns creative vision with business outcomes — mentoring teams, establishing culture, and advocating for design excellence.',
    features: [
      'Design team mentoring',
      'Process & workflow optimization',
      'Design critique facilitation',
      'Stakeholder alignment',
      'Design strategy & vision',
    ],
    background: `
      linear-gradient(to bottom, rgb(234,232,225) 0%, transparent 18%),
      linear-gradient(to right, transparent 50%, rgb(234,232,225) 92%),
      radial-gradient(ellipse at 60% 45%, rgba(255,180,180,0.5) 0%, transparent 50%),
      radial-gradient(ellipse at 5% 70%, rgba(255,220,150,0.5) 0%, transparent 50%),
      rgb(234,232,225)
    `,
    cardBg: 'linear-gradient(135deg, #FFB8B8 0%, #FFD4A0 50%, #FFF5E8 100%)',
    cardIcon: '⚡',
    domainStats: [
      { value: '4',  label: 'Team Size Led' },
      { value: '3',  label: 'Leadership Exp (yrs)' },
    ],
  },
  {
    id: 'system',
    label: 'Design System',
    heading: 'Scalable systems for consistent experiences',
    subtext: 'Comprehensive design systems that empower teams to build faster with consistency — from token architecture to component libraries and governance.',
    features: [
      'Token architecture',
      'Component library design',
      'Documentation & guidelines',
      'Accessibility standards',
      'Multi-platform scaling',
    ],
    background: `
      linear-gradient(to bottom, rgb(234,232,225) 0%, transparent 18%),
      linear-gradient(to right, transparent 50%, rgb(234,232,225) 92%),
      radial-gradient(ellipse at 5% 65%, rgba(180,240,220,0.6) 0%, transparent 55%),
      radial-gradient(ellipse at 72% 40%, rgba(150,200,255,0.45) 0%, transparent 50%),
      rgb(234,232,225)
    `,
    cardBg: 'linear-gradient(135deg, #B8F4D4 0%, #B8E8F8 50%, #EDFFF5 100%)',
    cardIcon: '🧩',
    domainRows: [
      { heading: 'Contributions', chips: ['Navigation', 'Form Components', 'Chart Visualizations'], color: '#B8F4D4' },
      { heading: 'Ownership',     chips: ['AI Components', 'Card Components', 'Slots'],             color: '#B8E8F8' },
    ],
  },
]

const stats = [
  { value: '11+', unit: 'Years', label: 'Experience' },
  { value: '15+', unit: '0→1 SaaS', label: 'Products' },
  { value: '7',   unit: 'Startup Exp', label: '(years)' },
  { value: '4',   unit: 'Enterprise Exp', label: '(years)' },
]

function ServiceCard({ tab }) {
  return (
    <div
      style={{
        background: tab.cardBg,
        borderRadius: '24px',
        padding: '36px',
        minHeight: '340px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          background: 'rgba(255,255,255,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          marginBottom: '20px',
        }}
      >
        {tab.cardIcon}
      </div>

      {/* Middle content — rows+chips, stat tiles, or placeholder bars */}
      {tab.domainRows ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          {tab.domainRows.map((row) => (
            <div key={row.heading}>
              <p style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)',
                marginBottom: '7px',
              }}>
                {row.heading}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {row.chips.map((chip) => (
                  <span key={chip} style={{
                    background: 'rgba(255,255,255,0.72)',
                    border: `1px solid ${row.color}99`,
                    borderRadius: '999px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#333',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                  }}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : tab.domainStats ? (
        <div style={{ display: 'flex', gap: '10px' }}>
          {tab.domainStats.map((s) => (
            <div key={s.label} style={{
              flex: '1 1 0',
              background: 'rgba(255,255,255,0.55)',
              borderRadius: '14px',
              padding: '16px 12px',
              textAlign: 'center',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}>
              <p style={{ fontSize: '24px', fontWeight: 750, color: '#111', letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
                {s.value}
              </p>
              <p style={{ fontSize: '11px', color: '#555', marginTop: '5px', fontWeight: 500 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[90, 70, 55].map((w, i) => (
            <div key={i} style={{ height: '8px', width: `${w}%`, borderRadius: '4px', background: 'rgba(255,255,255,0.6)' }} />
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {[40, 32, 48].map((w, i) => (
              <div key={i} style={{ height: '28px', width: `${w}px`, borderRadius: '8px', background: 'rgba(255,255,255,0.5)' }} />
            ))}
          </div>
        </div>
      )}

      {/* Decorative circles */}
      <div style={{
        position: 'absolute', bottom: '-30px', right: '-30px',
        width: '140px', height: '140px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
      }} />
      <div style={{
        position: 'absolute', top: '-20px', right: '40%',
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
      }} />

      {/* Label — hidden when custom content is present */}
      {!tab.domainRows && !tab.domainStats && <div
        style={{
          marginTop: 'auto',
          paddingTop: '24px',
        }}
      >
        <span
          style={{
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '999px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#333',
          }}
        >
          {tab.label}
        </span>
      </div>}
    </div>
  )
}

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState(0)
  const [headVisible, setHeadVisible] = useState(false)
  const { ref: contentRef } = useInView()

  // Animate heading in after hero CTA buttons finish (~1800ms from mount)
  useEffect(() => {
    const t = setTimeout(() => setHeadVisible(true), 1850)
    return () => clearTimeout(t)
  }, [])

  const tab = tabs[activeTab]

  return (
    <section
      id="services"
      className="services-section"
      style={{
        paddingTop: '56px',
        paddingBottom: '80px',
        background: tab.background,
        transition: 'background 0.8s ease',
      }}
    >
      <div className="section-container">
        {/* Section header — animates in after hero sequence completes */}
        <div
          style={{
            marginBottom: '48px',
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s cubic-bezier(0.33, 1, 0.68, 1), transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)',
          }}
        >
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
            What I Bring to the Table
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
            {tabs.map((t, i) => (
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
                  transition: 'background 0.25s ease, color 0.25s ease, transform 0.15s ease',
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

        {/* Content area */}
        <div
          ref={contentRef}
          className="reveal"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
            marginBottom: '64px',
          }}
        >
          {/* Left — text */}
          <div>
            <h3
              key={tab.heading}
              style={{
                fontSize: 'clamp(24px, 2.8vw, 36px)',
                fontWeight: 650,
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                color: '#111',
                marginBottom: '16px',
                animation: 'fadeInUp 0.4s cubic-bezier(0.33, 1, 0.68, 1) forwards',
              }}
            >
              {tab.heading}
            </h3>
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.7,
                color: '#555',
                marginBottom: '28px',
                letterSpacing: '-0.01em',
              }}
            >
              {tab.subtext}
            </p>

            {/* Feature list */}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tab.features.map((feature) => (
                <li
                  key={feature}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#444',
                    fontWeight: 450,
                  }}
                >
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#111',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      flexShrink: 0,
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — card */}
          <div>
            <ServiceCard tab={tab} key={tab.id} />
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            borderTop: '1px solid rgba(0,0,0,0.1)',
            paddingTop: '40px',
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                textAlign: 'center',
                padding: '20px 16px',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(28px, 3vw, 40px)',
                  fontWeight: 750,
                  letterSpacing: '-0.03em',
                  color: '#111',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: '#888', fontWeight: 500 }}>
                {stat.unit} {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
