# Assignment 4 — Java

Java implementation of eight commands: `lcs`, `merge`, `tree`, `naive`, `kmp`, `rk`, `suffix` and `aho`.

## Run

Requires **JDK 17+** and **Python 3.12+**. Run from the repository root:

```sh
python tools/run.py --setup
python tools/run.py --check
python tools/run.py --input examples/lcs.jsonl
python tests/student/run_tests.py
python tests/student/benchmark.py
```

On Windows, `py -3` can replace `python`. `submission.json` selects Java. Input/output uses UTF-8 JSON Lines: one request and one result per line.

## Files and results

- `Java/source/`: implementation and JSON transport.
- [ANALYSIS.md](ANALYSIS.md): algorithms, complexity, tests and measurements.
- `tests/student/`: own tests, benchmark and recorded results.

Recorded results: **44/44 public cases**, the **88-request repeated batch**, and **2014/2014 own checks** passed.

