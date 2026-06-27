# Lasha Khurtsidze / Team4 Sales College

Modern luxury personal brand website built with React and Tailwind CSS CDN.

## Run

Use the bundled Node runtime in this Codex workspace:

```powershell
& "C:\Users\info\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.js
```

Then open:

```text
http://localhost:4173
```

The app is intentionally dependency-light: React, ReactDOM, Tailwind, and fonts load from CDNs, while the site source lives in `index.html`, `src/app.js`, and `src/styles.css`.

## Vercel live deployment

For live Vercel deployment, import the GitHub repository into Vercel and use:

```text
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

Manual payment buyer data is stored in Vercel Postgres. Receipt uploads are stored in Vercel Blob. Create and connect both stores from the Vercel project dashboard before production deploy.

See `DEPLOYMENT.md` for the full Vercel setup checklist.

## EmailJS contact form

The contact form sends to the local Node backend at `/api/contact/send`. The backend forwards the message to EmailJS and applies a free in-memory rate limit of 5 messages per 15 minutes per IP address. Configure EmailJS values with environment variables for production:

```text
EMAILJS_SERVICE_ID
EMAILJS_TEMPLATE_ID
EMAILJS_PUBLIC_KEY
ADMIN_EMAIL
```

Because the website now sends EmailJS requests from the backend, enable this free EmailJS dashboard setting before production:

```text
EmailJS Dashboard -> Account -> Security -> API access from non-browser environments
```

The EmailJS template must include these variables exactly: `{{title}}`, `{{name}}`, `{{email}}`, `{{phone}}`, `{{program}}`, `{{message}}`, and `{{to_email}}`.

## Facebook Messenger chat

The site includes the Facebook Messenger Customer Chat Plugin in `index.html` using Page ID `61571797572892`. The floating fallback button calls the embedded Facebook Customer Chat API instead of redirecting to Messenger. The plugin may not render on localhost unless the domain is added in Meta Business settings. The Facebook profile URL is:

```text
https://www.facebook.com/profile.php?id=61571797572892
```

## Admin panel

Open `/admin` and log in with the credentials configured in the production environment.

The admin login is handled by the Node server, not by frontend-only JavaScript. Passwords are stored server-side in `.data/admin-auth.json` as salted PBKDF2 hashes, and admin sessions use an HttpOnly cookie. The dashboard includes Change Password, Logout, session persistence, and a Forgot Password flow that sends a 6-digit reset code to `collegeteam4you@gmail.com` through the server.

For production, set these environment variables instead of relying on defaults:

```text
ADMIN_USERNAME
ADMIN_PASSWORD
ADMIN_EMAIL
EMAILJS_SERVICE_ID
EMAILJS_TEMPLATE_ID
EMAILJS_PUBLIC_KEY
```

Editable website content still saves to browser `localStorage` under `team4AdminContent`. Save changes, then refresh or preview the main website in the same browser to see the updates.

Admin-edited URLs are validated before the main website applies them. The site allows only `https://`, `mailto:`, safe internal paths/anchors, and local assets under `assets/` for image fields.

## Protected books and courses

The `/library` route adds the foundation for buyer-only content. Users can log in, see `ჩემი წიგნები -> მე ვარ პასუხი`, and read chapters only after an entitlement exists. Unregistered or unpaid users see:

```text
ეს მასალა ხელმისაწვდომია მხოლოდ მყიდველებისთვის.
```

The current static deployment includes a demo entitlement flow so the UI can be reviewed without a payment backend. Production should replace the demo layer in `src/library.js` with server APIs:

```text
POST /api/auth/login
GET /api/library/entitlements
GET /api/library/items/:id/chapters/:chapterId
POST /api/payments/webhook
GET /api/admin/purchases
```

The content model is intentionally reusable for future books and courses. Add new records to the catalog with `id`, `type`, `title`, `cover`, and `chapters` or lesson entries, then grant access through the same entitlement system.

Reader protections included in the frontend:

- PDF download is not exposed.
- Copy, cut, right click, Ctrl/Cmd+C, Ctrl/Cmd+P, and print are blocked on the reader page.
- The reader prints a watermark with the user's name and email over the text.
- Device registration is limited to 2 devices per email in the demo layer.

Important: frontend protections are deterrents, not real DRM. Enforce payment access, chapter delivery, device limits, and audit logs on the backend before selling protected content.

Admin now includes a Purchases / Access table showing who bought, when they bought, and what book or course they can access. In production this should read from `/api/admin/purchases`.

## CSP and CDN integrity

The Node server sends a `Content-Security-Policy` header, and all HTML pages include a CSP meta fallback for static hosting. External React scripts are pinned to React `18.3.1` and use SRI hashes. Tailwind CDN remains allowed by CSP but does not use SRI because `cdn.tailwindcss.com` is runtime-generated and can break page rendering when hash validation drifts. For a stricter production security posture, replace Tailwind CDN with a real build step and serve compiled CSS locally.
