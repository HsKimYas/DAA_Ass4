# Assignment 4 — algorithm notes / Пояснения к алгоритмам

## English

- LCS prefix state: dp[i][j] concerns the first i and j characters. Compare a[i−1] and b[j−1] when i, j>0; zero row/column are base cases.
- Interval merge uses the lecture 8 partition pattern. Its split cost is the sum of sizes in [l, r], whereas matrix-chain multiplication uses matrix dimensions. These cost rules are not interchangeable.
- Tree MWIS is the take/skip example from lecture 8. Choosing a root supports computation; it does not change the undirected problem or optimum.
- Use the string-matching material from Lecture 9 for A4. The Kosaraju slide is outside this assignment.
- The naive-search pseudocode must compare character indices j=0..m-1, not 0..m inclusive. Test starts i=0..n-m when m<=n. Handle an empty pattern separately according to A4's n+1-boundary rule.
- The intentionally small hash modulus 101 is for collision testing. Equal hashes need character verification. Exact RK has a candidate-sensitive bound and may take quadratic time.
- Suffix examples in lecture 10 use banana$ with an added sentinel. A4's output has exactly the nonempty suffixes of the original text; remove any internally added sentinel from output.
- For the Aho example with text ushers, the zero-based inclusive start/end indices are: she is 1..3, he is 2..3, hers is 2..5. The patterns he and she end at the same character; hers ends later. A start index is not an end index.
- Doubling with comparison sorting is O(n log²n); linear-time sorting of rank pairs per round permits O(n log n). Kasai is O(n).
- DP does not universally turn exponential algorithms into polynomial time in bit-length: knapsack O(nW) is pseudopolynomial. Top-down versus bottom-up performance depends on visited states, storage and implementation.

## Русский

- dp[i][j] в LCS относится к первым i и j символам; при i, j>0 сравниваются a[i−1] и b[j−1]. Нулевая строка и столбец — база.
- merge использует partition pattern лекции 8. Добавочная стоимость split — сумма sizes[l..r]; matrix-chain использует размеры матриц. Формулы стоимости различаются.
- Tree MWIS соответствует take/skip лекции 8. Выбор корня нужен для вычисления и не меняет оптимум.
- Для A4 используйте материал лекции 9 о поиске строк. Слайд с алгоритмом Косарайю к этому заданию не относится.
- В псевдокоде naive внутренний цикл сравнивает j=0..m−1, а не 0..m включительно. При m≤n допустимы старты i=0..n−m. Пустой шаблон обрабатывается отдельно по правилу n+1 границ A4.
- modulus 101 выбран для проверки коллизий. После равенства хешей проверяются символы. Точный RK не гарантирует линейное время на всех входах.
- В лекции 10 banana$ включает sentinel. В A4 выводятся только непустые суффиксы исходного текста; внутренний sentinel в ответ не входит.
- Для примера Aho с текстом ushers позиции с нуля и включёнными концами: she — 1..3, he — 2..3, hers — 2..5. he и she заканчиваются на одном символе, hers — позже. Начало вхождения не равно его концу.
- Doubling с comparison sort даёт O(n log²n); линейная сортировка rank pairs на раунд позволяет O(n log n). Kasai — O(n).
- DP не всегда даёт полиномиальную сложность по битовой длине входа: O(nW) для knapsack псевдополиномиально. Сравнение memoization/tabulation зависит от посещаемых состояний, памяти и реализации.
