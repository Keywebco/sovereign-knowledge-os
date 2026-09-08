/* ===== Sovereign Knowledge OS — Search + Preview ===== */
/* Fuse.js search with Echo Core 64 priority, split-pane preview, markdown render */
/* Progressive enhancement: works on top of pre-rendered HTML */

(function () {
  'use strict';

  /* ---------- STATE ---------- */
  var fuseCore = null;
  var fuseGeneral = null;
  var echoNodes = [];
  var generalEntries = [];
  var mdCache = {};

  /* ---------- DOM REFS ---------- */
  var searchInput, searchResults, leftPanel, rightPanel,
      previewTitle, previewBody, btnClose, btnNewTab,
      ecBody, ecToggle, ecHeader, ecList, ecTabs;

  /* ---------- INIT ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    searchInput   = document.getElementById('search-input');
    searchResults = document.getElementById('search-results');
    leftPanel     = document.getElementById('left-panel');
    rightPanel    = document.getElementById('right-panel');
    previewTitle  = document.getElementById('preview-title');
    previewBody   = document.getElementById('preview-body');
    btnClose      = document.getElementById('btn-close-preview');
    btnNewTab     = document.getElementById('btn-newtab');
    ecBody        = document.getElementById('ec-body');
    ecToggle      = document.getElementById('ec-toggle');
    ecHeader      = document.getElementById('ec-header');
    ecList        = document.getElementById('ec-list');
    ecTabs        = document.getElementById('ec-tabs');

    parseEchoCore();
    parseGeneralEntries();
    buildFuse();
    bindEvents();
    /* Do NOT call renderEchoCore here — the HTML is pre-rendered.
       Only re-render when a filter tab is clicked. */
  }

  /* ---------- PARSE ECHO CORE from pre-rendered data in HTML ---------- */
  function parseEchoCore() {
    var dataEl = document.getElementById('echo-core-data');
    if (!dataEl) return;
    try { echoNodes = JSON.parse(dataEl.textContent); }
    catch (e) { console.error('Echo Core parse error', e); }
  }

  /* ---------- PARSE GENERAL ENTRIES from pre-rendered data ---------- */
  function parseGeneralEntries() {
    var dataEl = document.getElementById('general-entries-data');
    if (!dataEl) return;
    try { generalEntries = JSON.parse(dataEl.textContent); }
    catch (e) { console.error('General entries parse error', e); }
  }

  /* ---------- BUILD FUSE INSTANCES ---------- */
  function buildFuse() {
    if (typeof Fuse === 'undefined') { console.warn('Fuse.js not loaded'); return; }
    fuseCore = new Fuse(echoNodes, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'desc', weight: 0.35 },
        { name: 'category', weight: 0.15 },
        { name: 'id', weight: 0.1 }
      ],
      threshold: 0.35, includeScore: true, minMatchCharLength: 2
    });
    fuseGeneral = new Fuse(generalEntries, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'content', weight: 0.4 },
        { name: 'category', weight: 0.2 }
      ],
      threshold: 0.4, includeScore: true, minMatchCharLength: 2
    });
  }

  /* ---------- EVENTS ---------- */
  function bindEvents() {
    searchInput.addEventListener('input', onSearch);
    btnClose.addEventListener('click', closePreview);
    ecHeader.addEventListener('click', toggleEcBody);

    ecTabs.addEventListener('click', function (e) {
      if (e.target.tagName !== 'BUTTON') return;
      ecTabs.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      e.target.classList.add('active');
      filterEchoCore(e.target.dataset.cat);
    });

    leftPanel.addEventListener('click', function (e) {
      /* Allow real <a> links to work normally — only intercept non-link clicks */
      if (e.target.closest('a[href]') && !e.target.closest('[data-preview]')) return;
      var entry = e.target.closest('[data-preview]');
      if (entry) {
        e.preventDefault();
        openPreview(entry.dataset.preview, entry.dataset.title || '', entry.dataset.mdpath || '');
      }
    });
  }

  /* ---------- SEARCH ---------- */
  function onSearch() {
    var q = searchInput.value.trim();
    if (q.length < 2) {
      searchResults.innerHTML = '';
      document.getElementById('main-content').style.display = '';
      return;
    }
    document.getElementById('main-content').style.display = 'none';

    var coreResults = fuseCore ? fuseCore.search(q, { limit: 15 }) : [];
    var genResults  = fuseGeneral ? fuseGeneral.search(q, { limit: 15 }) : [];
    var html = '';

    if (coreResults.length) {
      html += '<div class="sr-group-label core-label">⬡ Core Memory</div>';
      coreResults.forEach(function (r) {
        var n = r.item;
        var link = n.link || '';
        var mdp  = 'knowledge/echo-core.md';
        html += '<div class="sr-item" data-preview="' + esc(link || mdp) + '" data-title="' + esc(n.title) + '" data-mdpath="' + mdp + '">';
        html += '<span class="sr-badge core">' + esc(n.id) + '</span>';
        html += '<div><div class="sr-title">';
        if (link) {
          html += '<a href="' + esc(link) + '" target="_blank" rel="noopener">' + esc(n.title) + '</a>';
        } else {
          html += esc(n.title);
        }
        html += '</div>';
        html += '<div class="sr-desc">' + esc(n.desc) + '</div></div></div>';
      });
    }

    if (genResults.length) {
      html += '<div class="sr-group-label general-label">◈ General Knowledge</div>';
      genResults.forEach(function (r) {
        var n = r.item;
        html += '<div class="sr-item" data-preview="' + esc(n.path) + '" data-title="' + esc(n.title) + '" data-mdpath="' + esc(n.path) + '">';
        html += '<span class="sr-badge general">' + esc(n.category) + '</span>';
        html += '<div><div class="sr-title">';
        html += '<a href="' + esc(n.path) + '" target="_blank">' + esc(n.title) + '</a>';
        html += '</div>';
        html += '<div class="sr-desc">' + esc(n.content ? n.content.substring(0, 120) + '…' : '') + '</div></div></div>';
      });
    }

    if (!html) {
      html = '<div style="padding:24px;color:#999;">No results for "' + esc(q) + '"</div>';
    }
    searchResults.innerHTML = html;
  }

  /* ---------- ECHO CORE FILTER (via CSS visibility, preserving pre-rendered HTML) ---------- */
  function filterEchoCore(cat) {
    var nodes = ecList.querySelectorAll('.ec-node');
    nodes.forEach(function (node) {
      if (cat === 'all' || node.dataset.category.toLowerCase() === cat.toLowerCase()) {
        node.style.display = '';
      } else {
        node.style.display = 'none';
      }
    });
  }

  function toggleEcBody() {
    ecBody.classList.toggle('collapsed');
    ecToggle.classList.toggle('collapsed');
  }

  /* ---------- PREVIEW PANE ---------- */
  var currentPreviewUrl = '';

  function openPreview(url, title, mdpath) {
    rightPanel.classList.add('open');
    previewTitle.textContent = title || url;
    currentPreviewUrl = url;
    btnNewTab.onclick = function () { window.open(url.startsWith('http') ? url : url, '_blank'); };

    if (url.endsWith('.md') || mdpath.endsWith('.md')) {
      var p = mdpath || url;
      loadMd(p, function (raw) {
        previewBody.innerHTML = '<div class="md-render">' + renderMarkdown(raw) + '</div>' +
          (url.startsWith('http') ? '<a class="open-tab-btn" href="' + esc(url) + '" target="_blank">Open in new tab ↗</a>' : '');
      });
      return;
    }

    if (url.startsWith('http')) {
      var iframeId = 'preview-iframe-' + Date.now();
      previewBody.innerHTML = '<iframe id="' + iframeId + '" src="' + esc(url) + '" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>';
      var iframe = document.getElementById(iframeId);
      var fallbackTimer = setTimeout(function () { showIframeFallback(url, title, mdpath); }, 5000);
      iframe.onload = function () {
        clearTimeout(fallbackTimer);
        try { var _t = iframe.contentDocument || iframe.contentWindow.document; if (!_t) throw 0; }
        catch (e) { showIframeFallback(url, title, mdpath); }
      };
      iframe.onerror = function () { clearTimeout(fallbackTimer); showIframeFallback(url, title, mdpath); };
      return;
    }

    previewBody.innerHTML = '<div class="iframe-fallback"><p>No preview available.</p></div>';
  }

  function showIframeFallback(url, title, mdpath) {
    var html = '<div class="iframe-fallback">' +
      '<p>This site blocks embedded previews.</p>' +
      '<a class="open-tab-btn" href="' + esc(url) + '" target="_blank">Open in new tab ↗</a></div>';
    if (mdpath) {
      loadMd(mdpath, function (raw) {
        previewBody.innerHTML = '<div class="md-render">' + renderMarkdown(raw) + '</div>' +
          '<a class="open-tab-btn" href="' + esc(url) + '" target="_blank">Open in new tab ↗</a>';
      });
    } else {
      previewBody.innerHTML = html;
    }
  }

  function closePreview() {
    rightPanel.classList.remove('open');
    previewBody.innerHTML = '';
    previewTitle.textContent = '';
    currentPreviewUrl = '';
  }

  /* ---------- LOAD .MD FILE ---------- */
  function loadMd(path, cb) {
    if (mdCache[path]) { cb(mdCache[path]); return; }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) { mdCache[path] = xhr.responseText; cb(xhr.responseText); }
        else { cb('*Failed to load ' + path + '*'); }
      }
    };
    xhr.send();
  }

  /* ---------- SIMPLE MARKDOWN RENDERER ---------- */
  function renderMarkdown(md) {
    return '<p>' + md
      .replace(/^---+$/gm, '<hr>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
      .replace(/\n\n+/g, '</p><p>')
      .replace(/\n/g, '<br>') + '</p>';
  }

  /* ---------- UTIL ---------- */
  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
  }

})();
