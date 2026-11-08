# Dynamic programming

Design and Analysis of Algorithms

## Dynamic programming patterns

Dynamic programming solves problems by expressing their answers through smaller subproblems and storing results that will be needed again. Three structures occur frequently: a position in a sequence, a contiguous interval, and a rooted subtree. These structures determine what a state needs to remember and which answers must be available before it can be computed. We will examine increasing subsequences and common subsequences, then use interval states to choose parentheses for matrix multiplication. Finally, we will select a maximum weight independent set in a tree. Each example begins with the meaning of its state. The recurrence follows from the legal choices, and the evaluation order follows from the dependencies. We will also recover the actual sequence, expression, or selected vertices, because the optimal value alone does not identify the solution. The same questions apply throughout: what information does this subproblem need, which choices cover all valid solutions, and why can smaller optimal answers be combined?

Reading: Lecture 8; CLRS 4e, §14.3

## Learning outcomes and reading

A complete dynamic programming solution includes a precise state definition, a recurrence, base cases, an evaluation order, and the location of the final answer. When the required output is a sequence or a set rather than its value, the solution also needs reconstruction. Correctness can be established by induction in the dependency order. Each transition must construct a legal solution, and every optimal solution must correspond to a choice considered by that transition. For matrix chains, the final multiplication determines the split. For a common subsequence, the final characters determine the two cases. For a tree, the choice at the subtree root determines which child states are allowed. Chapter fourteen of Introduction to Algorithms develops these ideas through rod cutting, matrix-chain multiplication, and longest common subsequences. The company-party problem gives a tree application. Fibonacci and zero-one knapsack provide additional examples of how repeated subproblems and state restrictions affect the implementation.

Reading: Lecture 8; CLRS 4e, §14.3

## Why stored answers help

Dynamic programming is useful when a problem can be expressed using smaller subproblems and those subproblems recur. Optimal substructure means that, once a relevant choice is fixed, the remaining parts can use their own optimal solutions. We must justify this property rather than assume it. Overlap means that separate branches of a recursive search ask the same question again. Saving the answer prevents repeated work. Compare this with merge sort. Its two recursive calls work on separate halves, and there is normally no repeated request for the same half within one run. A dynamic programming recurrence often forms a directed acyclic graph of dependencies. This connects directly to topological ordering. A state is sufficient only when two situations with that same state have the same possible future decisions and the same relevant outcome. If capacity affects future choices, for example, the state must include capacity. A table alone does not make an algorithm correct or efficient.

Reading: Lecture 8; CLRS 4e, §14.3

## Fibonacci: repeated subproblems

Consider Fibonacci numbers, with zero as the zeroth value and one as the first. To compute the fifth value recursively, we request the fourth and third. Computing the fourth requests the third again. The same duplication continues at smaller indices. A memoized function checks whether an answer already exists before making recursive calls. A bottom-up version fills the values in increasing index order. Both compute only a linear number of distinct states, with constant work per state under a fixed-width arithmetic model. The naive recursive method takes exponential time, while these versions take linear time. For the fifth value, the table is zero, one, one, two, three, five. This is a warm-up, not the main intellectual challenge. Fibonacci already gives us the recurrence. In more interesting problems, deciding what the state should mean is the difficult part. Also remember that fixed-width Java integers eventually overflow. If we use arbitrary precision numbers, arithmetic cost grows with the number of bits.

Reading: Lecture 8; CLRS 4e, §14.3

## Memoization and tabulation

There are two common ways to evaluate the same recurrence. Memoization keeps a recursive description and stores completed answers. It can avoid states that are never reached, but it needs a call stack and a reliable way to distinguish a missing entry from a valid answer. Zero is often a valid answer, so a separate visited flag can be useful. Tabulation chooses a valid order in advance and fills a table with loops. It avoids recursive call overhead and often makes memory compression easier. However, it may also compute states that memoization never needs. Therefore, we should not claim that tabulation is always faster or always uses less memory. These are implementation trade-offs. For either approach, correctness depends on the same state definition and recurrence. Before changing one implementation into the other, list the dependencies of a state. The loop order must make those dependencies available. For interval problems that usually means increasing interval length. For a rooted tree it means processing children before their parent.

Reading: Lecture 8; CLRS 4e, §14.3

## A complete DP specification

Here is the specification we will use for every example. First, define the state in words, including exactly which input elements it covers and which restrictions apply. Second, list the choices that can produce a valid solution and turn them into a recurrence. Third, handle the smallest subproblems with explicit base cases. Fourth, choose an evaluation order and explain why every dependency is ready. Fifth, locate the answer to the original problem. Sometimes it is the last table entry, but sometimes it is the maximum over many entries. Sixth, decide whether we need an actual sequence, a parenthesization, or a set of selected nodes. These outputs require reconstruction information or an appropriate backtracking procedure. Finally, justify correctness and analyze time and memory. A useful time estimate is the number of states multiplied by the amount of work per state, with separate accounting when the work varies. You should be able to apply this checklist before writing any loops.

Reading: Lecture 8; CLRS 4e, §14.3

## Three shapes of subproblems

The three patterns differ mainly in the structure of their states. In longest increasing subsequence, one useful state records the best subsequence ending at a particular position. In longest common subsequence, the state uses a pair of prefix lengths, because the answer depends on two strings. In matrix-chain multiplication, the natural question is the cheapest way to evaluate a contiguous interval of matrices. In tree independent set, a state refers to a rooted subtree and records whether its root is selected. Notice that the dimensions of the table come from the information the subproblem needs. They are not arbitrary choices. A two-dimensional table can represent two prefixes, two interval boundaries, or a node and a binary condition. Those meanings require different transitions and different orders. A problem can first be classified by writing its state definition. Recognizing a familiar pattern helps, but the definition must still match the exact problem.

Reading: Lecture 8; CLRS 4e, §14.3

## Subsequence and substring

Before deriving a recurrence, we need to understand the object we are choosing. A subsequence preserves the order of the original elements, but it may skip positions. A substring uses consecutive positions. In the string A B C D E, A C E is a subsequence because we can keep positions one, three, and five. It is not a substring because those positions are separated. C D is both a substring and a subsequence. E A is neither, because it reverses the order. This distinction changes algorithms. Longest common substring uses a recurrence that resets a value after a mismatch. Longest common subsequence can skip a character and keep the best result from a neighboring prefix state. Ask yourself whether the problem allows gaps before choosing a formula. For our examples, an empty subsequence is allowed, and repeated letters are distinct positions. We match positions in increasing order even when their character values are equal.

Reading: Lecture 8, slides 5–10; CLRS 4e, §14.4

## Longest increasing subsequence

Let us find a strictly increasing subsequence in the array three, one, two, five, four. We define dp at index i as the length of the longest increasing subsequence ending exactly at that index. The phrase ending exactly here is essential. It means the current element must belong to the subsequence. To extend an earlier solution, we choose an earlier index j whose value is strictly smaller than the current value. Appending the current element then adds one to the length stored at j. We take the best such predecessor. If no predecessor works, the element alone gives length one. The final answer is the maximum entry of the array, because the best subsequence may end anywhere. It is not automatically the last entry. For empty input we return length zero. Strict increase uses a less-than comparison. Replacing it with less-than-or-equal solves the different problem of longest nondecreasing subsequence, which treats equal adjacent values differently.

Reading: Lecture 8, slides 5–7

## LIS: a complete trace

We now evaluate the array from left to right. At index zero, value three has no earlier predecessor, so its length is one. At index one, value one cannot extend three, so its length is also one. At index two, value two can extend one and reaches length two. At index three, value five can extend the subsequence one, two, reaching length three. At index four, value four can also extend one, two and reaches length three. It cannot extend five because four is smaller. Our table is therefore one, one, two, three, three. Several optimal answers can exist, and a correct implementation may reconstruct either one, two, five or one, two, four. Now predict the result for three, three, three. A strictly increasing subsequence has length one. For a decreasing array the answer is also one, provided the array is nonempty. These are useful tests for the comparison and initialization rules.

Reading: Lecture 8, slides 5–7; original worked example

## LIS reconstruction in Java

The length table does not directly contain a chosen subsequence. To reconstruct one, initialize a parent array with minus one. Whenever an earlier index j improves the best length ending at i, store j as the parent of i. After filling the table, find an index with maximum length and follow its parent links until the sentinel minus one. We collect values in reverse order, so we reverse the collected list before returning it. In our example, choosing the last maximum gives indices four, two, one in reverse. Their values become one, two, four after reversal. Different tie rules may produce a different optimal subsequence, so tests should normally check its length, increasing order, and whether it is a subsequence of the input. The double loop takes quadratic time, and the two arrays use linear memory. A binary search method reduces the time to n log n, but its tails array has a different meaning.

Reading: Lecture 8, slides 5–7; original Java excerpt

## LCS: two prefixes define a state

Longest common subsequence compares two sequences. Our first string is A B C D E and the second is A C E. We define L at i, j as the length of a longest common subsequence between the first i characters of A and the first j characters of B. We use half-open prefix notation, so a prefix of length i ends just before index i. This makes the empty prefix natural. The table has one extra row and one extra column. Row zero and column zero contain zeros because an empty sequence has no nonempty common subsequence with any other sequence. The original problem is the table entry at the two full lengths. We are not requiring the current last characters to appear in the answer, which is different from our LIS state. Keep this difference in mind when locating the result. In this simple example, A C E is common to both strings and has length three.

Reading: Lecture 8, slides 8–10; CLRS 4e, §14.4

## LCS recurrence

To derive the LCS recurrence, compare the last characters of the two prefixes. If they are equal, we can extend an optimal common subsequence of the two shorter prefixes by this matching character. The value is one plus the diagonal entry. If the characters differ, a common subsequence cannot use both as its final matching pair. At least one of these final positions is unused. We therefore consider skipping the last position of A or skipping the last position of B, and take the larger answer. These choices cover all possibilities for an optimal solution. The base cases handle either empty prefix. A row-by-row evaluation from small indices to large indices makes the diagonal, above, and left dependencies available. Notice that a mismatch does not reset the answer to zero. Resetting would discard useful subsequences containing earlier matches. That rule belongs to the longest common substring problem, where consecutive positions are required. Write the state sentence beside the recurrence to keep these problems separate.

Reading: Lecture 8, slides 8–10; CLRS 4e, §14.4

## LCS table for ABCDE and ACE

Let us fill the complete table for our two strings. The first row and first column are zero. Comparing A with A gives one, and that value remains available as the second prefix grows. On the row for B, no new character matches the current characters of A C E, so the best value stays one. On the row for C and column for C, we add one to the diagonal value one, obtaining two. At the next column we keep that value even though C and E differ. The row for D also preserves the best length two. Finally, E matches E and extends the diagonal length two to three. The bottom-right entry is three. Before looking at the finished row, predict the value at the D row and E column. It is two, representing the common subsequence A C. This table is a record of prefix questions, so every entry has a concrete interpretation beyond its number.

Reading: Lecture 8, slide 10; CLRS 4e, §14.4; computed example

## LCS backtracking

To recover a longest common subsequence, start at the bottom-right corner of the full table. When the two current characters match, record that character and move diagonally to the shorter prefixes. When they do not match, move toward an above or left neighbor that retains the optimal value. Continue until one prefix becomes empty. For our example, we record E, later C, and finally A. Reversing these characters gives A C E. A tie between the above and left values means that more than one optimal route may exist. A deterministic implementation can prefer one direction, but it should not claim that its resulting string is the only answer. The classic textbook example A B C B D A B and B D C A B A has optimal length four and several possible answers. If we compress the table to two rows, the length is still available, but this simple backtracking procedure loses information. Reconstruction requires retaining decisions or using a different method.

Reading: CLRS 4e, §14.4

## LCS implementation in Java

This Java fragment directly implements the prefix definition. We allocate n plus one rows and m plus one columns. Java initializes primitive integer arrays to zero, giving the required boundary conditions. The loops begin at one because row zero and column zero already represent empty prefixes. To access a character, subtract one from its prefix length. On a match, use the diagonal value plus one. Otherwise, take the maximum from above and left. The answer is L at n, m. Each table cell uses constant work, so there are order n times m operations and the full table uses the same order of memory. If we only need the length, we can keep the previous row and current row, giving linear memory in the shorter string length. That optimization should follow a correct full-table implementation. These examples use Latin characters. Java char values are UTF-sixteen code units, so a general Unicode application may require code-point processing.

Reading: CLRS 4e, §14.4; original Java excerpt

## Related sequence problems

Related sequence problems include edit distance and longest palindromic subsequence. For edit distance with unit costs, an empty prefix needs one insertion per character of the other prefix. The boundary values are therefore i and j, not all zeros. Each interior state considers deletion, insertion, and replacement or matching. For longest palindromic subsequence, the state refers to an interval within one string. A single character has length one, and an empty interval has length zero. Matching endpoints can contribute two plus the interior answer. Different endpoints require skipping one side and taking the maximum. This example also shows that pattern categories overlap. A problem about a subsequence can use interval states. We choose the state according to dependencies, not according to one keyword in the problem title. In each new problem, derive the bases again instead of copying them from LCS.

Reading: Lecture 8, slide 8; CLRS problem 14-2 and problem 14-5

## 0/1 knapsack as a bridge

Zero-one knapsack gives another example of choosing or skipping. Suppose the weights are two, three, and four, the values are three, four, and five, and the capacity is five. Selecting the first two items gives weight five and value seven. Define K at i, c as the maximum total value using the first i items with total weight at most c. We can skip the current item and keep the previous row at capacity c. If it fits, we can take it and add its value to the previous row at the remaining capacity. Using the previous row prevents selecting the same item again. The zero-item row is zero when selecting nothing is allowed. With positive integer weights, the time is order n times capacity. This is pseudopolynomial because capacity can be much larger than the number of bits used to write it. Dynamic programming does not automatically guarantee polynomial time in input length.

Reading: Syllabus week 8 practice; CLRS 4e, exercise 15.2-2

## Why the knapsack loop runs downward

Now consider memory compression for zero-one knapsack. If we store only one array, we must ensure that the remaining-capacity value still refers to the previous item stage. Processing capacities from high to low achieves this. A smaller capacity has not yet been updated for the current item, so reading it cannot reuse that item. If we process capacities upward, we may read a value already improved by the same item, accidentally implementing repeated selection. A tiny counterexample makes the issue visible. Take one item of weight two and value three with capacity four. The zero-one optimum is three because we have only one item. An ascending loop first writes three at capacity two, then reads that new value when it reaches capacity four and produces six. That is wrong for zero-one knapsack. The same issue occurs in other compressed recurrences: memory compression changes which time stage a table entry represents, so loop direction becomes part of the correctness argument.

Reading: Syllabus week 8 practice; original explanation

## Partitioning a matrix chain

Our next pattern chooses a split inside an interval. Matrix multiplication is associative, so different parenthesizations give the same mathematical product, provided the dimensions are compatible. However, intermediate matrix sizes can change the number of scalar multiplications dramatically. Multiplying a matrix with p rows and q columns by one with q rows and r columns costs p times q times r scalar multiplications using the standard algorithm. Matrix-chain optimization chooses parentheses while preserving the original matrix order. It does not reorder the matrices, and it does not compute the matrix entries themselves. Think of it as planning a computation before executing it. The output can be a minimum cost and an expression describing the order of operations. We will start with three matrices, where there are just two parenthesizations, then generalize to an interval state. The final multiplication always splits the chain into a left contiguous part and a right contiguous part.

Reading: Lecture 8, slides 11–14; CLRS 4e, §14.2

## Two parenthesizations, two costs

Let us calculate both possibilities rather than accept the answer on faith. For open parenthesis A B close parenthesis C, the first multiplication costs ten times thirty times five, which is fifteen hundred. Its result has ten rows and five columns. Multiplying that result by C costs ten times five times sixty, which is three thousand. The total is forty-five hundred. For A open parenthesis B C close parenthesis, the first multiplication costs thirty times five times sixty, which is nine thousand, and creates a thirty by sixty matrix. Multiplying A by that matrix costs ten times thirty times sixty, or eighteen thousand. The total is twenty-seven thousand. Both expressions have the same final dimensions, but one uses six times as many scalar multiplications. Before moving on, identify the dimensions of each intermediate result yourself. That check explains why the transition cost depends on the two interval boundaries and the chosen split.

Reading: CLRS 4e, §14.2; original worked example

## The interval recurrence

Use one-based matrix indices and an array of dimensions p. Matrix i has dimensions p at i minus one by p at i. Define M at i, j as the minimum cost of multiplying matrices i through j. In the final operation, some split k separates matrices i through k from matrices k plus one through j. The left and right parts must themselves use optimal parenthesizations; otherwise, replacing a more expensive part would improve the full expression. Their result dimensions are p at i minus one by p at k, and p at k by p at j. Combining them therefore costs the product of these three dimensions. We try every k from i through j minus one and choose the minimum total. The base case M at i, i is zero. We compute shorter intervals first. With quadratic many intervals and up to linear many splits each, the time is cubic and memory is quadratic.

Reading: Lecture 8, slides 11–14; CLRS 4e, §14.2

## The lecture example: cost 26,000

Consider dimensions forty, twenty, thirty, ten, thirty. These define four matrices. First solve intervals of length two. Their costs are twenty-four thousand, six thousand, and nine thousand. For matrices one through three, splitting after the first costs fourteen thousand, while splitting after the second costs thirty-six thousand. We keep fourteen thousand. For matrices two through four, the best cost is twelve thousand. Now consider the complete chain. A final split after matrix one costs thirty-six thousand. A split after matrix two costs sixty-nine thousand. A split after matrix three costs twenty-six thousand, so it is the best. To reconstruct the expression, retain that split and recursively reconstruct both sides. The first three matrices use A one multiplied by the product of A two and A three. Then multiply by A four. The resulting expression has total cost twenty-six thousand. These intermediate values are useful for detecting dimension-index errors in an implementation.

Reading: Lecture 8, slide 14; computed intermediate states

## Matrix-chain loops in Java

The loop structure should express the dependency order visibly. The outer loop grows the interval length from two to the number of matrices. For each start index i, compute the end index j. Initialize the interval cost to a large value, then try every split k inside it. The diagonal entries remain zero, representing a single matrix. The fragment assumes positive compatible dimensions and that all intermediate costs fit a Java long. Writing one L before the product promotes the arithmetic before multiplication, preventing an accidental integer overflow in that expression. It does not protect against values exceeding the long range, so constraints still matter. A split array can record the k whenever a candidate improves the current minimum. A reconstruction procedure then returns a matrix name for a single-element interval and combines recursively reconstructed left and right expressions otherwise. Iterating intervals by arbitrary start and end indices without considering length can read values that have not yet been computed.

Reading: CLRS 4e, §14.2; original Java excerpt

## Another interval problem: stick cutting

Another interval problem asks for the minimum cost to cut a stick at specified positions. A cut costs the length of the segment being cut at that moment. The order matters because later cuts may operate on shorter segments. Add the two endpoints to the sorted required positions. Define C at l, r as the minimum cost of completing all required cuts strictly inside that interval. If the endpoint indices are adjacent, there is no internal cut and the cost is zero. Otherwise, try each internal required position as the first cut. It costs the current segment length plus the optimal costs of the left and right intervals. For a stick of length ten with required cuts at four and seven, cutting at four first costs ten plus six, giving sixteen. Cutting at seven first costs ten plus seven, giving seventeen. In this example, the interval pattern is familiar, but the combine cost differs from matrix multiplication.

Reading: Lecture 8, slide 12; original worked example

## Tree DP: choosing guests

We now move from intervals to a hierarchy. Imagine a company party where each employee has a contribution to the event, represented by a weight. An employee and their immediate supervisor cannot both attend. The supervisor relation forms a tree, which is the setting of the textbook's company-party problem. In graph language, we want a maximum weight independent set of a tree. Independent means that no edge has both endpoints selected. A locally attractive employee is not necessarily part of the optimal global set, because choosing that employee can exclude valuable children. We root the tree and define subproblems for its subtrees. The key boundary information is whether the subtree's root is selected. That binary decision tells the parent what combinations are legal. Our worked example has root zero with weight five, children one and two with weights three and four, and nodes three and four below node one with weights six and one. We allow selecting no nodes.

Reading: Lecture 8, slides 15–18; CLRS 4e, problem 14-6

## Two states per tree node

Define take at u as the maximum total weight in u's subtree when u must be selected. Define skip at u as the maximum when u must be excluded. If we select u, every child must be excluded, so we add the child's skip value. If we exclude u, each child may be included or excluded, so we add the larger of its two states. For a leaf, take equals its weight and skip equals zero. After processing children before parents, the answer is the larger root state. The two states are necessary because one unconstrained best value would hide whether the child root was selected. The parent needs that information to enforce the edge restriction. On a tree, separate child subtrees have no edges between them, so their legal choices can be combined independently once the decision at u is fixed. That independence is the reason the recurrence works. It does not automatically extend to a general graph containing cycles or cross edges.

Reading: Lecture 8, slides 15–18; CLRS 4e, problem 14-6

## Tree DP: the complete calculation

Start with the leaves. Node two has take four and skip zero. Node three has take six and skip zero. Node four has take one and skip zero. At node one, taking the node gives its own weight three plus zero from each excluded child. Skipping it lets us take both children, giving six plus one, or seven. Now compute root zero. Taking the root gives five plus skip one, which is seven, plus skip two, which is zero. The result is twelve. Skipping the root gives the best state of node one, seven, plus the best state of node two, four. The result is eleven. Therefore the optimum is twelve. One selected set is nodes zero, three, and four. They are pairwise nonadjacent and their weights sum to twelve. Notice that a selected grandparent and selected grandchild are permitted. The rule prohibits adjacent endpoints, not every pair related anywhere in the hierarchy.

Reading: Lecture 8, slides 15–18; computed original example

## Recovering the selected nodes

Computing the optimum weight is only part of the tree problem when a guest list is requested. Reconstruction starts at the root with no selected parent. If the parent of a node is selected, the node must be skipped. Otherwise, compare its take and skip values and choose a better state, using a documented tie rule if they are equal. Pass the resulting decision to each child. In our example, the root is selected because twelve exceeds eleven. Its children one and two must therefore be skipped. Since node one is skipped, nodes three and four are free to take their better states, and both are selected. The result is zero, three, four. Validation should check two independent properties: every selected pair is nonadjacent, and the sum of their weights equals the reported optimum. A correct weight with an illegal guest list is still an incorrect reconstructed solution. For tiny trees, exhaustive enumeration of all vertex subsets provides a useful independent reference.

Reading: CLRS 4e, problem 14-6; original reconstruction

## Tree DP in reverse traversal order

A recursive depth-first traversal naturally computes children before their parent if we combine results after recursive calls. On a very deep tree, however, recursion can exceed Java's call-stack limit. An iterative alternative first roots the validated tree and records an order in which every parent appears before its children. Reversing that order puts all children before their parent. The displayed fragment assumes that this traversal and parent array already exist. For each node, initialize take to its weight and skip to zero. Then combine only neighbors whose parent is the current node. Each edge contributes constant work to the appropriate parent-child combination, giving linear time for the whole tree. The adjacency list, parent array, order, and state arrays use linear memory. If the input is an arbitrary graph, we must validate connectivity and the tree property rather than silently treating a spanning tree as the original problem. Discarding extra edges can produce an invalid independent set for the original graph.

Reading: Lecture 8, slides 16–18; original Java excerpt

## Correctness and complexity

All our examples share one correctness structure. Establish the base cases. Assume that the smaller states already have their intended optimal values. Show that every transition constructs a legal solution, and that every optimal solution has a final choice represented among the candidates. Taking the best candidate then gives the desired optimal value. The evaluation order supports this induction. For complexity, LIS has linear many end-index states but examines up to linear many predecessors for each, giving quadratic time. LCS has a product of the two prefix counts and constant work per state. Matrix chains have quadratic many intervals and up to linear many split positions. Tree DP has two states per node and total combination work proportional to the tree edges. Memory depends on the representation and whether reconstruction is required. The length-only LCS optimization does not preserve the full table used in our simple backtracking method. Always state what output the memory bound supports, rather than presenting a compressed bound without that qualification.

Reading: Lecture 8, slides 19–22; CLRS 4e, chapter 14

## Small tests reveal state errors

Testing should challenge the state definition, not just repeat the main example. For LIS, test an empty array, one value, all equal values, and a decreasing array. For LCS, test either empty string, identical strings, no common character, and repeated characters with several optimal answers. For matrix chains, a single matrix must cost zero. Three matrices let us enumerate both possible parenthesizations by hand, and a four-matrix case exposes mistakes in interval order. For tree independent set, test a single node, a chain, a star, and negative weights when selecting nothing is allowed. Compare small random instances with a simple exhaustive solver. Reconstructed outputs need separate checks for feasibility and objective value. Also distinguish an unknown state from a valid zero answer, and avoid adding costs to an infinity sentinel. Before attempting memory optimization, make the straightforward version correct and inspect its table. A printed table for a five-element example often explains a failure more clearly than a large performance test.

Reading: Lecture 8, slides 20–22; original test guidance

## DP problem-solving questions

The state definition determines where the final answer is found. In longest increasing subsequence, the state requires the subsequence to end at a particular index. The full optimum can end anywhere, so we take the maximum across indices. In longest common subsequence, the state already allows arbitrary common subsequences of two prefixes. The answer for the full strings is therefore the entry for both complete prefixes. On a mismatch, skipping one final character preserves earlier matches, so the recurrence takes the best neighboring prefix value. Matrix-chain states depend on shorter intervals, which explains the increasing-length order. In a tree, the parent needs to know whether the child root is selected; take and skip preserve this boundary information. Reconstruction follows the decisions that attained the optimum. Its output must be checked for feasibility as well as objective value. These distinctions are useful when adapting a recurrence to a new problem rather than copying a formula unchanged.

Reading: CLRS 4e, chapter 14

## References and review

The examples illustrate the same design process under different dependencies. Sequence states describe an ending position or a pair of prefixes. Interval states describe a contiguous range and consider a split. Tree states describe a subtree together with a condition at its root. The recurrence specifies how the smaller answers combine, while the base cases handle the smallest valid inputs. A suitable order makes every required answer available. Complexity follows from the number of states and the work spent evaluating their choices. Memory reductions must preserve the information required by the requested output. In particular, obtaining an optimal value and reconstructing a solution are separate requirements. The references include the dynamic programming chapter of Introduction to Algorithms and additional explanations of subsequences, matrix chains, and independent sets. To review a solution, state its subproblem in one sentence, derive its choices, and check a small example by hand before considering an optimization.

Reading: https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-16-dynamic-programming-part-2-lcs-lis-coins/; https://www.youtube.com/watch?v=KLBCUx1is2c; https://www.youtube.com/watch?v=_WncuhSJZyA; https://www.youtube.com/watch?v=-yiKNcjcK0Y; https://www.youtube.com/watch?v=bKrRqJID_Dw
