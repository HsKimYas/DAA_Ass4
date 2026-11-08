import java.util.*;

/** Standalone Java 17 teaching examples. Run: javac --release 17 Week8Examples.java && java Week8Examples
 * Small bounded inputs are assumed. Matrix dimensions and accumulated tree weights must fit long.
 * LCS operates on UTF-16 code units; course examples use Latin letters.
 */
public final class Week8Examples {
    public record LisResult(int length, List<Integer> indices) {}
    public record MatrixResult(long cost, String expression) {}
    public record TreeResult(long weight, List<Integer> selected) {}

    public static LisResult lis(int[] a) {
        int n = a.length;
        if (n == 0) return new LisResult(0, List.of());
        int[] dp = new int[n], parent = new int[n];
        Arrays.fill(dp, 1); Arrays.fill(parent, -1);
        int end = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++)
                if (a[j] < a[i] && dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1; parent[i] = j;
                }
            if (dp[i] > dp[end]) end = i;
        }
        List<Integer> indices = new ArrayList<>();
        for (int u = end; u >= 0; u = parent[u]) indices.add(u);
        Collections.reverse(indices);
        return new LisResult(dp[end], List.copyOf(indices));
    }

    public static String lcs(String a, String b) {
        int n = a.length(), m = b.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++)
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                        ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
        StringBuilder reversed = new StringBuilder();
        int i = n, j = m;
        while (i > 0 && j > 0) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) { reversed.append(a.charAt(i - 1)); i--; j--; }
            else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
            else j--;
        }
        return reversed.reverse().toString();
    }

    public static long knapsack(int[] weight, int[] value, int capacity) {
        if (capacity < 0 || weight.length != value.length) throw new IllegalArgumentException();
        long[] best = new long[capacity + 1];
        for (int i = 0; i < weight.length; i++) {
            if (weight[i] <= 0) throw new IllegalArgumentException("Positive weights required");
            for (int c = capacity; c >= weight[i]; c--)
                best[c] = Math.max(best[c], value[i] + best[c - weight[i]]);
        }
        return best[capacity];
    }

    public static MatrixResult matrixChain(int[] p) {
        if (p.length < 2) throw new IllegalArgumentException("At least one matrix required");
        for (int d : p) if (d <= 0) throw new IllegalArgumentException("Positive dimensions required");
        int n = p.length - 1;
        long[][] dp = new long[n + 1][n + 1];
        int[][] split = new int[n + 1][n + 1];
        for (int len = 2; len <= n; len++)
            for (int i = 1; i + len - 1 <= n; i++) {
                int j = i + len - 1; dp[i][j] = Long.MAX_VALUE;
                for (int k = i; k < j; k++) {
                    long combine = Math.multiplyExact(Math.multiplyExact((long)p[i - 1], p[k]), p[j]);
                    long cost = Math.addExact(Math.addExact(dp[i][k], dp[k + 1][j]), combine);
                    if (cost < dp[i][j]) { dp[i][j] = cost; split[i][j] = k; }
                }
            }
        return new MatrixResult(dp[1][n], parentheses(split, 1, n));
    }
    private static String parentheses(int[][] split, int i, int j) {
        if (i == j) return "A" + i;
        int k = split[i][j];
        return "(" + parentheses(split, i, k) + parentheses(split, k + 1, j) + ")";
    }

    public static TreeResult treeIndependentSet(long[] weight, int[][] edges) {
        int n = weight.length;
        if (n == 0) {
            if (edges.length != 0) throw new IllegalArgumentException("Invalid empty tree");
            return new TreeResult(0, List.of());
        }
        if (edges.length != n - 1) throw new IllegalArgumentException("Tree needs n-1 edges");
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] edge : edges) {
            if (edge.length != 2 || edge[0] < 0 || edge[0] >= n || edge[1] < 0 || edge[1] >= n || edge[0] == edge[1])
                throw new IllegalArgumentException("Invalid edge");
            graph.get(edge[0]).add(edge[1]); graph.get(edge[1]).add(edge[0]);
        }
        int[] parent = new int[n]; Arrays.fill(parent, -2); parent[0] = -1;
        List<Integer> order = new ArrayList<>(); Deque<Integer> stack = new ArrayDeque<>(); stack.push(0);
        while (!stack.isEmpty()) {
            int u = stack.pop(); order.add(u);
            for (int v : graph.get(u)) if (parent[v] == -2) { parent[v] = u; stack.push(v); }
        }
        if (order.size() != n) throw new IllegalArgumentException("Tree must be connected");
        long[] take = new long[n], skip = new long[n];
        for (int t = order.size() - 1; t >= 0; t--) {
            int u = order.get(t); take[u] = weight[u];
            for (int v : graph.get(u)) if (parent[v] == u) {
                take[u] = Math.addExact(take[u], skip[v]);
                skip[u] = Math.addExact(skip[u], Math.max(take[v], skip[v]));
            }
        }
        boolean[] selected = new boolean[n]; List<Integer> result = new ArrayList<>();
        for (int u : order) {
            boolean blocked = parent[u] >= 0 && selected[parent[u]];
            selected[u] = !blocked && take[u] > skip[u];
            if (selected[u]) result.add(u);
        }
        Collections.sort(result);
        return new TreeResult(Math.max(take[0], skip[0]), List.copyOf(result));
    }

    private static void check(boolean ok) { if (!ok) throw new AssertionError(); }
    public static void main(String[] args) {
        check(lis(new int[]{3,1,2,5,4}).length() == 3);
        check(lis(new int[]{}).length() == 0);
        check(lis(new int[]{3,3,3}).length() == 1);
        check(lcs("ABCDE", "ACE").equals("ACE"));
        check(lcs("", "ACE").equals(""));
        check(lcs("ABC", "XYZ").equals(""));
        check(knapsack(new int[]{2,3,4}, new int[]{3,4,5}, 5) == 7);
        check(knapsack(new int[]{2}, new int[]{3}, 4) == 3);
        check(matrixChain(new int[]{10,30,5,60}).cost() == 4500);
        check(matrixChain(new int[]{40,20,30,10,30}).cost() == 26000);
        check(matrixChain(new int[]{10,20}).cost() == 0);
        int[][] edges = {{0,1},{0,2},{1,3},{1,4}};
        TreeResult tree = treeIndependentSet(new long[]{5,3,4,6,1}, edges);
        check(tree.weight() == 12 && tree.selected().equals(List.of(0,3,4)));
        check(treeIndependentSet(new long[]{-5,-3,-4,-6,-1}, edges).weight() == 0);
        check(treeIndependentSet(new long[]{7}, new int[][]{}).weight() == 7);
        System.out.println("14 Java 17 example checks passed.");
    }
}
