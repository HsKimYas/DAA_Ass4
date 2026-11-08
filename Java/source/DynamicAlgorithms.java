import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/** Dynamic programming and reconstruction for the first three assignment parts. */
final class DynamicAlgorithms {
    private DynamicAlgorithms() {
    }

    /** Prefix DP; on a mismatch tie, discard the last character of a first. */
    static Map<String, Object> lcs(Map<String, Object> input) {
        String a = (String) input.get("a");
        String b = (String) input.get("b");
        int n = a.length();
        int m = b.length();
        if (n == 0 || m == 0) {
            return Map.of("length", 0, "sequence", "");
        }

        // dp[i][j] is the optimum for a[0..i) and b[0..j).
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        int length = dp[n][m];
        char[] sequence = new char[length];
        int i = n;
        int j = m;
        int write = length;
        while (i > 0 && j > 0) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) {
                sequence[--write] = a.charAt(i - 1);
                i--;
                j--;
            } else if (dp[i - 1][j] >= dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        return Map.of("length", length, "sequence", new String(sequence));
    }

    /** Interval DP for adjacent merges, with a chronological postorder plan. */
    static Map<String, Object> merge(Map<String, Object> input) {
        List<?> sizes = (List<?>) input.get("sizes");
        int n = sizes.size();
        if (n <= 1) {
            return Map.of("cost", 0L, "plan", List.of());
        }

        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + ((Number) sizes.get(i)).longValue();
        }
        long[][] dp = new long[n][n];
        int[][] split = new int[n][n];
        // Single blocks already have cost zero. Shorter intervals precede parents.
        for (int length = 2; length <= n; length++) {
            for (int left = 0; left + length <= n; left++) {
                int right = left + length - 1;
                long intervalSize = prefix[right + 1] - prefix[left];
                long best = Long.MAX_VALUE;
                int bestSplit = left;
                for (int middle = left; middle < right; middle++) {
                    long candidate = dp[left][middle] + dp[middle + 1][right]
                            + intervalSize;
                    // Strict comparison keeps the smallest split on ties.
                    if (candidate < best) {
                        best = candidate;
                        bestSplit = middle;
                    }
                }
                dp[left][right] = best;
                split[left][right] = bestSplit;
            }
        }

        List<int[]> plan = new ArrayList<>(n - 1);
        appendMergePlan(0, n - 1, split, plan);
        return Map.of("cost", dp[0][n - 1], "plan", plan);
    }

    // Recursion here has depth at most 199, because the merge domain has n <= 200.
    private static void appendMergePlan(int left, int right, int[][] split,
                                        List<int[]> plan) {
        if (left == right) {
            return;
        }
        int middle = split[left][right];
        appendMergePlan(left, middle, split, plan);
        appendMergePlan(middle + 1, right, split, plan);
        plan.add(new int[]{left, middle, right});
    }

    /** Maximum-weight independent set; all tree passes are iterative. */
    static Map<String, Object> tree(Map<String, Object> input) {
        int n = ((Number) input.get("n")).intValue();
        if (n == 0) {
            return Map.of("weight", 0L, "selected", List.of());
        }

        List<?> weights = (List<?>) input.get("weights");
        List<?> edges = (List<?>) input.get("edges");

        // Primitive adjacency arrays avoid one collection object per vertex.
        int[] head = new int[n];
        Arrays.fill(head, -1);
        int[] to = new int[2 * edges.size()];
        int[] next = new int[to.length];
        int edgeIndex = 0;
        for (Object edgeObject : edges) {
            List<?> edge = (List<?>) edgeObject;
            int u = ((Number) edge.get(0)).intValue();
            int v = ((Number) edge.get(1)).intValue();
            to[edgeIndex] = v;
            next[edgeIndex] = head[u];
            head[u] = edgeIndex++;
            to[edgeIndex] = u;
            next[edgeIndex] = head[v];
            head[v] = edgeIndex++;
        }

        // The queue itself is a parent-before-child order. Its reverse is a
        // valid children-before-parent order, even for a 100,000-vertex chain.
        int[] parent = new int[n];
        int[] order = new int[n];
        parent[0] = -1;
        order[0] = 0;
        int orderSize = 1;
        for (int read = 0; read < orderSize; read++) {
            int u = order[read];
            for (int edge = head[u]; edge != -1; edge = next[edge]) {
                int v = to[edge];
                if (v != parent[u]) {
                    parent[v] = u;
                    order[orderSize++] = v;
                }
            }
        }

        long[] take = new long[n];
        long[] skip = new long[n];
        for (int v = 0; v < n; v++) {
            take[v] = ((Number) weights.get(v)).longValue();
        }
        for (int i = n - 1; i > 0; i--) {
            int v = order[i];
            int p = parent[v];
            take[p] += skip[v];
            skip[p] += Math.max(take[v], skip[v]);
        }

        // If the parent is taken this vertex must be skipped. Otherwise take
        // only on a strict improvement; skipping ties also handles zero weights.
        boolean[] chosen = new boolean[n];
        List<Integer> selected = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int v = order[i];
            boolean parentChosen = parent[v] >= 0 && chosen[parent[v]];
            if (!parentChosen && take[v] > skip[v]) {
                chosen[v] = true;
                selected.add(v);
            }
        }
        return Map.of("weight", Math.max(take[0], skip[0]), "selected", selected);
    }
}
