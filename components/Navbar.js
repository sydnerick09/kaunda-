import { useState, useEffect } from 'react';

export default function Navbar({ onApply }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(30,33,32,0.08)' : 'none',
        transition: 'all 0.3s ease', padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 1140, margin: '0 auto', height: 68,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 900, color: '#fff',
              fontFamily: 'Playfair Display, serif',
            }}>R</div>
            <span style={{
              fontFamily: 'Playfair Display, serif', fontWeight: 700,
              fontSize: '1.1rem', color: scrolled ? '#1E2120' : '#fff',
              letterSpacing: '-0.01em',
            }}>ReplyAgent<span style={{ color: '#52B788' }}>AI</span></span>
          </div>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}
               className="desktop-nav">
            {['how-it-works','features','apply'].map(id => (
              <button key={id} onClick={() => id === 'apply' ? onApply() : scroll(id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.9rem', fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                  color: scrolled ? '#2C3130' : 'rgba(255,255,255,0.88)',
                  textTransform: 'capitalize', letterSpacing: '0.02em',
                  transition: 'color 0.2s',
                }}>
                {id === 'how-it-works' ? 'How It Works' : id === 'features' ? 'Features' : 'Apply Now'}
              </button>
            ))}
            <button onClick={onApply} className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
              Get Started →
            </button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none', background: 'none', border: 'none',
              fontSize: '1.5rem', color: scrolled ? '#1E2120' : '#fff',
            }} className="hamburger">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0, zIndex: 899,
          background: '#fff', borderBottom: '1px solid rgba(30,33,32,0.08)',
          padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16,
          boxShadow: '0 8px 24px rgba(30,33,32,0.12)',
        }} className="mobile-menu">
          {[
            { id: 'how-it-works', label: 'How It Works' },
            { id: 'features', label: 'Features' },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => scroll(id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '1rem', fontWeight: 600, color: '#1E2120',
              textAlign: 'left', padding: '6px 0',
            }}>{label}</button>
          ))}
          <button onClick={() => { onApply(); setMenuOpen(false); }}
            className="btn btn-primary" style={{ marginTop: 8 }}>
            Apply Now →
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
}
