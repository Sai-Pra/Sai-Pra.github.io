# sai-pra.github.io

Source for my personal site at [sai-pra.github.io](https://sai-pra.github.io). If you're here because you want to use this as a starting point for your own site, instructions are below for onboarding :).

---

## what this is

A minimal personal/academic site built with Jekyll and deployed to GitHub Pages. Terminal-style aesthetic, dark/light mode, markdown-driven content, and a visitor counter via GoatCounter.

---

## using this as a template

### 1. fork or clone

Fork this repo or clone it and push to a new repo named `yourusername.github.io`.

### 2. update `_config.yml`

```yaml
title: Your Name
description: Your tagline
url: "https://yourusername.github.io"
email: you@email.com
github_username: yourusername
linkedin_username: your-linkedin
```

### 3. replace content

| File | What to change |
|---|---|
| `index.md` | Your name, bio, about text, links |
| `_data/experience.yml` | Your work experience |
| `_data/orgs.yml` | Your clubs / organizations |
| `research/index.md` | Your projects and skills |
| `assets/images/profile.jpg` | Your photo (keep it square, ~400px) |
| `resume/` | Your resume PDF |

### 4. set up analytics (optional)

This site uses [GoatCounter](https://goatcounter.com) — free, privacy-friendly, no cookie banner needed.

1. Sign up at goatcounter.com and choose a code (e.g. `yourname`)
2. In `_layouts/default.html`, replace the `data-goatcounter` URL with yours:
   ```html
   <script data-goatcounter="https://yourname.goatcounter.com/count"
           async src="//gc.zgo.at/count.js"></script>
   ```
3. In `assets/js/theme.js`, update the fetch URL for the visitor count:
   ```js
   fetch('https://yourname.goatcounter.com/counter/%2F.json')
   ```

If you don't want analytics, remove the `<script>` block from `_layouts/default.html` and the fetch call from `assets/js/theme.js`.

### 5. enable GitHub Pages

In your repo: **Settings → Pages → Source → GitHub Actions**.

Pushes to `main` will automatically build and deploy via `.github/workflows/jekyll.yml`.

---

## adding blog posts

Create a file in `_posts/` named `YYYY-MM-DD-your-slug.md`:

```markdown
---
layout: post
title: "Post Title"
date: 2026-09-01
---

Content in markdown.
```

---

## running locally

Requires Ruby 3.x and Bundler.

```bash
bundle install
bundle exec jekyll serve
```

Site is available at `http://localhost:4000`.

---

## structure

```
_config.yml          site config
_data/
  experience.yml     work experience
  orgs.yml           organizations
_layouts/            HTML templates
_posts/              blog posts
assets/
  css/main.css       all styles (edit for colors/fonts)
  js/theme.js        dark/light toggle + visitor counter
index.md             homepage
blog/index.html      blog listing
research/index.md    projects page (not linked in nav by default)
```

---

## customizing the look

Colors and fonts are all in `assets/css/main.css` under `:root` and `[data-theme="light"]`:

```css
:root {
  --bg:     #0c0c0c;
  --fg:     #e0e0e0;
  --accent: #4ade80;  /* change this for a different accent color */
}
```

The font is [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) loaded from Google Fonts — swap it out in `_layouts/default.html` and update `--font` in the CSS.
