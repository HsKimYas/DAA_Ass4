# Assignment 4 — Dynamic Programming and String Processing

[Interactive lesson and practice](https://rzhaniya.github.io/daa-assignment-4-archive/) · [English specification](docs/Assignment_4_EN.md) · [Русская версия](docs/README_RU.md)

**Course:** Design and Analysis of Algorithms. **Practical:** 50 points. **Defence:** 50 points. **Availability:** 29 October–8 November 2026, 23:59, for both practical work and defence; Moodle records approved extensions.

Implement six parts with eight commands: LCS; ordered adjacent-block merging; maximum-weight independent set on a tree; naive, KMP and exact Rabin–Karp search; suffix array with Kasai LCP; Aho–Corasick. The work covers syllabus weeks 8–10. This is a starter template: the algorithm methods are TODOs. Read the specification before coding.

## Create your repository

1. Select **Use this template → Create a new repository**. Create your own repository, then clone it to your computer or open it in your development environment. Work in your copy.
2. Set `language` in `submission.json` to `Java`, `Python`, `Cpp` or `CSharp`. Install Python 3.12+ for the launcher and the selected runtime: JDK 17+, Python 3.12+, C++17 compiler, or .NET 8 SDK.
3. From the repository root, run `python tools/run.py --setup`. This checks compilation and startup, not the algorithms.
4. Implement the TODO methods in your chosen language's `source` directory. Preserve the UTF-8 JSON Lines interface. Add your own tests under `tests/student` and complete [ANALYSIS.md](ANALYSIS.md) in English.
5. Run `python tools/run.py --check`. It checks 44 public cases and a repeated mixed batch. Also test the full published domains, boundary cases and alternative optimal witnesses.
6. Commit and push your implementation. In **Actions → Public checks**, check the run for that commit. The official template checks startup in all four languages; your copy also runs the algorithm checks.

## Submit in Moodle

Submit the **exact commit URL with its full 40-character SHA**, plus the chosen language, in [Assignment 4 → Online text](https://lms.astanait.edu.kz/mod/assign/view.php?id=95272). An Actions run URL for the same commit is optional. Give the teacher access if your repository is private. Click **Submit assignment** and verify the final submission status. If you revise before the deadline, update the commit link. Do not upload a ZIP as your submission.

The submitted commit must include selected source files, `submission.json`, your tests, completed English `ANALYSIS.md` and actual build/run/test commands. Include correctness, reconstruction, complexity and a reproducible comparison of naive/KMP/exact RK. Acknowledge sources and AI assistance, their contribution and your own verification.

## Learn and prepare

Use the [bilingual lesson](https://rzhaniya.github.io/daa-assignment-4-archive/), eight small interactive models, [Week 8 lecture](https://rzhaniya.github.io/daa-assignment-4-archive/week8/), and the [ungraded 15-question / 25-minute practice](https://rzhaniya.github.io/daa-assignment-4-archive/practice.html). A second [15-question practice with explanations](https://rzhaniya.github.io/daa-assignment-4-archive/practice-b.html) is also available. The public learning questions are separate from the assessed Moodle questions.

The [individual English defence](https://lms.astanait.edu.kz/mod/quiz/view.php?id=95271) has **15 questions in 25 minutes**, one attempt: 10 single-answer and 5 multiple-response, three pages of five, free navigation. All six assignment parts are covered. Work independently without AI or external assistance during the defence.

Each question is worth 1 raw point; quiz grade = raw/15 × 50. A single-answer question earns 1 for a correct answer and 0 for a wrong or blank answer. For a multiple-response question with k correct options (2 or 3), each selected correct option earns 1/k and each selected wrong option deducts 1/(2k), with a floor of zero per question. Selecting all five earns 0.25 for k=2 or about 0.67 for k=3. Full credit requires every correct option and no wrong selections. Follow the quiz instructions and approved accommodations in Moodle.

## Assessment and contracts

Practical work: 19 marking groups, 50 points. Defence: 50 points. A4 is out of 100 and contributes 20% of the second attestation; Quiz II is separate. The practical mark is calculated from the submitted commit using the rubric. Alternative optimal witnesses are accepted wherever reconstruction is non-unique. The rubric defines the 19 marking groups, required output schemas and partial credit.

| Practical part | Points |
|---|---:|
| LCS | 8 |
| Ordered adjacent-block merging | 7 |
| Tree independent set | 7 |
| Naive / KMP / exact RK | 10 |
| Suffix array and Kasai LCP | 9 |
| Aho–Corasick | 9 |
| **Total** | **50** |

<details>
<summary>Detailed reference</summary>

[Contracts](docs/guide/CONTRACTS.md) · [Rubric](docs/guide/RUBRIC.md) · [Testing](docs/guide/TESTING.md) · [Submission checklist](docs/guide/SUBMISSION.md) · [Algorithm notes](docs/LECTURE_CLARIFICATIONS_EN_RU.md)

</details>
