# Assignment 4 — practical rubric

Practical work: 50 points. Defence: 50 points. A4 contributes 20% of the second attestation.

## Practical groups

|Command|Group|Maximum|
|---|---|---:|
|lcs|core|4|
|lcs|witness|2|
|lcs|scale|2|
|merge|core|3|
|merge|witness|2|
|merge|scale|2|
|tree|core|3|
|tree|witness|2|
|tree|scale|2|
|naive|core|2|
|kmp|core|3|
|rk|core|3|
|kmp|scale|2|
|suffix|core|4|
|suffix|witness|3|
|suffix|scale|2|
|aho|core|4|
|aho|edge|3|
|aho|scale|2|
|**Total (19 groups)**||**50**|

Each group earns maximum × passed checks / total checks, rounded half-up to 0.01. Sum the 19 rounded groups, capped at 50. core checks correct results/optimum values; witness checks valid optimal subsequences, merge plans, selected tree vertices, or the longest repeated substring; edge checks Aho boundary behaviour; scale checks correct results on large valid inputs. For suffix, core and scale require correct sa and lcp; witness additionally requires a valid optimal repeated substring. Thus correct repeated alone does not earn suffix witness credit when sa or lcp is wrong. Alternative optimal witnesses are accepted.

Each group's maximum is fixed by the table above, regardless of the number of test cases. Every response must first satisfy the complete output schema: required fields and their types, including witness fields. For lcs, merge and tree, a correctly typed but logically incorrect witness does not prevent credit for a correct optimum value in core/scale; it fails witness checks. Missing or wrong-typed witness fields fail schema validation even in core. Suffix follows the explicit sa+lcp prerequisite described above. Extra object fields are ignored consistently. A failed build cannot earn execution-check points; timeouts affect their failed checks. If the checking infrastructure fails, grading is postponed until the checks can be rerun.

Implement the required algorithms and submit the English analysis, own tests and search comparison. These deliverables carry no separate points. Scale groups assess correct results within the published limits.

## Defence

The individual English defence is worth 50 points: 15 questions in 25 minutes, one attempt, 10 single-answer and 5 multiple-response questions. For question scoring, navigation and assessment rules, see [Assessment and defence](../Assignment_4_EN.md#assessment-and-defence).

## Public checks and the official grade

Public checks report whether the example cases pass; they do not award partial credit. The practical mark is calculated from the submitted commit using the 19 groups above. See [Testing](TESTING.md) for compilation and batch limits.
