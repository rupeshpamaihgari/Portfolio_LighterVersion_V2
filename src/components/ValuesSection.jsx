import { useState } from 'react'
import useInView from '../hooks/useInView'

const values = [
  {
    title: 'Embrace Challenges',
    description:
      'I view every obstacle as a challenge to be conquered, never a reason to lose confidence.',
    icon: '💪',
    color: '#F4A58A',
  },
  {
    title: 'Never Stop Learning',
    description:
      'Growth is a daily habit. I dedicate one hour every day to learning something new.',
    icon: '📚',
    color: '#B8D4F8',
  },
  {
    title: 'Creative Excellence',
    description:
      'I strive to stand out by finding creative solutions to complex problems. My international hackathon wins are proof of that.',
    icon: '✨',
    color: '#B8F4D4',
  },
  {
    title: 'Be Transparent',
    description:
      'Whether personally or professionally, transparency simplifies life. Clarity creates trust.',
    icon: '🔍',
    color: '#F8E4A0',
  },
]

function ValueCard({ value, delay }) {
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
      {/* Icon circle */}
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background: value.color + '33',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          marginBottom: '20px',
          flexShrink: 0,
        }}
      >
        {value.icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 650,
          letterSpacing: '-0.02em',
          color: '#111',
          marginBottom: '12px',
        }}
      >
        {value.title}
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
        {value.description}
      </p>

      {/* Bottom accent line */}
      <div
        style={{
          height: '3px',
          borderRadius: '2px',
          background: value.color,
          marginTop: '24px',
          width: '32px',
        }}
      />
    </div>
  )
}

export default function ValuesSection() {
  const { ref: headRef } = useInView()

  return (
    <section
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
            Values
          </p>
          <h2
            style={{
              fontSize: 'clamp(30px, 3.5vw, 48px)',
              fontWeight: 650,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#111',
            }}
          >
            The code I live by
          </h2>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gap: '16px',
          }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {values.map((value, index) => (
            <ValueCard key={value.title} value={value} delay={index * 80} />
          ))}
        </div>
      </div>
    </section>
  )
}
