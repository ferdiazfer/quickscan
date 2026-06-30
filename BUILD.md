# QuickScan — Build / Release pipeline

The **readable, commented, git-tracked `quickscan-v2.NN.html`** is the single source of truth.
The shipped **`index.html`** (the PWA `start_url`) is a **disposable build artifact**, regenerated
from the versioned source each release — like a compiled output. **Never obfuscate or hand-edit the
versioned source; never hand-edit `index.html`.** Every fix goes through the readable source, then
`index.html` is re-emitted.

All steps are reproducible from the versioned source + the scripts in `build/`. `vendor/` is a
gitignored working dir (downloaded libs, inlined into the app, never shipped or referenced).

---

## 0. Frozen gate (run after EVERY app bump — the hard gate)

```
python test_files/_frozen_compare.py quickscan-v2.NN.html prompts/scratch/frozen_baseline_v121.json
# must print:  changed: (none)
```
21 frozen items (the `OMR` object + 20 grade/merge/export functions) stay byte-identical to the
v2.121 baseline. If anything frozen moves, STOP.

---

## 1. Download the four vendor libraries (pinned — do NOT bump versions)

```
mkdir -p vendor
curl -sSL -o vendor/chart.umd.min.js   https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js
curl -sSL -o vendor/pdf.min.js         https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js
curl -sSL -o vendor/pdf.worker.min.js  https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js
curl -sSL -o vendor/jspdf.umd.min.js   https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
```

| Lib | Version | File | Global | SHA-256 (first 16) |
|---|---|---|---|---|
| Chart.js | 4.4.0 | chart.umd.min.js | `window.Chart` | `0e2326c6868072be` |
| PDF.js (main) | 3.11.174 | pdf.min.js | `globalThis.pdfjsLib` | `5b5799e6f8c68066` |
| PDF.js (worker) | 3.11.174 | pdf.worker.min.js | Blob-URL `workerSrc` | `feabdf309770ed24` |
| jsPDF | 2.5.1 | jspdf.umd.min.js | `window.jspdf.jsPDF` | `98ccf17aa10c20bb` |

---

## 2. Inline the vendor libs into the app (done once, at v2.138)

```
python build/inline_vendor.py <readable-src>.html vendor <out>.html <old-ver> <new-ver>
# e.g. python build/inline_vendor.py quickscan-v2.137.html vendor quickscan-v2.138.html 2.137 2.138
```
Replaces the four `<script src>` / lazy-loader / worker-config sites with inline blocks:
Chart.js + PDF.js main + jsPDF as `<script>`; the **PDF.js worker** as a non-executing
`<script id="pdfjs-worker-src" type="text/js-worker">` that the page reads at runtime and turns
into a **same-origin Blob URL** for `GlobalWorkerOptions.workerSrc` (true offline, no CDN). The
jsPDF lazy CDN fetch is removed (the inlined global is always present). Asserts exactly-one match
per site and neutralizes any `</script>` in the lib bytes (value-preserving; zero occurrences today).

Result: **zero external `<script src>`**. Verify:
```
grep -cE '<script[^>]*src="https?://' <out>.html      # 0
grep -cE "\.src\s*=\s*['\"]https?://" <out>.html       # 0
grep -cE "workerSrc\s*=\s*['\"]https?://" <out>.html   # 0
```
(Remaining `https?://` hits are vendor license/attribution comments, SVG/XML namespace URIs, or
dead vendor feature strings the app never calls — none are live loads.)

---

## 3. Bump the version for a new readable release (no behavior change)

```
python build/bump_version.py <prev>.html quickscan-v2.NN.html <old-ver> <new-ver>
# e.g. python build/bump_version.py quickscan-v2.138.html quickscan-v2.139.html 2.138 2.139
```
Touches ONLY the 3 display-version strings (title, About `<b>`, ready `console.log`); leaves
historical provenance comments and frozen bodies untouched. Re-run the frozen gate (step 0).

---

## 4. Obfuscate `index.html` (needs Node/npm)

> **Status (v2.181): EXECUTED (low-overhead profile).** The shipped `index.html` is an **obfuscated** build of
> the readable versioned source (app `<script>` blocks only; the four inlined vendor libraries
> and the worker source are left byte-identical). Obfuscation deters casual copying of
> Fernando's code; it is **not** a functional requirement, and it is fully reversible —
> `index.html` is re-emitted from the readable source each release. (Builds before v2.180
> shipped an un-obfuscated copy; obfuscated builds continue from v2.180 on.)

```
npm init -y && npm install --save-dev javascript-obfuscator
node build/obfuscate.js quickscan-v2.NN.html index.html
```
`build/obfuscate.js` obfuscates **only Fernando's app `<script>` blocks** and leaves the four
inlined vendor libraries + the worker source **as-is** (it skips any block whose opening tag has
`src=`, `type="text/js-worker"`, or whose head carries a `/*! Chart.js | PDF.js | jsPDF` marker).
The block scanner is comment- and template-aware: a literal `<script …>` inside an HTML comment
(e.g. the v2.138 "no external `<script src>`" note) or inside an app block's JS template string
(the Full-Report builder's embedded `<script> … <\/script>`) is never mis-parsed as its own block.

Settings — conservative for correctness, tuned LOW-OVERHEAD for speed (see the script for the full rationale):
- `renameGlobals: false` — **critical** (inline `onclick=` handlers + cross-`<script>` globals would break otherwise).
- `controlFlowFlattening: false`, `deadCodeInjection: false` — the riskiest/heaviest transforms; off so the harness-untestable grade path can't silently break.
- `transformObjectKeys: false` — the app uses object keys as data (roster maps, settings).
- `selfDefending: false`, `debugProtection: false`.
- `stringArray: true` with **`stringArrayEncoding: ['none']`, `stringArrayCallsTransform: false`, `stringArrayRotate/Shuffle: false`** (the v2.181 low-overhead profile — see the perf note), threshold 0.75; local identifier renaming (hexadecimal); `compact`.

**v2.181 performance tuning (why the string-array profile changed).** v2.180 graded *correctly* but
~6× too slow: the default `stringArrayCallsTransform` + base64 per-access decode + the rotate IIFE
added runtime cost to the string-touching grade/read code (measured `scoreSheet` **25.3 → 4.5 µs/call**
after tuning, matching the readable build's ~4.2 µs; the pure-numeric `sampleCircle` pixel loop was
never affected). The frozen grade logic is byte-unchanged — only the obfuscator's overhead moved.
Because an **un-encoded** string array re-emits `</script>` literally, the obfuscator step now
**neutralizes `</script` → `<\/script`** in each obfuscated block body (value-preserving) so the
Full-Report builder's embedded `<script> … <\/script>` template can't truncate the block (else
`buildFullReportHTML`/`exportFullReport` would go undefined). base64 encoding is also safe (it hid
these for free) if deterrence ever matters more than the last bit of speed — but the un-encoded
profile grades at native speed.

**Verify the obfuscated artifact (a build that breaks grading is a failed build):** load it offline,
confirm zero console errors + all globals present, exercise jsPDF + Chart.js offline, run the pure
grading functions (`scoreSheet` / `_cleanReadId` / `pairAndMergePages` / `itemAnalysis`) on synthetic
inputs and confirm identical outputs to the readable source, then grade a real PDF in a real browser
(the headless preview runs no Web Worker / can't exercise the PDF.js reader).

---

## 5. Re-emit the shell + bump the cache (every release)

```
cp quickscan-v2.NN.html index.html      # OR the obfuscated output from step 4
# then bump CACHE in service-worker.js -> quickscan-shell-v2.NN  (forces installs to fetch the new shell)
```
The inlined libs ride along inside the precached `index.html`; nothing else needs precaching.

---

## 6. Publish (Fernando's accounts — Claude Code STOPS before this)

`git push` → enable GitHub Pages (repo `quickscan`, SW uses the `/quickscan/` subfolder scope) →
mint the Zenodo DOI → drop the DOI into `CITATION.cff`. Claude Code preps the local repo and runs
`git push --dry-run` only (to report auth/remote state), never the real push.
