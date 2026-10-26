() => {
  // WCAG 4.1.3 Status Messages, two-call script for browser_evaluate.
  // Call 1 installs a recorder and returns the live regions present now.
  // Then perform the action (save, submit a dev form, add to cart…).
  // Call 2 returns what was announced through live regions and which status-like messages appeared
  // visibly WITHOUT being in a live region (fail candidates).
  const sel = el => (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '')).slice(0, 50);
  const LIVE = '[aria-live]:not([aria-live="off"]), [role=status], [role=alert], [role=log], [role=progressbar], output';
  const statusLike = /toast|snack|alert|notice|notif|message|status|error|success|banner|flash/i;
  const inLive = n => { const e = n.nodeType === 1 ? n : n.parentElement; return !!(e && e.closest(LIVE)); };
  if (!window.__auditLive) {
    window.__auditLive = { announced: [], unannounced: [] };
    const obs = new MutationObserver(muts => {
      for (const m of muts) {
        const nodes = m.type === 'characterData' ? [m.target] : [...m.addedNodes];
        for (const n of nodes) {
          const text = (n.textContent || '').trim(); if (!text) continue;
          const host = n.nodeType === 1 ? n : n.parentElement;
          if (inLive(n)) window.__auditLive.announced.push({ text: text.slice(0, 80), region: sel(host.closest(LIVE)) });
          else if (host && (statusLike.test(host.className + ' ' + host.id) || statusLike.test(host.getAttribute('role') || '')))
            window.__auditLive.unannounced.push({ text: text.slice(0, 80), el: sel(host) });
        }
      }
    });
    obs.observe(document.body, { subtree: true, childList: true, characterData: true });
    return { installed: true, liveRegionsNow: [...document.querySelectorAll(LIVE)].map(sel), next: 'perform the action, then run this script again' };
  }
  const out = window.__auditLive; delete window.__auditLive;
  return { announced: out.announced.slice(0, 30), visibleButNotAnnounced: out.unannounced.slice(0, 30) };
}
