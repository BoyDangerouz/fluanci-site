# fluanci.com

Static website for Fluanci (Pty) Ltd. Plain HTML, CSS and JavaScript: no build step, no frameworks.
Built from the "Fluanci Website Design Spec v1.0" (light default, dark mode, mobile-first).

## Pages
- index.html    Home (hero, problem, approach, Lerato preview, vision, partners, waitlist)
- about.html    Origin story, mission, founder
- lerato.html   Lerato: languages, how conversation works, personality, phone tasks (prototype)
- vision.html   Roadmap and long-term learning vision
- contact.html  Contact form + separate waitlist form
- privacy.html  POPIA privacy notice (have this reviewed before relying on it)

## Before going live
1. **Forms.** Right now the waitlist and contact forms open the visitor's email app with a
   pre-filled message to hello@fluanci.com. To receive submissions directly instead:
   create two free forms at https://formspree.io, then paste their URLs into
   `FORM_ENDPOINTS` at the top of `assets/main.js`.
2. **Partners.** Confirm Katlego Advisory and Joy Of Joys Organisation are happy to be listed.
3. **Founder photo (optional).** Add one to about.html when you have a good portrait.

## Publish on GitHub Pages
1. Create a repo (e.g. `fluanci-site`) and push the contents of this folder to `main`.
2. Settings > Pages > Source: Deploy from branch, `main`, `/ (root)`.
3. Custom domain: `fluanci.com` (the CNAME file sets this). Tick "Enforce HTTPS" when it appears.

## Point the domain (Namecheap > Domain List > Manage > Advanced DNS)
Delete the parking records (`www` CNAME to parkingpage and the `@` URL Redirect).
Keep the Zoho TXT, DKIM and Mail Settings (MX) records exactly as they are. Then add:

| Type  | Host | Value                   |
|-------|------|-------------------------|
| A     | @    | 185.199.108.153         |
| A     | @    | 185.199.109.153         |
| A     | @    | 185.199.110.153         |
| A     | @    | 185.199.111.153         |
| CNAME | www  | boydangerouz.github.io. |

## Editing
- Colours, fonts, spacing: tokens at the top of `assets/styles.css` (light and dark).
- Header and footer are repeated in each page; change all six files when you edit them.
- Fonts: Inter, self-hosted in `assets/fonts` (SIL Open Font License).
