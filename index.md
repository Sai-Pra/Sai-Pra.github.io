---
layout: default
wide: true
---

<div class="hero">
  <div class="hero-text">
    <h1>saipranav venkatakrishnan</h1>
    <div class="tagline">incoming ms/phd @ uiuc</div>
    <div class="hero-divider">─────────────────────────────────</div>
    <div class="interests">computer architecture&nbsp;·&nbsp;hardware-software co-design&nbsp;·&nbsp;ASIC-ification</div>
    <div class="hero-status"><span class="hero-status-key">currently</span> starting MS/PhD research @ UIUC · writing up thoughts on my <a href="/blog/">blog</a></div>
  </div>
  <div class="hero-photo">
    <img src="/assets/images/profile.jpg" alt="Saipranav Venkatakrishnan" />
  </div>
</div>

<section id="about" class="section">
  <h2 class="section-header">about</h2>
  <div class="about-grid">
    <div class="about-text">
      <p>
        Incoming MS student (first-year master's) at the University of Illinois Urbana-Champaign.
        I completed my B.S. in Computer Engineering at UIUC
        (May 2026), I did undergraduate research in Professor Jian Huang's group (PlatformX).
      </p>
      <p>
        My interests lie broadly in computer architecture, with more specifics to be discovered.
        I have done work in RTL/ASIC design (NVIDIA NVLink), GPU/specialized-accelerator kernel
        optimizations, and architectural simulation for AI accelerators.
      </p>
      <div class="about-links">
        <a href="mailto:saipranavvk@gmail.com">email</a>
        <a href="https://linkedin.com/in/saipranav-venkatakrishnan" target="_blank" rel="noopener">linkedin</a>
        <a href="https://github.com/Saipranavvk" target="_blank" rel="noopener">github (primary)</a>
        <a href="https://github.com/Sai-Pra" target="_blank" rel="noopener">github (secondary)</a>
        <a href="/resume/Saipranav_Venkatakrishnan_Resume_Brief.pdf" target="_blank">resume (brief)</a>
        <a href="/resume/Saipranav_Venkatakrishnan_Resume.pdf" target="_blank">resume (full)</a>
      </div>
    </div>
    <aside class="about-card">
      <div class="about-card-title">at a glance</div>
      <dl class="facts">
        <dt>location</dt><dd>Champaign, IL</dd>
        <dt>school</dt><dd>UIUC ECE</dd>
        <dt>focus</dt><dd>computer architecture</dd>
        <dt>advisor</dt><dd>Jian Huang · PlatformX</dd>
        <dt>recently</dt><dd>ASIC design @ NVIDIA</dd>
      </dl>
    </aside>
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

<section id="projects" class="section">
  <h2 class="section-header">projects</h2>
  <div class="proj-grid">
  {% for proj in site.data.projects %}
    <div class="proj-card">
      <div class="proj-head">
        <span class="proj-name">{{ proj.name }}</span>
        <span class="proj-date">{{ proj.dates }}</span>
      </div>
      <div class="proj-tech">{{ proj.tech }}</div>
      <ul class="proj-bullets">
        {% for b in proj.bullets %}
        <li>{{ b }}</li>
        {% endfor %}
      </ul>
    </div>
  {% endfor %}
  </div>
</section>

<section id="skills" class="section">
  <h2 class="section-header">skills</h2>
  <div class="skills-grid">
    <div class="skill-row">
      <span class="skill-label">languages</span>
      <span class="skill-value">SystemVerilog, Verilog, C, C++, CUDA C++, Python</span>
    </div>
    <div class="skill-row">
      <span class="skill-label">eda & tools</span>
      <span class="skill-value">Synopsys Design Compiler, VCS, Verdi, Verilator, Yosys, Spyglass, CDC/RDC Analysis, Vivado, Vitis, Git, Docker</span>
    </div>
    <div class="skill-row">
      <span class="skill-label">gpu & ml</span>
      <span class="skill-value">Nvidia Nsight Compute/Systems, PyTorch, CUDA, Vulkan</span>
    </div>
    <div class="skill-row">
      <span class="skill-label">areas</span>
      <span class="skill-value">ASIC &amp; RTL Design, Hardware–Software Co-design, Computer Architecture, VLSI Design, Logic Synthesis, Parallel Programming</span>
    </div>
  </div>
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
