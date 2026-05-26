# ReplyAgentAI — Job Application Website

A professional Next.js job application portal for AI email reply agents.
Applicants pay a **KSh 1,599** registration fee via **Paystack** before submitting.
No database required — confirmations are handled entirely via email (Nodemailer).

---

## Tech Stack

- **Next.js 14** (Pages Router)
- **Paystack** — payment processing (M-Pesa, Visa, Mastercard)
- **Nodemailer** — confirmation emails (Gmail SMTP)
- **Vercel** — deployment

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env.local
# Fill in all values (see below)

# 3. Start dev server
npm run dev
# → http://localhost:3000
```

---

## Environment Variables

Create `.env.local` (never commit this file):

```env
# Paystack — get from https://dashboard.paystack.com/#/settings/developer
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxx

# Gmail SMTP (use an App Password, not your actual Gmail password)
# Enable 2FA on Gmail → Settings → Security → App Passwords → Generate
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx

# Your Vercel deployment URL (or localhost for dev)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option B — GitHub Integration (recommended)

1. Push this repo to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Add all environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - `PAYSTACK_SECRET_KEY`
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `NEXT_PUBLIC_APP_URL`
5. Click **Deploy**

---

## Paystack Setup

1. Register at https://paystack.com
2. Complete KYC verification
3. Go to **Settings → API Keys & Webhooks**
4. Copy your **Public Key** and **Secret Key**
5. Set currency to **KES** in your Paystack dashboard
6. Test with test keys first (prefix `pk_test_` / `sk_test_`)

> ⚠️ For **M-Pesa** payments, ensure your Paystack account is KYC-verified and has M-Pesa enabled for KES transactions.

---

## Gmail App Password Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/security
3. Under "2-Step Verification", scroll to **App passwords**
4. Generate a password for "Mail" → "Other (custom)"
5. Use the 16-character code as `EMAIL_PASS`

---

## Project Structure

```
job-reply-agent/
├── pages/
│   ├── _app.js              # Global wrapper
│   ├── index.js             # Homepage (all sections)
│   └── api/
│       └── submit-application.js   # Paystack verify + send emails
├── components/
│   ├── Navbar.js            # Sticky navigation
│   ├── ApplicationModal.js  # 3-step application form + Paystack
│   └── Footer.js            # Footer
├── styles/
│   └── globals.css          # Global styles (white/charcoal/green)
├── public/                  # Static assets
├── .env.example
├── next.config.js
├── vercel.json
└── package.json
```

---

## Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| White | `#FFFFFF` | Backgrounds, cards |
| Off-white | `#F7F8F6` | Section backgrounds |
| Charcoal | `#1E2120` | Primary text, hero |
| Charcoal-2 | `#2C3130` | Dark sections |
| Green | `#2D6A4F` | Primary CTA, accents |
| Green-mid | `#40916C` | Hover states |
| Green-light | `#52B788` | Highlights |
| Green-pale | `#D8F3DC` | Badges, backgrounds |

---

## License

MIT — Free to use and customise.
