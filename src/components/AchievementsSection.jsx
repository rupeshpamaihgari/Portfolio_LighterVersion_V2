import { useRef } from 'react'
import useInView from '../hooks/useInView'

const achievements = [
  {
    year: '2019',
    location: 'Boston, MA',
    title: 'Winner: MIT "Reality Virtually" Hackathon',
    challenge: 'How can we make roads safer?',
    solution: 'AR/VR solution to solve high-demand use cases: helping people drive better, automating road safety tasks.',
    link: 'https://devpost.com/software/accudrive',
    linkLabel: 'View on Devpost',
    color: '#F4A58A',
    icon: '🏆',
  },
  {
    year: '2022',
    location: null,
    title: 'Winner: Bayer Integrated Digital Label Hackathon',
    challenge: 'How can we empower farmers with data?',
    solution: 'Accessible digital solution providing farmers with detailed product-specific information.',
    link: 'https://www.hackerearth.com/challenges/hackathon/bayer-hackathon-2/',
    linkLabel: 'View on HackerEarth',
    color: '#B8D4F8',
    icon: '🥇',
  },
  {
    year: '2016',
    location: null,
    title: "Winner: HackerEarth's First Game Development Hackathon",
    challenge: 'Stand out among 10,000+ global developers.',
    solution: 'Winning this highly competitive event in the early stages of my career was a pivotal moment. It validated my creative ability on the global stage.',
    link: 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/IH__Game%20Devac6bcb1.jpg',
    linkLabel: 'View Certificate',
    color: '#B8F4D4',
    icon: '🎮',
  },
  {
    year: '2× Winner',
    location: null,
    title: 'Consecutive Winner: Sense Internal Star Award',
    challenge: null,
    solution: 'Awarded for "Best Collaboration and Contribution to Success." A testament to my belief that great products are built through collaboration.',
    link: null,
    linkLabel: null,
    color: '#F8E4A0',
    icon: '⭐',
  },
]

// Duplicate for seamless infinite loop
const row = [...achievements, ...achievements]

function AchievementCard({ item, trackRef }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = ((y - cy) / cy) * -18
    const rotateY = ((x - cx) / cx) * 18
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
  }

  const handleMouseEnter = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (card) card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
    if (trackRef.current) trackRef.current.style.animationPlayState = 'running'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        minWidth: '306px',
        maxWidth: '306px',
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        marginRight: '12px',
        userSelect: 'none',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        willChange: 'transform',
        cursor: 'default',
      }}
    >
      {/* Award image — centered near top */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <img
          src="/award-symbol.png"
          alt="award"
          style={{ width: '90px', height: '90px', objectFit: 'contain' }}
        />
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '12px', fontWeight: 400, letterSpacing: '-0.01em',
        color: '#111', lineHeight: 1.35, marginBottom: '8px',
      }}>
        {item.title}
      </h3>

      {/* Solution */}
      <p style={{
        fontSize: '13px', lineHeight: 1.65, color: '#666',
        fontWeight: 400, flex: 1, marginBottom: '12px',
      }}>
        {item.solution}
      </p>

      {/* Bottom row — CTA left, year right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        {item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '3px',
              fontSize: '10px', fontWeight: 600, color: '#555',
              textDecoration: 'none', border: '1px solid #e8e8e8',
              borderRadius: '999px', padding: '4px 10px', width: 'fit-content',
              transition: 'border-color 0.2s, background 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555' }}
          >
            {item.linkLabel} ↗
          </a>
        ) : <div />}
        <span style={{ fontSize: '10px', fontWeight: 600, color: '#bbb', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
          {item.year}{item.location ? ` · ${item.location}` : ''}
        </span>
      </div>

      {/* Bottom accent */}
      <div style={{ height: '2px', borderRadius: '2px', background: item.color, marginTop: '10px', width: '20px' }} />
    </div>
  )
}

export default function AchievementsSection() {
  const { ref: headRef } = useInView()
  const trackRef = useRef(null)

  return (
    <section
      id="achievements"
      style={{
        paddingTop: '56px',
        paddingBottom: '92px',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '0 24px' }}>
        <div
          style={{
            maxWidth: '1260px',
            margin: '0 auto',
            width: '100%',
            background: 'linear-gradient(to top, #F9F7F6, transparent)',
            borderRadius: '32px',
            overflow: 'hidden',
            display: 'flex',
            minHeight: '560px',
          }}
          className="flex-col lg:flex-row"
        >
          {/* Left column — heading + marquee */}
          <div
            style={{
              flex: '1 1 50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Heading with padding */}
            <div
              ref={headRef}
              className="reveal"
              style={{ padding: 'clamp(40px, 5vw, 72px)', paddingBottom: '32px' }}
            >
              <p style={{
                fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#999', marginBottom: '12px',
              }}>
                Achievements
              </p>
              <h2 style={{
                fontSize: 'clamp(38px, 4.2vw, 60px)',
                fontWeight: 400,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                color: '#1a1a1a',
              }}>
                International Awards & Recognitions
              </h2>
            </div>

            {/* Marquee — full width of left column */}
            <div
              style={{
                paddingBottom: 'clamp(40px, 5vw, 72px)',
                paddingTop: '32px',
                overflow: 'hidden',
                maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              }}
            >
              <div
                ref={trackRef}
                className="marquee-track"
                style={{ animation: 'marquee 25s linear infinite' }}
              >
                {row.map((item, i) => (
                  <AchievementCard key={i} item={item} trackRef={trackRef} />
                ))}
              </div>
            </div>
          </div>

          {/* Right column — video */}
          <div
            style={{
              flex: '0 0 42%',
              position: 'relative',
              padding: 'clamp(40px, 5vw, 72px)',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
            className="hidden lg:block"
          >
            <video
              src="/Achievements.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '416px',
                borderRadius: '24px',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
                transform: 'scaleX(-1)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
