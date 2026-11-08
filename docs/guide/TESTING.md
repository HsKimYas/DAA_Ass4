# Assignment 4 — testing

Use the [build/check commands](../Assignment_4_EN.md#build-check-and-submit). The starter includes 44 public cases and a repeated mixed batch. Add your own boundary and stress tests across the full published input domain.

## Required cases

|Command|Own checks to include|
|---|---|
|lcs|Either/both empty; subsequence rather than substring; repeated characters; alternative optimal sequences|
|merge|0/1 blocks; zeros; multiple optimal plans; adjacent versus arbitrary merge; large total costs; chronological plan|
|tree|0/1 vertices; all negative; zero/ties; deep chain; no repeated/adjacent selected vertices; large sum|
|naive/kmp/rk|Empty pattern gives n+1 starts; empty text; pattern longer; case and punctuation; overlaps; identical outputs on common domain|
|rk|ab/dj collision; negative remainder normalization; verify each equal-hash candidate|
|suffix|Empty/one char; all equal; all distinct; no added sentinel; permutation/order; direct small LCP; tied longest repeats and overlaps|
|aho|Empty dictionary/texts/text; duplicate and suffix patterns; overlaps; consecutive requests and repeated independent texts|

Test mixed requests within one process to catch stale state. For small inputs use a simple independently written oracle; comparing implementations that share the same bug is insufficient. At large inputs test correctness as well as completion.

## Limits and official grading

Input domains are in [Contracts](CONTRACTS.md). Grading limits: 60s compilation, 20s requirement-group batches, 1 CPU, 768 MiB container memory, Java heap≤512 MiB, 128 processes and 8 MiB output. Public launcher compilation is limited to 60s; each public batch and a local --input run are limited to 20s. The launcher uses Java heap 384 MiB locally; the official Java heap limit is 512 MiB.

Each official group runs as one JSONL batch. A process failure, timeout, invalid JSON line, or missing/extra result line can fail every case in that batch. A well-formed incorrect answer fails its own case. Required fields and their types are checked before core/witness/scale semantics; additional object fields are ignored. The repeated public batch also checks mixed tasks; official groups each start a new process and cover one task at a time.

The submitted commit is assessed. Infrastructure failures are investigated and the checks rerun before a final mark is recorded. Benchmark rankings do not affect the mark.
