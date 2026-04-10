import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'About me',       href: '#intro' },
  { label: 'Achievements',   href: '#achievements' },
  { label: 'Experience',     href: '#experience' },
  { label: 'Projects',       href: '#projects' },
  { label: 'Design Process', href: '#design-process' },
  { label: 'AI Process',     href: '#ai-process' },
  { label: 'Contact',        href: '#contact' },
]

const RESUME_URL = 'https://drive.google.com/file/d/1KYs4Cow6IVj9G5wGh_EP0jkjD-6-cwfu/view?usp=sharing'

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [activeLink, setActiveLink] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: highlight nav link for whichever section is most visible
  useEffect(() => {
    const sectionIds = navLinks.map(l => l.href.replace('#', ''))
    const observers = []

    // Track intersection ratios per section, pick the highest
    const ratios = {}
    const pick = () => {
      const top = Object.entries(ratios).sort((a, b) => b[1] - a[1])[0]
      if (top && top[1] > 0) setActiveLink('#' + top[0])
    }

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      ratios[id] = 0
      const obs = new IntersectionObserver(
        ([entry]) => {
          ratios[id] = entry.intersectionRatio
          pick()
        },
        { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  const handleNav = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer')
      return
    }
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: '72px',
          backgroundColor: scrolled
            ? 'rgba(234,232,225,0.92)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
          transition: 'background-color 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
          boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 32px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '18px',
              letterSpacing: '-0.03em',
              color: '#111',
              flexShrink: 0,
            }}
          >
            Rupesh
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#111',
                display: 'inline-block',
                marginLeft: '2px',
                marginBottom: '8px',
              }}
            />
          </a>

          {/* Desktop nav links — centered */}
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            className="hidden lg:flex"
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  style={{
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: activeLink === link.href ? 600 : 450,
                    color: activeLink === link.href ? '#111' : '#555',
                    padding: '7px 14px',
                    borderRadius: '999px',
                    transition: 'color 0.2s ease, background 0.2s ease',
                    background: activeLink === link.href ? 'rgba(0,0,0,0.06)' : 'transparent',
                    whiteSpace: 'nowrap',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    if (activeLink !== link.href) {
                      e.target.style.color = '#111'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeLink !== link.href) {
                      e.target.style.color = '#555'
                    }
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right side — Resume CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex"
              style={{
                background: 'transparent',
                color: '#111',
                borderRadius: '999px',
                padding: '9px 20px',
                fontSize: '13.5px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                transition: 'transform 0.2s ease, background 0.2s ease, border-color 0.2s ease',
                border: '1.5px solid rgba(0,0,0,0.15)',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#111'
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.borderColor = '#111'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#111'
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'
              }}
            >
              Resume
            </a>

            {/* Hamburger */}
            <button
              className="lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
              aria-label="Toggle menu"
            >
              <span
                style={{
                  display: 'block',
                  width: '22px',
                  height: '2px',
                  background: '#111',
                  borderRadius: '2px',
                  transition: 'transform 0.3s ease, opacity 0.3s ease',
                  transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: '22px',
                  height: '2px',
                  background: '#111',
                  borderRadius: '2px',
                  transition: 'opacity 0.3s ease',
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: '22px',
                  height: '2px',
                  background: '#111',
                  borderRadius: '2px',
                  transition: 'transform 0.3s ease',
                  transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          zIndex: 999,
          background: 'rgba(234,232,225,0.98)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          padding: menuOpen ? '20px 24px 28px' : '0 24px',
          maxHeight: menuOpen ? '500px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.33, 1, 0.68, 1), padding 0.35s ease',
        }}
      >
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#111',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li style={{ marginTop: '8px' }}>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                background: '#111',
                color: '#fff',
                borderRadius: '999px',
                padding: '13px 24px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Resume ↗
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}
