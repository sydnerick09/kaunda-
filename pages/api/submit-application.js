import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    firstName, lastName, email, phone, location,
    jobType, experience, coverLetter, linkedin, portfolio,
    paymentRef, agreeTerms,
  } = req.body;

  /* ── Basic validation ── */
  if (!firstName || !lastName || !email || !phone || !jobType || !experience || !coverLetter || !paymentRef) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  if (!agreeTerms) {
    return res.status(400).json({ message: 'Terms must be accepted.' });
  }

  /* ── Verify Paystack payment ── */
  try {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(paymentRef)}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data?.status !== 'success') {
      return res.status(402).json({ message: 'Payment verification failed. Please contact support with your reference: ' + paymentRef });
    }

    // Verify amount paid (1599 KES = 159900 kobo/cents)
    const amountPaid = paystackData.data.amount;
    if (amountPaid < 159900) {
      return res.status(402).json({ message: 'Incomplete payment detected. Required: KSh 1,599.' });
    }

  } catch (err) {
    console.error('Paystack verification error:', err);
    return res.status(500).json({ message: 'Could not verify payment. Please contact support with ref: ' + paymentRef });
  }

  /* ── Send confirmation email to applicant ── */
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const applicantMail = {
      from: `"ReplyAgentAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Application Received – ${jobType} | ReplyAgentAI`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: 'DM Sans', Arial, sans-serif; background: #F7F8F6; margin: 0; padding: 0; }
            .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, #1E2120, #2C3130); padding: 40px 36px; text-align: center; }
            .logo { font-size: 24px; font-weight: 900; color: #fff; margin: 0; }
            .logo span { color: #52B788; }
            .hero-badge { display: inline-block; background: rgba(82,183,136,0.2); color: #52B788; padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 16px; }
            .body { padding: 40px 36px; }
            .greeting { font-size: 22px; font-weight: 700; color: #1E2120; margin-bottom: 12px; }
            .text { font-size: 15px; color: #3D4442; line-height: 1.7; margin-bottom: 16px; }
            .info-card { background: #F7F8F6; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid rgba(30,33,32,0.08); }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(30,33,32,0.07); font-size: 14px; }
            .info-row:last-child { border-bottom: none; }
            .info-key { color: #3D4442; font-weight: 500; }
            .info-val { color: #1E2120; font-weight: 700; text-align: right; }
            .ref-box { background: #D8F3DC; border-radius: 8px; padding: 14px 20px; margin: 20px 0; text-align: center; }
            .ref-text { font-size: 13px; color: #2D6A4F; font-weight: 600; }
            .timeline { margin: 28px 0; }
            .timeline-item { display: flex; gap: 14px; margin-bottom: 16px; align-items: flex-start; }
            .timeline-dot { width: 28px; height: 28px; border-radius: 50%; background: #2D6A4F; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
            .timeline-content h4 { font-size: 14px; font-weight: 700; color: #1E2120; margin: 0 0 4px; }
            .timeline-content p { font-size: 13px; color: #3D4442; margin: 0; }
            .cta-btn { display: block; background: linear-gradient(135deg, #2D6A4F, #40916C); color: #fff; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 15px; text-align: center; margin: 28px 0; }
            .footer { background: #1E2120; padding: 28px 36px; text-align: center; }
            .footer p { color: rgba(255,255,255,0.5); font-size: 12px; margin: 4px 0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <p class="logo">ReplyAgent<span>AI</span></p>
              <div class="hero-badge">Application Confirmed</div>
            </div>
            <div class="body">
              <p class="greeting">Hello ${firstName} ${lastName},</p>
              <p class="text">
                Congratulations! Your application has been successfully submitted and your registration fee of <strong>KSh 1,599</strong> has been confirmed. Welcome to the ReplyAgentAI community!
              </p>

              <div class="info-card">
                <div class="info-row"><span class="info-key">Full Name</span><span class="info-val">${firstName} ${lastName}</span></div>
                <div class="info-row"><span class="info-key">Email</span><span class="info-val">${email}</span></div>
                <div class="info-row"><span class="info-key">Phone</span><span class="info-val">${phone}</span></div>
                <div class="info-row"><span class="info-key">Location</span><span class="info-val">${location}</span></div>
                <div class="info-row"><span class="info-key">Role Applied</span><span class="info-val">${jobType}</span></div>
                <div class="info-row"><span class="info-key">Experience</span><span class="info-val">${experience}</span></div>
                <div class="info-row"><span class="info-key">Payment Ref</span><span class="info-val">${paymentRef}</span></div>
              </div>

              <div class="ref-box">
                <p class="ref-text">📌 Save your payment reference: <strong>${paymentRef}</strong></p>
              </div>

              <p class="text" style="font-weight: 700; color: #1E2120;">What happens next?</p>

              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-dot">1</div>
                  <div class="timeline-content">
                    <h4>Application Review (1–2 business days)</h4>
                    <p>Our team carefully reviews every application. You'll be notified of the outcome via email.</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot">2</div>
                  <div class="timeline-content">
                    <h4>Onboarding & Training Access</h4>
                    <p>Approved agents receive login credentials to our agent portal and training materials.</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot">3</div>
                  <div class="timeline-content">
                    <h4>First Assignment & Earnings</h4>
                    <p>Get matched to a client and start handling email queues. Paid every Friday via M-Pesa.</p>
                  </div>
                </div>
              </div>

              <p class="text">
                If you have any questions, reply to this email or contact us at <strong>support@replyagentai.com</strong>.
              </p>
            </div>
            <div class="footer">
              <p>ReplyAgentAI · Nairobi, Kenya</p>
              <p>© ${new Date().getFullYear()} ReplyAgentAI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    /* ── Notify admin/team ── */
    const adminMail = {
      from: `"ReplyAgentAI System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🆕 New Application: ${firstName} ${lastName} — ${jobType}`,
      html: `
        <h2>New Agent Application Received</h2>
        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px;">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Name</td><td style="padding:8px;border:1px solid #ddd;">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Email</td><td style="padding:8px;border:1px solid #ddd;">${email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Phone</td><td style="padding:8px;border:1px solid #ddd;">${phone}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Location</td><td style="padding:8px;border:1px solid #ddd;">${location}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Role</td><td style="padding:8px;border:1px solid #ddd;">${jobType}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Experience</td><td style="padding:8px;border:1px solid #ddd;">${experience}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">LinkedIn</td><td style="padding:8px;border:1px solid #ddd;">${linkedin || 'N/A'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Portfolio</td><td style="padding:8px;border:1px solid #ddd;">${portfolio || 'N/A'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Payment Ref</td><td style="padding:8px;border:1px solid #ddd;color:green;font-weight:bold;">${paymentRef}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Cover Letter</td><td style="padding:8px;border:1px solid #ddd;">${coverLetter}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Submitted At</td><td style="padding:8px;border:1px solid #ddd;">${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</td></tr>
        </table>
      `,
    };

    await transporter.sendMail(applicantMail);
    await transporter.sendMail(adminMail);

    return res.status(200).json({
      success: true,
      message: 'Application submitted successfully. Confirmation email sent.',
    });

  } catch (err) {
    console.error('Email send error:', err);
    // Payment was verified — don't fail the whole flow, just flag email issue
    return res.status(200).json({
      success: true,
      message: 'Application submitted. Note: confirmation email may be delayed.',
    });
  }
}
