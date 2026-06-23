# QuickScan — Sample Demo Set

A small, **clean** synthetic demo set for first-run trials, screenshots, and the
walkthrough video. The sheets are **computer-generated** (a simulated print → scan
of the standard QuickScan bubble sheet) — they are **not** real students, and this
is **not** the adversarial stress corpus. Every sheet is a normal, cleanly filled
sheet with realistic pencil darkness, slight scan skew, and varied answers.

## What's here

| File | What it is |
|---|---|
| `ANSWER_KEY.pdf` | The answer key sheet (ID `999999999`). 50 questions; correct answers cycle **A, B, C, D, E, A, …**. |
| `ALL_student_sheets.pdf` | **20 filled student sheets**, one page each — the file you upload as the scanned exams. |
| `roster.csv` | Canvas-format roster; the `SIS User ID` column matches the IDs bubbled on the sheets. |
| `ground_truth.json` | Reference only: each student's intended answers and expected score, so you can confirm QuickScan's grades. |

## Set details

- **50 questions**, single page per student.
- **20 students**, 9-digit IDs (`700000011`, `700001368`, …).
- Score spread ≈ **56%–92%** (raw 28–46 / 50, mean ≈ 36 / 50) for a realistic
  histogram, item analysis, and reliability stats.
- Verified: the generated sheets read back through the OMR with IDs, scores, and
  every answer cell matching ground truth, and the key splices correctly.

## How to use

1. Open QuickScan (`index.html`).
2. Set the **Student-ID width to 9** and the exam to **50 questions** if prompted.
3. Import `ANSWER_KEY.pdf` as the **answer key**.
4. Import `ALL_student_sheets.pdf` as the **student sheets** and grade.
5. (Optional) Load `roster.csv` to attach student names to the bubbled IDs.

Regenerate or resize this set with the project's `test-files/Simulations` generator.
