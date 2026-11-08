# Assignment 4 — Analysis

Yasina Bauyrzhanova | SE-2538

## Environment and commands

Java: Temurin 17.0.21+9 (`--release 17`, heap 384 MiB); Python 3.12.14; Debian 13/Linux x86-64. Reported hardware: AMD EPYC 9V74, 9 virtual CPUs, 9.73 GiB RAM. Runs recorded on 8 November 2026.

```sh
python tools/run.py --setup
python tools/run.py --check
python tools/run.py --input examples/lcs.jsonl
python tests/student/run_tests.py
python tests/student/benchmark.py --samples 5 --iterations 200 --warmup 200
```

The launcher compiles `Java/source/*.java` using `javac --release 17` and starts `Main`. All mutable algorithm state is local to a request; UTF-8 JSONL transport is preserved. Costs, weights and occurrence counts use `long`. Printable ASCII is processed without normalization.

## Algorithms and correctness

**LCS.** `dp[i][j]` is the optimum for prefixes `a[0..i)` and `b[0..j)`. Empty prefixes give zero. Equal final characters extend `dp[i-1][j-1]`; otherwise take `max(dp[i-1][j],dp[i][j-1])`. These cases cover every optimum. Increasing indices satisfy dependencies. Backtracking emits equal characters and follows optimal predecessors; mismatch ties decrement `i`. The result is an optimal subsequence of both strings.

**Merge.** `dp[l][r]` minimizes adjacent merging of `[l,r]`; singleton cost is zero. For every last split `k`, evaluate `dp[l][k]+dp[k+1][r]+sum(l..r)`, using prefix sums. Increasing interval lengths make children available. Every valid plan has one such split, proving optimality. Store the smallest optimal `k`; emit both child plans before their parent merge. Empty/singleton inputs return no operations; reconstruction depth is at most 199.

**Tree.** Root at 0 and create an iterative parent-before-child order. Reverse processing calculates `take[v]=w[v]+sum(skip[child])` and `skip[v]=sum(max(take[child],skip[child]))`. Child subtrees are independent; selecting a parent excludes each child. These exhaustive choices prove the optimum. Reconstruct forwards: a selected parent forces skipping; otherwise take only when `take>skip`. Ties are skipped, the empty set handles negative weights, and no recursive traversal is used.

**Naive.** Compare characters at every start `0..n-m`. This examines all alignments and reports only full matches, including overlaps. A longer pattern has no starts; an empty pattern returns boundaries `0..n`.

**KMP.** `pi[i]` is the longest proper prefix also suffix of `pattern[0..i]`. Build it left to right. The scan maintains the matched prefix length; mismatches fall back through `pi`, covering remaining possible borders. After a match, use `pi[m-1]` to retain overlaps. Increases and fallbacks are amortized linear. Empty/longer patterns are handled before indexing.

**Rabin–Karp.** Use ASCII, base 31, modulus 101, highest power on the left. Roll by removing `old*31^(m-1)`, normalizing the remainder, multiplying by 31 and adding the new character. This preserves the window hash. Every equal-hash window is verified character by character, preventing false matches. Handle empty/longer patterns first. With `c` candidates, verification costs up to `c*m`; worst-case time is not linear.

**Suffix/Kasai.** Doubling sorts `(rank[i],rank[i+width])` by two stable counting sorts, then assigns ranks and doubles width. Missing halves have rank zero; only original nonempty suffixes are output. Induction on prefix length proves sorted suffix order. Kasai compares each suffix with its predecessor, reusing the previous match length minus one; total extension work is linear. Maximum adjacent LCP gives a longest repeat because suffixes sharing a prefix form a contiguous sorted group. Keep the first maximum encountered; overlaps are valid. Empty input returns empty arrays/string.

**Aho–Corasick.** Insert patterns into one 95-character trie; duplicates share terminals. BFS builds failure links and completed transitions from shorter suffix states. Scanning visits the longest matching suffix state at each character. Reverse BFS propagates visits to failure ancestors, counting all suffix-pattern endings and overlaps without enumerating matches. Read terminals in original dictionary order. Clear visits/state between texts. Empty dictionary gives one empty row per text; empty texts give zero counts.

### Complexity

Bounds exclude parsing; auxiliary and output memory are separate. Search uses text length `n`, pattern length `m`, and `z` results. Aho uses total pattern length `L`, states `S`, dictionary size `p`, texts `q` and total text length `T`.

| Command | Time | Auxiliary memory | Output memory |
|---|---|---|---|
| LCS | `O((a+1)(b+1))` | `O((a+1)(b+1))` | `O(length+1)` |
| Merge | `O(n^3)` | `O(n^2)` | `O(n+1)` |
| Tree | `O(n+1)` | `O(n+1)` | `O(selected+1)` |
| Naive | `O(n*m+n+1)` | `O(1)` | `O(z+1)` |
| KMP | `O(n+m+z+1)` | `O(m+1)` | `O(z+1)` |
| Exact RK | `O(n+m+c*m)` for `1<=m<=n`; general `O(n*m+n+m+1)` | `O(1)` | `O(z+1)` |
| Suffix + Kasai | doubling `O(n log(n+1))`; Kasai `O(n)` | `O(n+1)` | `O(n+1)` |
| Aho | build `O(L+95*S+p)`; queries `O(T+q*(S+p))` | `O(95*S+p)` | `O(q*(p+1)+1)` |

Empty merge and suffix inputs take `O(1)` time/space. Returned lists and primitive arrays store required outputs only.

## Tests

**Passed:** 44 public cases, the repeated 88-request public batch, and 2014 own checks. Own checks comprise 84 named + 910 seeded random cases, repeated twice in one process, plus 26 scale cases. Seed: `20261108`.

Independent small oracles enumerate subsequences, merge operations and vertex subsets, or use direct matching/suffix sorting. Validators check complete schemas and witnesses, accepting alternative optima. Coverage includes empty inputs, ties, negatives, large sums, all printable ASCII, overlaps, collisions and state reset. Scale cases reach LCS 1000×1000, merge 200, tree 100000, KMP 200000 characters, suffix 50000, and Aho 100000 pattern characters/10000 patterns/100 texts. Every large output element is validated.

| Fixture in `small_cases.json` | Expected / actual | Detects |
|---|---|---|
| `lcs_subsequence_not_substring` | length 4, `team` / same | Subsequence versus substring |
| `merge_adjacency_counterexample` | cost 203 / 203, valid alternative plan | Invalid nonadjacent merges |
| `tree_chain` | weight 10, vertices `[0,2]` / same | Incorrect greedy selection |
| `naive_empty_pattern` | `[0,1,2,3,4,5]` / same | Missing boundary |
| `kmp_overlaps` | `[0,1,2]` / same | Lost overlaps |
| `rk_collision` | `[0]` / same | `ab`/`dj` hash collision |
| `suffix_banana` | SA `[5,3,1,0,4,2]`, LCP `[0,1,3,0,0,2]`, `ana` / same | Order, LCP and repeat |
| `aho_duplicates_suffix_reset` | Exact count matrix / same | Duplicates, suffix matches, reset |

[Fixtures](tests/student/small_cases.json) contain inputs/expectations; [results](tests/student/results/student_test_results.json) contain actual answers and scale summaries. Logs are in `tests/student/results/`. Each Java batch used a 20-second timeout and 384 MiB heap. Largest output: 5,000,213 bytes, below 8 MiB. Official grading remains separate.

## Search comparison

Identical pairs are checked against an independent oracle before timing. Sizes: `(500,50)`, `(1500,150)`, `(3000,300)`. Distributions: uniform lowercase text generated by Java `Random(20261108+n)`, with pattern taken from its middle; `a^n` versus `a^(m-1)b`; and dense matches `a^n` versus `a^m`.

One JVM; standard JIT/GC; 1000 initial warm-up calls per method and 200 per pair. Five samples × 200 calls, measured by `nanoTime`; rotate method order. Scope includes preprocessing, result allocation and identical lightweight result consumption; excludes compilation, startup, JSON, input generation, validation and warm-up. Units: microseconds/call.

| Input | n / m | Naive median | KMP median | RK median |
|---|---:|---:|---:|---:|
| Random | 500 / 50 | 8.614 | 10.454 | 11.034 |
| Random | 1500 / 150 | 4.220 | 3.291 | 12.245 |
| Random | 3000 / 300 | 8.809 | 7.975 | 24.847 |
| Repeated, mismatch | 500 / 50 | 14.259 | 2.166 | 3.798 |
| Repeated, mismatch | 1500 / 150 | 139.184 | 8.237 | 13.064 |
| Repeated, mismatch | 3000 / 300 | 520.667 | 13.512 | 23.922 |
| Dense matches | 500 / 50 | 13.364 | 4.275 | 14.803 |
| Dense matches | 1500 / 150 | 68.467 | 17.285 | 83.935 |
| Dense matches | 3000 / 300 | 236.725 | 19.419 | 289.654 |

[All five raw samples](tests/student/results/benchmark_results.csv) and [environment/settings](tests/student/results/benchmark_results.json) are recorded. KMP avoids repeated prefix comparisons; RK rejects mismatch windows efficiently but verifies every dense true match. Random timings include preprocessing and JIT/host noise, so they need not increase monotonically. Measurements do not prove asymptotic bounds. Modulus 101 intentionally exposes collisions and is not representative of every production hash.

## Sources and assistance

Sources: the official [specification](docs/Assignment_4_EN.md), [contracts](docs/guide/CONTRACTS.md) and [algorithm notes](docs/LECTURE_CLARIFICATIONS_EN_RU.md). The template supplied transport and public tools. ChatGPT helped with implementation, explaining the task, and preparing all the text documentation. Laziness and AI are the best friends when it comes to writing text and README files >:3
