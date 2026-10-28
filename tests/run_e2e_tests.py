#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TMG301 Master Exam Prep - Comprehensive E2E Automated Test Runner
Executes Tiers 1–4 Opaque-Box Test Suite:
  Tier 1: Feature Coverage (Data layer, 950 questions, 17 chapters, glossary 75 terms, KaTeX syntax)
  Tier 2: Boundary & Corner Cases (Lone $, long option wrapping, 0 results search, timer pulse, delimiters)
  Tier 3: Cross-Feature Combinations (Quiz DOM contract, LocalStorage persistence, status filtering, exam scoring)
  Tier 4: Real-World Workload Scenarios (50-min exam lifecycle, wrong questions review, bank search, glossary)

Usage:
  python tests/run_e2e_tests.py
Exits with returncode 0 on complete pass, 1 on failure.
"""

import os
import sys
import time
import unittest

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Ensure tests package is importable
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from tests.test_tier1_feature_coverage import TestTier1FeatureCoverage
from tests.test_tier2_boundary_corner import TestTier2BoundaryCorner
from tests.test_tier3_cross_feature import TestTier3CrossFeature
from tests.test_tier4_workload_scenarios import TestTier4WorkloadScenarios


class DetailedResult(unittest.TestResult):
    """Custom TestResult collecting execution metrics and formatted outputs."""

    def __init__(self):
        super().__init__()
        self.successes = []
        self.test_timings = {}
        self._start_time = None

    def startTest(self, test):
        super().startTest(test)
        self._start_time = time.time()

    def addSuccess(self, test):
        super().addSuccess(test)
        elapsed = time.time() - self._start_time
        self.test_timings[test.id()] = elapsed
        self.successes.append((test, elapsed))

    def addFailure(self, test, err):
        super().addFailure(test, err)
        elapsed = time.time() - self._start_time
        self.test_timings[test.id()] = elapsed

    def addError(self, test, err):
        super().addError(test, err)
        elapsed = time.time() - self._start_time
        self.test_timings[test.id()] = elapsed


def run_tier(suite_class, tier_num, tier_title, tier_desc):
    """Executes a single test tier and prints formatted results."""
    print(f"\n{'='*75}")
    print(f"  TIER {tier_num}: {tier_title.upper()}")
    print(f"  {tier_desc}")
    print(f"{'='*75}")

    suite = unittest.TestLoader().loadTestsFromTestCase(suite_class)
    result = DetailedResult()

    start_time = time.time()
    suite.run(result)
    total_elapsed = time.time() - start_time

    # Print individual test results
    for test, elapsed in result.successes:
        test_method = test.id().split('.')[-1]
        doc = (test._testMethodDoc or "").strip().split('\n')[0]
        desc = f" - {doc}" if doc else ""
        print(f"  [PASS] {test_method} ({elapsed:.3f}s){desc}")

    for test, err in result.failures:
        test_method = test.id().split('.')[-1]
        print(f"  [FAIL] {test_method}")
        print(f"         {err.strip().splitlines()[-1]}")

    for test, err in result.errors:
        test_method = test.id().split('.')[-1]
        print(f"  [ERROR] {test_method}")
        print(f"         {err.strip().splitlines()[-1]}")

    pass_count = len(result.successes)
    fail_count = len(result.failures) + len(result.errors)
    total_count = result.testsRun

    status_str = "PASSED" if fail_count == 0 else "FAILED"
    print(f"\n  --> Tier {tier_num} Result: {status_str} ({pass_count}/{total_count} tests in {total_elapsed:.3f}s)")

    return {
        "tier": tier_num,
        "title": tier_title,
        "total": total_count,
        "passed": pass_count,
        "failed": fail_count,
        "elapsed": total_elapsed,
        "result_obj": result
    }


def main():
    print("=" * 75)
    print("   TMG301 TEXT MINING REVIEW PORTAL - OPAQUE-BOX E2E TEST SUITE")
    print("   Target: TMG301-Term5 Single-Page Application (Vanilla JS / CSS / KaTeX)")
    print("=" * 75)

    suite_configs = [
        (
            TestTier1FeatureCoverage,
            1,
            "Feature Coverage",
            "Validates data parity, 950 questions schema, 17 chapters, glossary, KaTeX math"
        ),
        (
            TestTier2BoundaryCorner,
            2,
            "Boundary & Corner Cases",
            "Validates lone $, extreme option wrapping, zero results search, timer pulse, filters"
        ),
        (
            TestTier3CrossFeature,
            3,
            "Cross-Feature Combinations",
            "Validates quiz DOM contract, LocalStorage persistence, status filtering, exam scoring"
        ),
        (
            TestTier4WorkloadScenarios,
            4,
            "Real-World Workload Scenarios",
            "Validates 50-min exam lifecycle, wrong questions review, bank search, glossary"
        )
    ]

    tier_summaries = []
    global_start = time.time()

    for suite_class, num, title, desc in suite_configs:
        tier_summary = run_tier(suite_class, num, title, desc)
        tier_summaries.append(tier_summary)

    global_elapsed = time.time() - global_start

    # Global Summary Table
    print("\n" + "=" * 75)
    print("                          E2E TEST EXECUTION SUMMARY")
    print("=" * 75)
    print(f" {'Tier':<6} | {'Tier Name':<30} | {'Passed/Total':<14} | {'Duration':<10} | {'Status':<8}")
    print("-" * 75)

    all_passed = True
    total_all_tests = 0
    total_all_passed = 0
    total_all_failed = 0

    for s in tier_summaries:
        status = "PASS" if s["failed"] == 0 else "FAIL"
        if s["failed"] > 0:
            all_passed = False
        total_all_tests += s["total"]
        total_all_passed += s["passed"]
        total_all_failed += s["failed"]
        ratio_str = f"{s['passed']}/{s['total']}"
        time_str = f"{s['elapsed']:.3f}s"
        print(f" Tier {s['tier']:<1} | {s['title']:<30} | {ratio_str:<14} | {time_str:<10} | {status:<8}")

    print("-" * 75)
    print(f" TOTAL  | {'All 4 Tiers Combined':<30} | {f'{total_all_passed}/{total_all_tests}':<14} | {f'{global_elapsed:.3f}s':<10} | {'PASS' if all_passed else 'FAIL':<8}")
    print("=" * 75)

    if all_passed:
        print("\n[+] SUCCESS: All 4 E2E Test Tiers passed 100%! Ready for milestone verification.")
        return 0
    else:
        print(f"\n[-] FAILURE: {total_all_failed} test(s) failed across the suite.")
        # Print failure details
        for s in tier_summaries:
            for test, err in s["result_obj"].failures + s["result_obj"].errors:
                print(f"\n--- Failure in {test.id()} ---")
                print(err)
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
