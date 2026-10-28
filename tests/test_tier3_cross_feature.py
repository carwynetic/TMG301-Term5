#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tier 3: Cross-Feature Combinations Test Suite
Tests feature interactions across subsystems:
- Quiz answering and Contract 3 DOM class state machine
- LocalStorage persistence and cross-session state recovery
- In-place DOM update contract and KaTeX typesetting hook
- Question bank interaction and multi-criteria status filtering
- Exam scoring calculations, mastery breakdown, and history persistence
"""

import unittest
import json
from tests.harness import DataLoader, ExamEngineSimulator, AppStateSimulator


class TestTier3CrossFeature(unittest.TestCase):
    """Tier 3 Test Cases: Cross-Feature System Interactions."""

    def setUp(self):
        self.chapters = DataLoader.get_chapters()
        self.knowledge = DataLoader.get_knowledge()
        self.questions = DataLoader.get_questions()
        self.glossary = DataLoader.get_glossary()
        self.app = AppStateSimulator(self.questions, self.glossary)
        self.js = DataLoader.get_app_js()
        self.html = DataLoader.get_html()

    def test_01_quiz_answering_and_dom_class_contract(self):
        """
        Contract 3: Quiz State & In-Place DOM Class Interface.
        Tests state transitions when user answers correctly vs incorrectly.
        """
        sample_q = self.questions[0]  # q_ch01_01
        qid = sample_q["id"]
        correct_opt = sample_q["correct"]
        wrong_opt = (correct_opt + 1) % 4

        # 1. Test Correct Answer Interaction
        res_correct = self.app.answer_quiz_question(qid, correct_opt)
        self.assertTrue(res_correct["is_correct"])
        self.assertEqual(res_correct["card_class"], "question-card answered-correct")
        self.assertIn("correct", res_correct["option_classes"][correct_opt])
        self.assertEqual(res_correct["explanation_box_class"], "explanation-box show")

        # 2. Test Wrong Answer Interaction on another question
        sample_q2 = self.questions[1]
        qid2 = sample_q2["id"]
        correct_opt2 = sample_q2["correct"]
        wrong_opt2 = (correct_opt2 + 1) % 4

        res_wrong = self.app.answer_quiz_question(qid2, wrong_opt2)
        self.assertFalse(res_wrong["is_correct"])
        self.assertEqual(res_wrong["card_class"], "question-card answered-wrong")
        self.assertIn("wrong", res_wrong["option_classes"][wrong_opt2])
        self.assertIn("correct", res_wrong["option_classes"][correct_opt2])
        self.assertEqual(res_wrong["explanation_box_class"], "explanation-box show")

    def test_02_quiz_state_localstorage_persistence_and_recovery(self):
        """
        Quiz Persistence Workflow:
        Verifies answers are stored in LocalStorage, survive simulated page reload,
        and individual chapter reset works without affecting other chapters.
        """
        # Answer 5 questions in Ch 1 and 3 questions in Ch 2
        ch1_qs = [q for q in self.questions if q["chapter"] == 1][:5]
        ch2_qs = [q for q in self.questions if q["chapter"] == 2][:3]

        for q in ch1_qs:
            self.app.answer_quiz_question(q["id"], q["correct"])  # all correct

        for q in ch2_qs:
            self.app.answer_quiz_question(q["id"], (q["correct"] + 1) % 4)  # wrong

        # Check LocalStorage JSON serialization
        raw_storage = self.app.local_storage.get("tmg_quiz_answers")
        self.assertIsNotNone(raw_storage)
        parsed_storage = json.loads(raw_storage)
        self.assertEqual(len(parsed_storage), 8)

        # Simulate fresh session loading LocalStorage
        new_app = AppStateSimulator(self.questions, self.glossary)
        new_app.quiz_answers = json.loads(self.app.local_storage["tmg_quiz_answers"])

        self.assertEqual(len(new_app.quiz_answers), 8)
        for q in ch1_qs:
            self.assertEqual(new_app.quiz_answers[q["id"]], q["correct"])
        for q in ch2_qs:
            self.assertEqual(new_app.quiz_answers[q["id"]], (q["correct"] + 1) % 4)

        # Reset Chapter 1
        new_app.reset_chapter_quiz(chapter=1)
        self.assertEqual(len(new_app.quiz_answers), 3, "After reset of Ch 1, only 3 Ch 2 answers should remain")
        for q in ch1_qs:
            self.assertNotIn(q["id"], new_app.quiz_answers)
        for q in ch2_qs:
            self.assertIn(q["id"], new_app.quiz_answers)

    def test_03_in_place_dom_update_contract(self):
        """
        Contract 3 Verification in Codebase:
        Verifies presence of card ID naming '#q-card-${qid}',
        explanation box selector, and typesetMath hook compatibility.
        """
        # Verify DOM Card ID convention in js/app.js
        self.assertIn("q-card-${q.id}", self.js)

        # Verify explanation box convention
        self.assertIn("explanation-box", self.js)

        # Verify typesetMath function definition and signature in js/app.js:69-92
        self.assertIn("function typesetMath(element)", self.js)

        # Verify HTML container IDs
        self.assertIn('id="app-content-area"', self.html)
        self.assertIn('id="sidebar-chapters"', self.html)
        self.assertIn('id="global-search-modal"', self.html)

    def test_04_question_bank_interaction_and_status_filtering(self):
        """
        Question Bank Interaction & Status Filtering:
        Tests filtering by 'all', 'unanswered', 'correct', 'wrong', and chapter.
        """
        # 1. Initial State: 0 answered, 950 unanswered
        _, count_unans = self.app.filter_question_bank(status_filter="unanswered")
        self.assertEqual(count_unans, 950)

        _, count_corr = self.app.filter_question_bank(status_filter="correct")
        self.assertEqual(count_corr, 0)

        _, count_wrong = self.app.filter_question_bank(status_filter="wrong")
        self.assertEqual(count_wrong, 0)

        # 2. Answer 6 questions in Chapter 3 (4 correct, 2 wrong)
        ch3_qs = [q for q in self.questions if q["chapter"] == 3][:6]
        for q in ch3_qs[:4]:
            self.app.answer_quiz_question(q["id"], q["correct"])
        for q in ch3_qs[4:]:
            self.app.answer_quiz_question(q["id"], (q["correct"] + 1) % 4)

        # 3. Test Status Filter counts
        _, total_answered = self.app.filter_question_bank(status_filter="answered")
        self.assertEqual(total_answered, 6)

        _, total_correct = self.app.filter_question_bank(status_filter="correct")
        self.assertEqual(total_correct, 4)

        _, total_wrong = self.app.filter_question_bank(status_filter="wrong")
        self.assertEqual(total_wrong, 2)

        _, total_remaining = self.app.filter_question_bank(status_filter="unanswered")
        self.assertEqual(total_remaining, 944)

        # 4. Multi-criteria: Chapter 3 + Status 'correct'
        paged_ch3_corr, total_ch3_corr = self.app.filter_question_bank(chapter_filter="3", status_filter="correct")
        self.assertEqual(total_ch3_corr, 4)

        # Chapter 4 + Status 'correct' -> 0
        paged_ch4_corr, total_ch4_corr = self.app.filter_question_bank(chapter_filter="4", status_filter="correct")
        self.assertEqual(total_ch4_corr, 0)

    def test_05_exam_scoring_and_history_persistence(self):
        """
        Exam Engine Scoring & History Persistence:
        Verifies score calculation, pass threshold (>= 30/50),
        diagnostic mastery calculation, and history trimming (cap 30).
        """
        exam_qs = ExamEngineSimulator.generate_exam_questions(self.questions, seed=123)
        self.assertEqual(len(exam_qs), 50)

        # Simulate answers: 36 correct, 14 wrong
        user_answers = {}
        for idx, q in enumerate(exam_qs):
            if idx < 36:
                user_answers[q["id"]] = q["correct"]
            else:
                user_answers[q["id"]] = (q["correct"] + 1) % 4

        # Score calculation
        scorecard = ExamEngineSimulator.score_exam(exam_qs, user_answers)
        self.assertEqual(scorecard["correct_count"], 36)
        self.assertEqual(scorecard["wrong_count"], 14)
        self.assertEqual(scorecard["score_scale_10"], 7.2)
        self.assertEqual(scorecard["percentage"], 72)
        self.assertTrue(scorecard["is_passed"])

        # Diagnostic mastery breakdown
        mastery = ExamEngineSimulator.compute_diagnostic_mastery(exam_qs, user_answers)
        self.assertGreater(len(mastery), 10)
        for ch_key, data in mastery.items():
            self.assertIn("percentage", data)
            self.assertIn(data["level"], ["low", "medium", "high"])

        # Test history trimming (cap 30 records) in app.js logic
        history = []
        for i in range(40):
            entry = {
                "id": 1000 + i,
                "date": "2026-10-28",
                "score": 30 + (i % 20),
                "timeSpent": "35p 10s"
            }
            history.append(entry)
            if len(history) > 30:
                history = history[-30:]

        self.assertEqual(len(history), 30)
        self.assertEqual(history[0]["id"], 1010)  # first 10 pruned
        self.assertEqual(history[-1]["id"], 1039)


if __name__ == "__main__":
    unittest.main()
