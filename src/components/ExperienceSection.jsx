import { useState } from 'react'
import useInView from '../hooks/useInView'

const eras = [
  {
    yearRange: '2012–2015',
    title: 'The Spark: Gaming & Empathy',
    description:
      'My passion for design began before I even graduated. Leading a team of four, I developed games that built the foundation of empathetic, user-centered thinking.',
    icon: '🎮',
    color: '#F4A58A',
  },
  {
    yearRange: '2015–2019',
    title: 'Global Scale @ Unisys',
    description:
      'I landed my first role as a UX Designer at Unisys. This was my exposure to the global stage. I had the opportunity to work on enterprise products for international clients.',
    icon: '🌍',
    color: '#B8D4F8',
  },
  {
    yearRange: '2019–2021',
    title: 'Social Impact @ Betterplace',
    description:
      "Joining Betterplace as a Lead Product Designer offered a humbling challenge: designing for India's blue-collar workforce.",
    icon: '🤝',
    color: '#B8F4D4',
  },
  {
    yearRange: '2021 – Present',
    title: 'AI & Automation @ SenseHQ',
    description:
      'I joined Sense as a Lead Product Designer and grew into a Staff Product Designer. Over the last 4 years, I led end-to-end design across multiple products. Most recently, I have been part of the transformation of these tools into AI Agents, evolving the Sense platform.',
    icon: '🤖',
    color: '#F8E4A0',
  },
]

function EraCard({ era, delay }) {
  const { ref } = useInView({ rootMargin: '0px 0px -40px 0px' })
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        transitionDelay: `${delay}ms`,
        background: '#ffffff',
        borderRadius: '20px',
        padding: '32px 28px',
        boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.1)' : '0 2px 16px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Year range kicker */}
      <span
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#ccc',
          letterSpacing: '0.06em',
          marginBottom: '20px',
          display: 'block',
        }}
      >
        {era.yearRange}
      </span>

      {/* Icon circle */}
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background: era.color + '33',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          marginBottom: '20px',
          flexShrink: 0,
        }}
      >
        {era.icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          color: '#111',
          marginBottom: '12px',
        }}
      >
        {era.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '14px',
          lineHeight: 1.65,
          color: '#666',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          flex: 1,
        }}
      >
        {era.description}
      </p>

      {/* Bottom accent line */}
      <div
        style={{
          height: '3px',
          borderRadius: '2px',
          background: era.color,
          marginTop: '24px',
          width: '32px',
        }}
      />
    </div>
  )
}

export default function ExperienceSection() {
  const { ref: headRef } = useInView()

  return (
    <section
      id="experience"
      style={{
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
    >
      <div className="section-container">
        {/* Header */}
        <div
          ref={headRef}
          className="reveal"
          style={{ marginBottom: '64px' }}
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
            Experience
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <h2
              style={{
                fontSize: 'clamp(30px, 3.5vw, 48px)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#111',
              }}
            >
              From Game Worlds to Enterprise Ecosystems
            </h2>
            <p style={{ fontSize: '15px', color: '#777', maxWidth: '400px', lineHeight: 1.65, letterSpacing: '-0.01em' }}>
              If you're wondering how a game developer participating in AR/VR hackathons evolved into a Staff Product Designer...
            </p>
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gap: '16px',
          }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {eras.map((era, index) => (
            <EraCard key={era.yearRange} era={era} delay={index * 80} />
          ))}
        </div>
      </div>
    </section>
  )
}
