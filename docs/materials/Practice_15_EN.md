# Assignment 4 — defence practice

15 questions · 25 minutes · 10 single-answer + 5 multiple-response.

Practice questions with answers and explanations. This practice is not graded. Each question is worth 1 raw point; raw/15 × 50 is a learning score only. For k correct checkbox options, each correct selection gives 1/k and each wrong selection deducts 1/(2k); floor zero. Selecting all gives 0.25 (k=2) or about 0.67 (k=3).

## 1. LCS reconstruction

Choose one.

For a="ABCA" and b="BAC", which proposed output is an optimal common subsequence?

A. BCA
B. BC
C. CA
D. AB

**Learning explanations**

- A — False: BCA is not a subsequence of BAC: its A occurs before C in BAC.
- B — True: BC occurs in order in both strings. Length 3 would require BAC, which is not a subsequence of ABCA; therefore length 2 is optimal.
- C — False: CA is not a subsequence of BAC: its C comes after A.
- D — False: AB is not a subsequence of BAC: B comes before A.

## 2. Interval recurrence

Choose one.

For sizes=[3,1,2], consider the last split k=0 of interval [0,2]. The subinterval [1,2] costs 3 to merge. What candidate total does this split give?

A. 3
B. 6
C. 9
D. 10

**Learning explanations**

- A — False: 3 pays only for merging the right subinterval; the final merge is missing.
- B — False: 6 is the final merge cost, but the earlier right-subinterval cost is also paid.
- C — True: dp[0][0]+dp[1][2]+sum(0..2)=0+3+6=9.
- D — False: 10 is the candidate for last split k=1: merging sizes 3 and 1 first costs 4, then 6.

## 3. Tree states

Choose one.

A rooted vertex u has weight 5 and two leaf children of weights -2 and 4. What is (take[u],skip[u]) when the empty set is allowed?

A. (7,4)
B. (5,4)
C. (9,0)
D. (5,2)

**Learning explanations**

- A — False: Taking u excludes both children; adding the magnitude of a negative child is invalid.
- B — True: Taking u gives 5. Skipping u permits max(0,-2)+max(0,4)=4.
- C — False: Taking both u and its child of weight 4 violates independence; skipping u can earn 4.
- D — False: Skipping u does not force selection of the negative child: max is taken separately for each child.

## 4. Naive boundaries

Choose one.

Return all zero-based starts of pattern="aba" in text="ababa", including overlaps.

A. [0]
B. [0,2]
C. [0,1,2]
D. [2]

**Learning explanations**

- A — False: The overlapping occurrence at 2 is missing.
- B — True: Windows at 0 and 2 equal aba. Their starts are distinct even though the windows overlap.
- C — False: The window at 1 is bab, not aba.
- D — False: The first occurrence at 0 is missing.

## 5. KMP fallback

Choose one.

KMP has just matched the entire nonempty pattern="aaaa", whose pi array is [0,1,2,3]. What j should be used to continue searching for overlaps?

A. 0
B. 1
C. 3
D. 4

**Learning explanations**

- A — False: Resetting to 0 discards a valid three-character overlap.
- B — False: A one-character border exists, but it is not the longest fallback.
- C — True: Set j=pi[m-1]=pi[3]=3. Three matched a characters can begin the next occurrence.
- D — False: j=4 is a complete match, not a valid next character position in this pattern.

## 6. Rolling update

Choose one.

A width-2 rolling hash uses base=31, modulus=101 and ASCII codes. In text="ace", hash("ac")=76. Sliding to "ce" removes ASCII(a)=97 and adds ASCII(e)=101. What is the normalized next hash?

A. 39
B. 76
C. 0
D. 101

**Learning explanations**

- A — True: ((76-97*31)*31+101) mod101, normalized, is 39. Directly, 99*31+101=3170 and 3170 mod101=39.
- B — False: 76 belongs to the old window ac; the update changes it.
- C — False: The added code is divisible by 101, but the remaining contribution of c is not.
- D — False: A normalized residue modulo 101 lies in 0..100.

## 7. Hash collision

Choose one.

pattern="bc". Candidate windows "bc" and "ek" both hash to 6 with ASCII, base=31, modulus=101. Which rule guarantees exact search results?

A. Report both because the hashes agree.
B. Report neither because a collision exists.
C. Report only bc after comparing actual characters.
D. Treat hash equality as proof that the strings are identical.

**Learning explanations**

- A — False: ek is a false positive: its characters differ from the pattern.
- B — False: A collision does not invalidate the real match bc.
- C — True: Equal hashes only identify candidates; character verification keeps bc and rejects ek.
- D — False: A finite hash space permits collisions. Equality of hashes does not prove string equality.

## 8. Doubling ranks

Choose one.

In one doubling round, rank=[2,0,1] and compared half-length k=1. Use -1 for an out-of-range second rank. What pair represents suffix start i=2?

A. (1,0)
B. (2,-1)
C. (1,-1)
D. (0,1)

**Learning explanations**

- A — False: rank[i+k] is out of range; it must be -1, not 0.
- B — False: The first rank is rank[2]=1, not the original index 2.
- C — True: The pair is (rank[2],rank[3])=(1,-1) with the stated missing-rank convention.
- D — False: This uses unrelated rank entries and does not represent start 2.

## 9. LCP convention

Choose one.

text="aaaa", sa=[3,2,1,0]. lcp[0]=0 and lcp[i] compares suffixes sa[i-1] and sa[i]. What is lcp[2]?

A. 0
B. 1
C. 2
D. 3

**Learning explanations**

- A — False: The two suffixes share initial a characters.
- B — False: They share aa, so one is too short.
- C — True: sa[1]=2 gives aa; sa[2]=1 gives aaa. Their common prefix has length 2.
- D — False: The shorter suffix aa has only two characters.

## 10. Failure link

Choose one.

A trie is built from patterns=["ab","bab"]. Its states are ε,a,ab,b,ba,bab. Where does the failure link of state bab point?

A. ε
B. b
C. ba
D. ab

**Learning explanations**

- A — False: A longer matching proper suffix exists: ab.
- B — False: b is a proper suffix and a trie prefix, but ab is longer.
- C — False: ba is a prefix of bab, not a suffix of bab.
- D — True: ab is the longest proper suffix of bab that is also a trie prefix.

## 11. LCS properties

Select all true options.

For a="AB" and b="BA", select all true statements.

A. The LCS length is 1.
B. AB is a common subsequence.
C. A is an optimal common subsequence.
D. The empty sequence is the only common subsequence.
E. B is an optimal common subsequence.

**Learning explanations**

- A — True: The character order is reversed, so both characters cannot be kept; either individual character gives length 1.
- B — False: AB is not a subsequence of BA.
- C — True: A occurs in both strings and attains the optimum length 1.
- D — False: A and B are nonempty common subsequences.
- E — True: B also occurs in both strings and attains the optimum length 1.

## 12. Tree reconstruction

Select all true options.

The path 0—1—2 has weights=[-2,0,-3]. The empty set is allowed. Select all true statements.

A. {0,1} is an independent set.
B. The empty set is optimal.
C. {0,2} is optimal.
D. {1} is optimal.
E. Changing the root can change the optimum weight.

**Learning explanations**

- A — False: 0 and 1 are adjacent, so this set is not independent.
- B — True: The empty set has weight 0, and no positive weights are available.
- C — False: Its weight is -5, below the feasible weight 0.
- D — True: The single zero-weight vertex is independent and has the optimum weight 0.
- E — False: Rooting changes the computation order, not the underlying independent-set optimum.

## 13. KMP invariants

Select all true options.

Consider the required KMP search, including the A4 empty-pattern convention. Select all true statements.

A. After a full nonempty-pattern match, j=pi[m-1] preserves possible overlaps.
B. Every mismatch requires moving the text index backwards.
C. A fallback can change j while keeping the current text index unchanged.
D. An empty pattern has n+1 starting boundaries in a text of length n.
E. Replacing the implementation by built-in substring search satisfies the required-method rule.

**Learning explanations**

- A — True: The longest proper border can already be the beginning of the next match.
- B — False: KMP reuses prefix information; the text index never needs to move backwards.
- C — True: The same text character can be compared after shortening the matched prefix.
- D — True: The boundaries are 0 through n inclusive.
- E — False: The assignment requires a prefix function and KMP implementation; built-in search cannot replace it.

## 14. Dictionary counts

Select all true options.

patterns=["a","aa","a"], text="aaa". Count overlaps and keep original dictionary positions. Select all true statements.

A. The aa pattern is counted only once because its occurrences overlap.
B. The first dictionary position has count 3.
C. The second dictionary position has count 2.
D. Duplicate patterns must be removed from the output.
E. The third dictionary position has count 3.

**Learning explanations**

- A — False: aa starts at both 0 and 1; overlaps count.
- B — True: a starts at 0,1,2, giving 3.
- C — True: aa starts at 0 and 1, giving 2.
- D — False: Duplicates keep separate output columns even if they share a trie terminal.
- E — True: The duplicate a has the same count as the first a.

## 15. Independent texts

Select all true options.

patterns=["cat","at"], texts=["cat", ""]. Select all true statements about the required Aho output and reset behaviour.

A. The first output row is [1,1].
B. Each output row corresponds to a dictionary pattern rather than a text.
C. The second output row is [0,0].
D. The empty text must retain the previous text's counts.
E. With texts=[], the output counts is [].

**Learning explanations**

- A — True: cat occurs once, and its suffix pattern at occurs once.
- B — False: Rows correspond to texts; columns follow original dictionary positions.
- C — True: Both nonempty patterns have zero occurrences in the empty text.
- D — False: Each text starts with reset state and counts.
- E — True: No texts means no output rows.
