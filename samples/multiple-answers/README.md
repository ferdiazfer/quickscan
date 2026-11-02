# Sample set: multiple answers, points and bonus

A 50-question exam for 20 students that uses the features added in v2.218. The sheets are computer-generated; they are not real students.

| File | What it is |
|---|---|
| `ANSWER_KEY.pdf` | The answer key sheet. Questions 10, 20, 30 and 40 have several correct answers |
| `ALL_student_sheets.pdf` | 20 filled student sheets, one page each |
| `roster.csv` | Canvas-format roster matching the IDs on the sheets |
| `ground_truth.json` | Reference only: each student's intended answers and expected scores |

## The exam

| Setting | Value |
|---|---|
| Select-all-that-apply questions | Q10 = A and C · Q20 = B and D · Q30 = A, C and E · Q40 = B, C and D |
| Question points | Q10, Q20, Q30 and Q40 are worth 2 points each; all others 1 point |
| Bonus questions | Q49 and Q50 (a correct answer adds its point; a wrong or blank answer costs nothing) |
| Total possible | 52 points (bonus not included) |

## How to use

1. Open QuickScan. Create a class and an exam with **50 questions**.
2. Set the Student-ID width to **9**, then import `roster.csv`.
3. In the Key tab, upload `ANSWER_KEY.pdf`. QuickScan finds the four questions with several answers and asks whether to grade them as select all that apply. Click **Yes**.
4. In the Scan tab, upload `ALL_student_sheets.pdf`.
5. In Results, open **Points and Bonus**: tick **Use question points**, set questions 10 to 10 worth 2 (then 20, 30 and 40 the same way), and mark questions 49 to 50 as bonus.
6. Optional: in **Multiple-Answer Scoring**, tick **Partial credit**.

The **Adjusted** tag next to Student Scores lists everything applied to the scores.

## Expected results

All or nothing is the default (full points only for the exact set). Partial credit gives (right marks minus wrong marks) divided by the number of correct answers, never below zero, times the question's points. Scores are capped at 100%.

| Student | Student ID | Points (all or nothing) | % (all or nothing) | % (partial credit) |
|---|---|---|---|---|
| Perez, James | 700000011 | 40.00 / 52 | 76.92% | 79.49% |
| Jones, Maria | 700001368 | 42.00 / 52 | 80.77% | 86.54% |
| Clark, David | 700002725 | 46.00 / 52 | 88.46% | 92.31% |
| Wilson, Sarah | 700004082 | 47.00 / 52 | 90.38% | 91.67% |
| Nguyen, Michael | 700005439 | 47.00 / 52 | 90.38% | 91.67% |
| Gonzalez, Jessica | 700006796 | 39.00 / 52 | 75.00% | 75.00% |
| Robinson, Robert | 700008153 | 42.00 / 52 | 80.77% | 83.33% |
| Taylor, Ashley | 700009510 | 36.00 / 52 | 69.23% | 71.15% |
| Martinez, Carlos | 700010867 | 44.00 / 52 | 84.62% | 88.46% |
| Anderson, Emily | 700012224 | 51.00 / 52 | 98.08% | 98.08% |
| Garcia, Daniel | 700013581 | 47.00 / 52 | 90.38% | 92.95% |
| Martin, Amanda | 700014938 | 47.00 / 52 | 90.38% | 94.87% |
| Brown, Jose | 700016295 | 44.00 / 52 | 84.62% | 85.90% |
| Harris, Brittany | 700017652 | 48.00 / 52 | 92.31% | 92.31% |
| Williams, Joshua | 700019009 | 45.00 / 52 | 86.54% | 86.54% |
| Thompson, Megan | 700020366 | 50.00 / 52 | 96.15% | 96.15% |
| Lopez, Andrew | 700021723 | 45.00 / 52 | 86.54% | 86.54% |
| Ramirez, Samantha | 700023080 | 42.00 / 52 | 80.77% | 80.77% |
| Hernandez, Luis | 700024437 | 50.00 / 52 | 96.15% | 96.15% |
| Sanchez, Rachel | 700025794 | 52.00 / 52 | 100.00% | 100.00% |

Rachel Sanchez answers both bonus questions correctly on top of a perfect exam: 54 of 52 points, shown as 100% with the cap on and 103.85% with it off.
