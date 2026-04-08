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
