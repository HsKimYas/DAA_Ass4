import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/** Exact matching and text indexing for the printable-ASCII assignment domain. */
final class StringAlgorithms {
    private static final long HASH_BASE = 31L;
    private static final long HASH_MODULUS = 101L;
    private static final int FIRST_CHARACTER = 32;
    private static final int ALPHABET_SIZE = 95;

    private StringAlgorithms() {
    }

    static Map<String, Object> naive(Map<String, Object> input) {
        return Map.of("positions", naivePositions(
                (String) input.get("text"), (String) input.get("pattern")));
    }

    /** Compare every possible alignment, including alignments that overlap. */
    static List<Integer> naivePositions(String text, String pattern) {
        int n = text.length();
        int m = pattern.length();
        if (m == 0) {
            return allBoundaries(n);
        }

        List<Integer> positions = new ArrayList<>();
        for (int start = 0; start <= n - m; start++) {
            int matched = 0;
            while (matched < m
                    && text.charAt(start + matched) == pattern.charAt(matched)) {
                matched++;
            }
            if (matched == m) {
                positions.add(start);
            }
        }
        return positions;
    }

    static Map<String, Object> kmp(Map<String, Object> input) {
        return Map.of("positions", kmpPositions(
                (String) input.get("text"), (String) input.get("pattern")));
    }

    /** pi[i] is the longest proper prefix also ending at pattern position i. */
    private static int[] prefixFunction(String pattern) {
        int[] pi = new int[pattern.length()];
        for (int i = 1; i < pattern.length(); i++) {
            int matched = pi[i - 1];
            while (matched > 0 && pattern.charAt(i) != pattern.charAt(matched)) {
                matched = pi[matched - 1];
            }
            if (pattern.charAt(i) == pattern.charAt(matched)) {
                matched++;
            }
            pi[i] = matched;
        }
        return pi;
    }

    static List<Integer> kmpPositions(String text, String pattern) {
        int n = text.length();
        int m = pattern.length();
        if (m == 0) {
            return allBoundaries(n);
        }

        List<Integer> positions = new ArrayList<>();
        if (m > n) {
            return positions;
        }
        int[] pi = prefixFunction(pattern);
        int matched = 0;
        for (int i = 0; i < n; i++) {
            while (matched > 0 && text.charAt(i) != pattern.charAt(matched)) {
                matched = pi[matched - 1];
            }
            if (text.charAt(i) == pattern.charAt(matched)) {
                matched++;
            }
            if (matched == m) {
                positions.add(i - m + 1);
                // Retain the longest border, so overlapping matches are not lost.
                matched = pi[matched - 1];
            }
        }
        return positions;
    }

    static Map<String, Object> rk(Map<String, Object> input) {
        return Map.of("positions", rkPositions(
                (String) input.get("text"), (String) input.get("pattern")));
    }

    /** A hash equality only selects a candidate; actual characters decide a match. */
    static List<Integer> rkPositions(String text, String pattern) {
        int n = text.length();
        int m = pattern.length();
        if (m == 0) {
            return allBoundaries(n);
        }

        List<Integer> positions = new ArrayList<>();
        if (m > n) {
            return positions;
        }

        long highestPower = 1L;
        for (int i = 1; i < m; i++) {
            highestPower = highestPower * HASH_BASE % HASH_MODULUS;
        }
        long patternHash = 0L;
        long windowHash = 0L;
        for (int i = 0; i < m; i++) {
            patternHash = (patternHash * HASH_BASE + pattern.charAt(i)) % HASH_MODULUS;
            windowHash = (windowHash * HASH_BASE + text.charAt(i)) % HASH_MODULUS;
        }

        for (int start = 0; start <= n - m; start++) {
            if (windowHash == patternHash) {
                int matched = 0;
                while (matched < m
                        && text.charAt(start + matched) == pattern.charAt(matched)) {
                    matched++;
                }
                if (matched == m) {
                    positions.add(start);
                }
            }
            if (start < n - m) {
                // Remove the leftmost term, shift the remaining powers, append.
                windowHash = (windowHash - text.charAt(start) * highestPower)
                        % HASH_MODULUS;
                if (windowHash < 0L) {
                    windowHash += HASH_MODULUS;
                }
                windowHash = (windowHash * HASH_BASE + text.charAt(start + m))
                        % HASH_MODULUS;
            }
        }
        return positions;
    }

    private static List<Integer> allBoundaries(int length) {
        List<Integer> positions = new ArrayList<>(length + 1);
        for (int i = 0; i <= length; i++) {
            positions.add(i);
        }
        return positions;
    }

    static Map<String, Object> suffix(Map<String, Object> input) {
        String text = (String) input.get("text");
        int n = text.length();
        int[] sa = new int[n];
        int[] lcp = new int[n];
        if (n == 0) {
            return Map.of("sa", sa, "lcp", lcp, "repeated", "");
        }

        int[] rank = new int[n];
        int[] nextRank = new int[n];
        int[] temporary = new int[n];
        int[] counts = new int[Math.max(n + 1, ALPHABET_SIZE + 1)];
        for (int i = 0; i < n; i++) {
            sa[i] = i;
            // Zero is reserved for an absent second half, not an output suffix.
            rank[i] = text.charAt(i) - FIRST_CHARACTER + 1;
        }
        int classes = ALPHABET_SIZE;
        for (int width = 1; width < n; width *= 2) {
            // Stable sorting by the second key and then the first is radix sort.
            countingSort(sa, temporary, rank, width, classes, counts);
            countingSort(temporary, sa, rank, 0, classes, counts);

            int nextClasses = 1;
            nextRank[sa[0]] = nextClasses;
            for (int i = 1; i < n; i++) {
                int previous = sa[i - 1];
                int current = sa[i];
                if (rank[previous] != rank[current]
                        || rankAt(rank, previous + width) != rankAt(rank, current + width)) {
                    nextClasses++;
                }
                nextRank[current] = nextClasses;
            }
            int[] oldRank = rank;
            rank = nextRank;
            nextRank = oldRank;
            classes = nextClasses;
            if (classes == n) {
                break;
            }
        }

        int[] inverse = new int[n];
        for (int i = 0; i < n; i++) {
            inverse[sa[i]] = i;
        }
        int matched = 0;
        int bestLength = 0;
        int bestStart = 0;
        for (int start = 0; start < n; start++) {
            int position = inverse[start];
            if (position == 0) {
                matched = 0;
                continue;
            }
            int previous = sa[position - 1];
            while (start + matched < n && previous + matched < n
                    && text.charAt(start + matched) == text.charAt(previous + matched)) {
                matched++;
            }
            lcp[position] = matched;
            if (matched > bestLength) {
                bestLength = matched;
                bestStart = start;
            }
            // Removing the first character loses at most one known match.
            if (matched > 0) {
                matched--;
            }
        }

        String repeated = text.substring(bestStart, bestStart + bestLength);
        return Map.of("sa", sa, "lcp", lcp, "repeated", repeated);
    }

    private static int rankAt(int[] rank, int position) {
        return position < rank.length ? rank[position] : 0;
    }

    private static void countingSort(int[] input, int[] output, int[] rank,
                                     int offset, int classes, int[] counts) {
        Arrays.fill(counts, 0, classes + 1, 0);
        for (int index : input) {
            counts[rankAt(rank, index + offset)]++;
        }
        int nextPosition = 0;
        for (int key = 0; key <= classes; key++) {
            int frequency = counts[key];
            counts[key] = nextPosition;
            nextPosition += frequency;
        }
        for (int index : input) {
            int key = rankAt(rank, index + offset);
            output[counts[key]++] = index;
        }
    }

    static Map<String, Object> aho(Map<String, Object> input) {
        List<?> patterns = (List<?>) input.get("patterns");
        List<?> texts = (List<?>) input.get("texts");
        List<long[]> result = new ArrayList<>(texts.size());
        if (patterns.isEmpty()) {
            for (int i = 0; i < texts.size(); i++) {
                result.add(new long[0]);
            }
            return Map.of("counts", result);
        }

        // Allocate a row only when a distinct trie state is actually created.
        List<int[]> transitions = new ArrayList<>();
        transitions.add(new int[ALPHABET_SIZE]);
        int[] terminal = new int[patterns.size()];
        for (int i = 0; i < patterns.size(); i++) {
            String pattern = (String) patterns.get(i);
            int state = 0;
            for (int j = 0; j < pattern.length(); j++) {
                int character = pattern.charAt(j) - FIRST_CHARACTER;
                int[] row = transitions.get(state);
                if (row[character] == 0) {
                    row[character] = transitions.size();
                    transitions.add(new int[ALPHABET_SIZE]);
                }
                state = row[character];
            }
            // Duplicate dictionary entries deliberately share this terminal.
            terminal[i] = state;
        }

        int states = transitions.size();
        int[] failure = new int[states];
        int[] bfsOrder = new int[states];
        int head = 0;
        int tail = 0;
        int[] root = transitions.get(0);
        for (int character = 0; character < ALPHABET_SIZE; character++) {
            if (root[character] != 0) {
                bfsOrder[tail++] = root[character];
            }
        }
        while (head < tail) {
            int state = bfsOrder[head++];
            int[] row = transitions.get(state);
            int[] fallback = transitions.get(failure[state]);
            for (int character = 0; character < ALPHABET_SIZE; character++) {
                int child = row[character];
                if (child != 0) {
                    failure[child] = fallback[character];
                    bfsOrder[tail++] = child;
                } else {
                    row[character] = fallback[character];
                }
            }
        }

        long[] visits = new long[states];
        for (Object value : texts) {
            String text = (String) value;
            Arrays.fill(visits, 0L);
            int state = 0;
            for (int i = 0; i < text.length(); i++) {
                state = transitions.get(state)[text.charAt(i) - FIRST_CHARACTER];
                visits[state]++;
            }
            // Failure ancestors are suffixes; aggregate every matching end once.
            for (int i = tail - 1; i >= 0; i--) {
                int vertex = bfsOrder[i];
                visits[failure[vertex]] += visits[vertex];
            }
            long[] row = new long[patterns.size()];
            for (int i = 0; i < patterns.size(); i++) {
                row[i] = visits[terminal[i]];
            }
            result.add(row);
        }
        return Map.of("counts", result);
    }
}
