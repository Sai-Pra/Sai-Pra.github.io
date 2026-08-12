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
})();
