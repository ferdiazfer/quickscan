# QuickScan

**Free, browser-based OMR bubble-sheet grader for teachers. No install, no account, works offline. Scan, grade, and export to your gradebook from any device.**

![QuickScan](docs/screenshot.png)

---

## What it does

- **Grades scanned bubble sheets right in your browser** — no Scantron machine, no server, no API key. The whole app is one self-contained HTML file.
- **Handles real exams** — 1–200 questions, including multi-page (two-sheet) exams, with automatic skew correction and a contamination-safe page-merge gate.
- **Reads your roster and exports to your gradebook** — import a class roster and export a Canvas-ready scores CSV.
- **Gives you the analysis, not just scores** — item analysis, reliability (KR-20 / Cronbach's α), distractor analysis, grade curving, a flagged-question review workflow, and a downloadable self-contained report.
- **Works fully offline and installs as an app** — once installed it grades with no internet at all.

## How to use it

1. **Open the app** (or install it — see below). Create a class and an exam, and set the number of questions.
2. **Set the answer key** — print a key sheet, mark the correct answers, and scan it; QuickScan reads it (or type the key in by hand).
3. **Scan & grade** — students fill printed answer sheets by hand; scan them to PDF and upload; QuickScan grades every sheet and shows scores, analysis, and a review workflow. Export the scores CSV when you're done.

> **Live app:** _TODO — add the GitHub Pages URL once Pages is enabled (e.g. `https://ferdiazfer.github.io/quickscan/`)._

## Install as an app (PWA)

QuickScan is an installable Progressive Web App. Install it from your browser and it runs offline; the first launch shows a one-time precache progress bar while it stores the app for offline use.

## Citation

If you use QuickScan in your work, please cite it — see [`CITATION.cff`](./CITATION.cff). _TODO: add the Zenodo DOI once minted._

## License

QuickScan is **source-available, not open-source**: free for individual and academic use, all rights reserved, commercial use by permission. See [`LICENSE`](./LICENSE) for the full terms.

## Author

Fernando Díaz, PhD — West Texas A&M University.
