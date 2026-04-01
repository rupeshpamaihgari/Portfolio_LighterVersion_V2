import useInView from '../hooks/useInView'

const quotes = [
  {
    text: 'Rupesh completely transformed our approach to design. The quality of work and speed of delivery set a new benchmark for our entire team.',
    name: 'Nolan Vaccaro',
    role: 'Director',
    company: 'Continental',
    initials: 'NV',
    color: '#F4A58A',
  },
  {
    text: 'Exceptional problem-solving capabilities combined with a deep understanding of user needs. The ROI on this collaboration was undeniable.',
    name: 'Carla Dorwart',
    role: 'CEO',
    company: 'Levi9',
    initials: 'CD',
    color: '#B8D4F8',
  },
  {
    text: 'The design system delivered by Rupesh became the backbone of our product. It scaled beautifully as we grew from 10 to 200+ engineers.',
    name: 'Justin Rhiel Madsen',
    role: 'Design Director',
    company: '3Lateral',
    initials: 'JM',
    color: '#B8F4D4',
  },
]

export default function CompanySection() {
  const { ref: leftRef }  = useInView()
  const { ref: rightRef } = useInView({ rootMargin: '0px 0px -40px 0px' })

  return (
    <section
      id="company"
      style={{
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
    >
      <div
        className="section-container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
        }}
      >
        {/* LEFT — Big stat */}
        <div ref={leftRef} className="reveal">
          {/* Label */}
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '20px',
            }}
          >
            Impact
          </p>

          {/* Big number */}
          <div
            style={{
              fontSize: 'clamp(80px, 10vw, 130px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              color: '#111',
              marginBottom: '12px',
            }}
          >
            99%
          </div>

          {/* Sub label */}
          <p
            style={{
              fontSize: 'clamp(20px, 2.5vw, 30px)',
              fontWeight: 600,
              letterSpacing: '-0.025em',
              color: '#444',
              lineHeight: 1.3,
              marginBottom: '32px',
              maxWidth: '380px',
            }}
          >
            reduction in hiring costs for design talent
          </p>

          <p
            style={{
              fontSize: '14.5px',
              lineHeight: 1.7,
              color: '#777',
              maxWidth: '380px',
              letterSpacing: '-0.01em',
            }}
          >
            Startups and scale-ups that invest in experienced product design early save significantly on costly redesigns, engineering rework, and failed product launches.
          </p>

          {/* Accent bar */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              marginTop: '36px',
            }}
          >
            {['#F4A58A', '#B8D4F8', '#B8F4D4', '#F8E4A0'].map((color, i) => (
              <div
                key={i}
                style={{
                  height: '4px',
                  flex: i === 0 ? '3' : '1',
                  borderRadius: '2px',
                  background: color,
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — Quotes */}
        <div
          ref={rightRef}
          className="reveal"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}
        >
          {quotes.map((quote, index) => (
            <div key={quote.name}>
              {/* Divider */}
              {index === 0 && (
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)', marginBottom: '28px' }} />
              )}

              <div
                style={{
                  paddingBottom: '28px',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(6px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)' }}
              >
                {/* Quote text */}
                <p
                  style={{
                    fontSize: '14.5px',
                    lineHeight: 1.7,
                    color: '#444',
                    fontWeight: 400,
                    marginBottom: '16px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  "{quote.text}"
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: quote.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#333',
                      flexShrink: 0,
                    }}
                  >
                    {quote.initials}
                  </div>
                  <div>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#111', letterSpacing: '-0.01em' }}>
                      {quote.name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#888', marginLeft: '6px' }}>
                      — {quote.role}, {quote.company}
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)', marginBottom: '28px' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
