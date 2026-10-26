() => {
  // Style census for browser_evaluate (Malewicz's UI-audit inventory, automated).
  // Counts distinct text styles, colours, radii, border widths, shadows, gradients,
  // control heights and motion durations on the rendered page, with where each is used.
  // Read with evidence.md "style-inventory"; rare values (count 1-2) are merge candidates.
  const visible = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity !== 0; };
  const label = el => (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 60);
  const tally = (map, key, el) => { if (!map[key]) map[key] = { count: 0, examples: [] }; const e = map[key]; e.count++; if (e.examples.length < 3) e.examples.push(label(el)); };
  const sorted = map => Object.entries(map).map(([value, v]) => ({ value, ...v })).sort((a, b) => b.count - a.count);
  const transparent = c => !c || c === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(c);

  const textStyles = {}, families = {}, colours = {}, radii = {}, borders = {}, shadows = {}, gradients = {}, heights = {}, durations = {};
  const all = [...document.querySelectorAll('body *')].filter(visible).slice(0, 4000);
  for (const el of all) {
    const s = getComputedStyle(el);
    const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (hasText) {
      const fam = s.fontFamily.split(',')[0].replace(/["']/g, '').trim();
      tally(families, fam, el);
      tally(textStyles, `${fam} ${parseFloat(s.fontSize)}px/${s.fontWeight}${s.fontStyle === 'italic' ? ' italic' : ''}${s.textDecorationLine !== 'none' ? ' ' + s.textDecorationLine : ''}${s.textTransform !== 'none' ? ' ' + s.textTransform : ''}`, el);
      tally(colours, `text ${s.color}`, el);
    }
    if (!transparent(s.backgroundColor)) tally(colours, `bg ${s.backgroundColor}`, el);
    const bw = parseFloat(s.borderTopWidth) || parseFloat(s.borderLeftWidth);
    if (bw && s.borderTopStyle !== 'none') { tally(borders, `${bw}px`, el); if (!transparent(s.borderTopColor)) tally(colours, `border ${s.borderTopColor}`, el); }
    if (s.borderTopLeftRadius !== '0px') tally(radii, s.borderTopLeftRadius, el);
    if (s.boxShadow !== 'none') tally(shadows, s.boxShadow, el);
    if (/gradient/.test(s.backgroundImage)) tally(gradients, s.backgroundImage.slice(0, 120), el);
    if (el.matches('button, input:not([type=checkbox]):not([type=radio]):not([type=hidden]), select, textarea, a[role=button], [role=button]')) tally(heights, `${el.tagName.toLowerCase()} ${Math.round(el.getBoundingClientRect().height)}px`, el);
    const d = [s.transitionDuration, s.animationDuration].filter(v => v && v !== '0s').join(' | ');
    if (d) tally(durations, d, el);
  }
  const rules = [...document.styleSheets].flatMap(ss => { try { return [...ss.cssRules]; } catch { return []; } });
  const textStyleList = sorted(textStyles);
  return {
    url: location.href, viewport: [innerWidth, innerHeight],
    counts: {
      fontFamilies: Object.keys(families).length, textStyles: textStyleList.length,
      colourValues: new Set(Object.keys(colours).map(k => k.replace(/^\w+ /, ''))).size, colourUses: Object.keys(colours).length,
      radii: Object.keys(radii).length,
      borderWidths: Object.keys(borders).length, shadows: Object.keys(shadows).length,
      gradients: Object.keys(gradients).length, controlHeights: Object.keys(heights).length,
    },
    rareTextStyles: textStyleList.filter(t => t.count <= 2).map(t => t.value),
    fontFamilies: sorted(families), textStyles: textStyleList, colours: sorted(colours),
    radii: sorted(radii), borderWidths: sorted(borders), shadows: sorted(shadows),
    gradients: sorted(gradients), controlHeights: sorted(heights),
    motion: {
      durations: sorted(durations),
      reducedMotionRule: rules.some(r => r.media && /prefers-reduced-motion/.test(r.media.mediaText)),
      userPrefersReduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    },
  };
}
