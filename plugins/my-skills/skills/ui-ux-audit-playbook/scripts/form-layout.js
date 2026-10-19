() => {
  const rect = el => el.getBoundingClientRect();
  const domIndex = (() => { let i = 0; const map = new WeakMap(); (function walk(el){ map.set(el, i++); [...el.children].forEach(walk); })(document.body); return el => map.get(el) ?? -1; })();
  const containers = [...document.querySelectorAll('form, fieldset')];
  const scope = containers.length ? containers : [document.body];

  return scope.map(container => {
    const fields = [...container.querySelectorAll('input:not([type=hidden]), select, textarea')]
      .filter(el => { const r = rect(el); return r.width > 0 && r.height > 0; });

    const info = fields.map(f => {
      const label = (f.labels && f.labels[0]) || document.querySelector(f.id ? `label[for="${f.id}"]` : null) || null;
      const fr = rect(f), lr = label ? rect(label) : null;
      let labelPos = label ? 'unclear' : 'MISSING';
      if (lr) {
        if (fr.top - lr.bottom >= -2 && fr.top - lr.bottom < 40) labelPos = 'above';
        else if (lr.right <= fr.left + 4) labelPos = 'left';
        else if (lr.left >= fr.right - 4) labelPos = 'right';
      }
      const labelText = label ? label.textContent : (f.getAttribute('aria-label') || f.getAttribute('placeholder') || '');
      return {
        field: f.name || f.id || f.tagName.toLowerCase(),
        required: f.required || f.getAttribute('aria-required') === 'true',
        markedRequired: /\*|required/i.test(labelText), // visual marker; true while `required` is false → FM4/A13 gap
        markedOptional: /optional/i.test(labelText),
        x: Math.round(fr.left), y: Math.round(fr.top), width: Math.round(fr.width),
        labelPos,
        labelGapPx: lr ? Math.round(Math.max(0, Math.min(Math.abs(fr.top - lr.bottom), Math.abs(fr.left - lr.right)))) : null,
      };
    });

    // column count: cluster distinct x-starts more than 40px apart
    const xs = [...new Set(info.map(f => f.x))].sort((a, b) => a - b);
    const columns = xs.reduce((cols, x) => { if (!cols.length || x - cols[cols.length - 1] > 40) cols.push(x); return cols; }, []);

    // diagram/image adjacency to each field, with DOM-order delta (SC 1.3.2 signal)
    const media = [...container.querySelectorAll('img, svg, picture, canvas')];
    const diagramLinks = [];
    for (const f of fields) {
      const fr = rect(f);
      for (const m of media) {
        const mr = rect(m);
        const dx = Math.max(fr.left - mr.right, mr.left - fr.right, 0);
        const dy = Math.max(fr.top - mr.bottom, mr.top - fr.bottom, 0);
        const dist = Math.round(Math.hypot(dx, dy));
        if (dist < 150) diagramLinks.push({
          field: f.name || f.id || f.tagName.toLowerCase(),
          media: m.tagName.toLowerCase() + (m.getAttribute('alt') === null ? (m.tagName === 'IMG' ? '[NO ALT]' : '') : `[alt="${m.getAttribute('alt').slice(0, 40)}"]`),
          distancePx: dist,
          domOrderDelta: domIndex(m) - domIndex(f), // 0 = adjacent in DOM too; large |delta| = visual-only adjacency, check SC 1.3.2
        });
      }
    }

    // required/optional interleaving: do required and optional fields alternate in reading order (no spatial separation)?
    const interleaved = info.length > 1 && info.some((f, i) => i > 0 && f.required !== info[i - 1].required);

    return {
      container: container.tagName.toLowerCase() + (container.id ? '#' + container.id : container.className ? '.' + String(container.className).split(/\s+/)[0] : ''),
      fieldCount: fields.length,
      columnCount: columns.length, // >1 with no matching short-pair rationale (expiry+CVC, day+month+year) → FM2/Baymard multicolumn check
      labelPositions: [...new Set(info.map(f => f.labelPos))], // mixed positions in one form = FM2 fail
      requiredCount: info.filter(f => f.required).length,
      optionalCount: info.filter(f => !f.required).length,
      markedRequiredButNotProgrammatic: info.filter(f => f.markedRequired && !f.required).map(f => f.field), // FM4 / A13
      requiredOptionalInterleaved: interleaved, // true + both counts >0 → gap #5 (Tullis & Pons 1997): not spatially separated
      diagramLinks, // empty + field name suggests physically-located value (code/serial/CVV) → candidate FM16 gap
      fields: info.slice(0, 40),
    };
  });
}
