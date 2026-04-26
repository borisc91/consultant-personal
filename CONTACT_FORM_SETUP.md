# Contact form setup

The contact form posts to `POST /api/contact` and sends email through Resend.

Set these environment variables in Vercel:

```bash
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=boriscolovic@outlook.com
CONTACT_FROM_EMAIL=Boris SEO <contact@yourdomain.com>
```

`CONTACT_FROM_EMAIL` must use a sender/domain verified in Resend.

Spam filtering included:

- hidden honeypot field
- minimum time-to-submit check
- basic field validation
- message URL-count limit
- simple spam keyword check
- best-effort per-IP/user-agent rate limit

