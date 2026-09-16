# Kirong Job Kwemoi — Portfolio (Latest Build)

Your real, deployed portfolio — now on its most advanced version, with a
CTR-optimized search result as the first SEO upgrade. Single `index.html`
file plus SEO/asset files, ready for GitHub Pages exactly as before.

## What changed in this update

1. **Full site replaced with your newest build** — this version includes
   everything your latest file had: the real Kirong AI agent platform
   spotlight (autonomous agents, sandboxed code execution, human-approval
   safety layer), the command palette (⌘K / Ctrl+K to jump to any section),
   the quick Project Brief modal, mobile + desktop performance scores shown
   separately, and the pricing-section availability urgency note.

2. **Phase 1 of the SEO plan — CTR-optimized `<head>`** (based on your
   Search Console export showing 34.59% overall CTR, position 2.39,
   Kenya CTR 45.45% at position 1.93):
   - Title: `Kirong Job Kwemoi | Software & AI Developer in Nairobi, Kenya`
     (tighter, leads with the two things people are actually searching —
     "software" and "AI" — instead of listing three roles)
   - Meta description rewritten to be more specific about outcomes
     ("fast websites, WhatsApp-connected systems and AI tools... in Kenya
     and worldwide") and mentions the AI agent case study as a hook
   - Open Graph and Twitter titles/descriptions updated to match, so link
     previews are consistent with the search result
   - Schema.org JSON-LD, canonical URL, hreflang tags left as-is — they
     were already solid

## Phase 2 — the full landing-page set (now built)

After the initial caution about keyword cannibalization, you asked to go
ahead with the full Phase 2 plan anyway. Here's what that risk-mitigation
looked like in practice, and what got built:

**The risk:** four pages all describing "web development in Nairobi" in
slightly different words would confuse Google about which one to rank,
and split your site's authority across pages instead of concentrating it.

**How each page avoids that:** every page below has a genuinely different
angle, not a reworded version of the same pitch — one is about business
systems and internal tools, one is about AI agents specifically, one is
about customer-facing e-commerce/WhatsApp flows, one is about design
process. They also link to each other under "Related work," so Google
sees them as a connected set with distinct roles, not five pages
competing for the same query.

| Page | Angle | Targets |
|---|---|---|
| `kirong-ai.html` | Deep technical case study of your own AI product | "AI Developer Kenya", "AI agent case study" |
| `software-developer-nairobi.html` | Business systems, internal tools, custom software | "Software Developer Nairobi" |
| `ai-developer-kenya.html` | AI agents & automation as a service, chatbot-vs-agent distinction | "AI Developer Kenya" |
| `web-developer-nairobi.html` | Customer-facing business websites, WhatsApp ordering flow | "Web Developer Nairobi" |
| `uiux-designer-kenya.html` | Design process and philosophy | "UI/UX Designer Kenya" |

**Internal linking:** the homepage's Services bento cards now each link to
the matching page ("Learn more →"), the Kirong AI section links to both
`kirong-ai.html` (technical write-up) and `ai-developer-kenya.html` (AI
services generally), and all four service pages cross-link to each other
plus back to the homepage's project section. This is the hierarchy
structure from the original SEO analysis: Home → service page → deeper
page → projects, all connected instead of orphaned.

All five new pages are in `sitemap.xml` with their own title, meta
description, Open Graph tags, and Schema.org markup (`TechArticle` for
the Kirong AI write-up, `ProfessionalService` for the four service pages).

## Backlinks — the other lever I'd pull before more pages

See `BACKLINK-COPY.md` — ready-to-paste copy for your GitHub profile
README, LinkedIn headline/about, and a shortlist of free directories
(including Google Business Profile, which matters a lot for "Nairobi"
searches). Backlinks from profiles you already control are usually
faster and lower-risk than new pages for a site this size.

## Files in this folder

```
index.html                       ← the homepage (HTML + CSS + JS, one file)
kirong-ai.html                    ← Kirong AI technical case study
software-developer-nairobi.html   ← Software Developer Nairobi landing page
ai-developer-kenya.html           ← AI Developer Kenya landing page
web-developer-nairobi.html        ← Web Developer Nairobi landing page
uiux-designer-kenya.html          ← UI/UX Designer Kenya landing page
kirong-headshot.jpg               ← your photo, used across all SEO tags
robots.txt                        ← crawler rules
sitemap.xml                       ← all 5 pages listed
googled64297f47c465ab7.html       ← Google Search Console verification file
BACKLINK-COPY.md                  ← ready-to-paste GitHub/LinkedIn copy (not part of the site)
```

## Watching for the cannibalization risk after launch

Since this was the exact concern going in, keep an eye on it in Search
Console over the next month: under Performance → Pages, check whether
impressions for a given query start splitting evenly across two of your
pages (a sign Google is unsure which to rank) rather than consolidating
on one. If that happens for a specific term, it usually means two pages'
content drifted closer together than planned — worth flagging so the
weaker page's copy can be adjusted to pull further apart.

## Things you still control in `index.html`

Near the top of the `<script>` block at the bottom of the file:

- `KIRONG_AVAILABILITY` — `"available"` | `"limited"` | `"booked"`, drives
  the status pill in nav/hero/footer and the pricing urgency note
- `PERFORMANCE_SCORES` — real Lighthouse numbers only; currently set from
  your Sep 14, 2026 measurement (mobile 86/100/100/100, desktop 97/96/100/100)
- `CASE_STUDIES` — the six case-study modals, including the Kirong AI
  technical case study with its architecture diagram and engineering-layer
  cards

## Deploying

```bash
git add .
git commit -m "Latest build + Phase 1 SEO: CTR-optimized title/description"
git push
```

GitHub Pages will pick it up automatically at the same paths as before.

## Measuring the SEO change

Since your Search Console export is the "V1 benchmark," check back in a
few weeks under Search Console → Performance, filtering to Kenya first
(where you're already strongest), and watch specifically for: CTR moving
past 34.59% on the homepage query, and whether impressions start showing
up for terms beyond your brand name (the SEO analysis flagged this as the
real weak point — thin keyword footprint outside "Kirong").
