// Live GitHub data for the project cards. The HTML carries static fallback values,
// so the page reads correctly when this script or the GitHub API is not available.
(() => {
  const ORG = 'btraceio';
  const REPOS = ['btrace', 'agent-plugins', 'btrace-extensions', 'jafar'];
  const CACHE = 'btraceio-org-gh-cache-v2';
  const TTL = 60 * 60 * 1000;
  const NOTES = {
    loading: '// loading live data from GitHub',
    live: '// live data from the GitHub API',
    cached: '// GitHub data, cached for 1 hour',
    offline: '// GitHub API not available. The numbers shown are from Oct 2026.'
  };

  const card = id => document.querySelector(`[data-repo="${id}"]`);
  const field = (id, f) => card(id).querySelector(`[data-f="${f}"]`);
  const fmt = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(n);
  const note = s => { document.getElementById('data-note').textContent = NOTES[s]; };

  function renderBars(id, weeks) {
    const el = field(id, 'bars');
    const data = weeks && weeks.length ? weeks : Array(52).fill(0);
    const max = Math.max(1, ...data);
    el.replaceChildren(...data.map((v, j) => {
      const b = document.createElement('span');
      if (weeks && v > 0) {
        b.style.height = Math.max(4, Math.round((v / max) * 100)) + '%';
        b.className = j >= data.length - 4 ? 'recent' : 'on';
      }
      return b;
    }));
  }

  function apply(id, d, status) {
    if (d.stars != null) field(id, 'stars').textContent = fmt(d.stars);
    if (d.lang) field(id, 'lang').textContent = d.lang;
    if (d.release !== undefined) {
      const a = field(id, 'release');
      a.textContent = d.release || 'none yet';
      a.classList.toggle('none', !d.release);
      a.href = d.releaseUrl || `https://github.com/${ORG}/${id}${d.release ? '/releases' : ''}`;
    }
    if (d.weeks) {
      renderBars(id, d.weeks);
      field(id, 'commits').textContent = d.weeks.reduce((a, b) => a + b, 0) + ' total';
    } else {
      field(id, 'commits').textContent = status === 'loading' ? 'loading' : 'n/a';
    }
  }

  async function getJson(url, retries = 0, attempt = 0) {
    const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    // Stats endpoints answer 202 while GitHub computes them; retry with backoff.
    if (r.status === 202 && attempt < retries) {
      await new Promise(res => setTimeout(res, [2000, 3000, 5000, 8000, 8000][attempt]));
      return getJson(url, retries, attempt + 1);
    }
    if (r.status === 202) throw new Error('202');
    if (!r.ok) throw new Error(String(r.status));
    return r.json();
  }

  async function loadRepo(id, live, onFail) {
    const base = `https://api.github.com/repos/${ORG}/${id}`;
    const out = {};
    try { const m = await getJson(base); out.stars = m.stargazers_count; out.lang = m.language; } catch (e) { onFail(); }
    try {
      const rels = await getJson(base + '/releases?per_page=20');
      const ok = (rels || []).filter(x => !x.draft && !x.prerelease)
        .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
      out.release = ok[0] ? ok[0].tag_name : null;
      out.releaseUrl = ok[0] ? ok[0].html_url : null;
    } catch (e) { onFail(); }
    apply(id, out, 'loading');
    try {
      const act = await getJson(base + '/stats/commit_activity', 5);
      if (Array.isArray(act)) out.weeks = act.map(w => w.total);
    } catch (e) {}
    if (!out.weeks) {
      try {
        const part = await getJson(base + '/stats/participation', 3);
        if (part && Array.isArray(part.all)) out.weeks = part.all;
      } catch (e) {}
    }
    live[id] = out;
    apply(id, out, 'done');
  }

  async function init() {
    REPOS.forEach(id => renderBars(id, null));

    let cached = null;
    try { cached = JSON.parse(localStorage.getItem(CACHE) || 'null'); } catch (e) {}
    if (cached && Date.now() - cached.at < TTL) {
      REPOS.forEach(id => apply(id, cached.live[id] || {}, 'cached'));
      note('cached');
      return;
    }

    note('loading');
    REPOS.forEach(id => { field(id, 'commits').textContent = 'loading'; });
    const live = {};
    let failed = 0;
    await Promise.all(REPOS.map(id => loadRepo(id, live, () => failed++)));
    const status = failed >= REPOS.length * 2 ? 'offline' : 'live';
    note(status);
    if (status === 'live' && REPOS.every(id => live[id] && live[id].weeks)) {
      try { localStorage.setItem(CACHE, JSON.stringify({ at: Date.now(), live })); } catch (e) {}
    }
  }

  init();
})();
