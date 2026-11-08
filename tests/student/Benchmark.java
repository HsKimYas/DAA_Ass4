import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/** Reproducible, algorithm-only search comparison; not part of the JSONL app. */
public final class Benchmark {
    private static final long SEED = 20261108L;
    private static final String[] METHODS = {"naive", "kmp", "rk"};
    private static volatile long sink;

    private Benchmark() {
    }

    private static List<Integer> search(int method, String text, String pattern) {
        switch (method) {
            case 0: return StringAlgorithms.naivePositions(text, pattern);
            case 1: return StringAlgorithms.kmpPositions(text, pattern);
            case 2: return StringAlgorithms.rkPositions(text, pattern);
            default: throw new AssertionError(method);
        }
    }

    // A built-in startsWith is used only in this independent test oracle.
    private static List<Integer> oracle(String text, String pattern) {
        List<Integer> expected = new ArrayList<>();
        for (int start = 0; start <= text.length() - pattern.length(); start++) {
            if (text.startsWith(pattern, start)) {
                expected.add(start);
            }
        }
        return expected;
    }

    private static long consume(List<Integer> positions) {
        long value = positions.size();
        if (!positions.isEmpty()) {
            value += positions.get(0);
            value += positions.get(positions.size() - 1);
        }
        return value;
    }

    private static double measure(int method, String text, String pattern,
                                  int iterations) {
        long checksum = 0;
        long start = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            checksum += consume(search(method, text, pattern));
        }
        long elapsed = System.nanoTime() - start;
        sink ^= checksum;
        return elapsed / 1000.0 / iterations;
    }

    private static String randomText(int length, long seed) {
        Random random = new Random(seed);
        StringBuilder text = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            text.append((char) ('a' + random.nextInt(26)));
        }
        return text.toString();
    }

    public static void main(String[] args) {
        int samples = args.length > 0 ? Integer.parseInt(args[0]) : 5;
        int iterations = args.length > 1 ? Integer.parseInt(args[1]) : 200;
        int warmup = args.length > 2 ? Integer.parseInt(args[2]) : 200;
        if (samples < 3 || iterations < 1 || warmup < 1) {
            throw new IllegalArgumentException("Need samples >= 3 and positive iterations/warmup");
        }

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("seed", SEED);
        report.put("samples", samples);
        report.put("iterations_per_sample", iterations);
        report.put("warmup_calls_per_method_and_pair", warmup);
        report.put("global_warmup_calls_per_method", 1000);
        report.put("unit", "microseconds_per_call");
        report.put("java_version", System.getProperty("java.version"));
        report.put("java_vm", System.getProperty("java.vm.name"));
        report.put("java_vm_version", System.getProperty("java.vm.version"));
        report.put("os", System.getProperty("os.name") + " " + System.getProperty("os.version"));
        report.put("architecture", System.getProperty("os.arch"));
        report.put("available_processors", Runtime.getRuntime().availableProcessors());
        report.put("max_heap_bytes", Runtime.getRuntime().maxMemory());
        report.put("timing_scope", "Search helper including prefix/hash preparation and result-list allocation; "
                + "loop plus size/first/last consumption; excludes input generation, correctness checks, "
                + "warm-up, parsing, serialization, process startup and compilation.");
        report.put("order", "One JVM. Rotate method order across five samples; default JVM JIT and GC enabled.");

        if (!StringAlgorithms.rkPositions("abdj", "ab").equals(List.of(0))) {
            throw new AssertionError("RK failed the known ab/dj hash-collision check");
        }
        // Common initial JIT warm-up, excluded from every measurement.
        String warmText = "a".repeat(300);
        String warmPattern = "a".repeat(29) + "b";
        for (int i = 0; i < 1000; i++) {
            for (int method = 0; method < METHODS.length; method++) {
                sink ^= consume(search(method, warmText, warmPattern));
            }
        }

        List<Map<String, Object>> rows = new ArrayList<>();
        String[] cases = {"random", "repetitive_mismatch", "dense_matches"};
        for (String caseName : cases) {
            for (int n : new int[]{500, 1500, 3000}) {
                int m = n / 10;
                long pairSeed = SEED + n;
                String text;
                String pattern;
                if (caseName.equals("random")) {
                    text = randomText(n, pairSeed);
                    pattern = text.substring(n / 2, n / 2 + m);
                } else {
                    text = "a".repeat(n);
                    pattern = "a".repeat(m - 1)
                            + (caseName.equals("dense_matches") ? "a" : "b");
                }

                List<Integer> expected = oracle(text, pattern);
                // Validate every entire output before any timing of this pair.
                for (int method = 0; method < METHODS.length; method++) {
                    if (!search(method, text, pattern).equals(expected)) {
                        throw new AssertionError("Wrong " + METHODS[method] + " output for "
                                + caseName + " n=" + n);
                    }
                }
                for (int i = 0; i < warmup; i++) {
                    for (int method = 0; method < METHODS.length; method++) {
                        sink ^= consume(search(method, text, pattern));
                    }
                }

                double[][] times = new double[METHODS.length][samples];
                for (int sample = 0; sample < samples; sample++) {
                    for (int offset = 0; offset < METHODS.length; offset++) {
                        int method = (sample + offset) % METHODS.length;
                        times[method][sample] = measure(method, text, pattern, iterations);
                    }
                }
                for (int method = 0; method < METHODS.length; method++) {
                    double[] sorted = times[method].clone();
                    Arrays.sort(sorted);
                    double median = samples % 2 == 1 ? sorted[samples / 2]
                            : (sorted[samples / 2 - 1] + sorted[samples / 2]) / 2.0;
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("case", caseName);
                    row.put("n", n);
                    row.put("m", m);
                    row.put("seed", pairSeed);
                    row.put("method", METHODS[method]);
                    row.put("occurrences", expected.size());
                    row.put("correct_outputs_checked", true);
                    row.put("runs_us", times[method]);
                    row.put("median_us", median);
                    rows.add(row);
                }
            }
        }
        report.put("rows", rows);
        report.put("sink", sink);
        System.out.println(Json.write(report));
    }
}
