#!/usr/bin/env python3
"""Measure a local HTML form in headless Chrome and report layout problems.

Usage:
  python3 form_audit.py PAGE.html [--widths 1280,1000,760] [--scope "form"]
                        [--grid ".grid"] [--query "v=a&w=b"] [--shots OUTDIR]
                        [--before-js "document.querySelector('form').requestSubmit()"]

For every viewport width it prints:
  - distinct left / right edges of the visible controls ("vertical lines": fewer = calmer)
  - controls whose edges are off the reference grid's column lines
    (edges on 1/2- or 1/4-column lines are reported separately as "sub-column")
  - a disabled submit button
  - horizontal page overflow, with the elements that stick out
With --shots it also saves one full-height PNG per width.

The page is loaded inside an iframe of the exact width, so any width works (headless Chrome
will not make a window narrower than ~500px on its own). Needs python3 (stdlib) and Chrome/Chromium;
set CHROME=/path/to/binary to override. Only local files are supported. A temporary
copy (.form_audit_<pid>.html) is written next to the page while it runs, then deleted.
"""
import argparse, html, json, os, re, shutil, subprocess, sys, tempfile

AUDIT_JS = r"""
(() => {
  const scope = document.querySelector(__SCOPE__) || document.body;
  const vis = el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
  const sel = 'input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=submit])'
            + ':not([type=button]):not([type=reset]):not([type=image]), select, textarea';
  const controls = [...scope.querySelectorAll(sel)].filter(vis);   // edge/grid checks use these
  const all = [...scope.querySelectorAll("input, select, textarea")];
  const name = el => el.id || el.name || el.getAttribute("aria-label")
                  || `${el.tagName.toLowerCase()}${el.type ? "[" + el.type + "]" : ""} #${all.indexOf(el) + 1}`;

  // reference grid: --grid selector, else the grid container (not inside a table, i.e. not a
  // mobile card) that holds the most controls; ties go to more columns, then width
  let grids = __GRID__ ? [...scope.querySelectorAll(__GRID__)]
                       : [...scope.querySelectorAll("*")].filter(e => /grid/.test(getComputedStyle(e).display) && !e.closest("table"));
  grids = grids.filter(vis).map(g => {
    const cs = getComputedStyle(g), r = g.getBoundingClientRect();
    const tracks = cs.gridTemplateColumns.split(" ").map(parseFloat).filter(n => !isNaN(n));
    const gap = parseFloat(cs.columnGap) || 0;
    let x = r.left + (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.paddingLeft) || 0);
    const L = [], R = [], hL = [], hR = [];
    for (const w of tracks) {
      L.push(x); R.push(x + w);
      for (const k of [2, 4]) {               // the track split in 2 or 4 with the same gutter
        const sub = (w - (k - 1) * gap) / k;
        for (let j = 1; j < k; j++) { hL.push(x + j * (sub + gap)); hR.push(x + j * sub + (j - 1) * gap); }
      }
      x += w + gap;
    }
    const n = controls.filter(c => g.contains(c)).length;
    return { g, n, cols: tracks.length, width: r.width, gap, L, R, hL, hR };
  }).sort((a, b) => b.n - a.n || b.cols - a.cols || b.width - a.width);
  const ref = grids[0];
  const tol = 1.5, near = (v, arr) => arr.some(a => Math.abs(a - v) <= tol);

  const lefts = [], rights = [], off = [], half = [], probs = [];
  for (const c of controls) {
    const r = c.getBoundingClientRect();
    if (!near(r.left, lefts)) lefts.push(Math.round(r.left));
    if (!near(r.right, rights)) rights.push(Math.round(r.right));
    if (ref) {
      const okL = near(r.left, ref.L), okR = near(r.right, ref.R);
      const hfL = okL || near(r.left, ref.hL), hfR = okR || near(r.right, ref.hR);
      const desc = `${name(c)} (left ${Math.round(r.left)}${okL ? "" : hfL ? " sub" : " OFF"}, right ${Math.round(r.right)}${okR ? "" : hfR ? " sub" : " OFF"})`;
      if (!(hfL && hfR)) off.push(desc); else if (!(okL && okR)) half.push(desc);
    }
  }
  for (const b of [...scope.querySelectorAll("button, [role=button], input[type=submit], input[type=button]")].filter(vis)) {
    if (b.disabled && /submit/i.test(b.type)) probs.push(`submit "${(b.textContent || b.value || "").trim().slice(0, 24)}" is disabled`);
  }
  const W = document.documentElement.clientWidth;
  const clipped = e => { for (let p = e.parentElement; p && p !== document.body; p = p.parentElement)
    if (getComputedStyle(p).overflowX !== "visible") return true; return false; };
  const sticking = [...document.body.querySelectorAll("*")].filter(vis)
    .filter(e => e.getBoundingClientRect().right > W + 1 && !clipped(e))
    .slice(0, 6).map(e => `${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""}${e.classList.length ? "." + [...e.classList].join(".") : ""} (right ${Math.round(e.getBoundingClientRect().right)})`);
  return {
    viewport: W, controls: controls.length, scopeWidth: Math.round(scope.getBoundingClientRect().width),
    refGrid: ref ? { cols: ref.cols, width: Math.round(ref.width), gap: ref.gap,
                     el: ref.g.tagName.toLowerCase() + (ref.g.classList.length ? "." + [...ref.g.classList].join(".") : "") } : null,
    lefts: lefts.sort((a, b) => a - b), rights: rights.sort((a, b) => a - b),
    offGrid: off, halfGrid: half, problems: [...new Set(probs)],
    overflowX: document.documentElement.scrollWidth > W + 1, sticking,
    height: document.documentElement.scrollHeight,
  };
})()
"""

# injected into the page itself; reports to the wrapper page with postMessage
PAGE_JS = r"""
<script>
window.addEventListener("load", () => setTimeout(() => {
  try { __BEFORE__ } catch (e) { console.error(e); }
  setTimeout(() => {
    let out; try { out = __AUDIT__; } catch (e) { out = { error: String(e) }; }
    parent.postMessage({ formAudit: out }, "*");
  }, 400);
}, 300));
</script>
"""

WRAPPER = """<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;background:#fff}iframe{border:0;display:block}</style></head><body>
<iframe id="f" src="__SRC__" style="width:__W__px;height:__H__px"></iframe>
<script>
addEventListener("message", e => {
  if (!e.data || !e.data.formAudit) return;
  const p = document.createElement("pre"); p.id = "__form_audit__"; p.hidden = true;
  p.textContent = JSON.stringify(e.data.formAudit); document.body.append(p);
  document.getElementById("f").style.height = Math.max(e.data.formAudit.height || 0, 400) + "px";
});
</script></body></html>"""


def chrome_bin():
    for c in [os.environ.get("CHROME"), "google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]:
        if c and shutil.which(c):
            return shutil.which(c)
    sys.exit("Chrome/Chromium not found; set CHROME=/path/to/chrome")


def run_chrome(args, profile, timeout=90):
    base = [chrome_bin(), "--headless=new", "--disable-gpu", "--hide-scrollbars",
            "--virtual-time-budget=4000", f"--user-data-dir={profile}"]
    try:
        return subprocess.run(base + args, capture_output=True, text=True, timeout=timeout).stdout
    except subprocess.TimeoutExpired:
        return ""


def report(w, d):
    print(f"\n=== viewport {w}px (measured {d['viewport']}px) ===")
    g = d["refGrid"]
    print(f"  controls: {d['controls']} text/select/textarea   form width: {d['scopeWidth']}px\n  reference grid: "
          + (f"{g['cols']} cols, {g['width']}px, gap {g['gap']:g}px ({g['el']})" if g
             else "none (normal for a 1-column form: judge by the edge counts, ideally 1 left + 1 right)"))
    print(f"  vertical lines: {len(d['lefts'])} left edges {d['lefts']} | {len(d['rights'])} right edges {d['rights']}")
    print(f"  off-grid controls: {len(d['offGrid'])}" + "".join(f"\n    - {x}" for x in d["offGrid"]))
    if d["halfGrid"]:
        print(f"  on sub-column lines (1/2 or 1/4 column; ok for an input table or half grid): {len(d['halfGrid'])}"
              + "".join(f"\n    - {x}" for x in d["halfGrid"]))
    print("  horizontal overflow: " + ("YES; sticking out:" + "".join(f"\n    - {x}" for x in d["sticking"])
                                      if d["overflowX"] else "no"))
    if d["problems"]:
        print("  problems:" + "".join(f"\n    - {x}" for x in d["problems"]))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("page", help="local .html file")
    ap.add_argument("--widths", default="1280,1000,760", help="comma-separated viewport widths (default: panel beside form, 4 cols, 2 cols)")
    ap.add_argument("--scope", default="form", help="CSS selector of the form area (default: form)")
    ap.add_argument("--grid", default="", help="CSS selector of the reference grid container")
    ap.add_argument("--query", default="", help="query string appended to the page URL")
    ap.add_argument("--before-js", default="", help="JS to run before measuring, e.g. submit to show errors")
    ap.add_argument("--shots", default="", help="directory for one screenshot per width")
    a = ap.parse_args()

    src = os.path.abspath(a.page)
    page = open(src, encoding="utf-8").read()
    audit = AUDIT_JS.replace("__SCOPE__", json.dumps(a.scope)).replace("__GRID__", json.dumps(a.grid) if a.grid else "null")
    inj = PAGE_JS.replace("__AUDIT__", audit).replace("__BEFORE__", a.before_js)
    page = re.sub(r"</body>", lambda m: inj + "</body>", page, count=1, flags=re.I) if re.search(r"</body>", page, re.I) else page + inj

    tmpdir = tempfile.mkdtemp(prefix="form_audit_")
    profile = os.path.join(tmpdir, "profile")
    # the probe copy sits next to the original so relative CSS/JS/image paths still resolve
    stem = os.path.join(os.path.dirname(src), f".form_audit_{os.getpid()}")
    probe, wrapper = stem + ".html", stem + "_wrap.html"
    try:
        with open(probe, "w", encoding="utf-8") as fh:
            fh.write(page)
        target = "file://" + probe + (("?" + a.query) if a.query else "")
        if a.shots:
            os.makedirs(a.shots, exist_ok=True)
        for w in [int(x) for x in a.widths.split(",")]:
            with open(wrapper, "w", encoding="utf-8") as fh:
                fh.write(WRAPPER.replace("__SRC__", html.escape(target)).replace("__W__", str(w)).replace("__H__", "1200"))
            out = run_chrome([f"--window-size={max(w, 500)},1200", "--dump-dom", "file://" + wrapper], profile)
            m = re.search(r'<pre id="__form_audit__" hidden="">(.*?)</pre>', out, re.S)
            if not m:
                print(f"\n=== viewport {w}px ===\n  no audit output (page error or Chrome timeout)")
                continue
            d = json.loads(html.unescape(m.group(1)))
            if "error" in d:
                print(f"\n=== viewport {w}px ===\n  audit error: {d['error']}")
                continue
            report(w, d)
            if a.shots:
                h = min(max(d.get("height", 1200), 400), 8000)
                with open(wrapper, "w", encoding="utf-8") as fh:
                    fh.write(WRAPPER.replace("__SRC__", html.escape(target)).replace("__W__", str(w)).replace("__H__", str(h)))
                shot = os.path.join(os.path.abspath(a.shots), f"form_{w}.png")
                run_chrome([f"--window-size={max(w, 500)},{h}", f"--screenshot={shot}", "file://" + wrapper], profile)
                print(f"  screenshot: {shot}" + (f" (page is the left {w}px)" if w < 500 else ""))
    finally:
        for f in (probe, wrapper):
            if os.path.exists(f):
                os.remove(f)
        shutil.rmtree(tmpdir, ignore_errors=True)


if __name__ == "__main__":
    main()
