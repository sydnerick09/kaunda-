import { useState, useEffect } from 'react';

const REGISTRATION_FEE = 1599;

const JOB_TYPES = [
  'Customer Support Email Agent',
  'Sales Outreach Agent',
  'HR / Recruitment Response Agent',
  'E-commerce Support Agent',
  'Technical Support Agent',
  'Real Estate Response Agent',
  'Legal / Administrative Agent',
  'Other (Specify in cover letter)',
];

const EXPERIENCE = [
  'No experience (Beginner)',
  '1 – 2 years',
  '3 – 5 years',
  '5+ years',
];

export default function ApplicationModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paystackReady, setPaystackReady] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    jobType: '', experience: '', location: '',
    coverLetter: '', linkedin: '', portfolio: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  // Load Paystack script
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('paystack-script')) {
      setPaystackReady(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => setPaystackReady(true);
    script.onerror = () => setGlobalError('Failed to load payment system. Please refresh the page.');
    document.body.appendChild(script);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setGlobalError('');
  };

  /* ── Validators ── */
  const validateStep1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    if (!form.location.trim()) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.jobType) e.jobType = 'Please select a job type';
    if (!form.experience) e.experience = 'Please select your experience level';
    if (form.coverLetter.trim().length < 80)
      e.coverLetter = 'Cover letter must be at least 80 characters';
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => s + 1);
  };

  /* ── Paystack payment ── */
  const handlePayment = () => {
    if (!paystackReady) {
      setGlobalError('Payment system not ready. Please wait a moment and try again.');
      return;
    }
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setGlobalError('Payment configuration missing. Contact support.');
      return;
    }

    setGlobalError('');
    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: form.email,
      amount: REGISTRATION_FEE * 100, // Paystack uses kobo/cents
      currency: 'KES',
      ref: `RJA-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      metadata: {
        custom_fields: [
          { display_name: 'Applicant Name', variable_name: 'applicant_name', value: `${form.firstName} ${form.lastName}` },
          { display_name: 'Job Type', variable_name: 'job_type', value: form.jobType },
          { display_name: 'Phone', variable_name: 'phone', value: form.phone },
        ],
      },
      callback: async (response) => {
        // Verify payment on server then submit application
        await submitApplication(response.reference);
      },
      onClose: () => {
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  /* ── Submit application after payment ── */
  const submitApplication = async (paymentRef) => {
    setLoading(true);
    try {
      const res = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, paymentRef }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Submission failed. Please contact support.');
      }

      setSubmitted(true);
      setStep(4);
    } catch (err) {
      setGlobalError(err.message || 'Something went wrong. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Close & reset ── */
  const handleClose = () => {
    if (loading) return;
    onClose();
    setTimeout(() => {
      setStep(1);
      setSubmitted(false);
      setErrors({});
      setGlobalError('');
      setForm({
        firstName: '', lastName: '', email: '', phone: '',
        jobType: '', experience: '', location: '',
        coverLetter: '', linkedin: '', portfolio: '',
        agreeTerms: false,
      });
    }, 300);
  };

  const steps = [
    { num: 1, label: 'Personal Info' },
    { num: 2, label: 'Application' },
    { num: 3, label: 'Payment' },
  ];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-box">

        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>
              {step === 4 ? '🎉 Application Submitted!' : 'Apply for Email Reply Agent'}
            </h3>
            {step < 4 && (
              <p style={{ fontSize: '0.82rem', color: 'var(--charcoal-3)', marginTop: 2 }}>
                Step {step} of 3 — Registration Fee: <strong style={{ color: 'var(--green)' }}>KSh {REGISTRATION_FEE.toLocaleString()}</strong>
              </p>
            )}
          </div>
          <button className="modal-close" onClick={handleClose} aria-label="Close modal">✕</button>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div style={{ padding: '16px 32px 0', borderBottom: '1px solid var(--border)' }}>
            <div className="steps">
              {steps.map((s, i) => (
                <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className={`step-num ${step === s.num ? 'active' : step > s.num ? 'done' : ''}`}>
                      {step > s.num ? '✓' : s.num}
                    </div>
                    <span className={`step-label ${step === s.num ? 'active' : ''}`}>{s.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`step-connector ${step > s.num ? 'done' : ''}`} style={{ flex: 1, margin: '0 8px' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="modal-body">
          {globalError && (
            <div className="alert alert-error">
              <span>⚠️</span> <span>{globalError}</span>
            </div>
          )}

          {/* ── Step 1: Personal Info ── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--charcoal-3)', marginBottom: 4 }}>
                Fill in your personal details to begin your application.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input name="firstName" value={form.firstName} onChange={change}
                    className={`form-control ${errors.firstName ? 'error' : ''}`}
                    placeholder="e.g. Jane" />
                  {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input name="lastName" value={form.lastName} onChange={change}
                    className={`form-control ${errors.lastName ? 'error' : ''}`}
                    placeholder="e.g. Doe" />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={change}
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  placeholder="jane@example.com" />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input name="phone" type="tel" value={form.phone} onChange={change}
                    className={`form-control ${errors.phone ? 'error' : ''}`}
                    placeholder="+254 700 000 000" />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input name="location" value={form.location} onChange={change}
                    className={`form-control ${errors.location ? 'error' : ''}`}
                    placeholder="Nairobi, Kenya" />
                  {errors.location && <span className="form-error">{errors.location}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn Profile <span style={{color:'#9CA5A0',fontWeight:400}}>(optional)</span></label>
                <input name="linkedin" value={form.linkedin} onChange={change}
                  className="form-control" placeholder="https://linkedin.com/in/yourname" />
              </div>
            </div>
          )}

          {/* ── Step 2: Application Details ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--charcoal-3)', marginBottom: 4 }}>
                Tell us about your experience and what role you&apos;re applying for.
              </p>
              <div className="form-group">
                <label className="form-label">Role / Job Type *</label>
                <select name="jobType" value={form.jobType} onChange={change}
                  className={`form-control ${errors.jobType ? 'error' : ''}`}>
                  <option value="">— Select a role —</option>
                  {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
                {errors.jobType && <span className="form-error">{errors.jobType}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Years of Experience *</label>
                <select name="experience" value={form.experience} onChange={change}
                  className={`form-control ${errors.experience ? 'error' : ''}`}>
                  <option value="">— Select experience level —</option>
                  {EXPERIENCE.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                {errors.experience && <span className="form-error">{errors.experience}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Portfolio / Website <span style={{color:'#9CA5A0',fontWeight:400}}>(optional)</span></label>
                <input name="portfolio" value={form.portfolio} onChange={change}
                  className="form-control" placeholder="https://yourportfolio.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Letter / Motivation *</label>
                <textarea name="coverLetter" value={form.coverLetter} onChange={change}
                  className={`form-control ${errors.coverLetter ? 'error' : ''}`}
                  style={{ minHeight: 130 }}
                  placeholder="Tell us why you want this role and what skills you bring (minimum 80 characters)..." />
                <div style={{ display:'flex', justifyContent:'space-between', marginTop: 4 }}>
                  {errors.coverLetter
                    ? <span className="form-error">{errors.coverLetter}</span>
                    : <span />}
                  <span style={{ fontSize: '0.78rem', color: form.coverLetter.length >= 80 ? 'var(--green)' : '#9CA5A0' }}>
                    {form.coverLetter.length} / 80 min
                  </span>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginTop: 4 }}>
                <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={change}
                  style={{ marginTop: 3, accentColor: 'var(--green)', width: 16, height: 16 }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--charcoal-3)', lineHeight: 1.5 }}>
                  I agree to the{' '}
                  <span style={{ color: 'var(--green)', fontWeight: 600 }}>Terms & Conditions</span>
                  {' '}and confirm that all information provided is accurate. I understand the KSh {REGISTRATION_FEE.toLocaleString()} registration fee is non-refundable.
                </span>
              </label>
              {errors.agreeTerms && <span className="form-error">{errors.agreeTerms}</span>}
            </div>
          )}

          {/* ── Step 3: Payment ── */}
          {step === 3 && (
            <div>
              {/* Summary card */}
              <div style={{
                background: 'var(--off-white)', borderRadius: 'var(--radius)',
                padding: '20px 22px', marginBottom: 20,
                border: '1px solid var(--border)',
              }}>
                <h4 style={{ fontSize: '0.95rem', fontFamily:'DM Sans,sans-serif', fontWeight: 700, marginBottom: 14 }}>
                  📋 Application Summary
                </h4>
                {[
                  ['Name', `${form.firstName} ${form.lastName}`],
                  ['Email', form.email],
                  ['Phone', form.phone],
                  ['Location', form.location],
                  ['Role Applied', form.jobType],
                  ['Experience', form.experience],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex', justifyContent: 'space-between', gap: 12,
                    padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem',
                  }}>
                    <span style={{ color: 'var(--charcoal-3)', fontWeight: 500 }}>{k}</span>
                    <span style={{ fontWeight: 600, color: 'var(--charcoal)', textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Fee box */}
              <div style={{
                background: 'linear-gradient(135deg, var(--green) 0%, var(--green-mid) 100%)',
                borderRadius: 'var(--radius)', padding: '20px 22px', marginBottom: 20, color: '#fff',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', opacity: 0.85, marginBottom: 4 }}>One-time Registration Fee</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>
                      KSh {REGISTRATION_FEE.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontSize: '2.5rem' }}>💳</div>
                </div>
                <div style={{ fontSize: '0.78rem', opacity: 0.8, marginTop: 12 }}>
                  ✓ Secure payment via Paystack &nbsp; ✓ Non-refundable &nbsp; ✓ Instant confirmation
                </div>
              </div>

              <div className="alert alert-info">
                <span>ℹ️</span>
                <span style={{ fontSize: '0.85rem' }}>
                  After payment, your application is automatically submitted and you&apos;ll receive a confirmation email within minutes.
                </span>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                {['M-Pesa', 'Visa', 'Mastercard', 'Bank Transfer'].map(p => (
                  <span key={p} style={{
                    padding: '4px 12px', borderRadius: 6, fontSize: '0.78rem',
                    background: '#fff', border: '1px solid var(--border)',
                    color: 'var(--charcoal-3)', fontWeight: 500,
                  }}>{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Success ── */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: 20 }}>✅</div>
              <h3 style={{
                fontFamily: 'Playfair Display, serif', fontSize: '1.5rem',
                color: 'var(--charcoal)', marginBottom: 12,
              }}>
                You&apos;re all set, {form.firstName}!
              </h3>
              <p style={{ color: 'var(--charcoal-3)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 24 }}>
                Your application for <strong style={{color:'var(--green)'}}>{form.jobType}</strong> has been submitted successfully.
                A confirmation email has been sent to <strong>{form.email}</strong>.
              </p>
              <div style={{
                background: 'var(--green-pale)', borderRadius: 'var(--radius)',
                padding: '18px 22px', marginBottom: 24, textAlign: 'left',
              }}>
                <div style={{ fontWeight: 700, color: 'var(--green)', marginBottom: 10, fontSize: '0.9rem' }}>
                  🚀 What happens next?
                </div>
                {[
                  'Our team reviews your application within 2–3 business days.',
                  'Shortlisted candidates are contacted for a brief online interview.',
                  'Successful applicants receive onboarding materials via email.',
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: '0.88rem', color: 'var(--charcoal-3)' }}>
                    <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleClose} className="btn btn-primary">
                Close & Go Back to Home
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step < 4 && (
          <div className="modal-footer">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} disabled={loading}
                className="btn btn-outline">
                ← Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < 3 && (
              <button onClick={nextStep} disabled={loading} className="btn btn-primary">
                Continue →
              </button>
            )}
            {step === 3 && (
              <button onClick={handlePayment} disabled={loading || !paystackReady}
                className="btn btn-primary btn-lg"
                style={{ background: 'linear-gradient(135deg,#2D6A4F,#40916C)' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ display:'inline-block', width:16, height:16, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
                    Processing...
                  </span>
                ) : `Pay KSh ${REGISTRATION_FEE.toLocaleString()} & Submit`}
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 500px) {
          .modal-box { max-width: 100%; }
        }
      `}</style>
    </div>
  );
}
