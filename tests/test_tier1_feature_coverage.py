#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tier 1: Feature Coverage Test Suite
Tests each feature defined in PROJECT.md § Feature Inventory & Interface Contracts:
- Data layer parity & synchronization (F01)
- 950 questions schema & stratified distribution (Contract 1)
- 17 chapters knowledge base schema & citations (Contract 2)
- Glossary 75 terms coverage across all 17 chapters
- Exam generator stratified sampling (50 questions, 50 mins)
- KaTeX mathematical syntax and delimiter integrity
"""

import unittest
import os
import re
from typing import Dict, List, Any
from tests.harness import DataLoader, KaTeXValidator, ExamEngineSimulator, PROJECT_ROOT


class TestTier1FeatureCoverage(unittest.TestCase):
    """Tier 1 Test Cases: Comprehensive Functional Feature Coverage."""

    def setUp(self):
        self.chapters = DataLoader.get_chapters()
        self.knowledge = DataLoader.get_knowledge()
        self.questions = DataLoader.get_questions()
        self.glossary = DataLoader.get_glossary()
        self.slides_meta = DataLoader.get_slides_meta()

    def test_01_data_files_exist_and_synchronized(self):
        """
        Feature F01: Data Layer Parity & Sync.
        Verifies presence of all core assets and 100% data sync between *.json and *.js.
        """
        required_files = [
            "data/chapters.json", "data/chapters.js",
            "data/knowledge.json", "data/knowledge.js",
            "data/questions.json", "data/questions.js",
            "data/glossary.json", "data/glossary.js",
            "data/slides_meta.json",
            "index.html", "js/app.js", "css/style.css"
        ]
        for rel_path in required_files:
            full_path = os.path.join(PROJECT_ROOT, rel_path)
            self.assertTrue(os.path.exists(full_path), f"Required file missing: {rel_path}")
            self.assertGreater(os.path.getsize(full_path), 0, f"File is empty: {rel_path}")

        # Test Zero-CORS JS <-> JSON exact synchronization
        sync_targets = [
            ("data/chapters.json", "data/chapters.js", "TMG_CHAPTERS"),
            ("data/knowledge.json", "data/knowledge.js", "TMG_KNOWLEDGE"),
            ("data/questions.json", "data/questions.js", "TMG_QUESTIONS"),
            ("data/glossary.json", "data/glossary.js", "TMG_GLOSSARY"),
        ]

        for json_path, js_path, var_name in sync_targets:
            data_json = DataLoader.load_json(json_path)
            data_js = DataLoader.load_js_window_var(js_path, var_name)
            self.assertEqual(
                data_json, data_js,
                f"Synchronization mismatch between {json_path} and {js_path} for window.{var_name}"
            )

    def test_02_question_bank_schema_and_distribution(self):
        """
        Contract 1: Question Data Schema & Distribution.
        Verifies 950 questions total, exactly 50/ch (1..17) + 100 comp, and Contract 1 types.
        """
        self.assertEqual(len(self.questions), 950, f"Expected 950 questions, found {len(self.questions)}")

        # Verify chapter distribution
        ch_counter = {}
        for q in self.questions:
            ch = q.get("chapter")
            ch_counter[ch] = ch_counter.get(ch, 0) + 1

        for ch in range(1, 18):
            self.assertEqual(
                ch_counter.get(ch), 50,
                f"Chapter {ch} must contain exactly 50 questions, found {ch_counter.get(ch)}"
            )

        self.assertEqual(
            ch_counter.get("comp"), 100,
            f"Chapter 'comp' must contain exactly 100 synthesis questions, found {ch_counter.get('comp')}"
        )

        # Verify Contract 1 schema for every single question
        seen_ids = set()
        for idx, q in enumerate(self.questions):
            qid = q.get("id")
            self.assertIsInstance(qid, str, f"Question at index {idx} missing string id")
            self.assertTrue(len(qid) > 0, f"Question at index {idx} has empty id")
            self.assertNotIn(qid, seen_ids, f"Duplicate question ID found: {qid}")
            seen_ids.add(qid)

            # Chapter validation: 1..17 or "comp"
            ch = q.get("chapter")
            self.assertTrue(
                (isinstance(ch, int) and 1 <= ch <= 17) or ch == "comp",
                f"Question {qid} has invalid chapter: {ch}"
            )

            # Question prompt
            question_text = q.get("question")
            self.assertIsInstance(question_text, str, f"Question {qid} prompt must be a string")
            self.assertGreater(len(question_text.strip()), 5, f"Question {qid} prompt is too short")

            # Exactly 4 options
            options = q.get("options")
            self.assertIsInstance(options, list, f"Question {qid} options must be a list")
            self.assertEqual(len(options), 4, f"Question {qid} must have exactly 4 choices, found {len(options)}")
            for opt_idx, opt in enumerate(options):
                self.assertIsInstance(opt, str, f"Question {qid} option {opt_idx} must be a string")
                self.assertGreater(len(opt.strip()), 0, f"Question {qid} option {opt_idx} is empty")

            # Answer and Correct fields
            ans = q.get("answer")
            corr = q.get("correct")
            self.assertIn(ans, [0, 1, 2, 3], f"Question {qid} answer index {ans} not in [0..3]")
            self.assertIn(corr, [0, 1, 2, 3], f"Question {qid} correct index {corr} not in [0..3]")
            self.assertEqual(ans, corr, f"Question {qid} answer ({ans}) must match correct ({corr})")

            # Explanation and Slide Reference
            exp = q.get("explanation")
            if exp is not None:
                self.assertIsInstance(exp, str, f"Question {qid} explanation must be a string")
                self.assertGreater(len(exp.strip()), 0, f"Question {qid} explanation is empty")

            slide_ref = q.get("slide_ref")
            if slide_ref is not None:
                self.assertIsInstance(slide_ref, str, f"Question {qid} slide_ref must be a string")

    def test_03_knowledge_base_schema_and_integrity(self):
        """
        Contract 2: Knowledge Base Schema.
        Verifies 17 chapters, slide citations, content HTML, and reference metadata.
        """
        self.assertEqual(len(self.knowledge), 17, f"Expected 17 knowledge chapters, found {len(self.knowledge)}")

        for ch in range(1, 18):
            ch_str = str(ch)
            self.assertIn(ch_str, self.knowledge, f"Knowledge base missing Chapter {ch}")
            ch_data = self.knowledge[ch_str]

            # Content HTML
            content = ch_data.get("content_html")
            self.assertIsInstance(content, str, f"Chapter {ch} content_html must be a string")
            self.assertGreater(len(content), 200, f"Chapter {ch} content_html is suspiciously short")

            # References list
            references = ch_data.get("references", [])
            self.assertIsInstance(references, list, f"Chapter {ch} references must be a list")
            self.assertGreater(len(references), 0, f"Chapter {ch} must contain at least 1 citation reference")

            ref_ids = set()
            for ref in references:
                ref_id = ref.get("id")
                self.assertIsInstance(ref_id, int, f"Chapter {ch} reference ID must be an integer")
                self.assertNotIn(ref_id, ref_ids, f"Chapter {ch} duplicate reference ID: {ref_id}")
                ref_ids.add(ref_id)

                self.assertIn("title", ref, f"Chapter {ch} ref {ref_id} missing title")
                self.assertIn("slide_range", ref, f"Chapter {ch} ref {ref_id} missing slide_range")

    def test_04_glossary_schema_and_coverage(self):
        """
        Glossary Schema & Coverage:
        Verifies exactly 75 definitions and all 17 chapters represented.
        """
        self.assertEqual(len(self.glossary), 75, f"Expected 75 glossary terms, found {len(self.glossary)}")

        covered_chapters = set()
        for idx, item in enumerate(self.glossary):
            self.assertIn("term", item, f"Glossary item {idx} missing 'term'")
            self.assertIn("vn", item, f"Glossary item {idx} missing 'vn'")
            self.assertIn("def", item, f"Glossary item {idx} missing 'def'")
            self.assertIn("ch", item, f"Glossary item {idx} missing 'ch'")
            self.assertIn("slide", item, f"Glossary item {idx} missing 'slide'")

            self.assertGreater(len(item["term"].strip()), 0, f"Glossary item {idx} term is empty")
            self.assertGreater(len(item["vn"].strip()), 0, f"Glossary item {idx} vn translation is empty")
            self.assertGreater(len(item["def"].strip()), 10, f"Glossary item {idx} definition is too short")

            ch_val = int(item["ch"])
            self.assertTrue(1 <= ch_val <= 17, f"Glossary item {item['term']} has invalid chapter {ch_val}")
            covered_chapters.add(ch_val)

        # All 17 chapters should be represented in the glossary
        self.assertEqual(
            len(covered_chapters), 17,
            f"Expected glossary to cover all 17 chapters, covered: {len(covered_chapters)}"
        )

    def test_05_exam_generator_stratified_distribution(self):
        """
        Exam Generator Stratified Random Sampling:
        Verifies generation of exactly 50 questions: 34 chapter-specific (2/ch),
        at least 6 comprehensive questions, and zero duplicate IDs per exam.
        """
        for seed in range(10):
            exam_qs = ExamEngineSimulator.generate_exam_questions(self.questions, seed=seed * 42)
            self.assertEqual(len(exam_qs), 50, f"Exam run (seed={seed}) must produce exactly 50 questions")

            # Check uniqueness
            ids = [q["id"] for q in exam_qs]
            self.assertEqual(len(ids), len(set(ids)), f"Exam run (seed={seed}) generated duplicate questions!")

            # Check chapter representation
            ch_counts = {}
            for q in exam_qs:
                ch = q.get("chapter")
                ch_counts[ch] = ch_counts.get(ch, 0) + 1

            # Every chapter 1..17 must have at least 2 questions
            for ch in range(1, 18):
                self.assertGreaterEqual(
                    ch_counts.get(ch, 0), 2,
                    f"Exam run (seed={seed}) Chapter {ch} has fewer than 2 questions: {ch_counts.get(ch, 0)}"
                )

            # Comp chapter must have at least 6 questions
            self.assertGreaterEqual(
                ch_counts.get("comp", 0), 6,
                f"Exam run (seed={seed}) comp chapter has fewer than 6 questions: {ch_counts.get('comp', 0)}"
            )

    def test_06_katex_delimiters_and_syntax(self):
        """
        KaTeX Delimiters & Mathematical Formula Integrity:
        Verifies delimiter matching ($$...$$ and $...$) across knowledge articles and questions.
        """
        # Test Knowledge Base
        for ch_str, ch_data in self.knowledge.items():
            content = ch_data.get("content_html", "")
            balanced, err = KaTeXValidator.check_delimiter_balance(content)
            self.assertTrue(balanced, f"Knowledge Base Chapter {ch_str} delimiter mismatch: {err}")

            math_blocks = KaTeXValidator.extract_math_blocks(content)
            for m_type, formula in math_blocks:
                self.assertGreater(len(formula), 0, f"Ch {ch_str} has empty {m_type} math block")

        # Test Questions explanations
        for q in self.questions:
            exp = q.get("explanation", "")
            balanced, err = KaTeXValidator.check_delimiter_balance(exp)
            self.assertTrue(balanced, f"Question {q['id']} explanation has delimiter mismatch: {err}")


if __name__ == "__main__":
    unittest.main()
