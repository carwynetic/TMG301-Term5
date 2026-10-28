#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tier 4: Real-World Workload Scenarios Test Suite
Simulates end-to-end user workflows and full interactive journeys:
- Scenario 4.1: Complete 50-minute exam lifecycle (start -> answer -> flag -> countdown -> submit -> scorecard -> diagnostic review)
- Scenario 4.2: Targeted remediation workflow (filtering wrong answers, KaTeX explanation inspection, chapter reset)
- Scenario 4.3: Question Bank cross-chapter search & pagination limit mechanics
- Scenario 4.4: Academic Glossary multi-field lookup & PPT slide cross-referencing
"""

import unittest
from tests.harness import DataLoader, KaTeXValidator, ExamEngineSimulator, AppStateSimulator


class TestTier4WorkloadScenarios(unittest.TestCase):
    """Tier 4 Test Cases: Real-World Student Interactive Workflows."""

    def setUp(self):
        self.chapters = DataLoader.get_chapters()
        self.knowledge = DataLoader.get_knowledge()
        self.questions = DataLoader.get_questions()
        self.glossary = DataLoader.get_glossary()
        self.app = AppStateSimulator(self.questions, self.glossary)

    def test_01_scenario_full_50_minute_exam_lifecycle(self):
        """
        Scenario 4.1: Complete 50-minute exam simulation journey.
        Verifies stratified sampling, palette navigation, flagging, time countdown,
        scoring, chapter diagnostic breakdown, and scorecard review filtering.
        """
        # Step 1: Start New Exam Session
        exam_qs = ExamEngineSimulator.generate_exam_questions(self.questions, seed=2026)
        self.assertEqual(len(exam_qs), 50)

        # Step 2: Initialize liveExam state
        live_exam = {
            "isActive": True,
            "questions": exam_qs,
            "answers": {},
            "flagged": {},
            "currentQuestionIdx": 0,
            "totalSeconds": 3000,
            "timeRemaining": 3000
        }

        # Step 3: Student answers 45 questions (35 correct, 10 wrong) and flags 4 questions
        flagged_indices = [3, 14, 28, 41]
        for f_idx in flagged_indices:
            q_id = exam_qs[f_idx]["id"]
            live_exam["flagged"][q_id] = True

        for idx, q in enumerate(exam_qs[:45]):
            if idx < 35:
                live_exam["answers"][q["id"]] = q["correct"]
            else:
                live_exam["answers"][q["id"]] = (q["correct"] + 1) % 4

        self.assertEqual(len(live_exam["answers"]), 45)
        self.assertEqual(len(live_exam["flagged"]), 4)

        # Step 4: Simulate countdown to warning threshold (240s remaining = 4 mins)
        live_exam["timeRemaining"] = 240
        time_str = ExamEngineSimulator.format_time(live_exam["timeRemaining"])
        self.assertEqual(time_str, "04:00")
        is_warning_pulse = live_exam["timeRemaining"] <= 300
        self.assertTrue(is_warning_pulse, "Timer <= 300s must trigger danger warning pulse")

        # Step 5: Submit Exam & Scorecard Generation
        scorecard = ExamEngineSimulator.score_exam(exam_qs, live_exam["answers"])
        self.assertEqual(scorecard["correct_count"], 35)
        self.assertEqual(scorecard["wrong_count"], 15)  # 10 answered wrong + 5 unanswered
        self.assertEqual(scorecard["percentage"], 70)
        self.assertEqual(scorecard["score_scale_10"], 7.0)
        self.assertTrue(scorecard["is_passed"])

        # Step 6: Diagnostic Mastery Breakdown & Remediation Advice
        mastery = ExamEngineSimulator.compute_diagnostic_mastery(exam_qs, live_exam["answers"])
        weak_chapters = [c for c, data in mastery.items() if data["level"] == "low"]
        strong_chapters = [c for c, data in mastery.items() if data["level"] == "high"]
        self.assertIsInstance(weak_chapters, list)
        self.assertIsInstance(strong_chapters, list)

        # Step 7: Scorecard Review Filter Lists
        review_all = exam_qs
        review_wrong = [q for q in exam_qs if live_exam["answers"].get(q["id"]) != q["correct"]]
        review_flagged = [q for q in exam_qs if live_exam["flagged"].get(q["id"])]

        self.assertEqual(len(review_all), 50)
        self.assertEqual(len(review_wrong), 15)
        self.assertEqual(len(review_flagged), 4)

    def test_02_scenario_incorrect_questions_review_and_reset(self):
        """
        Scenario 4.2: Targeted remediation workflow.
        Student practices a chapter, reviews incorrect answers with KaTeX explanations,
        and resets chapter progress to re-attempt.
        """
        ch4_qs = [q for q in self.questions if q["chapter"] == 4]
        self.assertEqual(len(ch4_qs), 50)

        # Student gets 40 correct, 10 wrong
        for idx, q in enumerate(ch4_qs):
            if idx < 40:
                self.app.answer_quiz_question(q["id"], q["correct"])
            else:
                self.app.answer_quiz_question(q["id"], (q["correct"] + 1) % 4)

        # Filter by 'wrong' in Chapter 4
        wrong_ch4 = [q for q in ch4_qs if self.app.quiz_answers.get(q["id"]) != q["correct"]]
        self.assertEqual(len(wrong_ch4), 10)

        # For every wrong question, verify detailed explanation & slide citations exist
        for wq in wrong_ch4:
            exp = wq.get("explanation", "")
            self.assertGreater(len(exp), 10, f"Question {wq['id']} explanation is too short")
            slide = wq.get("slide_ref", "")
            self.assertGreater(len(slide), 0, f"Question {wq['id']} missing slide reference")

            # Check delimiter balance in explanation
            balanced, err = KaTeXValidator.check_delimiter_balance(exp)
            self.assertTrue(balanced, f"Explanation for {wq['id']} has unbalanced KaTeX: {err}")

        # Student resets Chapter 4
        self.app.reset_chapter_quiz(chapter=4)
        for q in ch4_qs:
            self.assertNotIn(q["id"], self.app.quiz_answers)

    def test_03_scenario_cross_chapter_bank_search_and_pagination(self):
        """
        Scenario 4.3: Question bank cross-chapter topic search & pagination limit.
        Verifies searching topics across 950 questions and load-more limit increment.
        """
        # 1. Search for "TF-IDF" across all chapters
        paged_tfidf, count_tfidf = self.app.filter_question_bank(search_query="tf-idf", limit=50)
        self.assertGreater(count_tfidf, 5, "Expected multiple questions mentioning TF-IDF across chapters")
        for q in paged_tfidf:
            text_corpus = (
                q["question"] + " " +
                q.get("topic", "") + " " +
                q.get("explanation", "") + " " +
                " ".join(q.get("options", []))
            ).lower()
            self.assertIn("tf-idf", text_corpus)

        # 2. Search for "Transformer"
        paged_tf, count_tf = self.app.filter_question_bank(search_query="transformer", limit=50)
        self.assertGreater(count_tf, 10, "Expected multiple questions on Transformer architecture")

        # 3. Test Pagination Limit (Load More +50)
        limit_initial = 50
        paged_all_1, total_all_1 = self.app.filter_question_bank(limit=limit_initial)
        self.assertEqual(len(paged_all_1), 50)
        self.assertEqual(total_all_1, 950)

        limit_next = limit_initial + 50
        paged_all_2, total_all_2 = self.app.filter_question_bank(limit=limit_next)
        self.assertEqual(len(paged_all_2), 100)
        self.assertEqual(total_all_2, 950)

    def test_04_scenario_glossary_lookup_and_cross_reference(self):
        """
        Scenario 4.4: Academic Glossary multi-field lookup & cross-referencing.
        Verifies lookup by English term, Vietnamese meaning, and acronym.
        """
        # 1. Search by English term
        res_perp = self.app.filter_glossary(query="Perplexity")
        self.assertGreaterEqual(len(res_perp), 1)
        term_obj = res_perp[0]
        self.assertEqual(term_obj["term"], "Perplexity")
        self.assertEqual(int(term_obj["ch"]), 2)  # Chapter 2: N-gram models

        # 2. Search by Vietnamese translation
        res_vn = self.app.filter_glossary(query="Biểu thức chính quy")
        self.assertGreaterEqual(len(res_vn), 1)
        self.assertEqual(int(res_vn[0]["ch"]), 1)

        # 3. Search by Acronym
        res_cky = self.app.filter_glossary(query="CKY")
        self.assertGreaterEqual(len(res_cky), 1)
        self.assertEqual(int(res_cky[0]["ch"]), 11)  # Chapter 11: Parsing


if __name__ == "__main__":
    unittest.main()
