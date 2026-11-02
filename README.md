# fluanci.com

Static website for Fluanci (Pty) Ltd. Plain HTML, CSS and JavaScript: no build step, no frameworks.
Light default, dark mode, mobile-first. Hosted on GitHub Pages.

## Pages
- index.html    Home (hero, problem, approach, Lerato preview, vision, partners, waitlist)
- about.html    Origin story, mission, founder
- lerato.html   Lerato: languages, how conversation works, personality, phone tasks (prototype)
- vision.html   Roadmap and long-term learning vision
- contact.html  Contact form + separate waitlist form
- privacy.html  POPIA privacy notice (have this reviewed before relying on it)
- 404.html      Unknown URLs. Uses root-absolute links so GitHub Pages can serve it from any path
- robots.txt    Allows crawling and points at the sitemap
- sitemap.xml   Public pages only (not the 404)

## Forms

GitHub Pages cannot run a server. The waitlist (home and contact) and the contact form share one Web3Forms access key in `assets/main.js` (`FORM_ACCESS_KEY`). The key is already set. It is public by design: it only tells Web3Forms which inbox to use. Do not put any other secret in that file.

A successful submit is sent to [Web3Forms](https://web3forms.com), which emails hello@fluanci.com.

- Waitlist subject: `Fluanci waitlist signup`
- Contact subject: `[General] Message from Name` (or Partnership / Other, matching the menu)

If the browser cannot reach Web3Forms (offline, blocked, or the request fails before a response), the form opens the visitor's email app with the same message addressed to hello@fluanci.com. If Web3Forms responds but rejects the submission, the page shows an error and points people at hello@fluanci.com. The site also drops a submission that fills either hidden field (`_gotcha` or `botcheck`).

To rotate the key, create a new one at Web3Forms for hello@fluanci.com and replace `FORM_ACCESS_KEY`. Leave `FORM_ENDPOINT` as `https://api.web3forms.com/submit` unless Web3Forms tells you to change it. Clearing the key back to `""` makes every submit use the email-app path.

Web3Forms is the provider named in the privacy notice. If you switch providers, update that notice and this file together.

## Before going live
1. **Forms.** The Web3Forms key is already in `assets/main.js`. Send one test from the waitlist and one from the contact form and confirm both arrive at hello@fluanci.com. See "Forms" above.
2. **Partners.** Confirm Katlego Advisory and Joy Of Joys Organisation are happy to be listed.
3. **Privacy notice.** Have it reviewed before relying on it. The storage section already describes the mailto fallback and Web3Forms.

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
- Header and footer are repeated in each page; change every HTML file when you edit them. `404.html` uses paths that start with `/` so a missing page still loads the CSS.
- Fonts: Inter, self-hosted in `assets/fonts` (SIL Open Font License). Colour and spacing tokens are at the top of `assets/styles.css`.
