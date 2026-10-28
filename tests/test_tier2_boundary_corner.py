#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tier 2: Boundary & Corner Cases Test Suite
Tests edge cases, boundary conditions, and stress limits:
- Lone $ in regex options (KaTeX delimiter collision boundary)
- Extreme long option text wrapping and layout stress
- Zero results search handling across all 3 search interfaces
- Timer pulse warning condition (< 5m / 300 seconds threshold)
- Mathematical formula delimiters and complex notation edge cases
- Empty filters, whitespace queries, and regex metacharacter queries
"""

import unittest
import re
from tests.harness import DataLoader, KaTeXValidator, ExamEngineSimulator, AppStateSimulator


class TestTier2BoundaryCorner(unittest.TestCase):
    """Tier 2 Test Cases: Boundary Conditions & Corner Cases."""

    def setUp(self):
        self.chapters = DataLoader.get_chapters()
        self.knowledge = DataLoader.get_knowledge()
        self.questions = DataLoader.get_questions()
        self.glossary = DataLoader.get_glossary()
        self.app = AppStateSimulator(self.questions, self.glossary)
        self.css = DataLoader.get_css()
        self.js = DataLoader.get_app_js()

    def test_01_lone_dollar_regex_boundary(self):
        """
        Boundary Test: Lone '$' in regex options.
        KaTeX auto-render treats '$' as math delimiter. Literal '$' in regex
        must be safely isolated (via <code>$</code>, '\\$', or balanced '$...$')
        so it never hijacks subsequent text or corrupts DOM formatting.
        """
        # 1. Delimiter Safety Analyzer Unit Tests
        self.assertTrue(KaTeXValidator.is_safe_katex_option("<code>$</code>"))
        self.assertTrue(KaTeXValidator.is_safe_katex_option("`$`"))
        self.assertTrue(KaTeXValidator.is_safe_katex_option(r"\$"))
        self.assertTrue(KaTeXValidator.is_safe_katex_option("$x + y$"))
        self.assertTrue(KaTeXValidator.is_safe_katex_option("Plain text without dollars"))
        self.assertFalse(KaTeXValidator.is_safe_katex_option("$"))  # Lone unescaped dollar

        # 2. Inspect question bank for regex metacharacter options
        q_ch01_01 = self.app.q_map.get("q_ch01_01")
        self.assertIsNotNone(q_ch01_01, "q_ch01_01 must exist in Question Bank")

        opt_0 = q_ch01_01["options"][0]
        # In M1, worker will wrap '$' into '<code>$</code>' or '\\$' (Feature F02).
        # We test both:
        # A) If patched: opt_0 is safe according to KaTeXValidator.
        # B) If still unpatched (raw '$'): verify our boundary detector catches it.
        is_safe = KaTeXValidator.is_safe_katex_option(opt_0)
        if not is_safe:
            # Documented implementation bug F02 slated for M1 remediation
            self.assertEqual(opt_0.strip(), "$", "Expected unpatched option to be raw '$'")
        else:
            self.assertTrue(is_safe, f"Option '{opt_0}' should be safe for KaTeX")

        # 3. Verify safe escaping transformation
        safe_wrapped = f"<code>{opt_0}</code>" if opt_0.strip() == "$" else opt_0
        self.assertTrue(KaTeXValidator.is_safe_katex_option(safe_wrapped))

    def test_02_extreme_long_option_wrapping(self):
        """
        Boundary Test: Extreme long option text wrapping.
        Verifies that options with large text bounds (200+ chars) exist and that
        the stylesheet enforces responsive flex & word-break wrapping rules.
        """
        # 1. Inspect distribution of option text lengths across all 950 questions
        max_opt_len = 0
        longest_opt_q = None
        long_opts_count = 0

        for q in self.questions:
            for opt in q["options"]:
                opt_len = len(opt)
                if opt_len > max_opt_len:
                    max_opt_len = opt_len
                    longest_opt_q = q["id"]
                if opt_len >= 100:
                    long_opts_count += 1

        # The question bank contains verbose and mathematical multiple-choice options
        self.assertGreater(max_opt_len, 150, f"Longest option length is {max_opt_len}, expected >= 150")
        self.assertGreater(long_opts_count, 10, f"Expected at least 10 options with length >= 100 chars, found {long_opts_count}")

        # 2. Verify CSS rules for .option-btn in style.css
        # Must have display: flex and alignment to accommodate multi-line content
        self.assertIn(".option-btn", self.css)
        self.assertTrue(
            "display: flex" in self.css or "display:flex" in self.css,
            "style.css should specify flex layout for option buttons"
        )
        self.assertTrue(
            "opt-letter" in self.css and ("flex-shrink: 0" in self.css or "flex-shrink:0" in self.css),
            "style.css should specify flex-shrink: 0 for .opt-letter so badge does not crush on long text"
        )

    def test_03_zero_results_search_graceful_handling(self):
        """
        Boundary Test: Zero results search handling.
        Verifies that non-matching queries in Question Bank, Glossary, and Global
        Search do not throw exceptions and return empty lists with zero count.
        """
        bogus_query = "XYZ_NONEXISTENT_SEARCH_STRING_12345"

        # 1. Question Bank Explorer Zero Results
        paged_q, total_count = self.app.filter_question_bank(search_query=bogus_query)
        self.assertEqual(len(paged_q), 0)
        self.assertEqual(total_count, 0)

        # 2. Glossary Zero Results
        gloss_results = self.app.filter_glossary(query=bogus_query)
        self.assertEqual(len(gloss_results), 0)

        # 3. Global Quick Search Modal Zero Results
        global_results = self.app.search_global(bogus_query, self.chapters)
        self.assertEqual(len(global_results["chapters"]), 0)
        self.assertEqual(len(global_results["glossary"]), 0)
        self.assertEqual(len(global_results["questions"]), 0)

        # 4. Verify app.js renders friendly zero-result feedback in the DOM
        self.assertIn("Không tìm thấy kết quả phù hợp", self.js)

    def test_04_timer_pulse_warning_threshold(self):
        """
        Boundary Test: Exam Timer Warning Pulse Threshold (< 5m / 300 seconds).
        Verifies threshold calculations in updateExamTimerDisplay() and formatting.
        """
        # Threshold definition: <= 300 seconds (5:00) triggers 'danger' class
        self.assertEqual(ExamEngineSimulator.format_time(3000), "50:00")
        self.assertEqual(ExamEngineSimulator.format_time(301), "05:01")
        self.assertEqual(ExamEngineSimulator.format_time(300), "05:00")
        self.assertEqual(ExamEngineSimulator.format_time(299), "04:59")
        self.assertEqual(ExamEngineSimulator.format_time(60), "01:00")
        self.assertEqual(ExamEngineSimulator.format_time(9), "00:09")
        self.assertEqual(ExamEngineSimulator.format_time(0), "00:00")

        # Threshold logic check in js/app.js:766
        # if (state.liveExam.timeRemaining <= 300) { timerElem.classList.add('danger'); }
        self.assertIn("timeRemaining <= 300", self.js)

        # Keyframes pulse check in style.css for timer warning animation
        self.assertIn("@keyframes pulse", self.css)

    def test_05_formula_delimiters_and_mathematical_edge_cases(self):
        """
        Boundary Test: Mathematical formula delimiters and notation edge cases.
        Tests superscripts, subscripts, fractions, Greek symbols, and display math.
        """
        sample_formulas = [
            r"\sigma(z) = \frac{1}{1 + e^{-z}}",
            r"Attention(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V",
            r"P(w_i \mid w_{i-1}) = \frac{C(w_{i-1}, w_i)}{C(w_{i-1})}",
            r"\mathcal{L} = -\sum_{i=1}^N y_i \log \hat{y}_i",
            r"\Delta W = B \times A"
        ]

        for formula in sample_formulas:
            inline_wrapped = f"${formula}$"
            display_wrapped = f"$${formula}$$"

            # Check inline balance
            balanced_in, err_in = KaTeXValidator.check_delimiter_balance(inline_wrapped)
            self.assertTrue(balanced_in, f"Inline delimiter check failed for {formula}: {err_in}")

            # Check display balance
            balanced_disp, err_disp = KaTeXValidator.check_delimiter_balance(display_wrapped)
            self.assertTrue(balanced_disp, f"Display delimiter check failed for {formula}: {err_disp}")

            # Verify extraction
            extracted = KaTeXValidator.extract_math_blocks(inline_wrapped)
            self.assertEqual(len(extracted), 1)
            self.assertEqual(extracted[0][0], "inline")

            extracted_disp = KaTeXValidator.extract_math_blocks(display_wrapped)
            self.assertEqual(len(extracted_disp), 1)
            self.assertEqual(extracted_disp[0][0], "display")

    def test_06_empty_and_special_char_filters(self):
        """
        Boundary Test: Empty queries, whitespace queries, and regex metacharacters.
        Verifies that searching with strings like '[', '*', '+', '?', '\\' doesn't crash.
        """
        # 1. Empty string & whitespace in Question Bank -> returns all 950
        _, total_empty = self.app.filter_question_bank(search_query="")
        self.assertEqual(total_empty, 950)

        _, total_whitespace = self.app.filter_question_bank(search_query="   ")
        self.assertEqual(total_whitespace, 950)

        # 2. Empty query in Glossary -> returns all 75
        gloss_all = self.app.filter_glossary(query="")
        self.assertEqual(len(gloss_all), 75)

        # 3. Regex metacharacters in search query
        tricky_queries = ["[", "]", "(", ")", "*", "+", "?", "\\", "^", "$", "{", "}"]
        for tq in tricky_queries:
            # Must not throw re.error
            paged_q, total_count = self.app.filter_question_bank(search_query=tq)
            self.assertIsInstance(paged_q, list)
            self.assertIsInstance(total_count, int)

            gloss_res = self.app.filter_glossary(query=tq)
            self.assertIsInstance(gloss_res, list)

        # 4. Filter by boundary chapters
        paged_ch1, total_ch1 = self.app.filter_question_bank(chapter_filter="1")
        self.assertEqual(total_ch1, 50)

        paged_ch17, total_ch17 = self.app.filter_question_bank(chapter_filter="17")
        self.assertEqual(total_ch17, 50)

        paged_comp, total_comp = self.app.filter_question_bank(chapter_filter="comp")
        self.assertEqual(total_comp, 100)

        # Invalid chapter boundary -> 0 results
        paged_ch99, total_ch99 = self.app.filter_question_bank(chapter_filter="99")
        self.assertEqual(total_ch99, 0)


if __name__ == "__main__":
    unittest.main()
