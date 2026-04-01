const socials = [
  { label: 'LinkedIn',  href: 'https://linkedin.com' },
  { label: 'Twitter',   href: 'https://twitter.com' },
  { label: 'Dribbble',  href: 'https://dribbble.com' },
  { label: 'Behance',   href: 'https://behance.net' },
]

export default function Footer() {
  return (
    <footer
      style={{
        paddingTop: '80px',
        paddingBottom: '48px',
        borderTop: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div className="section-container">
        {/* Big headline */}
        <div
          style={{
            marginBottom: '60px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 60px)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              color: '#111',
              maxWidth: '600px',
            }}
          >
            Upgrade your<br />web presence
          </h2>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#111',
              color: '#fff',
              borderRadius: '999px',
              padding: '14px 28px',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Start a Project ↗
          </a>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)', marginBottom: '32px' }} />

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
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
              fontSize: '17px',
              letterSpacing: '-0.03em',
              color: '#111',
            }}
          >
            Rupesh
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#111',
                display: 'inline-block',
                marginLeft: '2px',
                marginBottom: '7px',
              }}
            />
          </a>

          {/* Social links */}
          <nav>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                gap: '4px',
                flexWrap: 'wrap',
              }}
            >
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      fontSize: '13.5px',
                      fontWeight: 450,
                      color: '#777',
                      textDecoration: 'none',
                      padding: '6px 12px',
                      borderRadius: '999px',
                      transition: 'color 0.2s ease, background 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#111'
                      e.currentTarget.style.background = 'rgba(0,0,0,0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#777'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Copyright */}
          <p
            style={{
              fontSize: '13px',
              color: '#aaa',
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            © 2024. Designed with care.
          </p>
        </div>
      </div>
    </footer>
  )
}
