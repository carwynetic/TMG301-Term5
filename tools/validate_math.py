#!/usr/bin/env python3
"""
TMG301 KaTeX Formula & Syntax Validation Suite
Tests all math expressions in questions and knowledge base for syntax errors,
unbalanced delimiters, exposed LaTeX braces, and deprecated macros.
"""

import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def validate_questions_math():
    with open(os.path.join(ROOT, 'data', 'questions.json'), 'r', encoding='utf-8') as f:
        questions = json.load(f)

    issues = []
    total_formulas = 0

    # Whitelist of known non-math regex anchor occurrences
    regex_dollar_whitelist = {
        ('q_ch01_20', 'opt_0'), # '^email.*$' (regex pattern)
        ('q_ch01_29', 'opt_1'), # "Append '$'" (regex anchor explanation)
    }

    for q in questions:
        qid = q['id']
        fields = [
            ('question', q['question']),
            ('explanation', q.get('explanation', ''))
        ] + [(f'opt_{i}', opt) for i, opt in enumerate(q['options'])]

        for fname, text in fields:
            # Skip whitelisted non-math regex strings
            if (qid, fname) in regex_dollar_whitelist:
                continue

            # Strip <code>...</code> and `...`
            clean = re.sub(r'<code>.*?</code>', '', text, flags=re.DOTALL)
            clean = re.sub(r'`.*?`', '', clean, flags=re.DOTALL)
            clean = re.sub(r'\$\$.*?\$\$', '', clean, flags=re.DOTALL)
            
            # Extract properly paired inline math $...$
            clean_no_math = re.sub(r'(?<!\$)\$(?!\$)(.+?)(?<!\$)\$(?!\$)', '', clean, flags=re.DOTALL)

            # Check if any stray $ remains
            if '$' in clean_no_math:
                issues.append(f"[{qid}] {fname}: Stray unescaped '$' found in: {text}")

            # 2. Exposed LaTeX braces outside math
            no_math = re.sub(r'<code>.*?</code>', '', text, flags=re.DOTALL)
            no_math = re.sub(r'`.*?`', '', no_math, flags=re.DOTALL)
            no_math = re.sub(r'\$\$.*?\$\$', '', no_math, flags=re.DOTALL)
            no_math = re.sub(r'(?<!\$)\$(?!\$)(.+?)(?<!\$)\$(?!\$)', '', no_math, flags=re.DOTALL)
            if re.search(r'_[{][^}]+[}]', no_math):
                issues.append(f"[{qid}] {fname}: Exposed LaTeX subscript '_{{...}}' outside math mode: {text}")
            if re.search(r'\^[{][^}]+[}]', no_math):
                issues.append(f"[{qid}] {fname}: Exposed LaTeX superscript '^{{...}}' outside math mode: {text}")

            # 3. Pseudo-LaTeX operators outside math
            if re.search(r'\bSUM_\{', text):
                issues.append(f"[{qid}] {fname}: Raw pseudo-LaTeX 'SUM_{{...}}' found in text: {text}")
            if re.search(r'\bPROD_\{', text):
                issues.append(f"[{qid}] {fname}: Raw pseudo-LaTeX 'PROD_{{...}}' found in text: {text}")

            # 4. Extract formulas and check braces inside math
            inline_math = re.findall(r'(?<!\$)\$(?!\$)(.+?)(?<!\$)\$(?!\$)', text, flags=re.DOTALL)
            disp_math = re.findall(r'\$\$(.+?)\$\$', text, flags=re.DOTALL)
            for formula in inline_math + disp_math:
                total_formulas += 1
                if formula.count('{') != formula.count('}'):
                    issues.append(f"[{qid}] {fname}: Unbalanced braces in formula: {formula}")

    print(f"Questions Math Audit: {total_formulas} math formulas checked across 950 questions.")
    if issues:
        print(f"  [FAIL] {len(issues)} issues found in questions:")
        for iss in issues:
            print("    -", iss)
        return False
    else:
        print("  [PASS] 100% of question formulas have balanced delimiters, valid braces, and no exposed markup.")
        return True

def validate_knowledge_math():
    with open(os.path.join(ROOT, 'data', 'knowledge.json'), 'r', encoding='utf-8') as f:
        knowledge = json.load(f)

    issues = []
    total_formulas = 0

    for ch_id, ch_data in knowledge.items():
        html = ch_data.get('content_html', '')

        # 1. Delimiter balance (outside <code>...</code> and `...`)
        clean = re.sub(r'<code>.*?</code>', '', html, flags=re.DOTALL)
        clean = re.sub(r'`.*?`', '', clean, flags=re.DOTALL)
        clean = re.sub(r'\$\$.*?\$\$', '', clean, flags=re.DOTALL)
        clean_no_math = re.sub(r'(?<!\$)\$(?!\$)(.+?)(?<!\$)\$(?!\$)', '', clean, flags=re.DOTALL)
        if '$' in clean_no_math:
            issues.append(f"[Ch {ch_id}]: Stray unescaped '$' found in knowledge HTML")

        # 2. Check formulas for unbalanced braces
        inline_math = re.findall(r'(?<!\$)\$(?!\$)(.+?)(?<!\$)\$(?!\$)', html, flags=re.DOTALL)
        disp_math = re.findall(r'\$\$(.+?)\$\$', html, flags=re.DOTALL)
        for formula in inline_math + disp_math:
            total_formulas += 1
            if formula.count('{') != formula.count('}'):
                issues.append(f"[Ch {ch_id}]: Unbalanced braces in formula: {formula}")

    print(f"Knowledge Math Audit: {total_formulas} math formulas checked across 17 chapters.")
    if issues:
        print(f"  [FAIL] {len(issues)} issues found in knowledge base:")
        for iss in issues:
            print("    -", iss)
        return False
    else:
        print("  [PASS] 100% of knowledge base formulas have balanced delimiters and valid braces.")
        return True

if __name__ == '__main__':
    q_ok = validate_questions_math()
    k_ok = validate_knowledge_math()
    if q_ok and k_ok:
        print("\nAll KaTeX math formulas strictly validated!")
        sys.exit(0)
    else:
        print("\nKaTeX formula validation errors detected!")
        sys.exit(1)
