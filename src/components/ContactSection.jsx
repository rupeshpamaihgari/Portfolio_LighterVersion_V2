import useInView from '../hooks/useInView'

const cardStyle = {
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '20px',
  padding: '24px 28px',
  border: '1px solid rgba(255,255,255,0.06)',
}

export default function ContactSection() {
  const { ref } = useInView({ threshold: 0.1 })

  return (
    <section
      id="contact"
      style={{ paddingTop: '80px', paddingBottom: '80px' }}
    >
      <div className="section-container">
        <div
          ref={ref}
          className="reveal"
          style={{
            background: '#111111',
            borderRadius: '28px',
            padding: 'clamp(40px, 6vw, 72px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background decorative blobs */}
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '60px',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* ── LEFT ── */}
            <div>
              {/* Availability badge */}
              <div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '999px', padding: '8px 16px 8px 10px', marginBottom: '28px',
                }}
              >
                <span
                  className="animate-pulse-dot"
                  style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px rgba(34,197,94,0.6)' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#22c55e', letterSpacing: '-0.01em' }}>
                  Available for Hire
                </span>
              </div>

              {/* Title */}
              <h2
                style={{
                  fontSize: 'clamp(36px, 4.5vw, 60px)',
                  fontWeight: 750,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.0,
                  color: '#ffffff',
                  marginBottom: '12px',
                }}
              >
                AI Powered
                <br />
                Product Designer
              </h2>

              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', fontWeight: 400, letterSpacing: '-0.01em', marginBottom: '36px' }}>
                Automations & AI Agents Expert
              </p>

              {/* Contact info card */}
              <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}>📧</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', letterSpacing: '-0.01em' }}>rupesh.chaitanya@gmail.com</span>
                </div>
                {/* Phone */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', lineHeight: 1, color: 'rgba(255,255,255,0.4)', display: 'inline-flex', alignItems: 'center' }}>📞</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', letterSpacing: '-0.01em' }}>+91 9945186854</span>
                </div>
                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', lineHeight: 1, color: 'rgba(255,255,255,0.4)', display: 'inline-flex', alignItems: 'center' }}>📍</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', letterSpacing: '-0.01em' }}>Bangalore, Karnataka, India</span>
                </div>
                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/rupesh046/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    background: 'rgba(10,102,194,0.2)', border: '1px solid rgba(10,102,194,0.4)',
                    borderRadius: '12px', padding: '10px 16px', textDecoration: 'none',
                    transition: 'background 0.2s, border-color 0.2s', width: 'fit-content',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(10,102,194,0.35)'; e.currentTarget.style.borderColor = 'rgba(10,102,194,0.7)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(10,102,194,0.2)'; e.currentTarget.style.borderColor = 'rgba(10,102,194,0.4)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#70b5f9' }}>Connect on LinkedIn</span>
                </a>
              </div>
            </div>

            {/* ── RIGHT — illustration ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src="/ContactSection.png"
                alt="Contact illustration"
                style={{
                  width: '100%',
                  maxWidth: '440px',
                  objectFit: 'contain',
                  animation: 'scalePulse 11.82s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
