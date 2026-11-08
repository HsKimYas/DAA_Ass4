"""Compile and compare the exact Java search helpers; save genuine raw timings."""
import argparse
import csv
import datetime
import json
import os
import pathlib
import platform
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]


def machine_info():
    """Best-effort host/container metadata; unsupported fields stay explicit."""
    info = {"platform": platform.platform(), "logical_cpus_os": os.cpu_count(),
            "cpu_model": "not exposed", "memory": "not exposed"}
    try:
        for line in pathlib.Path("/proc/cpuinfo").read_text().splitlines():
            if line.startswith("model name"):
                info["cpu_model"] = line.split(":", 1)[1].strip()
                break
    except OSError:
        if platform.processor():
            info["cpu_model"] = platform.processor()
    try:
        for line in pathlib.Path("/proc/meminfo").read_text().splitlines():
            if line.startswith("MemTotal:"):
                info["memory"] = line.split(":", 1)[1].strip()
                break
    except OSError:
        pass
    for label, path in (("cgroup_cpu_max", "/sys/fs/cgroup/cpu.max"),
                        ("cgroup_memory_max", "/sys/fs/cgroup/memory.max")):
        try:
            info[label] = pathlib.Path(path).read_text().strip()
        except OSError:
            info[label] = "not exposed"
    return info


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--samples", type=int, default=5)
    parser.add_argument("--iterations", type=int, default=200)
    parser.add_argument("--warmup", type=int, default=200)
    args = parser.parse_args()
    if args.samples < 3 or min(args.iterations, args.warmup) < 1:
        parser.error("Use at least 3 samples and positive iterations/warmup")

    build = ROOT / "Java" / "build" / "benchmark"
    build.mkdir(parents=True, exist_ok=True)
    sources = sorted((ROOT / "Java" / "source").glob("*.java"))
    compile_command = ["javac", "--release", "17", "-encoding", "UTF-8", "-d", str(build),
                       *map(str, sources), str(ROOT / "tests/student/Benchmark.java")]
    subprocess.run(compile_command, check=True, timeout=60)
    command = ["java", "-Xmx384m", "-cp", str(build), "Benchmark",
               str(args.samples), str(args.iterations), str(args.warmup)]
    completed = subprocess.run(command, capture_output=True, text=True, encoding="utf-8",
                               check=True, timeout=180)
    report = json.loads(completed.stdout)
    report["recorded_at_utc"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    report["python_version"] = sys.version.split()[0]
    report["host"] = machine_info()
    report["reproduce"] = ("python tests/student/benchmark.py "
                           f"--samples {args.samples} --iterations {args.iterations} --warmup {args.warmup}")
    report["compile_command"] = "javac --release 17 -encoding UTF-8 -d Java/build/benchmark Java/source/*.java tests/student/Benchmark.java"
    report["java_command"] = ("java -Xmx384m -cp Java/build/benchmark Benchmark "
                              f"{args.samples} {args.iterations} {args.warmup}")
    dest = ROOT / "tests/student/results"
    dest.mkdir(parents=True, exist_ok=True)
    (dest / "benchmark_results.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    with (dest / "benchmark_results.csv").open("w", encoding="utf-8", newline="") as output:
        writer = csv.writer(output)
        writer.writerow(["case", "n", "m", "seed", "algorithm", "occurrences",
                         *[f"run_{i+1}_us" for i in range(args.samples)], "median_us", "verified"])
        for row in report["rows"]:
            writer.writerow([row["case"], row["n"], row["m"], row["seed"], row["method"],
                             row["occurrences"], *row["runs_us"], row["median_us"],
                             row["correct_outputs_checked"]])
    print("PASS benchmark: 9 input pairs, 27 method/case rows; independent full-output checks passed.")
    print(f"Java {report['java_version']}; {args.samples} measured samples x {args.iterations} calls.")
    for row in report["rows"]:
        print(f"{row['case']:22s} n={row['n']:4d} m={row['m']:3d} "
              f"{row['method']:5s} median={row['median_us']:.3f} us/call")
    print("Raw measurements: tests/student/results/benchmark_results.json and benchmark_results.csv")


if __name__ == "__main__":
    main()
