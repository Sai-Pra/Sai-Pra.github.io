---
layout: default
---

<div class="hero">
  <div class="hero-text">
    <h1>saipranav venkatakrishnan</h1>
    <div class="tagline">incoming ms/phd @ uiuc</div>
    <div class="hero-divider">─────────────────────────────────</div>
    <div class="interests">computer architecture&nbsp;·&nbsp;hardware-software codesign&nbsp;·&nbsp;memory systems</div>
  </div>
  <div class="hero-photo">
    <img src="/assets/images/profile.jpg" alt="Saipranav Venkatakrishnan" />
  </div>
</div>

<section id="about" class="section">
  <h2 class="section-header">about</h2>
  <div class="about-text">
    <p>
      Incoming MS/PhD student (first-year master's) at the University of Illinois Urbana-Champaign,
      advised by Professor Jian Huang. I completed my B.S. in Computer Engineering at UIUC
      (May 2026, GPA 3.85), where I also did undergraduate research in Huang's group (PlatformX).
    </p>
    <p>
      My interests lie broadly in computer architecture, with a gorwing interest in hardware-software codesign
      and memory systems. I have worked in RTL/ASIC design (NVIDIA NVLink), GPU kernel
      optimization, and architectural simulation for AI accelerators.
    </p>
    <div class="about-links">
      <a href="mailto:saipranavvk@gmail.com">email</a>
      <a href="https://linkedin.com/in/saipranav-venkatakrishnan" target="_blank" rel="noopener">linkedin</a>
      <a href="https://github.com/Saipranavvk" target="_blank" rel="noopener">school github (primary)</a>
      <a href="https://github.com/Sai-Pra" target="_blank" rel="noopener">personal github (secondary)</a>
      <a href="/resume/Saipranav_Venkatakrishnan_Resume.pdf" target="_blank">resume</a>
    </div>
  </div>
</section>

<section id="experience" class="section">
  <h2 class="section-header">experience</h2>
  <ul class="exp-list">
  {% for exp in site.data.experience %}
    <li class="exp-item{% if exp.collapsed %} exp-collapsed{% endif %}">
      <div class="exp-meta">
        <span class="exp-role">{{ exp.role }}</span>
        <span class="exp-date">{{ exp.dates }}</span>
      </div>
      <div class="exp-company">{{ exp.company }}&nbsp;·&nbsp;{{ exp.location }}</div>
      {% if exp.bullets %}
      <ul class="exp-bullets">
        {% for bullet in exp.bullets %}
        <li>{{ bullet }}</li>
        {% endfor %}
      </ul>
      {% endif %}
    </li>
  {% endfor %}
  </ul>
  <button class="exp-toggle" id="exp-toggle">[show more]</button>
</section>

<section id="organizations" class="section">
  <h2 class="section-header">organizations</h2>
  <ul class="orgs-list">
  {% for org in site.data.orgs %}
    <li class="orgs-item">
      <span class="orgs-role">{{ org.role }}</span>
      <span class="orgs-org">{{ org.org }}</span>
      <span class="orgs-dates">{{ org.dates }}</span>
      {% if org.note %}
      <span class="orgs-note">{{ org.note }}</span>
      {% endif %}
    </li>
  {% endfor %}
  </ul>
</section>
