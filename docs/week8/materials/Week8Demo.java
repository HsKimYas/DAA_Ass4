public class Week8Demo {
    public static void main(String[] args) {
        var lis = Week8Examples.lis(new int[]{3, 1, 2, 5, 4});
        System.out.println("LIS length: " + lis.length());
        System.out.println("LIS indices: " + lis.indices());

        String lcs = Week8Examples.lcs("ABCDE", "ACE");
        System.out.println("LCS: " + lcs);
        System.out.println("LCS length: " + lcs.length());

        long knapsack = Week8Examples.knapsack(
                new int[]{2, 3, 4}, new int[]{3, 4, 5}, 5);
        System.out.println("Knapsack value: " + knapsack);

        var matrix = Week8Examples.matrixChain(new int[]{40, 20, 30, 10, 30});
        System.out.println("Matrix cost: " + matrix.cost());
        System.out.println("Parentheses: " + matrix.expression());

        int[][] edges = {{0, 1}, {0, 2}, {1, 3}, {1, 4}};
        var tree = Week8Examples.treeIndependentSet(new long[]{5, 3, 4, 6, 1}, edges);
        System.out.println("Tree weight: " + tree.weight());
        System.out.println("Selected nodes: " + tree.selected());
    }
}
