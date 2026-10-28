# TMG301 Master Exam Prep — Test Infrastructure & Methodology (`TEST_INFRA.md`)

## 1. Executive Summary & Architecture

The **TMG301 Text Mining Review Portal** test infrastructure provides comprehensive, opaque-box, automated verification covering all functional features, data contracts, boundary limits, and user journeys.

In alignment with the portal's zero-dependency, 100% offline-first architecture, the test suite is implemented using **Python 3 standard library (`unittest`)**, requiring zero third-party packages or external services.

```
tests/
├── __init__.py                     # Package indicator
├── harness.py                      # Data loader, KaTeX validator, and state simulator
├── test_tier1_feature_coverage.py   # Tier 1: Feature Coverage (6 test methods)
├── test_tier2_boundary_corner.py    # Tier 2: Boundary & Corner Cases (6 test methods)
├── test_tier3_cross_feature.py      # Tier 3: Cross-Feature Combinations (5 test methods)
├── test_tier4_workload_scenarios.py # Tier 4: Real-World Workload Scenarios (4 test methods)
└── run_e2e_tests.py                 # Unified test runner with colorized tier reports
```

---

## 2. 4-Tier Testing Methodology

The test suite is structured into 4 distinct verification tiers:

### Tier 1: Feature Coverage (`test_tier1_feature_coverage.py`)
Validates that every individual feature specified in `PROJECT.md § Feature Inventory` functions according to contract:
1. **`test_01_data_files_exist_and_synchronized` (F01)**:
   - Validates existence of all core data assets (`chapters`, `knowledge`, `questions`, `glossary`, `slides_meta`).
   - Asserts 100% structural and byte-for-byte data parity between `data/*.json` and `data/*.js` Zero-CORS window bundles (`window.TMG_CHAPTERS`, `window.TMG_KNOWLEDGE`, `window.TMG_QUESTIONS`, `window.TMG_GLOSSARY`).
2. **`test_02_question_bank_schema_and_distribution` (Contract 1)**:
   - Validates exactly 950 questions across the question bank.
   - Validates chapter distribution: 50 questions per chapter for Chapters 1..17 ($17 \times 50 = 850$), and exactly 100 comprehensive synthesis questions (`chapter: 'comp'`).
   - Validates Contract 1 schema: `id` uniqueness, `chapter` range, `question` prompt, exactly 4 `options`, `answer` matching `correct` in `[0..3]`, `explanation`, and `slide_ref`.
3. **`test_03_knowledge_base_schema_and_integrity` (Contract 2)**:
   - Validates 17 complete knowledge chapters with slide files and lecture content.
   - Validates reference citation arrays (`id`, `title`, `slide_range`, `excerpt`).
4. **`test_04_glossary_schema_and_coverage`**:
   - Validates exactly 75 academic terminology definitions.
   - Validates coverage across all 17 chapters (every chapter has defined terms).
5. **`test_05_exam_generator_stratified_distribution`**:
   - Validates stratified random sampling: generates exactly 50 questions with 2 per chapter (34 questions), at least 6 comprehensive questions, zero duplicate IDs, and 50-minute duration.
6. **`test_06_katex_delimiters_and_syntax`**:
   - Validates that all mathematical formulas in `knowledge.json` and `questions.json` have matching and balanced delimiters (`$$...$$` display math and `$...$` inline math).

---

### Tier 2: Boundary & Corner Cases (`test_tier2_boundary_corner.py`)
Tests extreme inputs, edge conditions, delimiter collisions, and boundary limits:
1. **`test_01_lone_dollar_regex_boundary` (F02)**:
   - Tests delimiter safety: verifies that literal `$` in regex options (e.g. `q_ch01_01`) is isolated (enclosed in `<code>`, escaped as `\$`, or wrapped in code blocks) to prevent KaTeX delimiter hijacking.
2. **`test_02_extreme_long_option_wrapping` (F10)**:
   - Tests the upper bound of multiple-choice option lengths (options exceeding 150–200 characters).
   - Verifies stylesheet flex constraints (`display: flex`, `.opt-letter { flex-shrink: 0 }`, `word-break`) to prevent layout breakage on mobile and compact views.
3. **`test_03_zero_results_search_graceful_handling`**:
   - Tests search robustness on non-matching queries across Question Bank Explorer, Glossary, and Global Modal Search (Ctrl + K).
   - Verifies 0 items returned without throwing exceptions, and ensures friendly Vietnamese empty-state messages render.
4. **`test_04_timer_pulse_warning_threshold`**:
   - Tests exam timer boundary condition at exactly 300 seconds (5 minutes).
   - Asserts standard display for `> 300s`, danger/pulse styling for `<= 300s`, and auto-submission trigger at `0s`.
5. **`test_05_formula_delimiters_and_mathematical_edge_cases`**:
   - Tests fractions (`\frac`), superscripts/subscripts (`e^{-z}`, `x_i`), summations (`\sum`), matrices (`\mathbf{W}`), and Greek characters (`\sigma`, `\alpha`).
6. **`test_06_empty_and_special_char_filters`**:
   - Tests filter boundaries: empty string `""`, whitespace `"   "`, regex metacharacters (`[`, `]`, `*`, `+`, `?`, `\`, `^`, `$`), and chapter boundaries (Ch 1, Ch 17, Ch comp, invalid Ch 99).

---

### Tier 3: Cross-Feature Combinations (`test_tier3_cross_feature.py`)
Tests the integration and state transitions between interactive subsystems:
1. **`test_01_quiz_answering_and_dom_class_contract` (Contract 3)**:
   - Correct choice: card `#q-card-${qid}` gets `.answered-correct`, option button gets `.correct`, explanation box gets `.show`.
   - Wrong choice: card gets `.answered-wrong`, selected option gets `.wrong`, expected option gets `.correct`, explanation box gets `.show`.
2. **`test_02_quiz_state_localstorage_persistence_and_recovery`**:
   - Serializes user progress into `localStorage['tmg_quiz_answers']`.
   - Reconstructs state on simulated new session and verifies chapter-specific reset cleans only the targeted chapter.
3. **`test_03_in_place_dom_update_contract`**:
   - Verifies card ID naming `#q-card-${qid}`, explanation box class, and `typesetMath` hook targeted DOM update compatibility.
4. **`test_04_question_bank_interaction_and_status_filtering`**:
   - Tests multi-criteria filtering: combines chapter selection with answer status (`all`, `unanswered`, `correct`, `wrong`).
5. **`test_05_exam_scoring_and_history_persistence`**:
   - Computes score (out of 50 and scaled to 10), pass status (`score >= 30`), chapter diagnostic mastery levels (`low`, `medium`, `high`), and history cap (trims at 30 records).

---

### Tier 4: Real-World Workload Scenarios (`test_tier4_workload_scenarios.py`)
Executes full student end-to-end interactive journeys:
1. **`test_01_scenario_full_50_minute_exam_lifecycle`**:
   - Starts a 50-minute exam -> answers 45 questions with mixed responses -> flags 4 questions for review -> navigates question palette -> advances timer to danger threshold (240s) -> submits exam -> verifies scorecard accuracy and diagnostic mastery -> filters scorecard review list (wrong, flagged, all).
2. **`test_02_scenario_incorrect_questions_review_and_reset`**:
   - Simulates targeted remediation: filters practice quiz by incorrect questions -> expands explanation boxes -> validates math typesetting and slide citation -> resets chapter progress.
3. **`test_03_scenario_cross_chapter_bank_search_and_pagination`**:
   - Searches for core NLP topics ("TF-IDF", "Transformer") across all 950 questions -> tests "Xem thêm" pagination increment (+50 questions).
4. **`test_04_scenario_glossary_lookup_and_cross_reference`**:
   - Looks up terms by English name ("Perplexity"), Vietnamese translation ("Biểu thức chính quy"), and academic acronym ("CKY") -> verifies chapter and slide cross-reference.

---

## 3. How to Run the Tests

To run the complete automated test suite:

```powershell
python tests/run_e2e_tests.py
```

To run individual tiers:

```powershell
# Tier 1 only
python -m unittest tests/test_tier1_feature_coverage.py

# Tier 2 only
python -m unittest tests/test_tier2_boundary_corner.py

# Tier 3 only
python -m unittest tests/test_tier3_cross_feature.py

# Tier 4 only
python -m unittest tests/test_tier4_workload_scenarios.py
```

### Exit Codes
- `0`: All tests passed 100%.
- `1`: One or more tests failed.
