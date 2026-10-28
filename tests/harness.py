#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TMG301 Master Exam Prep - Automated Test Harness & Simulation Engine
Provides authoritative data loading, state simulation, DOM contract validation,
and KaTeX delimiter verification for the 4-tier E2E test suite.
"""

import os
import sys
import json
import re
import random
from collections import Counter
from typing import Dict, List, Any, Optional, Tuple, Set

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


class DataLoader:
    """Provides validated file-reading helpers for all portal data and code assets."""

    @staticmethod
    def read_text(rel_path: str) -> str:
        full_path = os.path.join(PROJECT_ROOT, rel_path)
        if not os.path.exists(full_path):
            raise FileNotFoundError(f"Required file not found: {rel_path} at {full_path}")
        with open(full_path, "r", encoding="utf-8") as f:
            return f.read()

    @staticmethod
    def load_json(rel_path: str) -> Any:
        full_path = os.path.join(PROJECT_ROOT, rel_path)
        if not os.path.exists(full_path):
            raise FileNotFoundError(f"Required JSON file not found: {rel_path}")
        with open(full_path, "r", encoding="utf-8") as f:
            return json.load(f)

    @classmethod
    def load_js_window_var(cls, rel_path: str, var_name: str) -> Any:
        content = cls.read_text(rel_path)
        if var_name not in content:
            raise ValueError(f"Variable window.{var_name} not found in {rel_path}")
        first_bracket = min([p for p in [content.find('['), content.find('{')] if p != -1])
        last_bracket = max([p for p in [content.rfind(']'), content.rfind('}')] if p != -1])
        raw_json = content[first_bracket:last_bracket + 1]
        return json.loads(raw_json)

    @classmethod
    def get_chapters(cls) -> List[Dict[str, Any]]:
        return cls.load_json("data/chapters.json")

    @classmethod
    def get_knowledge(cls) -> Dict[str, Any]:
        return cls.load_json("data/knowledge.json")

    @classmethod
    def get_questions(cls) -> List[Dict[str, Any]]:
        return cls.load_json("data/questions.json")

    @classmethod
    def get_glossary(cls) -> List[Dict[str, Any]]:
        return cls.load_json("data/glossary.json")

    @classmethod
    def get_slides_meta(cls) -> Dict[str, Any]:
        return cls.load_json("data/slides_meta.json")

    @classmethod
    def get_html(cls) -> str:
        return cls.read_text("index.html")

    @classmethod
    def get_css(cls) -> str:
        return cls.read_text("css/style.css")

    @classmethod
    def get_app_js(cls) -> str:
        return cls.read_text("js/app.js")


class KaTeXValidator:
    """Validates KaTeX syntax, delimiter pairings, and escaping rules."""

    @staticmethod
    def extract_math_blocks(text: str) -> List[Tuple[str, str]]:
        """
        Extracts display ($$...$$) and inline ($...$) formulas.
        Returns list of tuples: (math_type, formula_content) where math_type in ('display', 'inline').
        """
        results = []
        if not text:
            return results

        # 1. Extract display math $$...$$
        display_pattern = re.compile(r'\$\$(.+?)\$\$', re.DOTALL)
        for m in display_pattern.finditer(text):
            results.append(('display', m.group(1).strip()))

        # Remove display math before finding inline to avoid double matching
        text_without_display = display_pattern.sub('', text)

        # 2. Extract inline math $...$ (ensuring no escaped \$)
        inline_pattern = re.compile(r'(?<!\\)\$(.+?)(?<!\\)\$', re.DOTALL)
        for m in inline_pattern.finditer(text_without_display):
            results.append(('inline', m.group(1).strip()))

        return results

    @staticmethod
    def check_delimiter_balance(text: str) -> Tuple[bool, Optional[str]]:
        """
        Verifies that all $ delimiters in text are balanced.
        Accounts for escaped \\$ and display $$ pairs.
        """
        if not text:
            return True, None

        # Replace escaped dollar signs \$, display math $$, and code blocks <code>...</code>
        cleaned = re.sub(r'<code>.*?</code>', '', text, flags=re.DOTALL)
        cleaned = re.sub(r'<pre>.*?</pre>', '', cleaned, flags=re.DOTALL)
        cleaned = re.sub(r'\\\$', '', cleaned)
        cleaned = re.sub(r'\$\$.*?\$\$', '', cleaned, flags=re.DOTALL)

        # Count remaining unescaped single $
        single_dollars = re.findall(r'(?<!\\)\$', cleaned)
        if len(single_dollars) % 2 != 0:
            return False, f"Odd number of unescaped $ delimiters detected ({len(single_dollars)} single $ found)"

        return True, None

    @staticmethod
    def is_safe_katex_option(option_str: str) -> bool:
        """
        Returns True if an option string containing '$' is properly enclosed in <code>
        or escaped or forms a valid balanced KaTeX pair.
        """
        if "$" not in option_str:
            return True

        # If wrapped in code tags: <code>$</code> or `$`
        if re.search(r'<code>.*?\$+.*?</code>', option_str) or re.search(r'`.*?\$+.*?`', option_str):
            return True

        # If escaped as \$
        if r"\$" in option_str and not re.search(r'(?<!\\)\$', option_str):
            return True

        # If balanced math formula: e.g. $x$ or $O(n)$
        ok, _ = KaTeXValidator.check_delimiter_balance(option_str)
        return ok


class ExamEngineSimulator:
    """Simulates the stratified random sampling and scoring logic of js/app.js."""

    @staticmethod
    def generate_exam_questions(all_questions: List[Dict[str, Any]], seed: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Exact replication of startNewExam stratified sampling (js/app.js:547-567):
        - 2 questions per chapter (Ch 1..17 = 34 questions)
        - 6 comprehensive synthesis questions (chapter == 'comp' or '0')
        - 10 remaining questions from general pool
        Total: exactly 50 questions
        """
        rng = random.Random(seed) if seed is not None else random.Random()
        sampled = []

        # 1. 2 questions per chapter 1..17
        for ch in range(1, 18):
            ch_pool = [q for q in all_questions if str(q.get("chapter")) == str(ch)]
            shuffled = ch_pool.copy()
            rng.shuffle(shuffled)
            sampled.extend(shuffled[:2])

        # 2. 6 comprehensive synthesis questions
        synth_pool = [q for q in all_questions if str(q.get("chapter")) in ("comp", "0")]
        shuffled_synth = synth_pool.copy()
        rng.shuffle(shuffled_synth)
        sampled.extend(shuffled_synth[:6])

        # 3. Fill remaining up to 50
        remaining_pool = [q for q in all_questions if not any(s["id"] == q["id"] for s in sampled)]
        shuffled_remaining = remaining_pool.copy()
        rng.shuffle(shuffled_remaining)
        sampled.extend(shuffled_remaining[:50 - len(sampled)])

        # Final uniform shuffle of the 50 questions
        exam_questions = sampled.copy()
        rng.shuffle(exam_questions)
        return exam_questions

    @staticmethod
    def score_exam(exam_questions: List[Dict[str, Any]], answers: Dict[str, int]) -> Dict[str, Any]:
        """Calculates scorecard statistics matching submitExam() (js/app.js:786-819)."""
        correct_count = 0
        for q in exam_questions:
            if answers.get(q["id"]) == q["correct"]:
                correct_count += 1

        score_out_of_10 = round((correct_count / 50.0) * 10.0, 2)
        percentage = round((correct_count / 50.0) * 100)
        is_passed = correct_count >= 30

        return {
            "total_questions": len(exam_questions),
            "correct_count": correct_count,
            "wrong_count": len(exam_questions) - correct_count,
            "score_raw": correct_count,
            "score_scale_10": score_out_of_10,
            "percentage": percentage,
            "is_passed": is_passed
        }

    @staticmethod
    def compute_diagnostic_mastery(exam_questions: List[Dict[str, Any]], answers: Dict[str, int]) -> Dict[str, Dict[str, Any]]:
        """Calculates chapter-by-chapter mastery breakdown (js/app.js:830-880)."""
        stats: Dict[str, Dict[str, Any]] = {}
        for q in exam_questions:
            ch_key = "comp" if str(q.get("chapter")) in ("comp", "0") else str(q.get("chapter"))
            if ch_key not in stats:
                stats[ch_key] = {"chapter": ch_key, "total": 0, "correct": 0}
            stats[ch_key]["total"] += 1
            if answers.get(q["id"]) == q["correct"]:
                stats[ch_key]["correct"] += 1

        for ch_key, data in stats.items():
            pct = round((data["correct"] / data["total"]) * 100) if data["total"] > 0 else 0
            data["percentage"] = pct
            if pct < 50:
                data["level"] = "low"
                data["label"] = "Cần ôn lại"
            elif pct < 80:
                data["level"] = "medium"
                data["label"] = "Trung bình"
            else:
                data["level"] = "high"
                data["label"] = "Thành thạo"

        return stats

    @staticmethod
    def format_time(seconds: int) -> str:
        """Exact replication of formatTime(totalSeconds) in js/app.js:772-776."""
        mins = seconds // 60
        secs = seconds % 60
        return f"{mins:02d}:{secs:02d}"


class AppStateSimulator:
    """Simulates the state transitions and localStorage persistence of js/app.js."""

    def __init__(self, questions: List[Dict[str, Any]], glossary: List[Dict[str, Any]]):
        self.all_questions = questions
        self.q_map = {q["id"]: q for q in questions}
        self.all_glossary = glossary

        # State object matching js/app.js:10-38
        self.current_view = "knowledge"
        self.current_chapter = 1
        self.theme = "dark"
        self.quiz_answers: Dict[str, int] = {}
        self.exam_history: List[Dict[str, Any]] = []
        self.live_exam: Optional[Dict[str, Any]] = None

        # Question bank explorer state
        self.bank_chapter_filter = "all"
        self.bank_search_query = ""
        self.bank_status_filter = "all"
        self.bank_current_limit = 50
        self.bank_show_all_answers = False
        self.bank_revealed_answers: Dict[str, bool] = {}

        # Glossary query
        self.glossary_query = ""

        # Simulated browser LocalStorage
        self.local_storage: Dict[str, str] = {
            "tmg_theme": "dark",
            "tmg_quiz_answers": "{}",
            "tmg_exam_history": "[]"
        }

    # Quiz Interactions
    def answer_quiz_question(self, qid: str, selected_opt: int) -> Dict[str, Any]:
        """
        Simulates user selecting an option in Quiz practice.
        Applies Contract 3 DOM class rules and updates state & localStorage.
        """
        q = self.q_map.get(qid)
        if not q:
            raise KeyError(f"Question ID {qid} not found")

        self.quiz_answers[qid] = selected_opt
        self.local_storage["tmg_quiz_answers"] = json.dumps(self.quiz_answers)

        is_correct = (selected_opt == q["correct"])
        card_class = "question-card answered-correct" if is_correct else "question-card answered-wrong"

        option_classes = {}
        for idx in range(len(q["options"])):
            cls = "option-btn"
            if idx == q["correct"]:
                cls += " correct"
            elif idx == selected_opt:
                cls += " wrong"
            option_classes[idx] = cls

        return {
            "qid": qid,
            "user_ans": selected_opt,
            "correct_ans": q["correct"],
            "is_correct": is_correct,
            "card_class": card_class,
            "option_classes": option_classes,
            "explanation_box_class": "explanation-box show"
        }

    def reset_chapter_quiz(self, chapter: int):
        """Resets quiz answers for a specific chapter (js/app.js:350-356)."""
        for q in self.all_questions:
            if q.get("chapter") == chapter and q["id"] in self.quiz_answers:
                del self.quiz_answers[q["id"]]
        self.local_storage["tmg_quiz_answers"] = json.dumps(self.quiz_answers)

    # Question Bank Explorer Filtering
    def filter_question_bank(
        self,
        chapter_filter: str = "all",
        search_query: str = "",
        status_filter: str = "all",
        limit: int = 50
    ) -> Tuple[List[Dict[str, Any]], int]:
        """
        Replicates Question Bank Explorer filtering pipeline (js/app.js:1150-1190).
        Returns: (paged_questions, total_matching_count)
        """
        q_str = search_query.lower().strip()

        matched = []
        for q in self.all_questions:
            # 1. Chapter filter
            if chapter_filter != "all" and str(q.get("chapter")) != str(chapter_filter):
                continue

            # 2. Search query filter
            if q_str:
                in_q = q_str in q.get("question", "").lower()
                in_topic = q_str in q.get("topic", "").lower()
                in_exp = q_str in q.get("explanation", "").lower()
                in_opts = any(q_str in opt.lower() for opt in q.get("options", []))
                if not (in_q or in_topic or in_exp or in_opts):
                    continue

            # 3. Status filter
            user_ans = self.quiz_answers.get(q["id"])
            if status_filter == "answered" and user_ans is None:
                continue
            if status_filter == "unanswered" and user_ans is not None:
                continue
            if status_filter == "correct" and (user_ans is None or user_ans != q["correct"]):
                continue
            if status_filter == "wrong" and (user_ans is None or user_ans == q["correct"]):
                continue

            matched.append(q)

        return matched[:limit], len(matched)

    # Glossary Filtering
    def filter_glossary(self, query: str = "") -> List[Dict[str, Any]]:
        """Replicates Glossary filtering pipeline (js/app.js:1294-1300)."""
        q = query.lower().strip()
        if not q:
            return self.all_glossary.copy()

        return [
            it for it in self.all_glossary
            if q in it.get("term", "").lower() or q in it.get("vn", "").lower() or q in it.get("def", "").lower()
        ]

    # Global Quick Search Modal (Ctrl + K)
    def search_global(self, query: str, chapters: List[Dict[str, Any]]) -> Dict[str, List[Any]]:
        """Replicates Global search modal logic (js/app.js:1370-1392)."""
        q = query.lower().strip()
        if not q:
            return {"chapters": [], "glossary": [], "questions": []}

        matched_chapters = [
            c for c in chapters
            if q in c.get("title", "").lower() or q in c.get("title_vn", "").lower()
        ]

        matched_glossary = [
            g for g in self.all_glossary
            if q in g.get("term", "").lower() or q in g.get("vn", "").lower()
        ][:5]

        matched_questions = [
            ques for ques in self.all_questions
            if q in ques.get("question", "").lower() or q in ques.get("topic", "").lower()
        ][:5]

        return {
            "chapters": matched_chapters,
            "glossary": matched_glossary,
            "questions": matched_questions
        }
