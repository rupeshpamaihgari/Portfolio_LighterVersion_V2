import useInView from '../hooks/useInView'

const testimonials = [
  {
    name: 'Arun Purohit',
    role: 'Co-Founder & Principal Design Officer',
    company: 'iSootra Designs',
    relation: 'Managed Rupesh directly · April 2020',
    text: 'Just a look at his answer sheet convinced me he was a top talent — a unicorn. He mastered UX design fast and scaled superbly by drawing on his motion and animation skills. His contributions across every workflow were top notch. His best work came when we designed a complex heart surgery application.',
    avatar: 'AP',
    color: '#F4A58A',
  },
  {
    name: 'Vamsi Batchu',
    role: 'Sr. Product Design Manager',
    company: 'Rocket',
    relation: 'Worked on the same team · April 2020',
    text: 'Rupesh is one of the most hardworking people I have worked with — highly imaginative, motivated, and goal-oriented. He gets things done no matter how hard they are. He has mastered UX Design, Coding, and Game Development, with a wonderful resume of awards from all over the world. He would be the star of any team he joins.',
    avatar: 'VB',
    color: '#B8D4F8',
  },
  {
    name: 'Alex Rosen',
    role: 'Co-Founder / Product',
    company: 'Sense',
    relation: 'Worked with Rupesh at Sense',
    text: 'Rupesh took our recruiting automation from linear workflows to a fully autonomous agent ecosystem — Grace. Watching a hard-to-fill role go from application to hire in 11 hours, with 50K+ manager hours saved at scale, was the proof. He doesn\'t just design features; he redesigns what\'s possible.',
    avatar: 'AR',
    color: '#B8F4D4',
  },
  {
    name: 'Deepak Panda',
    role: 'Director of Product',
    company: 'Sense',
    relation: 'Worked with Rupesh at Sense',
    text: 'Rupesh was the design backbone of our AI transformation at Sense. From reimagining the workflow canvas to architecting the UX for our entire agent ecosystem, he consistently translated ambiguous product bets into experiences customers loved. His work directly contributed to our 96.6% CSAT and $4.6M post-pilot ARR. A rare designer who thinks in systems and ships with precision.',
    avatar: 'DP',
    color: '#F8E4A0',
  },
]

// Triplicate for a smooth seamless loop with only 2 cards
const row1 = [...testimonials, ...testimonials, ...testimonials]

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
        display: 'flex',
        flexDirection: 'column',
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
          flex: 1,
        }}
      >
        "{item.text}"
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
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
          <div style={{ fontSize: '12px', color: '#555', marginTop: '1px', fontWeight: 500 }}>
            {item.role}, {item.company}
          </div>
          {item.relation && (
            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>
              {item.relation}
            </div>
          )}
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
            Recommendations
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

    </section>
  )
}
