(function () {
  var html = document.documentElement;
  var btn = document.getElementById('theme-toggle');

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (btn) btn.textContent = theme === 'dark' ? 'light' : 'dark';
  }

  // Sync button label with current theme
  var current = html.getAttribute('data-theme') || 'dark';
  if (btn) btn.textContent = current === 'dark' ? 'light' : 'dark';

  if (btn) {
    btn.addEventListener('click', function () {
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  // Experience expand/collapse toggle
  var expToggle = document.getElementById('exp-toggle');
  if (expToggle) {
    expToggle.addEventListener('click', function () {
      var collapsed = document.querySelectorAll('.exp-collapsed');
      var isExpanded = collapsed.length > 0 && collapsed[0].style.display === 'block';
      collapsed.forEach(function (el) {
        el.style.display = isExpanded ? '' : 'block';
      });
      expToggle.textContent = isExpanded ? '[show more]' : '[show less]';
    });
  }

  // Visitor count from GoatCounter public counter API
  var countEl = document.getElementById('gc-count');
  if (countEl) {
    fetch('https://sai-pra.goatcounter.com/counter/%2F.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { countEl.textContent = d.count || '—'; })
      .catch(function () { countEl.textContent = '—'; });
  }

  // Blog post table of contents + scroll-spy
  var tocList = document.getElementById('post-toc-list');
  var content = document.querySelector('.post-content');
  if (tocList && content) {
    var headings = content.querySelectorAll('h1, h2');
    var links = [];

    headings.forEach(function (h) {
      if (!h.id) {
        h.id = h.textContent.trim().toLowerCase()
          .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      }
      var li = document.createElement('li');
      if (h.tagName === 'H2') li.className = 'toc-sub';
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      tocList.appendChild(li);
      links.push({ a: a, target: h });
    });

    if (links.length) {
      var toc = document.getElementById('post-toc');
      if (toc) toc.style.display = '';

      var setActive = function () {
        var pos = window.scrollY + 120;
        var current = links[0];
        for (var i = 0; i < links.length; i++) {
          if (links[i].target.offsetTop <= pos) current = links[i];
        }
        links.forEach(function (l) { l.a.classList.remove('active'); });
        current.a.classList.add('active');
      };

      var ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(function () { setActive(); ticking = false; });
          ticking = true;
        }
      }, { passive: true });
      setActive();
    } else {
      var tocEmpty = document.getElementById('post-toc');
      if (tocEmpty) tocEmpty.style.display = 'none';
    }
  }

  // Heading anchor links (added after TOC so TOC text stays clean)
  if (content) {
    content.querySelectorAll('h1, h2').forEach(function (h) {
      if (!h.id) {
        h.id = h.textContent.trim().toLowerCase()
          .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      }
      var a = document.createElement('a');
      a.className = 'heading-anchor';
      a.href = '#' + h.id;
      a.textContent = '#';
      a.setAttribute('aria-label', 'link to this section');
      a.addEventListener('click', function () {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(
            location.origin + location.pathname + '#' + h.id
          ).catch(function () {});
        }
      });
      h.appendChild(a);
    });
  }

  // Reading progress bar
  var progress = document.getElementById('read-progress');
  if (progress) {
    var updateProgress = function () {
      var el = document.documentElement;
      var max = el.scrollHeight - el.clientHeight;
      progress.style.width = (max > 0 ? (el.scrollTop / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  // Code copy buttons
  if (content) {
    content.querySelectorAll('pre').forEach(function (pre) {
      var btn = document.createElement('button');
      btn.className = 'code-copy';
      btn.type = 'button';
      btn.textContent = 'copy';
      btn.addEventListener('click', function () {
        var code = pre.querySelector('code') || pre;
        var text = code.innerText.replace(/\n?copy$/, '');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function () {
            btn.textContent = 'copied';
            setTimeout(function () { btn.textContent = 'copy'; }, 1500);
          }).catch(function () {});
        }
      });
      pre.appendChild(btn);
    });
  }

  // Blog index tag filter
  var tagFilter = document.getElementById('tag-filter');
  if (tagFilter) {
    var btns = tagFilter.querySelectorAll('.tag-btn');
    var items = document.querySelectorAll('#post-list .post-item');
    var applyTag = function (tag) {
      btns.forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-tag') === tag);
      });
      items.forEach(function (it) {
        var tags = (it.getAttribute('data-tags') || '').split(' ');
        it.classList.toggle('is-hidden', tag !== 'all' && tags.indexOf(tag) === -1);
      });
    };
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTag(btn.getAttribute('data-tag'));
      });
    });
    if (location.hash.indexOf('#tag-') === 0) {
      applyTag(location.hash.slice(5));
    }
  }
})();
