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

    script.onerror = () =>
      setGlobalError('Failed to load payment system. Please refresh the page.');

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
      setGlobalError('Payment system not ready. Please wait a moment.');
      return;
    }

    if (typeof window === 'undefined' || !window.PaystackPop) {
      setGlobalError('Payment library failed to load. Refresh page.');
      return;
    }

    if (!form.email) {
      setGlobalError("Email is required before payment");
      return;
    }

    console.log("CLICKED PAY BUTTON");
    console.log("Email:", form.email);

    setGlobalError('');
    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: REGISTRATION_FEE * 100,
      currency: 'KES',

      ref: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,

      metadata: {
        custom_fields: [
          {
            display_name: 'Applicant Name',
            variable_name: 'applicant_name',
            value: `${form.firstName} ${form.lastName}`
          },
          {
            display_name: 'Job Type',
            variable_name: 'job_type',
            value: form.jobType
          },
          {
            display_name: 'Phone',
            variable_name: 'phone',
            value: form.phone
          }
        ]
      },

      callback: function (response) {
        console.log("PAYMENT SUCCESS:", response);

        setTimeout(async () => {
          try {
            await submitApplication(response.reference);
          } catch (err) {
            console.error(err);
            setGlobalError("Payment succeeded but submission failed.");
          }
        }, 800);
      },

      onClose: function () {
        setLoading(false);
      }
    });

    handler.openIframe();
  };

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
        throw new Error(data.message || 'Submission failed');
      }

      setSubmitted(true);
      setStep(4);

    } catch (err) {
      setGlobalError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-box">

        <h3>Apply</h3>

        {step === 1 && (
          <>
            <input name="firstName" placeholder="First Name" onChange={change} />
            <input name="lastName" placeholder="Last Name" onChange={change} />
            <input name="email" placeholder="Email" onChange={change} />
            <input name="phone" placeholder="Phone" onChange={change} />
            <input name="location" placeholder="Location" onChange={change} />
            <button onClick={nextStep}>Next</button>
          </>
        )}

        {step === 2 && (
          <>
            <select name="jobType" onChange={change}>
              <option value="">Select Job</option>
              {JOB_TYPES.map(j => <option key={j}>{j}</option>)}
            </select>

            <select name="experience" onChange={change}>
              <option value="">Experience</option>
              {EXPERIENCE.map(e => <option key={e}>{e}</option>)}
            </select>

            <textarea name="coverLetter" onChange={change} />

            <label>
              <input type="checkbox" name="agreeTerms" onChange={change} />
              Agree Terms
            </label>

            <button onClick={nextStep}>Next</button>
          </>
        )}

        {step === 3 && (
          <>
            <h3>Pay KSh {REGISTRATION_FEE}</h3>
            <button onClick={handlePayment} disabled={loading}>
              Pay Now
            </button>
          </>
        )}

        {step === 4 && (
          <h2>Success 🎉</h2>
        )}

      </div>
    </div>
  );
}