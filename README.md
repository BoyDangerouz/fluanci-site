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

## Activate the forms

GitHub Pages cannot run a server. The waitlist (on the home page and the contact page) and the contact form share **one** Web3Forms access key, which is free and is meant to live in the public JavaScript.

Both forms are wired in `assets/main.js`:

```js
const FORM_ACCESS_KEY = "";
const FORM_ENDPOINT = "https://api.web3forms.com/submit";
```

Leave `FORM_ACCESS_KEY` as `""` until you have a real key. While it is empty, or still a placeholder such as `YOUR_ACCESS_KEY`, submitting a form opens the visitor's email app with a message addressed to hello@fluanci.com. Nothing is stored until they press send in that app.

To receive submissions in the Fluanci inbox:

1. Open [https://web3forms.com](https://web3forms.com) and create a free access key for **hello@fluanci.com**. Web3Forms emails each submission to that address. No paid plan and no server are required. The key is public by design. Do not put any other secret in this file.
2. In `assets/main.js`, set `FORM_ACCESS_KEY` to the key you were given. Leave `FORM_ENDPOINT` as `https://api.web3forms.com/submit` unless Web3Forms tells you to change it.
3. Commit and push to the branch GitHub Pages publishes (usually `main`).
4. Send one test from the home waitlist and one from the contact form. Each should show a success message on the page, and both should arrive at hello@fluanci.com.
   - Waitlist subject: `Fluanci waitlist signup`
   - Contact subject: `[General] Message from Name` (or Partnership / Other, matching the menu)
5. In the Web3Forms dashboard, turn on their spam filter if you want it. The site also drops a submission that fills either hidden field (`_gotcha` or `botcheck`).

If a submission fails after the key is set, the form shows an error and points people at hello@fluanci.com. To go back to the email-app fallback, set `FORM_ACCESS_KEY` to `""` again.

Web3Forms is the provider named in the privacy notice. If you switch providers, update that notice and this file together.

## Before going live
1. **Forms.** Follow "Activate the forms" above. Until the access key is set, the mailto fallback is what visitors get.
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
- Fonts, self-hosted in `assets/fonts` (SIL Open Font License): Syne for headings, Inter for body text.
