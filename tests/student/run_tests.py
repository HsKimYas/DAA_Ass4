#!/usr/bin/env python3
"""Independent, reproducible correctness and full-domain tests for the Java solution.

Run from the repository root with Python 3.12+ and JDK 17+ on PATH:
    python tests/student/run_tests.py

No third-party packages or public-result validator are used. The Java algorithms
are always exercised through the original JSON Lines entry point.
"""

from __future__ import annotations

import argparse
from collections import Counter
from datetime import datetime, timezone
from functools import lru_cache
import hashlib
from itertools import combinations
import json
from pathlib import Path
import platform
import random
import subprocess
import sys
import time


ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
RESULTS = HERE / "results"
SEED = 20261108
PRINTABLE = "".join(chr(i) for i in range(32, 127))
MAX_OUTPUT = 8 * 1024 * 1024
MIN_INT, MAX_INT = -(2**63), 2**63 - 1


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def is_integer(value):
    return type(value) is int and MIN_INT <= value <= MAX_INT


def integer_array(value):
    return type(value) is list and all(is_integer(item) for item in value)


def is_subsequence(sequence, text):
    cursor = 0
    for char in text:
        if cursor < len(sequence) and char == sequence[cursor]:
            cursor += 1
    return cursor == len(sequence)


def brute_lcs(a, b):
    """Enumerate subsequences, not the production prefix-DP recurrence."""
    if len(a) > len(b):
        a, b = b, a
    for length in range(len(a), -1, -1):
        for indices in combinations(range(len(a)), length):
            candidate = "".join(a[i] for i in indices)
            if is_subsequence(candidate, b):
                return {"length": length, "sequence": candidate}
    raise AssertionError("The empty subsequence must be feasible")


def brute_merge(sizes):
    """Enumerate every available adjacent operation on the CURRENT blocks."""
    @lru_cache(maxsize=None)
    def search(blocks):
        if len(blocks) <= 1:
            return 0, ()
        best_cost, best_plan = None, None
        for i in range(len(blocks) - 1):
            left, right = blocks[i], blocks[i + 1]
            joined = (left[0], right[1], left[2] + right[2])
            rest = blocks[:i] + (joined,) + blocks[i + 2:]
            remaining_cost, remaining_plan = search(rest)
            cost = joined[2] + remaining_cost
            if best_cost is None or cost < best_cost:
                best_cost = cost
                best_plan = ((left[0], left[1], right[1]),) + remaining_plan
        return best_cost, best_plan

    cost, plan = search(tuple((i, i, size) for i, size in enumerate(sizes)))
    return {"cost": cost, "plan": [list(step) for step in plan]}


def brute_tree(request):
    """Enumerate all vertex subsets, independently of take/skip tree DP."""
    n, weights, edges = request["n"], request["weights"], request["edges"]
    best_weight, best_selected = 0, []
    for mask in range(1 << n):
        if any(mask & (1 << u) and mask & (1 << v) for u, v in edges):
            continue
        selected = [i for i in range(n) if mask & (1 << i)]
        weight = sum(weights[i] for i in selected)
        if weight > best_weight:
            best_weight, best_selected = weight, selected
    return {"weight": best_weight, "selected": best_selected}


def direct_positions(text, pattern):
    # startswith at each boundary also implements the required empty-pattern rule.
    return [i for i in range(len(text) + 1) if text.startswith(pattern, i)]


def direct_suffix(text):
    # Materializing suffixes is deliberately restricted to tiny ORACLE inputs.
    sa = sorted(range(len(text)), key=lambda i: text[i:])
    lcp = [0] * len(text)
    for rank in range(1, len(sa)):
        a, b, length = sa[rank - 1], sa[rank], 0
        while b + length < len(text) and a + length < len(text):
            if text[a + length] != text[b + length]:
                break
            length += 1
        lcp[rank] = length
    maximum = max(lcp, default=0)
    start = sa[lcp.index(maximum)] if maximum else 0
    return {"sa": sa, "lcp": lcp, "repeated": text[start:start + maximum]}


def oracle(request):
    task = request["task"]
    if task == "lcs":
        return brute_lcs(request["a"], request["b"])
    if task == "merge":
        return brute_merge(request["sizes"])
    if task == "tree":
        return brute_tree(request)
    if task in ("naive", "kmp", "rk"):
        return {"positions": direct_positions(request["text"], request["pattern"])}
    if task == "suffix":
        return direct_suffix(request["text"])
    if task == "aho":
        return {"counts": [[len(direct_positions(text, pattern))
                            for pattern in request["patterns"]]
                           for text in request["texts"]]}
    raise AssertionError(f"Unknown task {task}")


def validate_domain(request):
    """Fail if the test generator accidentally creates an out-of-contract input."""
    def ascii_string(value):
        return type(value) is str and all(32 <= ord(c) <= 126 for c in value)

    task = request["task"]
    if task == "lcs":
        a, b = request["a"], request["b"]
        require(ascii_string(a) and ascii_string(b), "LCS alphabet")
        require(len(a) <= 1000 and len(b) <= 1000 and len(a) * len(b) <= 1000000,
                "LCS dimensions")
    elif task == "merge":
        sizes = request["sizes"]
        require(integer_array(sizes) and len(sizes) <= 200 and
                all(0 <= v <= 10**9 for v in sizes), "Merge domain")
    elif task == "tree":
        n, weights, edges = request["n"], request["weights"], request["edges"]
        require(is_integer(n) and 0 <= n <= 100000 and len(weights) == n, "Tree n")
        require(integer_array(weights) and all(-10**9 <= w <= 10**9 for w in weights),
                "Tree weights")
        require(len(edges) == max(0, n - 1), "Tree edge count")
        parents = list(range(n))

        def root(v):
            while parents[v] != v:
                parents[v] = parents[parents[v]]
                v = parents[v]
            return v

        for edge in edges:
            require(integer_array(edge) and len(edge) == 2, "Tree edge schema")
            u, v = edge
            require(0 <= u < n and 0 <= v < n, "Tree endpoint")
            ru, rv = root(u), root(v)
            require(ru != rv, "Tree cycle/duplicate")
            parents[ru] = rv
        # An acyclic graph with n vertices and n-1 edges is connected.
    elif task in ("naive", "kmp", "rk"):
        text, pattern = request["text"], request["pattern"]
        require(ascii_string(text) and ascii_string(pattern), "Search alphabet")
        n, m = len(text), len(pattern)
        limits = {"naive": (3000, 3000), "kmp": (200000, 100000), "rk": (10000, 10000)}
        require(n <= limits[task][0] and m <= limits[task][1], "Search dimensions")
        require(task != "rk" or n * m <= 20000000, "RK product")
    elif task == "suffix":
        require(ascii_string(request["text"]) and len(request["text"]) <= 50000,
                "Suffix domain")
    elif task == "aho":
        patterns, texts = request["patterns"], request["texts"]
        require(len(patterns) <= 10000 and sum(map(len, patterns)) <= 100000,
                "Aho dictionary limits")
        require(len(texts) <= 100 and sum(map(len, texts)) <= 200000, "Aho text limits")
        require(all(ascii_string(p) and p for p in patterns), "Aho nonempty patterns")
        require(all(ascii_string(t) for t in texts), "Aho text alphabet")


def validate(request, actual, expected):
    """Check full schemas, exact optimum values and semantic witnesses."""
    require(type(actual) is dict, "The result is not an object")
    task = request["task"]
    if task == "lcs":
        length, sequence = actual["length"], actual["sequence"]
        require(is_integer(length) and type(sequence) is str, "LCS output types")
        require(length == expected["length"] == len(sequence), "LCS optimum/length")
        require(is_subsequence(sequence, request["a"]) and
                is_subsequence(sequence, request["b"]), "Invalid LCS witness")
    elif task == "merge":
        cost, plan, sizes = actual["cost"], actual["plan"], request["sizes"]
        require(is_integer(cost) and type(plan) is list, "Merge output types")
        require(len(plan) == max(0, len(sizes) - 1), "Merge operation count")
        blocks = [(i, i, size) for i, size in enumerate(sizes)]
        total = 0
        for step in plan:
            require(integer_array(step) and len(step) == 3, "Merge step schema")
            left, split, right = step
            require(0 <= left <= split < right < len(sizes), "Merge interval bounds")
            position = next((i for i, block in enumerate(blocks)
                             if block[:2] == (left, split)), None)
            require(position is not None and position + 1 < len(blocks),
                    "Merge child does not exist yet")
            require(blocks[position + 1][:2] == (split + 1, right),
                    "Merge children are not adjacent current blocks")
            combined = blocks[position][2] + blocks[position + 1][2]
            total += combined
            blocks[position:position + 2] = [(left, right, combined)]
        require(len(blocks) <= 1, "Merge plan is incomplete")
        require(total == cost == expected["cost"], "Merge optimum or reconstructed cost")
    elif task == "tree":
        selected, weight = actual["selected"], actual["weight"]
        require(integer_array(selected) and is_integer(weight), "Tree output types")
        chosen = set(selected)
        require(len(selected) == len(chosen), "Repeated tree vertex")
        require(all(0 <= v < request["n"] for v in selected), "Tree vertex bounds")
        require(not any(u in chosen and v in chosen for u, v in request["edges"]),
                "Adjacent tree vertices were both selected")
        require(sum(request["weights"][v] for v in selected) == weight == expected["weight"],
                "Tree optimum or reconstructed weight")
    elif task in ("naive", "kmp", "rk"):
        positions = actual["positions"]
        require(integer_array(positions), "Search positions are not integers")
        require(positions == expected["positions"], "Missing, false, duplicate or unsorted matches")
    elif task == "suffix":
        sa, lcp, repeated = actual["sa"], actual["lcp"], actual["repeated"]
        text, n = request["text"], len(request["text"])
        require(integer_array(sa) and integer_array(lcp) and type(repeated) is str,
                "Suffix output types")
        require(len(sa) == len(lcp) == n and set(sa) == set(range(n)),
                "Suffix permutation/length; no extra sentinel is allowed")
        require(sa == expected["sa"] and lcp == expected["lcp"], "Suffix order or LCP")
        require(len(repeated) == max(lcp, default=0), "Nonoptimal repeated substring")
        if repeated:
            first = text.find(repeated)
            require(first >= 0 and text.find(repeated, first + 1) >= 0,
                    "Repeated substring does not have two distinct starts")
    elif task == "aho":
        counts = actual["counts"]
        require(type(counts) is list and len(counts) == len(request["texts"]),
                "Aho output rows")
        require(all(integer_array(row) and len(row) == len(request["patterns"])
                    and all(v >= 0 for v in row) for row in counts), "Aho count types/columns")
        require(counts == expected["counts"], "Aho counts/order/reset")
    else:
        raise AssertionError(f"Unvalidated task {task}")


def case(name, request, checks, expected=None, **metadata):
    validate_domain(request)
    return {"name": name, "input": request,
            "expected": oracle(request) if expected is None else expected,
            "checks": checks, **metadata}


def named_cases():
    cases = []
    for name, a, b, checks in [
        ("both_empty", "", "", "Empty zero-row/column base case"),
        ("first_empty", "", "abc", "Empty first sequence"),
        ("second_empty", "abc", "", "Empty second sequence"),
        ("subsequence_not_substring", "tea_time", "team", "Noncontiguous reconstruction"),
        ("repeated", "AAAAAB", "BAAAA", "Repeated-character choices"),
        ("alternative_optima", "ab", "ba", "Either a or b must be accepted"),
        ("case_and_spaces", "Ab a!", "a A!", "Case-sensitive characters and spaces"),
        ("nontrivial", "ABCBDAB", "BDCABA", "Several possible optimal witnesses"),
    ]:
        cases.append(case("lcs_" + name, {"task": "lcs", "a": a, "b": b}, checks))
    for name, sizes, checks in [
        ("empty", [], "No blocks and no merges"),
        ("single", [10**9], "One block costs zero"),
        ("zeros", [0, 0, 0, 0], "Zero costs and tied optimal plans"),
        ("alternative_optima", [1, 1, 1], "Accept either chronological optimal plan"),
        ("adjacency_counterexample", [1, 100, 1], "Arbitrary two-smallest merge is invalid"),
        ("large_sum", [10**9] * 4, "Optimal cost 8000000000 exceeds signed 32-bit"),
        ("chronological", [5, 2, 4, 7, 1], "Each child block exists before its parent merge"),
        ("mixed_zeros", [0, 7, 0, 1, 0], "Zero and positive sizes"),
    ]:
        cases.append(case("merge_" + name, {"task": "merge", "sizes": sizes}, checks))
    for name, weights, edges, checks in [
        ("empty", [], [], "Empty tree"),
        ("single_negative", [-3], [], "Empty selected set is allowed"),
        ("single_zero", [0], [], "A zero-weight tie is valid"),
        ("single_positive", [10**9], [], "Root may be selected"),
        ("negative", [-1, -2, -3], [[0, 1], [1, 2]], "All-negative optimum is zero"),
        ("tie", [1, 1], [[0, 1]], "Either endpoint is an optimal witness"),
        ("chain", [4, 9, 6], [[0, 1], [1, 2]], "Skip the individually largest vertex"),
        ("root_is_leaf", [8, 7, 9, -1], [[3, 2], [0, 2], [2, 1]], "Arbitrary root/edge order"),
        ("large_sum", [0] + [10**9] * 5, [[0, i] for i in range(1, 6)],
         "Independent total exceeds signed 32-bit"),
    ]:
        cases.append(case("tree_" + name,
                          {"task": "tree", "n": len(weights), "weights": weights, "edges": edges}, checks))
    search_pairs = [
        ("both_empty", "", "", "Empty pattern has one boundary in empty text"),
        ("empty_text", "", "a", "Nonempty pattern in empty text"),
        ("empty_pattern", " a!? ", "", "All n+1 boundaries including the last"),
        ("longer_pattern", "ab", "abcd", "Handle m>n before indexing a window"),
        ("overlaps", "aaaaa", "aaa", "All overlapping starts"),
        ("fallback", "abababacababaca", "ababaca", "Fallback after a long matched prefix"),
        ("case_punctuation", "Aa! aa! Aa? Aa!", "Aa!", "Case and punctuation are significant"),
        ("last_start", "xxend", "end", "Include start n-m"),
        ("one_character", "x", "x", "One-character equality"),
        ("collision", "abdj", "ab", "ab and dj hash to 75; verify actual characters"),
        ("only_collision", "dj", "ab", "Equal hash alone must not report a match"),
        ("negative_remainder", "zzab", "ab", "Rolling subtraction is negative before normalization"),
        ("escaped_json", 'a"\\a"\\!', '"\\', "JSON quotes and backslashes are ordinary characters"),
        ("printable_ascii", PRINTABLE * 2, PRINTABLE, "All 95 permitted ASCII codes"),
    ]
    for name, text, pattern, checks in search_pairs:
        for method in ("naive", "kmp", "rk"):
            cases.append(case(method + "_" + name,
                              {"task": method, "text": text, "pattern": pattern}, checks,
                              comparison_id="named_" + name))
    for name, text, checks in [
        ("empty", "", "No empty suffix or sentinel in output"),
        ("single", "$", "A dollar sign is real input, not a sentinel"),
        ("all_equal", "aaaaa", "Repeated substring may overlap"),
        ("all_distinct", "zyx?!", "All adjacent LCPs are zero"),
        ("banana", "banana", "Known suffix ordering and LCP alignment"),
        ("tied_repeats", "abXabYcdZcd", "Either ab or cd is a longest repeat"),
        ("punctuation", "$a$ a$", "ASCII order including spaces and dollar signs"),
        ("printable_ascii", PRINTABLE, "Every printable character and JSON escaping"),
    ]:
        cases.append(case("suffix_" + name, {"task": "suffix", "text": text}, checks))
    for name, patterns, texts, checks in [
        ("both_empty", [], [], "Empty dictionary and empty text array"),
        ("empty_dictionary", [], ["", "abc", "abc"], "Retain one empty row per text"),
        ("no_texts", ["he", "he"], [], "No rows when texts is empty"),
        ("empty_text", ["he", "she", "he"], [""], "One zero for each dictionary position"),
        ("duplicates_suffix_reset", ["he", "she", "he", "hers"],
         ["ushers", "sheshe", "", "ushers"], "Suffix matches, duplicate columns, and independent texts"),
        ("overlaps", ["a", "aa", "aaa", "a"], ["aaaaa", "a", "aaaaa"],
         "Dense overlapping patterns and duplicate terminal states"),
        ("failure_chain", ["abcd", "bcd", "cd", "d", "abc", "bc", "c"],
         ["xabcdabcd", "abcd"], "Counts propagate through multiple suffix links"),
        ("punctuation", ['"', "\\", " !", "A", "a", "A"],
         ['A\\a" !A', "", 'A\\a" !A'], "Full JSON escaping and case sensitivity"),
        ("printable_ascii", list(PRINTABLE), [PRINTABLE * 2, ""], "All 95 automaton columns"),
    ]:
        cases.append(case("aho_" + name, {"task": "aho", "patterns": patterns, "texts": texts}, checks))
    return cases


def random_cases():
    rng, cases = random.Random(SEED), []
    alphabet = 'abAB !?"\\~'
    def word(length, chars=alphabet):
        return "".join(rng.choice(chars) for _ in range(length))

    for i in range(80):
        cases.append(case(f"random_lcs_{i:03}",
                          {"task": "lcs", "a": word(rng.randrange(10), "ab A"),
                           "b": word(rng.randrange(10), "ab A")}, "Enumerated-subsequence oracle"))
        cases.append(case(f"random_merge_{i:03}",
                          {"task": "merge", "sizes": [rng.randrange(11) for _ in range(rng.randrange(8))]},
                          "Exhaustive chronological adjacent-merge oracle"))
        n = rng.randrange(12)
        permutation = list(range(n))
        rng.shuffle(permutation)
        edges = [[permutation[v], permutation[rng.randrange(v)]] for v in range(1, n)]
        rng.shuffle(edges)
        for edge in edges:
            if rng.randrange(2):
                edge.reverse()
        cases.append(case(f"random_tree_{i:03}",
                          {"task": "tree", "n": n, "weights": [rng.randrange(-9, 10) for _ in range(n)],
                           "edges": edges}, "All vertex subsets; relabelled roots and shuffled edges"))
    for i in range(150):
        text = word(rng.randrange(81))
        if rng.random() < 0.55:
            start = rng.randrange(len(text) + 1)
            pattern = text[start:start + rng.randrange(25)]
        else:
            pattern = word(rng.randrange(25))
        for method in ("naive", "kmp", "rk"):
            cases.append(case(f"random_{method}_{i:03}",
                              {"task": method, "text": text, "pattern": pattern},
                              "Independent startswith oracle and equality across three algorithms",
                              comparison_id=f"random_search_{i:03}"))
    for i in range(120):
        chars = "aba !" if i % 2 == 0 else PRINTABLE
        cases.append(case(f"random_suffix_{i:03}",
                          {"task": "suffix", "text": word(rng.randrange(61), chars)},
                          "Direct suffix sort and direct adjacent LCP oracle"))
    for i in range(100):
        patterns = []
        for _ in range(rng.randrange(11)):
            patterns.append(rng.choice(patterns) if patterns and rng.random() < 0.4
                            else word(rng.randrange(1, 9), "aba !"))
        texts = [word(rng.randrange(71), "aba !") for _ in range(rng.randrange(7))]
        if len(texts) > 1:
            texts[-1] = texts[0]
        cases.append(case(f"random_aho_{i:03}",
                          {"task": "aho", "patterns": patterns, "texts": texts},
                          "Direct per-pattern occurrence oracle; duplicate and repeated texts"))
    return cases


def scale_cases():
    """Exact closed-form expectations, not a second copy of the Java algorithms."""
    text = "abCD !?~" * 125
    yield case("scale_lcs_identical_1000", {"task": "lcs", "a": text, "b": text},
               "Maximum 1000x1000 table; identical strings have LCS length 1000",
               {"length": 1000, "sequence": text})
    yield case("scale_lcs_shifted_1000", {"task": "lcs", "a": "ab" * 500, "b": "ba" * 500},
               "Equal full lengths cannot match; deleting one endpoint gives 999",
               {"length": 999, "sequence": ("ab" * 500)[:-1]})
    yield case("scale_lcs_disjoint_1000", {"task": "lcs", "a": "a" * 1000, "b": "b" * 1000},
               "Maximum dimensions with no matching character", {"length": 0, "sequence": ""})
    n, size = 200, 10**9
    height = (n - 1).bit_length()
    optimum = (n * (height + 1) - (1 << height)) * size
    yield case("scale_merge_200_large", {"task": "merge", "sizes": [size] * n},
               "Equal leaves have balanced optimal depths: cost = (n*(ceil(log2(n))+1)-2^ceil(log2(n)))*size",
               {"cost": optimum})
    yield case("scale_merge_200_zero", {"task": "merge", "sizes": [0] * n},
               "Maximum-size chronological plan with every split tied", {"cost": 0})
    n = 100000
    chain = [[i, i + 1] for i in range(n - 1)]
    yield case("scale_tree_chain_100000", {"task": "tree", "n": n, "weights": [10**9] * n, "edges": chain},
               "No recursive-stack failure; a unit path selects exactly ceil(n/2) vertices",
               {"weight": ((n + 1) // 2) * 10**9})
    yield case("scale_tree_star_100000", {"task": "tree", "n": n, "weights": [10**9] * n,
                                         "edges": [[i, n - 1] for i in range(n - 1)]},
               "Root 0 is a leaf; all n-1 leaves are optimal; total is 99999000000000",
               {"weight": (n - 1) * 10**9})
    yield case("scale_tree_negative_chain_100000",
               {"task": "tree", "n": n, "weights": [-10**9] * n, "edges": chain},
               "Deep all-negative tree still permits the empty set", {"weight": 0})
    for method in ("naive", "kmp", "rk"):
        yield case("scale_" + method + "_common_maximum", {"task": method, "text": "a" * 3000,
                                                           "pattern": "a" * 3000},
                   "Maximum common n=m=3000; all three methods must give [0]", {"positions": [0]})
    yield case("scale_naive_long_prefix", {"task": "naive", "text": "a" * 3000,
                                          "pattern": "a" * 1499 + "b"},
               "Many long partial matches but no full match", {"positions": []})
    yield case("scale_kmp_dense_200000", {"task": "kmp", "text": "a" * 200000,
                                         "pattern": "a" * 100000},
               "Maximum text/pattern lengths with 100001 overlapping occurrences",
               {"positions": list(range(100001))})
    yield case("scale_kmp_empty_200000", {"task": "kmp", "text": "~" * 200000, "pattern": ""},
               "Largest empty-pattern output: every boundary 0..200000",
               {"positions": list(range(200001))})
    yield case("scale_kmp_periodic_200000", {"task": "kmp", "text": "ab" * 100000,
                                            "pattern": "ab" * 50000},
               "Maximum-length nontrivial prefix fallback preserves every even start",
               {"positions": list(range(0, 100001, 2))})
    yield case("scale_kmp_long_prefix", {"task": "kmp", "text": "a" * 200000,
                                        "pattern": "a" * 99999 + "b"},
               "Maximum-domain adversarial mismatch; no result", {"positions": []})
    yield case("scale_rk_product_limit", {"task": "rk", "text": "a" * 10000, "pattern": "a" * 2000},
               "n*m=20000000 exactly; equal-hash true candidates all require verification",
               {"positions": list(range(8001))})
    yield case("scale_rk_pattern_10000", {"task": "rk", "text": "a" * 2000, "pattern": "a" * 10000},
               "Maximum pattern and product limit with m>n", {"positions": []})
    yield case("scale_rk_collisions", {"task": "rk", "text": "abdj" * 2500, "pattern": "ab"},
               "Many known ab/dj collisions must not add false starts",
               {"positions": list(range(0, 10000, 4))})
    n = 50000
    yield case("scale_suffix_equal_50000", {"task": "suffix", "text": "a" * n},
               "Suffixes sort shortest first; LCP is 0..n-1; longest repeat overlaps",
               {"sa": list(range(n - 1, -1, -1)), "lcp": list(range(n)), "repeated": "a" * (n - 1)})
    yield case("scale_suffix_periodic_50000", {"task": "suffix", "text": "ab" * (n // 2)},
               "Even starts precede odd starts, each in descending numeric order",
               {"sa": list(range(n - 2, -1, -2)) + list(range(n - 1, 0, -2)),
                "lcp": [0] + list(range(2, n, 2)) + [0] + list(range(1, n - 1, 2)),
                "repeated": "ab" * (n // 2 - 1)})
    text = (PRINTABLE * ((n + 94) // 95))[:n]
    sa, lcp = [], []
    for offset in range(95):
        group = list(range(offset, n, 95))[::-1]
        sa.extend(group)
        lcp.extend([0] + [n - previous for previous in group[:-1]])
    yield case("scale_suffix_ascii_50000", {"task": "suffix", "text": text},
               "Group by first ASCII character; shorter equal-phase periodic suffix precedes longer",
               {"sa": sa, "lcp": lcp, "repeated": text[:-95]})
    yield case("scale_aho_states_100001", {"task": "aho", "patterns": ["a" * 100000],
                                         "texts": ["a" * 200000]},
               "Maximum possible trie-state count and maximum text length",
               {"counts": [[100001]]})
    yield case("scale_aho_states_100_texts", {"task": "aho", "patterns": ["a" * 100000],
                                            "texts": ["a" * 2000] * 100},
               "100 independent texts with maximum state count; no text is long enough",
               {"counts": [[0] for _ in range(100)]})
    lengths = list(range(1, 447)) + [319]  # Sum is exactly 100000; 319 is a duplicate.
    yield case("scale_aho_nested_dense", {"task": "aho", "patterns": ["a" * k for k in lengths],
                                          "texts": ["a" * 200000]},
               "100000 total pattern characters; nested suffix matches are aggregated",
               {"counts": [[200000 - k + 1 for k in lengths]]})
    yield case("scale_aho_10000_duplicates_100_texts",
               {"task": "aho", "patterns": ["a" * 10] * 10000, "texts": ["a" * 2000] * 100},
               "Maximum p, q, total pattern/text length; 1 million exact output cells, no per-match expansion",
               {"counts": [[1991] * 10000 for _ in range(100)]})


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=True, sort_keys=True,
                                     separators=(",", ":")).encode("utf-8")).hexdigest()


def summarize(value):
    """Keep large evidence compact AFTER every output element has been checked."""
    if isinstance(value, dict):
        return {key: summarize(item) for key, item in value.items()}
    if isinstance(value, str) and len(value) > 120:
        return {"length": len(value), "prefix": value[:40], "suffix": value[-40:], "sha256": digest(value)}
    if isinstance(value, list):
        if len(value) > 12:
            return {"length": len(value), "first": summarize(value[:3]),
                    "last": summarize(value[-3:]), "sha256": digest(value)}
        return [summarize(item) for item in value]
    return value


def execute(command, cases):
    data = "".join(json.dumps(item["input"], ensure_ascii=True, separators=(",", ":")) + "\n"
                   for item in cases)
    started = time.perf_counter()
    process = subprocess.run(command, input=data, capture_output=True, text=True,
                             encoding="utf-8", timeout=20)
    elapsed = time.perf_counter() - started
    require(process.returncode == 0, f"Java exit {process.returncode}: {process.stderr[:2000]}")
    output_bytes = len(process.stdout.encode("utf-8"))
    require(output_bytes <= MAX_OUTPUT, f"Batch output exceeds 8 MiB: {output_bytes}")
    lines = process.stdout.splitlines()
    require(len(lines) == len(cases), f"Expected {len(cases)} lines, received {len(lines)}")
    def invalid_constant(value):
        raise ValueError(f"Non-JSON number {value}")
    answers = [json.loads(line, parse_constant=invalid_constant) for line in lines]
    return answers, elapsed, output_bytes


def self_check():
    """Known oracle values and alternative witnesses guard the test harness itself."""
    require(brute_lcs("tea_time", "team")["length"] == 4, "LCS oracle self-check")
    require(brute_merge([1, 100, 1])["cost"] == 203, "Merge oracle self-check")
    require(brute_tree({"n": 3, "weights": [4, 9, 6], "edges": [[0, 1], [1, 2]]})["weight"] == 10,
            "Tree oracle self-check")
    require(direct_suffix("banana") == {"sa": [5, 3, 1, 0, 4, 2], "lcp": [0, 1, 3, 0, 0, 2],
                                        "repeated": "ana"}, "Suffix oracle self-check")
    alternatives = [
        ({"task": "lcs", "a": "ab", "b": "ba"}, {"length": 1, "sequence": "b"}),
        ({"task": "merge", "sizes": [1, 1, 1]}, {"cost": 5, "plan": [[1, 1, 2], [0, 0, 2]]}),
        ({"task": "tree", "n": 2, "weights": [1, 1], "edges": [[0, 1]]},
         {"weight": 1, "selected": [1]}),
        ({"task": "suffix", "text": "abXabYcdZcd"},
         {**direct_suffix("abXabYcdZcd"), "repeated": "cd"}),
    ]
    for request, actual in alternatives:
        validate(request, actual, oracle(request))
    # Python bool is an int subclass; a grader must still reject JSON booleans.
    require(not is_integer(True) and not is_integer(1.0), "Integer schema self-check")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--skip-build", action="store_true", help="use an already compiled Java/build")
    parser.add_argument("--quick", action="store_true", help="omit full-limit cases; default includes them")
    parser.add_argument("--write-fixtures", action="store_true", help="regenerate named small_cases.json and exit")
    args = parser.parse_args()
    self_check()
    if args.write_fixtures:
        cases = named_cases()
        (HERE / "small_cases.json").write_text(json.dumps(cases, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
        print(f"Wrote {len(cases)} named cases with independent expected outputs.")
        return 0

    RESULTS.mkdir(exist_ok=True)
    started = time.perf_counter()
    log, records, batches = [], [], []
    def note(message):
        log.append(message)
        print(message, flush=True)

    environment = {"utc": datetime.now(timezone.utc).isoformat(), "python": sys.version,
                   "platform": platform.platform(), "seed": SEED,
                   "command": "python tests/student/run_tests.py" +
                              (" --skip-build" if args.skip_build else "") + (" --quick" if args.quick else ""),
                   "java_command": ["java", "-Xmx384m", "-cp", "Java/build", "Main"],
                   "batch_timeout_seconds": 20, "output_limit_bytes": MAX_OUTPUT}
    failure = None
    try:
        environment["java_version"] = subprocess.run(["java", "-version"], capture_output=True,
                                                        text=True, timeout=10).stderr.strip()
        if not args.skip_build:
            output = ROOT / "Java" / "build"
            output.mkdir(exist_ok=True)
            compile_command = ["javac", "--release", "17", "-encoding", "UTF-8", "-d", str(output),
                               *map(str, sorted((ROOT / "Java" / "source").glob("*.java")))]
            environment["compile_command"] = ["javac", "--release", "17", "-encoding", "UTF-8",
                                               "-d", "Java/build", "Java/source/*.java"]
            compiled = subprocess.run(compile_command, capture_output=True, text=True, timeout=60)
            require(compiled.returncode == 0, "Compilation failed: " + compiled.stderr)
            note("PASS Java compilation (--release 17)")
        command = ["java", "-Xmx384m", "-cp", str(ROOT / "Java" / "build"), "Main"]

        named = json.loads((HERE / "small_cases.json").read_text(encoding="utf-8"))
        require(named == named_cases(), "small_cases.json differs from its reproducible independent generator")
        random_tests = random_cases()
        small = named + random_tests
        random.Random(SEED + 1).shuffle(small)

        def batch(label, tests, compact=False):
            for item in tests:
                validate_domain(item["input"])
            answers, seconds, output_bytes = execute(command, tests)
            passed = 0
            compare = {}
            for index, (item, actual) in enumerate(zip(tests, answers)):
                error = None
                try:
                    validate(item["input"], actual, item["expected"])
                    if "comparison_id" in item:
                        prior = compare.setdefault(item["comparison_id"], actual["positions"])
                        require(prior == actual["positions"], "Cross-method outputs disagree")
                    passed += 1
                except (AssertionError, KeyError, TypeError, IndexError) as exc:
                    error = str(exc)
                record = {"batch": label, "index": index, "name": item["name"], "task": item["input"]["task"],
                          "status": "PASS" if error is None else "FAIL", "checks": item["checks"],
                          "input": summarize(item["input"]) if compact else item["input"],
                          "expected": summarize(item["expected"]) if compact else item["expected"],
                          "actual": summarize(actual) if compact else actual}
                if error is not None:
                    record["error"] = error
                records.append(record)
            batches.append({"name": label, "cases": len(tests), "passed": passed,
                            "wall_seconds": round(seconds, 6), "output_bytes": output_bytes,
                            "comparison_groups": len(compare)})
            note(f"{'PASS' if passed == len(tests) else 'FAIL'} {label}: {passed}/{len(tests)}, "
                 f"{seconds:.3f} s wall, {output_bytes} output bytes")

        note(f"Seed: {SEED}; named cases: {len(named)}; randomized oracle cases: {len(random_tests)}")
        batch("small_mixed_twice_one_process", small + small)
        if not args.quick:
            for item in scale_cases():
                batch(item["name"], [item], compact=True)
    except (AssertionError, OSError, ValueError, subprocess.SubprocessError) as exc:
        failure = str(exc)
        note("FAIL test infrastructure/batch: " + failure)

    passed = sum(item["status"] == "PASS" for item in records)
    by_task = dict(sorted(Counter(item["task"] for item in records).items()))
    summary = {"status": "PASS" if failure is None and passed == len(records) and records else "FAIL",
               "case_executions": len(records), "passed": passed, "failed": len(records) - passed,
               "by_task": by_task, "elapsed_seconds": round(time.perf_counter() - started, 6),
               "full_scale_tests_included": not args.quick}
    if failure:
        summary["infrastructure_failure"] = failure
    note(f"{summary['status']} TOTAL: {passed}/{len(records)} case executions, "
         f"{summary['elapsed_seconds']:.3f} s including compilation, oracles and verification")
    evidence = {"environment": environment, "summary": summary, "batches": batches, "cases": records}
    (RESULTS / "student_test_results.json").write_text(json.dumps(evidence, indent=2, ensure_ascii=True) + "\n",
                                                       encoding="utf-8")
    (RESULTS / "student_tests.log").write_text("\n".join(log) + "\n", encoding="utf-8")
    return 0 if summary["status"] == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
