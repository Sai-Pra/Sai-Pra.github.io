---
layout: post
title: "post template"
date: 2026-08-12
---

Given this repo is open source and available on my github, this post serves as a template for other utilizing this same stack.

To write a post, create a file in `_posts/` named `YYYY-MM-DD-your-slug.md` with this front matter at the top:

```
---
layout: post
title: "Your Title"
date: YYYY-MM-DD
---
```

Everything after the front matter is standard markdown. A few things that render nicely on this site:

**Headers** — use `##` and `###` for section breaks.

**Code blocks** — fenced with triple backticks, syntax highlighting works for most languages (Verilog, Python, C++, bash, etc.).

**Inline code** — wrap in single backticks, e.g. `signal_name` or `git commit`.

**Blockquotes** — prefix lines with `>`, good for paper excerpts or quotes.

**Bold / italic** — `**bold**` and `*italic*`.

Links render as `[text](url)`. Images aren't styled by default but work if you need them.

---

Posts appear in the blog listing automatically, ordered by date. To remove this template, delete this file.
