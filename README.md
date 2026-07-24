# Yinfeng Zeng — Academic Homepage

A fast, modern, single-page academic site. No build step, no frameworks — just
`index.html`, `style.css`, and `script.js`. It works by opening `index.html`
in a browser and can be hosted for free.

## Features

- Art-directed, high-contrast design with one electric accent (Space Grotesk display + mono labels)
- **Generative flow-field hero** — a live particle current on canvas that parts around your cursor
- **Interactive research map** — your themes as draggable, physics-driven nodes with a live detail panel
- Custom cursor with contextual labels (auto-off on touch)
- Kinetic type: headings skew/unmask on scroll, statement animates word-by-word, running marquee
- Subtle film grain; dark + light (warm paper) mode, remembers choice — dark is default
- Scrollspy nav, publication filter chips, collapsing mobile menu, live Cambridge clock
- All motion respects "reduce motion"; canvases pause when off-screen
- Everything is a placeholder in `[brackets]` — search for `EDIT` in the files

## Turning effects on/off

- **Flow-field hero:** delete the `<canvas id="flow">` element (the hero stays, just static).
- **Research map content:** edit `RESEARCH_NODES` and `RESEARCH_EDGES` near the top of `script.js` — that's where node labels, descriptions, and connections live.
- **Custom cursor:** delete the `<div class="cursor" ...>` element.
- **Film grain:** delete the `<div class="grain">` element, or lower `--grain` in `style.css`.
- **Marquee / clock:** delete `<div class="marq">` / `<div class="nav__clock">`.
- **Accent / colors:** edit the variables at the top of `style.css` (`--bg`, `--text`, `--accent`, …). Dark values live under `:root`; light under `[data-theme="light"]`.

## How to customize (start here)

Open `index.html` and look for comments marked `EDIT` and text in `[brackets]`.

1. **Header / meta** — top of `index.html`: page title and description (show in Google and link previews).
2. **Hero** — your name and one-line research summary.
3. **About statement** — the big sentence in the Work section; keep it punchy (it animates word-by-word).
4. **Research map** — edit `RESEARCH_NODES` / `RESEARCH_EDGES` in `script.js` (labels + descriptions + links).
5. **Publications** — duplicate a `<li class="pub">` block per paper. Set `data-type` to `preprint`, `conference`, or `journal` so the filter chips work.
6. **CV** — fill the three columns (education, experience, awards/tools).
7. **Contact** — email and social links.

### Add your images

Create an `assets/` folder next to `index.html` and add:

- `assets/profile.jpg` — your headshot (portrait, ~4:5 works best)
- `assets/cv.pdf` — your CV (the Download CV buttons link here)
- `assets/pub1.png`, `pub2.png`, … — optional publication thumbnails

If an image is missing, the site degrades gracefully (shows a placeholder), so you can add them later.

### Change the colors

In `style.css`, edit the variables at the very top under `:root` — mainly
`--accent` and `--accent-2`. The whole site recolors from those two values.
Dark-mode colors are under `[data-theme="dark"]`.

## Preview locally

Just double-click `index.html`. For a local server (optional):

```bash
cd "Personal Website"
python3 -m http.server 8000
# then open http://localhost:8000
```

## Put it online (free)

**Recommended: GitHub Pages** — free, gives you a clean URL, easy to update.

1. Create a free account at github.com.
2. Create a new **public** repository named `yourusername.github.io`.
3. Upload `index.html`, `style.css`, `script.js`, and your `assets/` folder
   (drag-and-drop in the repo's "Add file → Upload files").
4. Go to the repo's **Settings → Pages**, set source to the `main` branch, `/root`.
5. Your site goes live at `https://yourusername.github.io` within a minute or two.

**Custom domain (optional):** buy a domain (e.g. `yinfengzeng.com`), then in
Settings → Pages add it under "Custom domain" and point your domain's DNS to GitHub.

**Other free hosts** that also work with drag-and-drop: Netlify, Cloudflare Pages,
Vercel. Any of them can host these three files as-is.

## A tip on academic sites

Keep it current and skimmable: a recruiter or collaborator should learn who you
are, what you work on, and how to reach you within ten seconds. Update the News
section a few times a year — it's the cheapest signal that you're active.
