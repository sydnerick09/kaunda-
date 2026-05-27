import Head from 'next/head';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ApplicationModal from '../components/ApplicationModal';

/* ── Data ── */
const FEATURES = [
  {
    icon: '🤖',
    title: 'Human and AI-Powered Responses',
    desc: 'Leverage cutting-edge language models to craft personalised, context-aware email replies at scale — no templates, no delays.',
  },
  {
    icon: '⚡',
    title: 'Instant Turnaround',
    desc: 'Respond to client and customer emails in seconds, not hours. Keep SLAs green and customers happy around the clock.',
  },
  {
    icon: '🌍',
    title: 'Remote & Flexible',
    desc: 'Work from anywhere in Africa. Set your own hours and manage your workload through our intuitive agent dashboard.',
  },
  {
    icon: '💰',
    title: 'Competitive Earnings',
    desc: 'Earn up to Ksh 55,000 /month handling email queues for businesses across Kenya, Nigeria, Ghana and beyond.',
  },
  {
    icon: '📈',
    title: 'Career Growth',
    desc: 'Level up through our agent tiers — Junior, Senior, and Lead. Each tier unlocks premium clients and higher pay rates.',
  },
  {
    icon: '🔒',
    title: 'Secure & Compliant',
    desc: 'All communications are end-to-end encrypted. We adhere to GDPR and local data protection standards.',
  },
];

const HOW_IT_WORKS = [
  { num: '01', title: 'Submit Your Application', desc: 'Fill out the form, pay the one-time KSh 1,599 registration fee, and your application is instantly logged.' },
  { num: '02', title: 'Screening & Onboarding', desc: 'Our team reviews your profile within 48 hours. Accepted agents receive access to training and the agent portal.' },
  { num: '03', title: 'Get Matched to Clients', desc: 'Based on your skills and availability, you\'re matched with businesses that need email reply support.' },
  { num: '04', title: 'Reply & Earn', desc: 'Handle email queues through our platform. Get paid weekly directly to your M-Pesa or bank account.' },
];

const STATS = [
  { value: '300+', label: 'Active Agents' },
  { value: 'kSH 55,000', label: 'Top Monthly Earnings' },
  { value: '180+', label: 'Business Clients' },
  { value: '98%', label: 'Client Satisfaction' },
];

const TESTIMONIALS = [
  {
    name: 'Amara Osei', role: 'Senior Email Agent', location: 'Accra, Ghana',
    text: 'I was sceptical at first, but within 3 months I was earning more than my previous office job — all from home. The training is excellent.',
    avatar: 'AO',
  },
  {
    name: 'Fatima Ndungu', role: 'Lead Reply Agent', location: 'Nairobi, Kenya',
    text: 'ReplyAgentAI changed my life. I now manage a team of junior agents and earn a stable income while looking after my kids.',
    avatar: 'FN',
  },
  {
    name: 'Kofi Mensah', role: 'Email Agent', location: 'Lagos, Nigeria',
    text: 'The platform is clean, payouts are on time, and the support team is always available. Best remote opportunity I\'ve found.',
    avatar: 'KM',
  },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Head>
        <title>ReplyAgentAI — Get Paid to Reply Emails with AI</title>
        <meta name="description" content="Join Africa's leading AI email reply agent platform. Work remotely, earn up to Ksh 55,000/month, and build a career in the AI-powered economy." />
        <meta property="og:title" content="ReplyAgentAI — Get Paid to Reply Emails with AI" />
        <meta property="og:description" content="Join Africa's leading AI email reply agent platform. Work remotely and earn competitive pay." />
        <meta name="robots" content="index, follow" />
      </Head>

      <Navbar onApply={() => setModalOpen(true)} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(150deg, var(--charcoal) 0%, var(--charcoal-2) 45%, #1A3028 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        padding: '120px 0 80px',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(82,183,136,0.12) 0%, transparent 70%)',
          top: -100, right: -100, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,106,79,0.18) 0%, transparent 70%)',
          bottom: 80, left: -80, pointerEvents: 'none',
        }} />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <div className="badge badge-white fade-up" style={{ marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#52B788', display: 'inline-block' }} />
              Now Hiring — 28 Agent Spots Available
            </div>
            <h1 className="display fade-up delay-1" style={{ color: '#FFFFFF', marginBottom: 24 }}>
              Get Paid to Reply<br />
              <span style={{ color: '#52B788' }}>Emails with AI</span>
            </h1>
            <p className="lead fade-up delay-2" style={{ color: 'rgba(255,255,255,0.72)', marginBottom: 40, maxWidth: 580 }}>
              Join over 400 remote agents across Africa who earn competitive monthly income by managing business email queues — powered by our cutting-edge AI platform.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }} className="fade-up delay-3">
              <button onClick={() => setModalOpen(true)} className="btn btn-white btn-lg">
                Apply Now — KSh 1,599 →
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-lg"
                style={{ color: 'rgba(255,255,255,0.8)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: 50 }}>
                How It Works ↓
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 24, marginTop: 48, flexWrap: 'wrap' }} className="fade-up delay-4">
              {['✓ Weekly M-Pesa Payouts', '✓ 100% Remote', '✓ No Experience Needed'].map(t => (
                <span key={t} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section style={{ background: 'var(--green)', padding: '52px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 0, textAlign: 'center',
          }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                padding: '16px 24px',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              }}>
                <div style={{
                  fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem,4vw,2.6rem)',
                  fontWeight: 900, color: '#fff', lineHeight: 1,
                }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.85rem', marginTop: 6, fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="section" id="how-it-works" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="badge badge-green" style={{ marginBottom: 16 }}>Process</div>
            <h2 className="section-title" style={{ color: 'var(--charcoal)' }}>How It Works</h2>
            <div className="divider divider-center" />
            <p className="lead" style={{ maxWidth: 520, margin: '0 auto' }}>
              From application to your first payday in under a week — here&apos;s the journey.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 28,
          }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.num} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', top: -10, right: -10,
                  fontFamily: 'Playfair Display, serif', fontSize: '5rem', fontWeight: 900,
                  color: 'var(--green-pale)', lineHeight: 1, pointerEvents: 'none',
                }}>{step.num}</div>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--green)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: '0.95rem',
                  marginBottom: 18,
                }}>{i + 1}</div>
                <h3 style={{ fontSize: '1.05rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, marginBottom: 10, color: 'var(--charcoal)' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--charcoal-3)', lineHeight: 1.7 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="section" id="features">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="badge badge-green" style={{ marginBottom: 16 }}>Why Us</div>
            <h2 className="section-title" style={{ color: 'var(--charcoal)' }}>Everything You Need to Succeed</h2>
            <div className="divider divider-center" />
            <p className="lead" style={{ maxWidth: 520, margin: '0 auto' }}>
              We&apos;ve built the most agent-friendly platform in Africa. Here&apos;s what sets us apart.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: '2rem' }}>{f.icon}</div>
                <h3 style={{
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
                  fontSize: '1rem', color: 'var(--charcoal)',
                }}>{f.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--charcoal-3)', lineHeight: 1.7, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge badge-green" style={{ marginBottom: 16 }}>Testimonials</div>
            <h2 className="section-title" style={{ color: 'var(--charcoal)' }}>Agents Love ReplyAgentAI</h2>
            <div className="divider divider-center" />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card" style={{ position: 'relative' }}>
                <div style={{ fontSize: '2.5rem', color: 'var(--green-pale)', fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: 14 }}>"</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--charcoal-3)', lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>
                  {t.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--green), var(--green-light))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--charcoal)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--charcoal-3)' }}>{t.role} · {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ REQUIREMENTS ═══════════════ */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 40, alignItems: 'center',
          }}>
            <div>
              <div className="badge badge-green" style={{ marginBottom: 20 }}>Requirements</div>
              <h2 className="section-title" style={{ color: 'var(--charcoal)', marginBottom: 16 }}>
                Who Can Apply?
              </h2>
              <div className="divider" />
              <p className="lead" style={{ marginBottom: 28 }}>
                We welcome applicants from all backgrounds. If you can communicate clearly and are willing to learn, you qualify.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Must be 18 years or older',
                  'Proficient in written English',
                  'Access to a smartphone or laptop',
                  'Reliable internet connection',
                  'Ability to commit 3–8 hours daily',
                  'No prior experience required',
                ].map(req => (
                  <li key={req} style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '0.92rem', color: 'var(--charcoal-3)' }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', background: 'var(--green)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '0.7rem', flexShrink: 0, fontWeight: 700,
                    }}>✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Earnings card */}
            <div style={{
              background: 'linear-gradient(150deg, var(--charcoal) 0%, var(--charcoal-2) 100%)',
              borderRadius: 'var(--radius-lg)', padding: '40px 36px', color: '#fff',
            }}>
              <div style={{ fontSize: '0.82rem', opacity: 0.65, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Earnings Breakdown
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 900, color: '#52B788', marginBottom: 28 }}>
                Up to Ksh 55,000/mo
              </div>
              {[
                { tier: 'Junior Agent', range: 'KSh 15,000 – 28,000', emails: '100–200 emails/day' },
                { tier: 'Senior Agent', range: 'KSh 30,000 – 55,000', emails: '200–400 emails/day' },
                { tier: 'Lead Agent', range: 'KSh 60,000 – 85,000', emails: '400+ emails/day + team' },
              ].map((tier, i) => (
                <div key={tier.tier} style={{
                  padding: '14px 0',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 3 }}>{tier.tier}</div>
                      <div style={{ fontSize: '0.78rem', opacity: 0.6 }}>{tier.emails}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#52B788', fontSize: '0.88rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {tier.range}
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setModalOpen(true)}
                className="btn btn-white"
                style={{ marginTop: 28, width: '100%', justifyContent: 'center' }}>
                Apply Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="badge badge-green" style={{ marginBottom: 16 }}>FAQ</div>
            <h2 className="section-title" style={{ color: 'var(--charcoal)' }}>Frequently Asked Questions</h2>
            <div className="divider divider-center" />
          </div>
          {[
            {
              q: 'Why is there a KSh 1,599 registration fee?',
              a: 'The fee covers your account setup, AI tool access, onboarding training materials, and the first month of platform access. It ensures only serious applicants are considered.',
            },
            {
              q: 'How soon will I start working after applying?',
              a: 'Once your application is approved (within 2–3 business days), you\'ll receive onboarding instructions. Most agents start their first assignment within 5–7 days of applying.',
            },
            {
              q: 'How and when do I get paid?',
              a: 'Agents are paid weekly every Friday via M-Pesa or direct bank transfer. There is no minimum payout threshold.',
            },
            {
              q: 'Do I need to be in Kenya to apply?',
              a: 'No. We accept agents from across Africa. However, the registration fee is collected in KES via Paystack, which supports multiple currencies.',
            },
            {
              q: 'What if my application is not accepted?',
              a: 'In the rare case your application is declined, our team will reach out with feedback. The registration fee is non-refundable as it covers administrative costs.',
            },
          ].map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section id="apply" style={{
        background: 'linear-gradient(135deg, var(--green) 0%, var(--charcoal) 100%)',
        padding: '96px 0', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06,
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge badge-white" style={{ marginBottom: 24, margin: '0 auto 24px' }}>
            Limited Spots
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,5vw,3.6rem)',
            fontWeight: 900, color: '#fff', marginBottom: 20,
          }}>
            Ready to Start Earning?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            Join thousands of agents building a sustainable remote income. Apply in minutes, start earning within days.
          </p>
          <button onClick={() => setModalOpen(true)} className="btn btn-white btn-lg"
            style={{ fontSize: '1.1rem' }}>
            Apply Now — KSh 1,599 →
          </button>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginTop: 20 }}>
            One-time registration fee · Secure Paystack payment · Instant confirmation
          </p>
        </div>
      </section>

      <Footer />

      <ApplicationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

/* ── Accordion FAQ item ── */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: '1px solid var(--border)', padding: '20px 0',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
          textAlign: 'left',
        }}>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--charcoal)', lineHeight: 1.4 }}>
          {question}
        </span>
        <span style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: open ? 'var(--green)' : 'var(--off-white)',
          color: open ? '#fff' : 'var(--charcoal-3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', fontWeight: 700, transition: 'all 0.2s',
        }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <p style={{ fontSize: '0.88rem', color: 'var(--charcoal-3)', lineHeight: 1.75, marginTop: 12, paddingRight: 44 }}>
          {answer}
        </p>
      )}
    </div>
  );
}
