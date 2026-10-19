() => {
  // WCAG 2.2 inventory for browser_evaluate: facts the agent then judges or follows up.
  // 3.3.8 Accessible Authentication: password/OTP fields, autocomplete, paste blocking (tested by
  //   dispatching a synthetic paste event and checking defaultPrevented), CAPTCHA providers.
  // 2.5.7 Dragging Movements: drag-capable elements; the agent checks for a single-pointer alternative.
  // 3.2.6 Consistent Help: help mechanisms with their relative order; compare across ≥3 pages.
  // 3.3.7 Redundant Entry: fields already filled vs empty (run on later steps of multi-step flows).
  const sel = el => (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '')).slice(0, 50);
  const visible = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const pasteBlocked = el => {
    try {
      const dt = new DataTransfer(); dt.setData('text/plain', 'x');
      const ev = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
      return !el.dispatchEvent(ev);   // false when a handler called preventDefault()
    } catch { return null; }
  };
  const authFields = [...document.querySelectorAll('input[type=password], input[autocomplete="one-time-code"], input[name*=otp i], input[name*=code i], input[id*=otp i]')]
    .filter(visible).map(el => ({ el: sel(el), type: el.type, autocomplete: el.getAttribute('autocomplete') || null, pasteBlocked: pasteBlocked(el), maxlength: el.maxLength > 0 ? el.maxLength : null }));
  const captcha = [...document.querySelectorAll('iframe[src*="recaptcha"], iframe[src*="hcaptcha"], iframe[src*="turnstile"], .g-recaptcha, .h-captcha, .cf-turnstile, img[src*=captcha i]')].map(sel);
  const dragCandidates = [...document.querySelectorAll('[draggable=true], [role=slider], input[type=range], [class*=drag i], [class*=sortable i], [class*=resiz i], [data-rbd-draggable-id], [data-sortable-id]')]
    .filter(visible).map(el => ({ el: sel(el), role: el.getAttribute('role') || el.type || null, text: (el.textContent || '').trim().slice(0, 30) })).slice(0, 30);
  const helpRe = /\b(help|support|contact|chat|faq|customer service|call us|hotline)\b/i;
  const help = [...document.querySelectorAll('a, button, [role=button]')].filter(el => visible(el) && helpRe.test((el.textContent || '') + ' ' + (el.getAttribute('aria-label') || '')))
    .map((el, i) => ({ order: i + 1, text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40), region: sel(el.closest('header, nav, main, aside, footer') || document.body), href: el.getAttribute('href') }));
  const fields = [...document.querySelectorAll('input:not([type=hidden]):not([type=password]):not([type=submit]):not([type=button]), select, textarea')].filter(visible);
  return {
    url: location.href,
    auth: { fields: authFields, captcha },
    dragCandidates,
    helpMechanisms: help.slice(0, 10),
    redundantEntry: { filled: fields.filter(f => f.value).map(sel).slice(0, 20), empty: fields.filter(f => !f.value).map(f => `${sel(f)} [${f.name || ''} ${f.getAttribute('autocomplete') || ''}]`).slice(0, 30) },
  };
}
