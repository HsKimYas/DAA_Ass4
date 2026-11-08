import java.util.Map;

/** Entry points for the eight commands defined in docs/guide/CONTRACTS.md. */
public final class Algorithms {
    private Algorithms() {
    }

    static Map<String, Object> lcs(Map<String, Object> input) {
        return DynamicAlgorithms.lcs(input);
    }

    static Map<String, Object> merge(Map<String, Object> input) {
        return DynamicAlgorithms.merge(input);
    }

    static Map<String, Object> tree(Map<String, Object> input) {
        return DynamicAlgorithms.tree(input);
    }

    static Map<String, Object> naive(Map<String, Object> input) {
        return StringAlgorithms.naive(input);
    }

    static Map<String, Object> kmp(Map<String, Object> input) {
        return StringAlgorithms.kmp(input);
    }

    static Map<String, Object> rk(Map<String, Object> input) {
        return StringAlgorithms.rk(input);
    }

    static Map<String, Object> suffix(Map<String, Object> input) {
        return StringAlgorithms.suffix(input);
    }

    static Map<String, Object> aho(Map<String, Object> input) {
        return StringAlgorithms.aho(input);
    }
}
