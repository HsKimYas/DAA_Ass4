# Assignment 4 — Practice B

15 questions · 25 minutes · 10 single-answer + 5 multiple-response. Ungraded.

## 1. LCS — applied reasoning

Choose one.

For a="CACDCCD" and b="CDBABCB", which output satisfies BOTH the optimal LCS length and the subsequence reconstruction requirement?

A. length=3; sequence="CDC"
B. length=3; sequence="DAB"
C. length=3; sequence="CAB"
D. length=3; sequence="CCC"

### Explanation

Correct: A
The maximum length is 3. The optimal strings are ["CAC","CDC"]. A witness must preserve character order in both inputs, not merely contain shared characters.

## 2. Interval DP — applied reasoning

Choose one.

Adjacent merging uses sizes=[8,5,4,2]. Every merge costs the combined size. Return [C,K], where C is the minimum total cost and K is the SMALLEST last-split index among optimal plans for [0,3]. Which pair is correct?

A. [36,1]
B. [38,0]
C. [36,0]
D. [34,0]

### Explanation

Correct: C
Exhaustively checking all five merge trees gives minimum 36; the optimal last-split indices are [0]. Both child costs and the full interval sum must be paid.

## 3. Tree DP — applied reasoning

Choose one.

A tree has weights=[8,1,7,6,2,8] and edges=[[0,1],[0,2],[1,3],[1,4],[2,5]]. The empty set is allowed. Return [W,T], where W is the maximum independent-set weight and T is the best weight when vertex 0 is REQUIRED to be selected. Which pair is correct?

A. [24,24]
B. [26,25]
C. [22,22]
D. [21,21]

### Explanation

Correct: A
The optimal sets are [[0,3,4,5]], each of weight 24. Requiring vertex 0 excludes its neighbours; optimise the remaining permitted subtrees separately.

## 4. Naive search — applied reasoning

Choose one.

For text="xaabaabaabyy" and pattern="aabaab", a faulty search advances by m after a match and by 1 after a mismatch. It checks the final legal start. Which list contains exactly the valid starts that this search MISSES? All indices are zero-based.

A. [1]
B. [5]
C. [4]
D. [1,4]

### Explanation

Correct: C
All valid starts are [1,4]. The faulty search reports [1]; subtracting these gives [4].

## 5. Prefix fallback — applied reasoning

Choose one.

KMP uses pattern="aabaaab" and has matched its first 2 characters. The next unconsumed text character is "c" and mismatches pattern[2]. Return [F,J]: F is the first prefix-function fallback; J is the state AFTER processing this character, including any further fallbacks. Which pair is correct?

A. [1,0]
B. [0,2]
C. [0,0]
D. [0,1]

### Explanation

Correct: A
The prefix function is [0,1,0,1,2,2,3]. First use pi[1]=1; retry the same character until a valid prefix can be extended. The resulting state is 0.

## 6. KMP — applied reasoning

Choose one.

KMP scans text="abaabaabaabaabaabaa" with pattern="abaabaa". After every full match it immediately sets j=pi[m-1]. Return [R,J], where R is the number of reported occurrences and J is the retained state after the entire text. Which pair is correct?

A. [6,5]
B. [7,6]
C. [3,2]
D. [5,4]

### Explanation

Correct: D
The reported starts are [0,3,6,9,12]. With pi=[0,0,1,1,2,3,4], the retained final state is 4. A completed match is reduced before the next character is read.

## 7. Rolling hash — applied reasoning

Choose one.

A width-4 rolling hash scans "eebdcb" using ASCII codes, base 31 and modulus 101, with the leftmost code at the highest power. Return the normalized hashes after the FIRST and SECOND slides from the initial window. Which pair is correct?

A. [15,100]
B. [13,97]
C. [10,100]
D. [15,94]

### Explanation

Correct: B
The next windows are ebdc and bdcb. Direct polynomial evaluation gives residues 13 and 97. Each slide removes the outgoing highest-power term, shifts, then appends.

## 8. Exact RK — applied reasoning

Choose one.

Exact RK searches text="abdjzzdjababbc" for pattern="ab" using ASCII, base 31 and modulus 101. It examines EVERY width-2 window, including overlaps. Return [C,R], where C counts equal-hash candidates and R counts reported exact matches. Which pair is correct?

A. [5,4]
B. [3,1]
C. [4,1]
D. [6,3]

### Explanation

Correct: D
Equal-hash starts: [0,2,3,6,8,10]. Exact-match starts: [0,8,10]. Character verification rejects collisions, including dj.

## 9. Suffix doubling — applied reasoning

Choose one.

For text="cbaabb", initial ranks are [2,1,0,0,1,1]. Perform ONE doubling round with k=1, using -1 beyond the text. Equal rank pairs share a rank; distinct pairs receive consecutive ranks from 0. Which new rank array is in ORIGINAL start-index order?

A. [1,5,2,3,0,4]
B. [5,3,0,1,4,2]
C. [2,0,3,4,1,5]
D. [0,4,1,2,5,3]

### Explanation

Correct: B
The original-order pairs are [[2,1],[1,0],[0,0],[0,1],[1,1],[1,-1]]. Ranking their distinct sorted values gives [5,3,0,1,4,2].

## 10. Kasai — applied reasoning

Choose one.

For text="abaabaabaabaabab", let L be the adjacent LCP array with L[0]=0. Return [S,M], where S=sum(L) and M=max(L). S also counts successful equal-character comparisons if every adjacent pair is scanned independently from offset zero. Which pair is correct?

A. [81,12]
B. [83,15]
C. [80,14]
D. [80,9]

### Explanation

Correct: A
The suffix array is [2,5,8,11,14,0,3,6,9,12,15,1,4,7,10,13] and LCP is [0,10,7,4,1,2,12,9,6,3,0,1,11,8,5,2]. Thus the sum is 81 and the longest-repeat length is 12. Reusing Kasai state avoids repeating these successful comparisons.

## 11. LCS — applied reasoning

Select all that apply.

For a="FGBEC" and b="GFEBC", select every output that satisfies BOTH the LCS value and reconstruction requirements.

A. {"length":3,"sequence":"GBC"} is an accepted result.
B. {"length":3,"sequence":"GBE"} is an accepted result.
C. {"length":3,"sequence":"GEB"} is an accepted result.
D. {"length":3,"sequence":"FEC"} is an accepted result.
E. {"length":3,"sequence":"FBC"} is an accepted result.

### Explanation

Correct: A, D, E
The optimum length is 3; all optimal strings are ["FBC","FEC","GBC","GEC"]. An accepted sequence must have the claimed length and preserve order in both inputs.

## 12. Tree reconstruction — applied reasoning

Select all that apply.

A tree has weights=[2,8,0,9,0,0] and edges=[[0,1],[0,2],[0,3],[0,4],[0,5]]. The empty set is allowed. Select every output that satisfies BOTH optimal weight and a valid reconstructed set.

A. {"weight":17,"selected":[0,3,4]} is an accepted result.
B. {"weight":17,"selected":[1,3,5]} is an accepted result.
C. {"weight":17,"selected":[1,3,4]} is an accepted result.
D. {"weight":17,"selected":[0,2,5]} is an accepted result.
E. {"weight":17,"selected":[2,3,5]} is an accepted result.

### Explanation

Correct: B, C
The optimum is 17; all optimal sets are [[1,3],[1,2,3],[1,3,4],[1,2,3,4],[1,3,5],[1,2,3,5],[1,3,4,5],[1,2,3,4,5]]. Zero-weight leaves may be included when independent; a claimed total alone does not validate a set.

## 13. Aho-Corasick — applied reasoning

Select all that apply.

Aho–Corasick uses patterns=["a","ba","a","aa","baa"] and text="baaabaaaaa". Count overlaps, terminal suffixes and duplicate dictionary positions. Select all correct per-position counts.

A. The count for dictionary position 1 ("ba") is 2.
B. The count for dictionary position 0 ("a") is 9.
C. The count for dictionary position 4 ("baa") is 2.
D. The count for dictionary position 2 ("a") is 8.
E. The count for dictionary position 3 ("aa") is 7.

### Explanation

Correct: A, C, D
The complete row is [8,2,8,6,2]. Duplicate strings retain separate columns; every terminal suffix also contributes.

## 14. Aho-Corasick — applied reasoning

Select all that apply.

One Aho automaton processes patterns=["bc","c","bc"] and independent texts=["b","c","bc","bcbc",""]. Rows follow text order; columns follow original dictionary positions. Select every correct row. State and counters reset for each text.

A. The count row for text index 1 is [0,1,0].
B. The count row for text index 3 is [2,2,2].
C. The count row for text index 0 is [0,1,0].
D. The count row for text index 4 is [0,0,1].
E. The count row for text index 2 is [2,1,1].

### Explanation

Correct: A, B
The complete matrix is [[0,0,0],[0,1,0],[1,1,1],[2,2,2],[0,0,0]]. Matches cannot cross text boundaries. The empty text retains one zero for each dictionary position.

## 15. Verification — applied reasoning

Select all that apply.

Three measured times (microseconds) are naive=[70,32,74], KMP=[72,81,68] and exact RK=[74,42,46]. Outputs have been checked and timing boundaries match. Select every correct numerical conclusion; no claim about universal speed is implied.

A. The number of overlapping matches of a repeated "a" pattern of length 3 in a text of 15 "a" characters is 13.
B. The median exact RK time in microseconds is 46.
C. The median KMP time in microseconds is 73.
D. The median naive time in microseconds is 70.
E. The number of starts for an empty pattern in a text of length 15 is 17.

### Explanation

Correct: A, B, D
The three medians are [70,72,46]. Repeated-character matches occupy every legal start, giving 13; an empty pattern matches 16 boundaries. These measurements do not prove an asymptotic ranking.
