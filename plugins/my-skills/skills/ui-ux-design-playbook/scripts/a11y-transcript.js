() => {
  // Screen-reader-style transcript for browser_evaluate: what a keyboard/screen-reader user meets,
  // in reading order. Feeds the accessibility lens as grounding (ScreenAudit: LLM review of a
  // spoken-style transcript found far more errors than rule engines). Read with evidence.md "a11y-transcript".
  const visible = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const hiddenFromAT = el => !!el.closest('[aria-hidden="true"], [inert]');
  const sel = el => (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '')).slice(0, 50);
  const txt = s => (s || '').replace(/\s+/g, ' ').trim();
  const implicitRole = el => {
    const t = el.tagName.toLowerCase(), type = (el.getAttribute('type') || '').toLowerCase();
    if (t === 'a') return el.hasAttribute('href') ? 'link' : 'generic';
    if (t === 'button' || (t === 'input' && ['button', 'submit', 'reset', 'image'].includes(type))) return 'button';
    if (t === 'input') return { checkbox: 'checkbox', radio: 'radio', range: 'slider', search: 'searchbox', email: 'textbox', tel: 'textbox', url: 'textbox', text: 'textbox', password: 'password', number: 'spinbutton', '': 'textbox' }[type] || type;
    if (t === 'select') return el.multiple || el.size > 1 ? 'listbox' : 'combobox';
    if (t === 'textarea') return 'textbox';
    if (/^h[1-6]$/.test(t)) return 'heading';
    if (t === 'img') return el.getAttribute('alt') === '' ? 'presentation' : 'img';
    if (t === 'summary') return 'button';
    return { nav: 'navigation', main: 'main', header: 'banner', footer: 'contentinfo', aside: 'complementary', dialog: 'dialog', form: 'form' }[t] || 'generic';
  };
  const nameOf = el => {
    const by = el.getAttribute('aria-labelledby');
    if (by) return txt(by.split(/\s+/).map(id => document.getElementById(id)?.textContent || '').join(' '));
    if (el.getAttribute('aria-label')) return txt(el.getAttribute('aria-label'));
    if (el.labels && el.labels.length) return txt([...el.labels].map(l => l.textContent).join(' '));
    if (el.tagName === 'IMG') return txt(el.getAttribute('alt'));
    if (el.matches('input[type=submit], input[type=button], input[type=reset]')) return txt(el.value);
    if (el.matches('a, button, summary, [role=button], [role=link], [role=tab], [role=menuitem], h1, h2, h3, h4, h5, h6, legend, caption'))
      return txt([...el.childNodes].map(n => n.nodeType === 3 ? n.textContent : n.nodeType === 1 && !hiddenFromAT(n) ? (n.tagName === 'IMG' ? n.getAttribute('alt') || '' : n.textContent) : '').join(' '));
    return txt(el.getAttribute('title') || '');
  };
  const states = el => {
    const s = [];
    for (const a of ['expanded', 'pressed', 'checked', 'selected', 'current', 'invalid', 'required', 'disabled', 'haspopup']) {
      const v = el.getAttribute('aria-' + a); if (v && v !== 'false') s.push(v === 'true' ? a : `${a}=${v}`);
    }
    if (el.disabled) s.push('disabled'); if (el.required) s.push('required');
    if ((el.type === 'checkbox' || el.type === 'radio') && el.checked) s.push('checked');
    if (el.tagName === 'INPUT' && el.value && !['button', 'submit', 'checkbox', 'radio'].includes(el.type)) s.push(`value="${el.type === 'password' ? '•••' : el.value.slice(0, 20)}"`);
    if (el.getAttribute('placeholder')) s.push(`placeholder="${el.getAttribute('placeholder').slice(0, 30)}"`);
    const desc = (el.getAttribute('aria-describedby') || '').split(/\s+/).map(id => txt(document.getElementById(id)?.textContent)).filter(Boolean).join(' ');
    if (desc) s.push(`description="${desc.slice(0, 60)}"`);
    return [...new Set(s)];
  };
  const focusable = el => el.matches('a[href], button, input:not([type=hidden]), select, textarea, summary, [tabindex], [contenteditable=true], iframe') && !el.disabled && el.getAttribute('tabindex') !== '-1';
  const nodes = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6, header, nav, main, aside, footer, [role], form, dialog, a[href], button, input:not([type=hidden]), select, textarea, summary, img, [tabindex]')]
    .filter(el => visible(el) && !hiddenFromAT(el));
  // Tab order: positive tabindex first (ascending), then DOM order
  const tabbable = nodes.filter(focusable);
  const positive = tabbable.filter(el => el.tabIndex > 0).sort((a, b) => a.tabIndex - b.tabIndex);
  const tabOrder = [...positive, ...tabbable.filter(el => !(el.tabIndex > 0))];
  const lines = nodes.filter(el => !(el.tagName === 'IMG' && el.getAttribute('alt') === '' && !focusable(el))).map(el => {
    const role = el.getAttribute('role') || implicitRole(el);
    const name = nameOf(el);
    const lvl = /^H[1-6]$/.test(el.tagName) ? ` level ${el.tagName[1]}` : '';
    const tab = tabOrder.indexOf(el);
    const needsName = tab >= 0 || ['img', 'heading', 'dialog', 'form'].includes(role);
    return { tab: tab >= 0 ? tab + 1 : null, say: `${role}${lvl}${name ? `, "${name.slice(0, 80)}"` : needsName ? ', [no name]' : ''}${states(el).length ? ', ' + states(el).join(', ') : ''}`, el: sel(el), y: Math.round(el.getBoundingClientRect().top + scrollY) };
  });
  // reading-order vs visual-order jumps in Tab sequence (large upward jumps = likely 2.4.3 issue)
  // fixed/sticky layers (cookie bars, chat buttons) sit outside document flow; leave them out of the order check
  const inFlow = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const p = getComputedStyle(e).position; if (p === 'fixed' || p === 'sticky') return false; } return true; };
  const tabSeq = tabOrder.filter(inFlow).map(el => ({ el: sel(el), y: Math.round(el.getBoundingClientRect().top + scrollY) }));
  const orderJumps = tabSeq.slice(1).map((t, i) => ({ from: tabSeq[i].el, to: t.el, dy: t.y - tabSeq[i].y })).filter(j => j.dy < -150);
  return {
    url: location.href, lang: document.documentElement.lang || null, title: document.title,
    transcript: lines.slice(0, 200).map(l => `${l.tab ? '[Tab ' + l.tab + '] ' : '          '}${l.say}  ‹${l.el}›`),
    unnamedInteractive: lines.filter(l => l.tab && l.say.includes('[no name]')).map(l => l.el),
    positiveTabindex: positive.map(sel),
    tabOrderUpwardJumps: orderJumps.slice(0, 20),
  };
}
