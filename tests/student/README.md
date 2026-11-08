# Student tests

Requires Python 3.12+ and JDK 17+. Run from the repository root:

```sh
python tools/run.py --language Java --setup
python tools/run.py --language Java --check
python tests/student/run_tests.py
python tests/student/benchmark.py --samples 5 --iterations 200 --warmup 200
```

**Recorded result: 2,014/2,014 PASS.** The suite runs 84 named and 910 seeded random cases twice in one process, then 26 full-domain cases. Seed: `20261108`. Independent oracles check outputs, optimality and reconstructed witnesses; alternative optimal answers are accepted.

- [Named fixtures](small_cases.json)
- [Full test evidence](results/student_test_results.json)
- [Test log](results/student_tests.log)
- [Benchmark results](results/benchmark_results.csv)
- [Algorithm analysis](../../ANALYSIS.md)

Each Java batch uses a 20-second timeout, 384 MiB heap and 8 MiB output limit. Reruns overwrite the corresponding result files.
