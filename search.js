/* ===== Sovereign Knowledge OS — Search + Preview ===== */
/* Fuse.js search with Echo Core 64 priority, split-pane preview, markdown render */

(function () {
  'use strict';

  /* ---------- STATE ---------- */
  let fuseCore = null;      // Fuse instance for Echo Core 64
  let fuseGeneral = null;   // Fuse instance for general .md content
  let echoNodes = [];       // parsed EC nodes
  let generalEntries = [];  // parsed .md file entries
  let mdCache = {};          // path -> raw markdown text

  /* ---------- DOM REFS ---------- */
  const searchInput   = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const leftPanel     = document.getElementById('left-panel');
  const rightPanel    = document.getElementById('right-panel');
  const previewTitle  = document.getElementById('preview-title');
  const previewBody   = document.getElementById('preview-body');
  const btnClose      = document.getElementById('btn-close-preview');
  const btnNewTab     = document.getElementById('btn-newtab');
  const ecBody        = document.getElementById('ec-body');
  const ecToggle      = document.getElementById('ec-toggle');
  const ecHeader      = document.getElementById('ec-header');
  const ecList        = document.getElementById('ec-list');
  const ecTabs        = document.getElementById('ec-tabs');

  /* ---------- INIT ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    parseEchoCore();
    parseGeneralEntries();
    buildFuse();
    bindEvents();
    renderEchoCore('all');
  }

  /* ---------- PARSE ECHO CORE from pre-rendered data in HTML ---------- */
  function parseEchoCore() {
    const dataEl = document.getElementById('echo-core-data');
    if (!dataEl) return;
    try {
      echoNodes = JSON.parse(dataEl.textContent);
    } catch (e) {
      console.error('Echo Core parse error', e);
    }
  }

  /* ---------- PARSE GENERAL ENTRIES from pre-rendered data ---------- */
  function parseGeneralEntries() {
    const dataEl = document.getElementById('general-entries-data');
    if (!dataEl) return;
    try {
      generalEntries = JSON.parse(dataEl.textContent);
    } catch (e) {
      console.error('General entries parse error', e);
    }
  }

  /* ---------- BUILD FUSE INSTANCES ---------- */
  function buildFuse() {
    if (typeof Fuse === 'undefined') {
      console.warn('Fuse.js not loaded');
      return;
    }
    const coreOpts = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'desc', weight: 0.35 },
        { name: 'category', weight: 0.15 },
        { name: 'id', weight: 0.1 }
      ],
      threshold: 0.35,
      includeScore: true,
      minMatchCharLength: 2
    };
    fuseCore = new Fuse(echoNodes, coreOpts);

    const genOpts = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'content', weight: 0.4 },
        { name: 'category', weight: 0.2 }
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2
    };
    fuseGeneral = new Fuse(generalEntries, genOpts);
  }

  /* ---------- EVENTS ---------- */
  function bindEvents() {
    searchInput.addEventListener('input', onSearch);
    btnClose.addEventListener('click', closePreview);
    ecHeader.addEventListener('click', toggleEcBody);

    // Echo Core category tabs
    ecTabs.addEventListener('click', function (e) {
      if (e.target.tagName !== 'BUTTON') return;
      ecTabs.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      e.target.classList.add('active');
      renderEchoCore(e.target.dataset.cat);
    });

    // Knowledge entry clicks (delegated)
    leftPanel.addEventListener('click', function (e) {
      var entry = e.target.closest('[data-preview]');
      if (entry) openPreview(entry.dataset.preview, entry.dataset.title || '', entry.dataset.mdpath || '');
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
        html += '<div><div class="sr-title">' + esc(n.title) + '</div>';
        html += '<div class="sr-desc">' + esc(n.desc) + '</div></div></div>';
      });
    }

    if (genResults.length) {
      html += '<div class="sr-group-label general-label">◈ General Knowledge</div>';
      genResults.forEach(function (r) {
        var n = r.item;
        html += '<div class="sr-item" data-preview="' + esc(n.path) + '" data-title="' + esc(n.title) + '" data-mdpath="' + esc(n.path) + '">';
        html += '<span class="sr-badge general">' + esc(n.category) + '</span>';
        html += '<div><div class="sr-title">' + esc(n.title) + '</div>';
        html += '<div class="sr-desc">' + esc(n.content ? n.content.substring(0, 120) + '…' : '') + '</div></div></div>';
      });
    }

    if (!html) {
      html = '<div style="padding:24px;color:#999;">No results for "' + esc(q) + '"</div>';
    }

    searchResults.innerHTML = html;
  }

  /* ---------- ECHO CORE RENDER ---------- */
  function renderEchoCore(cat) {
    var nodes = cat === 'all' ? echoNodes : echoNodes.filter(function (n) {
      return n.category.toLowerCase() === cat.toLowerCase();
    });
    var html = '';
    nodes.forEach(function (n) {
      var link = n.link || '';
      var mdp  = 'knowledge/echo-core.md';
      html += '<div class="ec-node" data-preview="' + esc(link || mdp) + '" data-title="' + esc(n.title) + '" data-mdpath="' + mdp + '">';
      html += '<span class="ec-id">' + esc(n.id) + '</span>';
      html += '<div class="ec-info"><span class="ec-title">' + esc(n.title) + '</span>';
      html += '<span class="ec-cat">' + esc(n.category) + '</span>';
      html += '<div class="ec-desc">' + esc(n.desc) + '</div></div></div>';
    });
    ecList.innerHTML = html;
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

    // Internal .md file
    if (url.endsWith('.md') || mdpath.endsWith('.md')) {
      var p = mdpath || url;
      loadMd(p, function (raw) {
        previewBody.innerHTML = '<div class="md-render">' + renderMarkdown(raw) + '</div>' +
          (url.startsWith('http') ? '<a class="open-tab-btn" href="' + esc(url) + '" target="_blank">Open in new tab ↗</a>' : '');
      });
      return;
    }

    // External URL — try iframe, fallback to md content
    if (url.startsWith('http')) {
      var iframeId = 'preview-iframe-' + Date.now();
      previewBody.innerHTML = '<iframe id="' + iframeId + '" src="' + esc(url) + '" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>';
      var iframe = document.getElementById(iframeId);
      var fallbackTimer = setTimeout(function () {
        showIframeFallback(url, title, mdpath);
      }, 5000);

      iframe.onload = function () {
        clearTimeout(fallbackTimer);
        try {
          // test access — if blocked, this will throw
          var _test = iframe.contentDocument || iframe.contentWindow.document;
          if (!_test) throw new Error('blocked');
        } catch (e) {
          showIframeFallback(url, title, mdpath);
        }
      };
      iframe.onerror = function () {
        clearTimeout(fallbackTimer);
        showIframeFallback(url, title, mdpath);
      };
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
        if (xhr.status === 200) {
          mdCache[path] = xhr.responseText;
          cb(xhr.responseText);
        } else {
          cb('*Failed to load ' + path + '*');
        }
      }
    };
    xhr.send();
  }

  /* ---------- SIMPLE MARKDOWN RENDERER ---------- */
  function renderMarkdown(md) {
    var html = md
      // Horizontal rules (must be before list processing)
      .replace(/^---+$/gm, '<hr>')
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // Bold + italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links  [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Unordered lists (- item)
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // Wrap consecutive <li> in <ul>
      .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
      // Paragraphs — double newlines
      .replace(/\n\n+/g, '</p><p>')
      // Single newlines inside paragraphs
      .replace(/\n/g, '<br>');

    return '<p>' + html + '</p>';
  }

  /* ---------- UTIL ---------- */
  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
  }

})();
