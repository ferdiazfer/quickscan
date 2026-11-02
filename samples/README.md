# QuickScan sample sets

Two ready-made sets so you can try QuickScan with no printer or scanner. The sheets are computer-generated (a simulated print and scan of the standard QuickScan bubble sheet). They are not real students.

| Folder | What it shows |
|---|---|
| this folder (`ANSWER_KEY.pdf`, `ALL_student_sheets.pdf`, `roster.csv`) | The basics: 50 questions, one answer per question, 20 students |
| [`multiple-answers/`](multiple-answers/) | New in v2.218: select-all-that-apply questions, question points and bonus questions. 50 questions, 20 students |

## Basic set

| File | What it is |
|---|---|
| `ANSWER_KEY.pdf` | The answer key sheet. 50 questions; correct answers cycle A, B, C, D, E, A, ... |
| `ALL_student_sheets.pdf` | 20 filled student sheets, one page each. This is the file you upload as the scanned exams |
| `roster.csv` | Canvas-format roster. The `SIS User ID` column matches the IDs bubbled on the sheets |
| `ground_truth.json` | Reference only: each student's intended answers and expected score |

Score spread is about 56% to 92% (28 to 46 of 50), for a realistic histogram, item analysis and reliability statistics.

## How to use (basic set)

1. Open QuickScan.
2. Create a class and an exam with **50 questions**.
3. Set the Student-ID width to **9**, then import `roster.csv`.
4. In the Key tab, upload `ANSWER_KEY.pdf`.
5. In the Scan tab, upload `ALL_student_sheets.pdf`. Grading starts on its own.
6. Open Results.
