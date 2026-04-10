import { useEffect, useRef } from 'react'
import ToolsMarquee from './ToolsMarquee'

export default function Hero() {
  const containerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const t1 = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.opacity = '1'
        containerRef.current.style.transform = 'translateY(0)'
      }
    }, 200)
    const t2 = setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.querySelectorAll('.hero-anim').forEach((el, i) => {
          setTimeout(() => {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
          }, i * 120)
        })
      }
    }, 500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <section
      id="intro"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '132px',
      }}
    >
      {/* Hero card container */}
      <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <div
          ref={containerRef}
          style={{
            maxWidth: '1260px',
            margin: '0 auto',
            width: '100%',
            background: 'linear-gradient(to bottom, #F9F7F6, transparent)',
            borderRadius: '32px',
            overflow: 'hidden',
            display: 'flex',
            minHeight: '560px',
            opacity: 0,
            transform: 'translateY(16px)',
            transition: 'opacity 0.8s cubic-bezier(0.33, 1, 0.68, 1), transform 0.8s cubic-bezier(0.33, 1, 0.68, 1)',
          }}
          className="flex-col lg:flex-row"
        >
          {/* Left column — text content */}
          <div
            ref={contentRef}
            style={{
              flex: '1 1 50%',
              padding: 'clamp(40px, 5vw, 72px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Badge */}
            <div
              className="hero-anim"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '999px',
                padding: '10px 20px',
                marginBottom: '36px',
                width: 'fit-content',
                opacity: 0,
                transform: 'translateY(18px)',
                transition: 'opacity 0.7s cubic-bezier(0.33, 1, 0.68, 1), transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#444',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                Product Designer with 10+ years Experience
              </span>
            </div>

            {/* H1 */}
            <h1
              className="hero-anim"
              style={{
                fontSize: 'clamp(38px, 4.2vw, 60px)',
                fontWeight: 600,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                color: '#1a1a1a',
                marginBottom: '28px',
                opacity: 0,
                transform: 'translateY(18px)',
                transition: 'opacity 0.7s cubic-bezier(0.33, 1, 0.68, 1), transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)',
              }}
            >
              Rupesh Pamaihgari
            </h1>

            {/* Divider line */}
            <div
              className="hero-anim"
              style={{
                width: '280px',
                maxWidth: '70%',
                height: '1px',
                background: 'rgba(0,0,0,0.12)',
                marginBottom: '28px',
                opacity: 0,
                transform: 'translateY(18px)',
                transition: 'opacity 0.7s cubic-bezier(0.33, 1, 0.68, 1), transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)',
              }}
            />

            {/* Subtitle */}
            <p
              className="hero-anim"
              style={{
                fontSize: '16px',
                fontWeight: 400,
                color: '#111011',
                lineHeight: 1.7,
                maxWidth: '400px',
                marginBottom: '16px',
                opacity: 0,
                transform: 'translateY(18px)',
                transition: 'opacity 0.7s cubic-bezier(0.33, 1, 0.68, 1), transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)',
              }}
            >
              Staff Product Designer @SenseHQ, Specialized in
              Automation products and AI Agents
            </p>

            {/* Bio */}
            <p
              className="hero-anim"
              style={{
                fontSize: '14px',
                fontWeight: 400,
                color: '#888',
                lineHeight: 1.7,
                maxWidth: '400px',
                marginBottom: '40px',
                opacity: 0,
                transform: 'translateY(18px)',
                transition: 'opacity 0.7s cubic-bezier(0.33, 1, 0.68, 1), transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)',
              }}
            >
              10+ years bridging code and experience — productizing AI Agents, SaaS tools from 0→1, and leading end-to-end design across 10+ platforms.
            </p>

            {/* CTA buttons */}
            <div
              className="hero-anim"
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                opacity: 0,
                transform: 'translateY(18px)',
                transition: 'opacity 0.7s cubic-bezier(0.33, 1, 0.68, 1), transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)',
              }}
            >
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="btn-dark"
                style={{
                  padding: '14px 32px',
                  fontSize: '15px',
                }}
              >
                <span>See Work</span>
                <span style={{ fontSize: '18px', fontWeight: 300 }}>›</span>
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="btn-light"
                style={{
                  padding: '14px 32px',
                  fontSize: '15px',
                }}
              >
                <span>Contact</span>
              </a>
            </div>
          </div>

          {/* Right column — image area */}
          <div
            style={{
              flex: '0 0 42%',
              position: 'relative',
              padding: 'clamp(40px, 5vw, 72px)',
              minHeight: '400px',
            }}
            className="hidden lg:block"
          >
            <video
              src="/HeroImageVideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
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
