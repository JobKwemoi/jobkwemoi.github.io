# Kirong Job Kwemoi — Portfolio (Real Site)

Your real, deployed portfolio — merged with new features. Single `index.html`
file plus SEO/asset files, ready for GitHub Pages exactly as before.

## What's new in this merge

1. **Your headshot photo** is now wired into the About section
   (`kirong-headshot.jpg`, root of the project — matches every reference
   in your SEO tags, favicon, and Open Graph metadata already in the file).

2. **Live availability status pill** — appears in the nav, the hero, and the
   footer. Change ONE value to update it everywhere:
   ```js
   const KIRONG_AVAILABILITY = "limited"; // "available" | "limited" | "booked"
   ```
   Find this near the top of the `<script>` block at the bottom of `index.html`.

3. **"View case study" modals** on every project card — Problem, Solution,
   Before → After, Features, Tech stack, Development time, Results, Live
   demo link, and a WhatsApp CTA pre-filled with the project name. Edit the
   `CASE_STUDIES` object in the script to update content.

4. **"What working with Kirong looks like" dashboard preview** — a new
   section right after Process, showing a real-feeling project-stage
   tracker (Design → Development → Content → Testing → Launch) with an
   animated progress bar.

5. **Trust & Security section** — HTTPS, secure forms, privacy-conscious
   integrations, accessible UI, clean code, no unnecessary tracking.

6. **Performance section** — wired to show real Lighthouse scores once you
   run an audit. It intentionally shows "Not yet audited" instead of a
   made-up number. Update `PERFORMANCE_SCORES` in the script:
   ```js
   const PERFORMANCE_SCORES = {
     measuredOn: "2026-09-12",
     scores: { performance: 98, accessibility: 96, bestPractices: 100, seo: 97 }
   };
   ```

## What was already real and untouched

- **Kirong AI** — still the real assistant at `kirongjob.vercel.app`, loaded
  in an iframe modal. Not a demo, not touched.
- **WhatsApp number, email, bilingual EN/SWA content** — all untouched.
- **Project Estimator** (your "Instant Estimate" section) — this already
  did what a "Project Builder" needed to do (tiers, add-ons, live WhatsApp
  message generation), so it wasn't rebuilt.
- **SEO**: schema.org JSON-LD, Open Graph, Twitter cards, sitemap.xml,
  robots.txt, and Google Search Console verification (both the file
  method and the meta tag) are all in place.

## Files in this folder

```
index.html                       ← the whole site (HTML + CSS + JS, one file)
kirong-headshot.jpg               ← your photo, used in About + all SEO tags
robots.txt                        ← crawler rules
sitemap.xml                       ← fixed to point at the real image path
googled64297f47c465ab7.html       ← Google Search Console verification file
```

## One thing to double check after deploying

The sitemap and meta tags assume everything deploys to the root of
`https://jobkwemoi.github.io/`. If you ever move to a custom domain or a
repo subpath, update the `<link rel="canonical">`, Open Graph URLs, and
`sitemap.xml` `<loc>` values to match.

## Deploying

```bash
git add .
git commit -m "Merge: photo, status pill, case studies, dashboard, trust & performance sections"
git push
```

GitHub Pages will pick it up automatically since this replaces your
existing `index.html` at the same paths.
