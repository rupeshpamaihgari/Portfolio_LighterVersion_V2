import { useState } from 'react'
import useInView from '../hooks/useInView'

const processSteps = [
  { number: '01', title: 'Research', icon: '🔍', color: '#F4A58A' },
  { number: '02', title: 'Define', icon: '📐', color: '#B8D4F8' },
  { number: '03', title: 'Validate', icon: '✅', color: '#B8F4D4' },
  { number: '04', title: 'Design', icon: '🎨', color: '#F8E4A0' },
  { number: '05', title: 'Prototype', icon: '⚡', color: '#D4C5F8' },
  { number: '06', title: 'Build', icon: '🛠️', color: '#FFB8B8' },
  { number: '07', title: 'QA Test', icon: '🧪', color: '#B8E8F8' },
  { number: '08', title: 'Launch', icon: '🚀', color: '#C8F8B8' },
]

const principles = [
  {
    title: 'Thoughtful',
    description:
      'Innovate with intention. Build simple, delightful experiences through deep user understanding.',
    icon: '💡',
    color: '#F4A58A',
  },
  {
    title: 'Collaborative',
    description:
      'Design thrives through teamwork and critique. Collective intelligence builds better solutions.',
    icon: '🤝',
    color: '#B8D4F8',
  },
  {
    title: 'Scalable',
    description:
      'Design systems, not pages. Build frameworks that adapt from simple tasks to complex workflows.',
    icon: '📐',
    color: '#B8F4D4',
  },
  {
    title: 'Empathetic',
    description:
      "Focus on the \"Why.\" Understand users' goals, motivations, and emotional connections.",
    icon: '❤️',
    color: '#F8E4A0',
  },
]

function StepBadge({ step, delay }) {
  const { ref } = useInView({ rootMargin: '0px 0px -20px 0px' })
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        transitionDelay: `${delay}ms`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: hovered ? step.color + '55' : step.color + '33',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          transition: 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.1)' : 'none',
          cursor: 'default',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {step.icon}
      </div>
      <div style={{ textAlign: 'center' }}>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: '#ccc',
            letterSpacing: '0.06em',
            display: 'block',
            marginBottom: '4px',
          }}
        >
          {step.number}
        </span>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#333',
            letterSpacing: '-0.01em',
          }}
        >
          {step.title}
        </span>
      </div>
    </div>
  )
}

function PrincipleCard({ principle, delay }) {
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
          background: principle.color + '33',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          marginBottom: '20px',
          flexShrink: 0,
        }}
      >
        {principle.icon}
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
        {principle.title}
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
        {principle.description}
      </p>

      {/* Bottom accent line */}
      <div
        style={{
          height: '3px',
          borderRadius: '2px',
          background: principle.color,
          marginTop: '24px',
          width: '32px',
        }}
      />
    </div>
  )
}

export default function DesignProcessSection() {
  const { ref: headRef } = useInView()
  const { ref: processRef } = useInView()

  return (
    <section
      id="design-process"
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
            How I Work
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
            Design Process & Principles
          </h2>
        </div>

        {/* 8-step process */}
        <div
          ref={processRef}
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '48px 36px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
            marginBottom: '64px',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '36px',
              textAlign: 'center',
            }}
          >
            Design Process
          </p>

          {/* Steps grid with arrows */}
          <div
            style={{
              display: 'grid',
              gap: '12px',
              alignItems: 'center',
            }}
            className="grid-cols-4 sm:grid-cols-4 lg:grid-cols-8"
          >
            {processSteps.map((step, index) => (
              <div key={step.number} style={{ position: 'relative' }}>
                <StepBadge step={step} delay={index * 60} />
                {/* Arrow connector (hidden on last item and at row breaks) */}
                {index < processSteps.length - 1 && (
                  <div
                    className="hidden lg:block"
                    style={{
                      position: 'absolute',
                      top: '36px',
                      right: '-10px',
                      color: '#ddd',
                      fontSize: '14px',
                      fontWeight: 300,
                    }}
                  >
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Iterative loop note */}
          <p
            style={{
              fontSize: '12px',
              color: '#bbb',
              textAlign: 'center',
              marginTop: '28px',
              fontStyle: 'italic',
            }}
          >
            ↻ Iterative — revisit any step as insights evolve
          </p>
        </div>

        {/* Design Principles heading */}
        <p
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '28px',
          }}
        >
          Design Principles
        </p>

        {/* Principles grid */}
        <div
          style={{
            display: 'grid',
            gap: '16px',
          }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {principles.map((principle, index) => (
            <PrincipleCard
              key={principle.title}
              principle={principle}
              delay={index * 80}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
