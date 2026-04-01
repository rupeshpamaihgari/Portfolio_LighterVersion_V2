import { useState, useEffect } from 'react'
import useInView from '../hooks/useInView'

function LiveClock() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      // Convert to IST (GMT+5:30)
      const utc = now.getTime() + now.getTimezoneOffset() * 60000
      const ist = new Date(utc + 5.5 * 3600000)

      const h = String(ist.getHours()).padStart(2, '0')
      const m = String(ist.getMinutes()).padStart(2, '0')
      const s = String(ist.getSeconds()).padStart(2, '0')
      const ampm = ist.getHours() < 12 ? 'AM' : 'PM'
      const h12 = ist.getHours() % 12 || 12

      setTime(`${String(h12).padStart(2, '0')}:${m}:${s} ${ampm}`)

      const days   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      setDate(`${days[ist.getDay()]}, ${months[ist.getMonth()]} ${ist.getDate()}`)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <div
        style={{
          fontSize: 'clamp(28px, 3.5vw, 44px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: '#ffffff',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
          marginBottom: '4px',
        }}
      >
        {time}
      </div>
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>
        {date} · GMT+5:30
      </div>
    </div>
  )
}

export default function ContactSection() {
  const { ref } = useInView({ threshold: 0.1 })

  return (
    <section
      id="contact"
      style={{
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
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
          {/* Background decorative elements */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-40px',
              left: '30%',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

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
            {/* Left content */}
            <div>
              {/* Studio label */}
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '20px',
                }}
              >
                My Studio
              </p>

              {/* Availability badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(34,197,94,0.15)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '999px',
                  padding: '8px 16px 8px 10px',
                  marginBottom: '28px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'inline-block',
                    boxShadow: '0 0 8px rgba(34,197,94,0.6)',
                  }}
                  className="animate-pulse-dot"
                />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#22c55e', letterSpacing: '-0.01em' }}>
                  Available for Projects
                </span>
              </div>

              {/* Name / title */}
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
                Product
                <br />
                Designer
              </h2>

              <p
                style={{
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  marginBottom: '36px',
                }}
              >
                Framer Pro Expert & Product Designer
              </p>

              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="mailto:hello@rupesh.design"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#ffffff',
                    color: '#111',
                    borderRadius: '999px',
                    padding: '13px 28px',
                    fontSize: '14px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(255,255,255,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Book a Call <span>↗</span>
                </a>
                <a
                  href="mailto:hello@rupesh.design"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    borderRadius: '999px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.2)',
                    letterSpacing: '-0.01em',
                    transition: 'color 0.2s ease, border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                  }}
                >
                  Send Email
                </a>
              </div>
            </div>

            {/* Right content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Live time */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '20px',
                  padding: '28px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
                  Local Time
                </p>
                <LiveClock />
              </div>

              {/* Response time */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '20px',
                  padding: '24px 28px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>
                    Response time
                  </p>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                    Within 24hrs
                  </p>
                </div>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(34,197,94,0.15)',
                    border: '1px solid rgba(34,197,94,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                  }}
                >
                  ⚡
                </div>
              </div>

              {/* Rate card */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '20px',
                  padding: '24px 28px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #F4A58A, #F8D4B8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0,
                  }}
                >
                  🎨
                </div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>
                    Engagements
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.8)', letterSpacing: '-0.01em' }}>
                    Project-based · Retainer · Advisory
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
