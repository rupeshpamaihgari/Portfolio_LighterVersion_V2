import useInView from '../hooks/useInView'

const testimonials = [
  {
    name: 'Sienna Hewitt',
    role: 'CEO',
    company: 'Tech Innovations',
    text: 'Working with Rupesh has been a game-changer for our app\'s user experience. The attention to detail and strategic thinking brought our vision to life in ways we hadn\'t imagined.',
    avatar: 'SH',
    color: '#F4A58A',
  },
  {
    name: 'Maria Septimus',
    role: 'Lead Designer',
    company: 'Creative Studio',
    text: 'As a fellow UI/UX designer, I\'m truly impressed by the ability to create visually stunning interfaces. The design system delivered is both beautiful and highly functional.',
    avatar: 'MS',
    color: '#B8D4F8',
  },
  {
    name: 'Joakim Korsgaard',
    role: 'CEO',
    company: 'Tech Innovations',
    text: 'Their innovative UI designs and seamless development have elevated our product to new heights. The process was collaborative, transparent, and delivered on time.',
    avatar: 'JK',
    color: '#B8F4D4',
  },
  {
    name: 'Giana Kenter',
    role: 'Founder',
    company: 'Mobile Dynamics',
    text: 'Their UI/UX designs not only met but exceeded our expectations. Every interaction feels natural and the visual language perfectly captures our brand identity.',
    avatar: 'GK',
    color: '#F8E4A0',
  },
]

// Duplicate for seamless loop
const row1 = [...testimonials, ...testimonials]
const row2 = [...testimonials, ...testimonials]

function TestimonialCard({ item }) {
  return (
    <div
      style={{
        minWidth: '340px',
        maxWidth: '340px',
        background: '#ffffff',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
        marginRight: '16px',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* Stars */}
      <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
        {Array(5).fill(0).map((_, i) => (
          <span key={i} style={{ color: '#F4A58A', fontSize: '14px' }}>★</span>
        ))}
      </div>

      {/* Quote */}
      <p
        style={{
          fontSize: '14px',
          lineHeight: 1.7,
          color: '#444',
          fontWeight: 400,
          marginBottom: '20px',
          letterSpacing: '-0.01em',
        }}
      >
        "{item.text}"
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: item.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
            color: '#333',
            flexShrink: 0,
          }}
        >
          {item.avatar}
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#111', letterSpacing: '-0.01em' }}>
            {item.name}
          </div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '1px' }}>
            {item.role}, {item.company}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  const { ref: headRef } = useInView()

  return (
    <section
      id="testimonials"
      style={{
        paddingTop: '120px',
        paddingBottom: '120px',
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <div
        className="section-container"
        style={{ marginBottom: '56px' }}
      >
        <div ref={headRef} className="reveal">
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
            Testimonials
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <h2
              style={{
                fontSize: 'clamp(30px, 3.5vw, 48px)',
                fontWeight: 650,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#111',
              }}
            >
              Trusted By Professionals
            </h2>
            <p style={{ fontSize: '14px', color: '#888', maxWidth: '360px', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
              Client confidentiality is paramount. These reviews reflect real experiences shared under NDA-protected agreements.
            </p>
          </div>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div
        className="marquee-wrapper"
        style={{
          marginBottom: '16px',
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div
          className="marquee-track animate-marquee-slow"
          style={{ paddingBottom: '4px' }}
        >
          {row1.map((item, i) => (
            <TestimonialCard key={i} item={item} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div
        className="marquee-wrapper"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div
          className="marquee-track animate-marquee-reverse"
          style={{ paddingTop: '4px' }}
        >
          {row2.map((item, i) => (
            <TestimonialCard key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
