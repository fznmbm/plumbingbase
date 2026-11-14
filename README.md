# PlumbingBase — plumbingbase.co.uk

Static website + Vercel serverless booking function for PlumbingBase, plumbers in Crawley.

## Structure
```
build.mjs                 → generates every page into /public (no dependencies)
src/site.config.mjs       → phone, WhatsApp, email, address, hours, areas, reviews
src/content/services.mjs  → all 10 service pages (copy, lists, FAQs)
src/lib/layout.mjs        → header, footer, floating WhatsApp, mobile bar, SEO/schema
src/lib/forms.mjs         → booking + call-back forms
src/assets/               → css, js, fonts (self-hosted), images/logo
api/book.js               → POST /api/book → emails via Resend
vercel.json               → build settings, clean URLs, security & cache headers
```
Edit content → `npm run build` → open `/public`. On Vercel the build runs automatically.

## Deploy to Vercel
1. Push this folder to a GitHub repo and import it in Vercel (framework preset: **Other**). `vercel.json` sets the build command and output directory.
2. **Domains:** add `plumbingbase.co.uk` and `www.plumbingbase.co.uk` in Vercel → Settings → Domains and set the DNS records it shows at your registrar.
3. **Email (Resend):** create an account at resend.com → Domains → add `plumbingbase.co.uk` → add the DNS records (SPF/DKIM) → create an API key.
4. **Environment variables** (Vercel → Settings → Environment Variables), see `.env.example`:
   - `RESEND_API_KEY` (required)
   - `BOOKING_TO_EMAIL` (default plumbingbasecrawley@gmail.com)
   - `FROM_EMAIL` (default `PlumbingBase <bookings@plumbingbase.co.uk>`)
   - `TURNSTILE_SECRET` (optional)
5. Redeploy, then send a test booking. Check the Gmail spam folder the first time and mark as "Not spam".

## Optional: spam protection (Cloudflare Turnstile)
Create a free Turnstile widget for plumbingbase.co.uk, put the **site key** in `src/site.config.mjs` → `turnstileSiteKey`, and the **secret** in Vercel as `TURNSTILE_SECRET`. A honeypot field is always active.

## After launch
- Create/claim the **Google Business Profile** (same name, address, phone as the site) and add the site URL.
- Submit `https://plumbingbase.co.uk/sitemap.xml` in Google Search Console.
- Once real Google reviews come in, add them to `reviews` in `site.config.mjs` and set `googleReviewsUrl` — the reviews section appears automatically.
- Add real photos of the team/van/work when available (big boost for trust).

## Claims to confirm with the client
Copy avoids unverifiable claims (no "fully insured", years trading, star ratings, accreditations). Confirm before launch:
- Payment methods (site says bank transfer & card) and 24h cancellation note in Terms
- Saturday hours (set to 8am–5pm)
- Legal/company name for the footer, privacy policy and terms
