export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      background: 'var(--charcoal)', color: 'rgba(255,255,255,0.7)',
      padding: '60px 0 32px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40, marginBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', fontWeight: 900, color: '#fff',
                fontFamily: 'Playfair Display, serif',
              }}>R</div>
              <span style={{
                fontFamily: 'Playfair Display, serif', fontWeight: 700,
                fontSize: '1.05rem', color: '#fff',
              }}>ReplyAgent<span style={{ color: '#52B788' }}>AI</span></span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7 }}>
              Africa&apos;s leading AI-powered email reply agent platform. Connecting talent with opportunity.
            </p>
          </div>

          {/* Links */}
          <div>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: 16, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</div>
            {['About Us', 'How It Works', 'Careers', 'Blog'].map(l => (
              <div key={l} style={{ marginBottom: 10 }}>
                <a href="#" style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', transition: 'color 0.2s' }}
                   onMouseEnter={e => e.target.style.color = '#52B788'}
                   onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}>
                  {l}
                </a>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: 16, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support</div>
            {['FAQ', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map(l => (
              <div key={l} style={{ marginBottom: 10 }}>
                <a href="#" style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', transition: 'color 0.2s' }}
                   onMouseEnter={e => e.target.style.color = '#52B788'}
                   onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}>
                  {l}
                </a>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: 16, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</div>
            {[
              { icon: '📧', text: 'support@replyagentai.com' },
              { icon: '📍', text: 'Nairobi, Kenya' },
              { icon: '⏰', text: 'Mon–Fri, 9am – 6pm EAT' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: '0.88rem' }}>
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 28,
          display: 'flex', flexWrap: 'wrap', gap: 16,
          justifyContent: 'space-between', alignItems: 'center',
          fontSize: '0.82rem',
        }}>
          <span>© {year} ReplyAgentAI. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>Secure payments by</span>
            <span style={{
              padding: '3px 10px', borderRadius: 4,
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              fontWeight: 700, fontSize: '0.8rem',
            }}>Paystack</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
