/**
 * TMG301 - Text Mining Course Chapters Data
 * Contains comprehensive curriculum content, key terms, formulas, and slide references.
 */
window.TMG_CHAPTERS = [
  {
    "id": 1,
    "title": "Chapter 1: Regular Expressions, Text Normalization & Edit Distance",
    "vn_title": "Biểu thức chính quy, Chuẩn hóa văn bản & Khoảng cách Edit",
    "ppt_file": "01. Regular Expressions - Text Normalization - SDIT Distance.ppt",
    "slide_count": 25,
    "summary": "Nền tảng tiền xử lý dữ liệu dạng chuỗi và văn bản: Biểu thức chính quy (Regex) để trích xuất và xác thực dữ liệu, quy trình chuẩn hóa văn bản (Tokenization, Stemming vs Lemmatization), và thuật toán đo độ tương đồng chuỗi SDIT / Edit Distance.",
    "key_terms": [
      {
        "term": "Regular Expressions (Regex)",
        "vn": "Biểu thức chính quy",
        "def": "A sequence of characters defining a search pattern for text matching, manipulation, and validation."
      },
      {
        "term": "Metacharacters & Anchors",
        "vn": "Ký tự đặc biệt & Vị trí neo",
        "def": "Special characters (^ start, $ end, \\b word boundary, . wildcard, \\ escape) defining search rules."
      },
      {
        "term": "Quantifiers",
        "vn": "Bộ lượng từ",
        "def": "Symbols specifying repetition count: * (0+), + (1+), ? (0 or 1), {m,n} (range)."
      },
      {
        "term": "Capturing vs Non-Capturing",
        "vn": "Nhóm trích xuất vs Nhóm gom logic",
        "def": "(...) saves captured text in memory; (?:...) groups tokens without memory allocation."
      },
      {
        "term": "Text Normalization",
        "vn": "Chuẩn hóa văn bản",
        "def": "Pre-processing pipeline to reduce noise and vocabulary size (case folding, tokenization, stemming/lemmatization)."
      },
      {
        "term": "Stemming vs Lemmatization",
        "vn": "Tách gốc từ vs Quy về từ nguyên thể",
        "def": "Stemming cuts word affixes by heuristic rules (Porter); Lemmatization uses morphology & dictionary (WordNet)."
      },
      {
        "term": "Edit Distance / Levenshtein",
        "vn": "Khoảng cách Edit",
        "def": "Minimum number of edit operations (Insertion, Deletion, Substitution) required to transform string s1 into s2."
      },
      {
        "term": "SDIT Distance",
        "vn": "Khoảng cách SDIT",
        "def": "Edit distance algorithm tracking Substitution, Deletion, Insertion, and Transposition (Damerau-Levenshtein)."
      }
    ],
    "sections": [
      {
        "id": "ch1-sec1",
        "title": "1. Regular Expressions (Regex) - Bản chất & Cú pháp nền tảng",
        "content_html": "\n<p><strong>Regular Expressions (Regex)</strong> là chuỗi ký tự định nghĩa một <em>Search Pattern</em> (mẫu tìm kiếm) bên trong dữ liệu văn bản <a href=\"#ref-ch1-1\" class=\"cite-ref\" data-ref=\"ref-ch1-1\" title=\"Slide 3: Definition of Regular Expressions\">[1]</a>. Trong khai phá văn bản và NLP, Regex đóng vai trò là công cụ tuyến đầu trong việc chuẩn bị dữ liệu thô.</p>\n\n<div class=\"callout callout-info\">\n  <h4>📌 3 Chức năng cốt lõi (Core Functionalities) <a href=\"#ref-ch1-2\" class=\"cite-ref\" data-ref=\"ref-ch1-2\" title=\"Slide 4: Functionality of Regular Expressions\">[2]</a>:</h4>\n  <ul>\n    <li><strong>Searching / Pattern Matching:</strong> Quét và phát hiện các mẫu dữ liệu xác định (như số điện thoại, ngày tháng, mã hóa đơn).</li>\n    <li><strong>Manipulating / Substitution:</strong> Thay thế hoặc định dạng lại văn bản (xóa ký tự rác, chuẩn hóa URL, biến đổi dấu câu).</li>\n    <li><strong>Validating:</strong> Kiểm tra tính hợp lệ của chuỗi đầu vào theo quy cách kỹ thuật (email format validation, password strength).</li>\n  </ul>\n</div>\n\n<h4>Cú pháp ký tự đặc biệt (Metacharacters & Anchors) <a href=\"#ref-ch1-3\" class=\"cite-ref\" data-ref=\"ref-ch1-3\" title=\"Slide 5-8: Metacharacters & Anchors\">[3]</a></h4>\n<table class=\"table-content\">\n  <thead><tr><th>Ký hiệu</th><th>Tên gọi</th><th>Ý nghĩa & Hành vi</th><th>Ví dụ</th></tr></thead>\n  <tbody>\n    <tr><td><code>^</code></td><td>Caret (Anchor)</td><td>Neo tại vị trí <strong>đầu dòng / chuỗi</strong></td><td><code>^The</code> khớp với dòng bắt đầu bằng \"The\"</td></tr>\n    <tr><td><code>$</code></td><td>Dollar (Anchor)</td><td>Neo tại vị trí <strong>cuối dòng / chuỗi</strong></td><td><code>end$</code> khớp với dòng kết thúc bằng \"end\"</td></tr>\n    <tr><td><code>\\b</code></td><td>Word Boundary</td><td>Ranh giới giữa ký tự từ (word) và ký tự không phải từ</td><td><code>\\bcat\\b</code> khớp đúng từ \"cat\", không khớp \"concatenate\"</td></tr>\n    <tr><td><code>.</code></td><td>Wildcard Dot</td><td>Đại diện cho <strong>bất kỳ ký tự đơn nào</strong> (trừ newline <code>\\n</code>)</td><td><code>c.t</code> khớp \"cat\", \"cot\", \"c#t\"</td></tr>\n    <tr><td><code>\\d</code> / <code>\\D</code></td><td>Digit / Non-digit</td><td>Khớp chữ số <code>[0-9]</code> / Khớp ký tự không phải chữ số</td><td><code>\\d{4}</code> khớp năm gồm 4 chữ số</td></tr>\n    <tr><td><code>\\w</code> / <code>\\W</code></td><td>Word char</td><td>Khớp <code>[a-zA-Z0-9_]</code> / Ký tự không phải từ</td><td><code>\\w+</code> khớp một chuỗi từ</td></tr>\n  </tbody>\n</table>\n\n<h4>Bộ lượng từ (Quantifiers) & Nhóm trích xuất (Capturing Groups) <a href=\"#ref-ch1-4\" class=\"cite-ref\" data-ref=\"ref-ch1-4\" title=\"Slide 9-11: Quantifiers and Groups\">[4]</a></h4>\n<ul>\n  <li><code>*</code>: Khớp <strong>0 hoặc nhiều lần</strong> (zero or more).</li>\n  <li><code>+</code>: Khớp <strong>1 hoặc nhiều lần</strong> (one or more).</li>\n  <li><code>?</code>: Khớp <strong>0 hoặc 1 lần</strong> (optional, tùy chọn).</li>\n  <li><code>{m,n}</code>: Khớp từ <code>m</code> đến <code>n</code> lần (ví dụ: <code>\\d{2,4}</code>).</li>\n  <li><code>(pattern)</code>: <strong>Capturing Group</strong> — gom nhóm và lưu chuỗi con khớp được vào bộ nhớ để trích xuất lại thông qua nhóm đánh số <code>group(1)</code>.</li>\n  <li><code>(?:pattern)</code>: <strong>Non-Capturing Group</strong> — chỉ gom nhóm logic để áp dụng lượng từ, không tốn bộ nhớ lưu trữ trích xuất.</li>\n</ul>\n\n<div class=\"code-block\">\n<pre><code class=\"language-python\">import re\n\n# Ví dụ trích xuất Email và Số điện thoại chuẩn trong Python\ntext = \"Contact us at support@fpt.edu.vn or hotline (024) 7300-1866 on 2026-10-26.\"\n\nemail_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,}'\nemails = re.findall(email_pattern, text)\nprint(\"Emails found:\", emails) # ['support@fpt.edu.vn']\n\n# Non-capturing group kết hợp capturing group\nurl_pattern = r'https?://(?:www\\.)?([a-zA-Z0-9.-]+)'\nmatch = re.search(url_pattern, 'https://www.google.com')\nif match:\n    print(\"Domain:\", match.group(1)) # 'google.com'</code></pre>\n</div>\n"
      },
      {
        "id": "ch1-sec2",
        "title": "2. Text Normalization (Chuẩn hóa văn bản) - Pipeline & Kỹ thuật",
        "content_html": "\n<p><strong>Text Normalization</strong> là chuỗi xử lý nhằm biến đổi văn bản thô đa dạng thành dạng thức đồng nhất, giảm nhiễu (<em>Noise Reduction</em>) và giảm kích thước không gian từ vựng (<em>Vocabulary Reduction</em>) <a href=\"#ref-ch1-5\" class=\"cite-ref\" data-ref=\"ref-ch1-5\" title=\"Slide 13-14: Text Normalization Overview\">[5]</a>.</p>\n\n<h4>Các bước chính trong Text Normalization Pipeline <a href=\"#ref-ch1-6\" class=\"cite-ref\" data-ref=\"ref-ch1-6\" title=\"Slide 15-17: Normalization Techniques\">[6]</a>:</h4>\n<ol>\n  <li><strong>Case Folding:</strong> Đưa toàn bộ ký tự về chữ thường (lowercase) nhằm xem \"Machine\" và \"machine\" là cùng một từ.</li>\n  <li><strong>Punctuation & Noise Cleaning:</strong> Loại bỏ các ký tự đặc biệt, mã HTML, dấu câu không mang giá trị ngữ nghĩa.</li>\n  <li><strong>Tokenization:</strong> Tách chuỗi ký tự thành danh sách các đơn vị độc lập gọi là <em>Tokens</em>.</li>\n  <li><strong>Stopwords Removal:</strong> Lọc bỏ các từ xuất hiện với tần suất cao nhưng mang ít giá trị phân loại như \"the\", \"is\", \"at\", \"which\".</li>\n  <li><strong>Stemming & Lemmatization:</strong> Đưa các biến thể từ ngữ về dạng gốc.</li>\n</ol>\n\n<div class=\"callout callout-warning\">\n  <h4>⚖️ Trọng tâm thi cử: So sánh Stemming vs. Lemmatization <a href=\"#ref-ch1-7\" class=\"cite-ref\" data-ref=\"ref-ch1-7\" title=\"Slide 18-19: Stemming vs Lemmatization\">[7]</a></h4>\n  <table class=\"table-content\">\n    <thead><tr><th>Tiêu chí</th><th>Stemming (Tách gốc từ theo luật thô)</th><th>Lemmatization (Quy về từ nguyên thể)</th></tr></thead>\n    <tbody>\n      <tr><td><strong>Cơ chế</strong></td><td>Cắt xén tiếp đầu/vĩ ngữ bằng tập luật thô (heuristic). Không dùng từ điển.</td><td>Phân tích hình thái học (Morphology), tra từ điển và xem xét từ loại (POS).</td></tr>\n      <tr><td><strong>Kết quả đầu ra</strong></td><td>Có thể là từ <strong>không có nghĩa trong từ điển</strong> (ví dụ: \"studies\" -> <code>studi</code>).</td><td>Luôn là một từ <strong>hợp lệ trong từ điển</strong> (Lemma) (ví dụ: \"studies\" -> <code>study</code>).</td></tr>\n      <tr><td><strong>Tốc độ</strong></td><td>Rất nhanh, tốn ít tài nguyên bộ nhớ.</td><td>Chậm hơn do phải tra từ điển và phân tích ngữ pháp.</td></tr>\n      <tr><td><strong>Đại diện</strong></td><td>Porter Stemmer, Lancaster Stemmer.</td><td>WordNet Lemmatizer (NLTK), spaCy Lemmatizer.</td></tr>\n      <tr><td><strong>Ví dụ</strong></td><td><code>\"better\"</code> -> <code>better</code><br><code>\"meeting\"</code> -> <code>meet</code></td><td><code>\"better\"</code> (POS='a') -> <code>good</code><br><code>\"was\"</code> (POS='v') -> <code>be</code></td></tr>\n    </tbody>\n  </table>\n</div>\n"
      },
      {
        "id": "ch1-sec3",
        "title": "3. SDIT Distance & String Similarity (Đo khoảng cách & Độ tương đồng chuỗi)",
        "content_html": "\n<p><strong>Edit Distance (Khoảng cách hiệu chỉnh)</strong> đo lường mức độ tương đồng giữa hai chuỗi bằng số lượng thao tác tối thiểu cần thực hiện để biến đổi chuỗi nguồn $S_1$ thành chuỗi đích $S_2$ <a href=\"#ref-ch1-8\" class=\"cite-ref\" data-ref=\"ref-ch1-8\" title=\"Slide 22-24: Edit Distance & SDIT\">[8]</a>.</p>\n\n<div class=\"callout callout-info\">\n  <h4>4 Thao tác trong mô hình SDIT Distance:</h4>\n  <ul>\n    <li><strong>S (Substitution - Thay thế):</strong> Đổi ký tự $c_1$ thành ký tự $c_2$ (Chi phí: 1 hoặc 2 tùy Levenshtein gốc).</li>\n    <li><strong>D (Deletion - Xóa):</strong> Xóa bỏ ký tự khỏi chuỗi (Chi phí: 1).</li>\n    <li><strong>I (Insertion - Chèn):</strong> Thêm một ký tự mới vào chuỗi (Chi phí: 1).</li>\n    <li><strong>T (Transposition - Hoán vị):</strong> Đổi chỗ hai ký tự liền kề như \"ca\" thành \"ac\" (Đặc trưng của thuật toán <em>Damerau-Levenshtein</em>).</li>\n  </ul>\n</div>\n\n<h4>Công thức Quy hoạch động (Dynamic Programming Formulation):</h4>\n<div class=\"formula-box\">\n  $$D[i, j] = \\min \\begin{cases}\n    D[i-1, j] + \\text{cost}_{\\text{del}} \\\\\n    D[i, j-1] + \\text{cost}_{\\text{ins}} \\\\\n    D[i-1, j-1] + \\begin{cases} 0 & \\text{nếu } X[i] = Y[j] \\\\ \\text{cost}_{\\text{sub}} & \\text{nếu } X[i] \\neq Y[j] \\end{cases}\n  \\end{cases}$$\n</div>\n<p><strong>Ứng dụng thực tế:</strong> Kiểm tra lỗi chính tả (Spelling Correction), gợi ý từ tìm kiếm (Search Auto-complete), và so khớp chuỗi sinh học (Bioinformatics).</p>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch1-1",
        "index": 1,
        "slide": "Slide 3",
        "topic": "Definition of Regular Expressions (regex)",
        "ppt": "01. Regular Expressions - Text Normalization - SDIT Distance.ppt",
        "excerpt": "Regular Expressions are sequences of characters that define search patterns within text data for matching and extraction."
      },
      {
        "id": "ref-ch1-2",
        "index": 2,
        "slide": "Slide 4",
        "topic": "Functionality of Regular Expressions",
        "ppt": "01. Regular Expressions - Text Normalization - SDIT Distance.ppt",
        "excerpt": "Three core functions: Searching (pattern detection), Manipulating (replacing/rearranging text), and Validating (format checking)."
      },
      {
        "id": "ref-ch1-3",
        "index": 3,
        "slide": "Slide 5-8",
        "topic": "Metacharacters, Anchors & Character Classes",
        "ppt": "01. Regular Expressions - Text Normalization - SDIT Distance.ppt",
        "excerpt": "Anchors (^, $) anchor matching at boundary positions. Character classes [a-z] match defined symbol sets."
      },
      {
        "id": "ref-ch1-4",
        "index": 4,
        "slide": "Slide 9-11",
        "topic": "Quantifiers, Capturing & Non-Capturing Groups",
        "ppt": "01. Regular Expressions - Text Normalization - SDIT Distance.ppt",
        "excerpt": "Quantifiers (*, +, ?, {m,n}) control repetition. Parentheses define capturing groups for memory extraction."
      },
      {
        "id": "ref-ch1-5",
        "index": 5,
        "slide": "Slide 13-14",
        "topic": "Text Normalization Overview & Purpose",
        "ppt": "01. Regular Expressions - Text Normalization - SDIT Distance.ppt",
        "excerpt": "Transforming unstructured raw text into standardized formats to reduce vocabulary noise and dimensionality."
      },
      {
        "id": "ref-ch1-6",
        "index": 6,
        "slide": "Slide 15-17",
        "topic": "Case Folding, Tokenization & Stopwords",
        "ppt": "01. Regular Expressions - Text Normalization - SDIT Distance.ppt",
        "excerpt": "Segmenting text into distinct tokens and stripping low-information stopwords to preserve salient features."
      },
      {
        "id": "ref-ch1-7",
        "index": 7,
        "slide": "Slide 18-19",
        "topic": "Stemming vs. Lemmatization Comparison",
        "ppt": "01. Regular Expressions - Text Normalization - SDIT Distance.ppt",
        "excerpt": "Stemming uses heuristic rule truncation (Porter); Lemmatization uses grammatical vocabulary lookup to return canonical lemmas."
      },
      {
        "id": "ref-ch1-8",
        "index": 8,
        "slide": "Slide 22-24",
        "topic": "Edit Distance, Levenshtein & SDIT Distance",
        "ppt": "01. Regular Expressions - Text Normalization - SDIT Distance.ppt",
        "excerpt": "SDIT models minimum cost transformation via Substitution, Deletion, Insertion, and Transposition using dynamic programming."
      }
    ]
  },
  {
    "id": 2,
    "title": "Chapter 2: N-Gram Language Models",
    "vn_title": "Mô hình ngôn ngữ N-Gram & Ước lượng xác suất",
    "ppt_file": "02. N-Gram Language Models.ppt",
    "slide_count": 15,
    "summary": "Mô hình xác suất cho chuỗi từ: Khái niệm Language Model, Quy tắc nhân xác suất (Chain Rule), Giả định Markov, Ước lượng hợp lý cực đại (MLE), Đánh giá mô hình bằng Perplexity, và kỹ thuật làm mịn xác suất (Smoothing) giải quyết vấn đề Zero-Probability.",
    "key_terms": [
      {
        "term": "Language Model (LM)",
        "vn": "Mô hình ngôn ngữ",
        "def": "A probabilistic model assigning a probability P(W) to a sequence of words."
      },
      {
        "term": "N-gram",
        "vn": "Chuỗi N từ liên tiếp",
        "def": "A contiguous sequence of n items: Unigram (n=1), Bigram (n=2), Trigram (n=3)."
      },
      {
        "term": "Chain Rule of Probability",
        "vn": "Quy tắc nhân xác suất",
        "def": "Decomposing joint probability into conditional probabilities: P(w1...wn) = P(w1)P(w2|w1)...P(wn|w1...wn-1)."
      },
      {
        "term": "Markov Assumption",
        "vn": "Giả định Markov",
        "def": "Assuming the next word depends only on the preceding k words rather than entire past history."
      },
      {
        "term": "Maximum Likelihood Estimation (MLE)",
        "vn": "Ước lượng hợp lý cực đại",
        "def": "P(wn|wn-1) = Count(wn-1, wn) / Count(wn-1)."
      },
      {
        "term": "Perplexity (PP)",
        "vn": "Độ hỗn loạn / Bối rối",
        "def": "Reciprocal probability of the test set normalized by length: PP(W) = P(w1...wN)^(-1/N). Lower is better."
      },
      {
        "term": "Zero-Probability Problem",
        "vn": "Vấn đề xác suất bằng 0",
        "def": "If any test n-gram was unseen in training, MLE assigns P=0, causing entire sequence probability to collapse to 0."
      },
      {
        "term": "Laplace Smoothing (Add-1)",
        "vn": "Làm mịn Laplace",
        "def": "Adding 1 to all n-gram counts: P_Laplace = (Count + 1) / (Total_Count + |V|)."
      }
    ],
    "sections": [
      {
        "id": "ch2-sec1",
        "title": "1. Khái niệm Mô hình ngôn ngữ (Language Model) & Quy tắc nhân",
        "content_html": "\n<p><strong>Mô hình ngôn ngữ (Language Model - LM)</strong> là một mô hình toán học gán xác suất $P(W) = P(w_1, w_2, \\dots, w_n)$ cho một chuỗi các từ trong ngôn ngữ tự nhiên <a href=\"#ref-ch2-1\" class=\"cite-ref\" data-ref=\"ref-ch2-1\" title=\"Slide 3-4: Introduction to N-Gram Language Models\">[1]</a>.</p>\n<p>Theo <strong>Quy tắc nhân xác suất (Chain Rule of Probability)</strong>, xác suất đồng thời của một câu được khai triển chính xác thành:</p>\n<div class=\"formula-box\">\n  $$P(w_1^n) = \\prod_{k=1}^n P(w_k | w_1^{k-1})$$\n</div>\n<p><strong>Thách thức thực tế:</strong> Không thể lưu trữ và ước lượng chính xác xác suất có điều kiện trên toàn bộ lịch sử các từ phía trước vì kích thước lịch sử tăng theo cấp số nhân và dữ liệu luôn bị thưa thớt (Sparsity) <a href=\"#ref-ch2-2\" class=\"cite-ref\" data-ref=\"ref-ch2-2\" title=\"Slide 5-6: Unigrams and Bigrams\">[2]</a>.</p>\n"
      },
      {
        "id": "ch2-sec2",
        "title": "2. Giả định Markov & Mô hình N-Gram (Markov Assumption)",
        "content_html": "\n<p><strong>Giả định Markov (Markov Assumption)</strong> xấp xỉ xác suất của từ tiếp theo chỉ phụ thuộc vào $k$ từ ngay trước đó thay vì toàn bộ lịch sử <a href=\"#ref-ch2-3\" class=\"cite-ref\" data-ref=\"ref-ch2-3\" title=\"Slide 7-8: Language Models and Markov Assumption\">[3]</a>:</p>\n<ul>\n  <li><strong>Unigram ($N=1$):</strong> $P(w_1, \\dots, w_n) \\approx \\prod_{i=1}^n P(w_i)$.</li>\n  <li><strong>Bigram ($N=2$):</strong> $P(w_1, \\dots, w_n) \\approx \\prod_{i=1}^n P(w_i | w_{i-1})$.</li>\n  <li><strong>Trigram ($N=3$):</strong> $P(w_1, \\dots, w_n) \\approx \\prod_{i=1}^n P(w_i | w_{i-2}, w_{i-1})$.</li>\n</ul>\n<div class=\"formula-box\">\n  $$P_{\\text{MLE}}(w_i | w_{i-1}) = \\frac{\\text{Count}(w_{i-1}, w_i)}{\\text{Count}(w_{i-1})}$$\n</div>\n"
      },
      {
        "id": "ch2-sec3",
        "title": "3. Đánh giá mô hình bằng Perplexity & Kỹ thuật làm mịn (Smoothing)",
        "content_html": "\n<h4>Độ hỗn loạn (Perplexity - PP) <a href=\"#ref-ch2-4\" class=\"cite-ref\" data-ref=\"ref-ch2-4\" title=\"Slide 9-10: Evaluating Language Models & Perplexity\">[4]</a></h4>\n<div class=\"formula-box\">\n  $$PP(W) = P(w_1, w_2, \\dots, w_N)^{-\\frac{1}{N}} = \\sqrt[N]{\\frac{1}{P(w_1, w_2, \\dots, w_N)}}$$\n</div>\n<p><strong>Perplexity càng THẤP thì mô hình càng TỐT!</strong></p>\n\n<h4>Làm mịn Laplace (Add-1 Smoothing) <a href=\"#ref-ch2-5\" class=\"cite-ref\" data-ref=\"ref-ch2-5\" title=\"Slide 11-14: Generalization, Zeros & Smoothing\">[5]</a></h4>\n<p>Giải quyết vấn đề xác suất bằng 0 khi gặp từ chưa thấy trong tập train:</p>\n<div class=\"formula-box\">\n  $$P_{\\text{Laplace}}(w_i | w_{i-1}) = \\frac{\\text{Count}(w_{i-1}, w_i) + 1}{\\text{Count}(w_{i-1}) + |V|}$$\n</div>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch2-1",
        "index": 1,
        "slide": "Slide 3-4",
        "topic": "Introduction to N-Gram Language Models",
        "ppt": "02. N-Gram Language Models.ppt",
        "excerpt": "Language models assign probabilistic values to sequences of words to quantify syntactic and lexical likelihood."
      },
      {
        "id": "ref-ch2-2",
        "index": 2,
        "slide": "Slide 5-6",
        "topic": "Unigrams and Bigrams Definitions",
        "ppt": "02. N-Gram Language Models.ppt",
        "excerpt": "Unigrams analyze isolated word probabilities; Bigrams inspect joint sequential transitions of consecutive word pairs."
      },
      {
        "id": "ref-ch2-3",
        "index": 3,
        "slide": "Slide 7-8",
        "topic": "Markov Assumption & Probability Estimation",
        "ppt": "02. N-Gram Language Models.ppt",
        "excerpt": "Markov assumption bounds conditioning history to k previous tokens, rendering probabilistic estimation tractable via MLE."
      },
      {
        "id": "ref-ch2-4",
        "index": 4,
        "slide": "Slide 9-10",
        "topic": "Evaluating Language Models & Perplexity",
        "ppt": "02. N-Gram Language Models.ppt",
        "excerpt": "Perplexity computes geometric mean of inverse conditional likelihood; smaller perplexity corresponds to superior predictive confidence."
      },
      {
        "id": "ref-ch2-5",
        "index": 5,
        "slide": "Slide 11-14",
        "topic": "Generalization, Zeros and Laplace Smoothing",
        "ppt": "02. N-Gram Language Models.ppt",
        "excerpt": "Smoothing redistributes probability mass to unseen transitions, adding pseudo-counts (+1) adjusted by vocabulary cardinality |V|."
      }
    ]
  },
  {
    "id": 3,
    "title": "Chapter 3: Naive Bayes, Text Classification & Sentiment Analysis",
    "vn_title": "Phân loại văn bản, Phân tích cảm xúc & Bộ phân loại Naive Bayes",
    "ppt_file": "03. Naive Bayes - Text Classification and Sentiment.ppt",
    "slide_count": 19,
    "summary": "Phân loại văn bản có giám sát: Định lý Bayes, Giả định độc lập có điều kiện (Naive Independence Assumption), Tính toán Prior và Likelihood kết hợp làm mịn Laplace, Xử lý Underflow trong không gian Log, và các thước đo đánh giá Precision, Recall, F1.",
    "key_terms": [
      {
        "term": "Text Classification",
        "vn": "Phân loại văn bản",
        "def": "Assigning predefined categorical labels to input documents based on features."
      },
      {
        "term": "Sentiment Analysis",
        "vn": "Phân tích cảm xúc",
        "def": "Extracting subjective opinion polarity (Positive, Negative, Neutral) from text."
      },
      {
        "term": "Naive Bayes Classifier",
        "vn": "Bộ phân loại Naive Bayes",
        "def": "Generative probabilistic classifier applying Bayes' theorem with conditional independence assumption."
      },
      {
        "term": "Conditional Independence",
        "vn": "Độc lập có điều kiện",
        "def": "Assuming features are statistically independent given the target class label."
      },
      {
        "term": "Class Prior P(c)",
        "vn": "Xác suất tiên nghiệm của lớp",
        "def": "P(c) = Number of documents in class c / Total number of documents."
      },
      {
        "term": "Word Likelihood P(w|c)",
        "vn": "Xác suất khả dĩ của từ theo lớp",
        "def": "P(w|c) = (Count(w, c) + 1) / (Total_words_in_c + |V|)."
      },
      {
        "term": "Log Space Summation",
        "vn": "Cộng trong không gian log",
        "def": "Converting products of small probabilities to sums of log values to prevent floating-point underflow."
      },
      {
        "term": "F1-Score",
        "vn": "Điểm F1 cân bằng",
        "def": "Harmonic mean of Precision and Recall: F1 = 2 * (P * R) / (P + R)."
      }
    ],
    "sections": [
      {
        "id": "ch3-sec1",
        "title": "1. Bài toán Phân loại văn bản & Định lý Bayes (Bayes' Theorem)",
        "content_html": "\n<p>Mục tiêu là tìm lớp $\\hat{c} \\in C$ tối ưu cho một văn bản $d = (w_1, \\dots, w_n)$ <a href=\"#ref-ch3-1\" class=\"cite-ref\" data-ref=\"ref-ch3-1\" title=\"Slide 3-4: Text Classification Overview\">[1]</a>:</p>\n<div class=\"formula-box\">\n  $$\\hat{c} = \\arg\\max_{c \\in C} P(c | d) = \\arg\\max_{c \\in C} P(d | c) P(c)$$\n</div>\n"
      },
      {
        "id": "ch3-sec2",
        "title": "2. Giả định Naive Bayes & Ước lượng tham số (Training)",
        "content_html": "\n<p><strong>Giả định độc lập có điều kiện:</strong> <a href=\"#ref-ch3-2\" class=\"cite-ref\" data-ref=\"ref-ch3-2\" title=\"Slide 5-8: Naive Bayes Formulation\">[2]</a></p>\n<div class=\"formula-box\">\n  $$P(d | c) = \\prod_{i=1}^n P(w_i | c)$$\n</div>\n<p>Prior $P(c) = N_c / N_{\\text{total}}$ và Word Likelihood với Laplace Smoothing <a href=\"#ref-ch3-3\" class=\"cite-ref\" data-ref=\"ref-ch3-3\" title=\"Slide 9-12: Parameter Estimation & Laplace\">[3]</a>:</p>\n<div class=\"formula-box\">\n  $$P(w | c) = \\frac{\\text{count}(w, c) + 1}{\\sum_{w' \\in V} \\text{count}(w', c) + |V|}$$\n</div>\n<div class=\"callout callout-warning\">\n  <h4>Tránh Underflow bằng Log-Space</h4>\n  $$\\hat{c} = \\arg\\max_{c \\in C} \\left[ \\log P(c) + \\sum_{i=1}^n \\log P(w_i | c) \\right]$$\n</div>\n"
      },
      {
        "id": "ch3-sec3",
        "title": "3. Đánh giá chất lượng phân loại (Evaluation Metrics)",
        "content_html": "\n<p>Dựa trên Confusion Matrix <a href=\"#ref-ch3-4\" class=\"cite-ref\" data-ref=\"ref-ch3-4\" title=\"Slide 16: Evaluation Metrics\">[4]</a>:</p>\n<ul>\n  <li><strong>Precision:</strong> $TP / (TP + FP)$</li>\n  <li><strong>Recall:</strong> $TP / (TP + FN)$</li>\n  <li><strong>F1-Score:</strong> $2 \\times (P \\times R) / (P + R)$</li>\n</ul>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch3-1",
        "index": 1,
        "slide": "Slide 3-4",
        "topic": "Text Classification Task Definition",
        "ppt": "03. Naive Bayes - Text Classification and Sentiment.ppt",
        "excerpt": "Supervised categorization mapping input document features to a finite discrete label space C."
      },
      {
        "id": "ref-ch3-2",
        "index": 2,
        "slide": "Slide 5-8",
        "topic": "Naive Bayes Algorithm and Independence Assumption",
        "ppt": "03. Naive Bayes - Text Classification and Sentiment.ppt",
        "excerpt": "Bayes' decision rule decomposed into class prior and product of feature conditional likelihoods."
      },
      {
        "id": "ref-ch3-3",
        "index": 3,
        "slide": "Slide 9-12",
        "topic": "Parameter Estimation & Laplace Smoothing",
        "ppt": "03. Naive Bayes - Text Classification and Sentiment.ppt",
        "excerpt": "MLE parameter computation with Add-1 smoothing to guarantee nonzero probabilities for rare tokens."
      },
      {
        "id": "ref-ch3-4",
        "index": 4,
        "slide": "Slide 16",
        "topic": "Evaluation Metrics: Precision, Recall, F1",
        "ppt": "03. Naive Bayes - Text Classification and Sentiment.ppt",
        "excerpt": "Quantifying classification accuracy via Confusion Matrix, Precision, Recall, and harmonic F1 metric."
      }
    ]
  },
  {
    "id": 4,
    "title": "Chapter 4: Logistic Regression",
    "vn_title": "Hồi quy Logistic, Hàm Sigmoid & Tối ưu hóa phân loại văn bản",
    "ppt_file": "04. Logistic Regression.ppt",
    "slide_count": 28,
    "summary": "Mô hình phân loại phân biệt có giám sát (Discriminative Classifier): Hàm kích hoạt Sigmoid, Tỉ số chênh Log-Odds/Logit, Hàm mất mát Cross-Entropy (Negative Log-Likelihood), Thuật toán Gradient Descent, Ranh giới quyết định (Decision Boundary) và Kỹ thuật điều chuẩn L1/L2 Regularization.",
    "key_terms": [
      {
        "term": "Logistic Regression",
        "vn": "Hồi quy Logistic",
        "def": "A discriminative supervised learning algorithm modeling P(y=1|x) via linear combinations squashed by a sigmoid function."
      },
      {
        "term": "Sigmoid Activation",
        "vn": "Hàm kích hoạt Sigmoid",
        "def": "sigma(z) = 1 / (1 + e^(-z)); squashes any real value into the probabilistic range (0, 1)."
      },
      {
        "term": "Log-Odds / Logit",
        "vn": "Log tỉ số chênh (Logit)",
        "def": "ln(p / (1-p)) = w^T * x + b; establishes the linear relationship in log-odds space."
      },
      {
        "term": "Cross-Entropy Loss",
        "vn": "Hàm mất mát Cross-Entropy",
        "def": "Loss = - [y * log(p) + (1-y) * log(1-p)]; convex objective for maximum likelihood estimation."
      },
      {
        "term": "Gradient Descent",
        "vn": "Thuật toán hạ độ dốc",
        "def": "Iterative optimization rule: w := w - alpha * grad(Loss) updating parameters opposite the gradient."
      },
      {
        "term": "Decision Boundary",
        "vn": "Ranh giới quyết định",
        "def": "The hyperplane w^T * x + b = 0 where P(y=1|x) = 0.5 separating classes."
      },
      {
        "term": "L2 Regularization (Ridge)",
        "vn": "Chính quy hóa L2 (Ridge)",
        "def": "Adds (lambda / 2) * sum(w_i^2) to penalize extreme parameter values and prevent overfitting."
      },
      {
        "term": "L1 Regularization (Lasso)",
        "vn": "Chính quy hóa L1 (Lasso)",
        "def": "Adds lambda * sum(|w_i|) to promote parameter sparsity, setting non-essential weights to 0."
      }
    ],
    "sections": [
      {
        "id": "ch4-sec1",
        "title": "1. Bản chất mô hình phân biệt & Hàm kích hoạt Sigmoid",
        "content_html": "\n<p><strong>Logistic Regression</strong> trực tiếp mô hình hóa xác suất có điều kiện $P(y=1|x)$ <a href=\"#ref-ch4-1\" class=\"cite-ref\" data-ref=\"ref-ch4-1\" title=\"Slide 3-4: Introduction to Logistic Regression\">[1]</a>.</p>\n<h4>Hàm kích hoạt Sigmoid <a href=\"#ref-ch4-2\" class=\"cite-ref\" data-ref=\"ref-ch4-2\" title=\"Slide 5-8: Sigmoid Function\">[2]</a></h4>\n<div class=\"formula-box\">\n  $$\\sigma(z) = \\frac{1}{1 + e^{-z}} = \\frac{e^z}{1 + e^z}$$\n</div>\n<p>Đạo hàm: $\\sigma'(z) = \\sigma(z)(1 - \\sigma(z))$.</p>\n"
      },
      {
        "id": "ch4-sec2",
        "title": "2. Phương trình Logistic Regression & Không gian Log-Odds (Logit)",
        "content_html": "\n<p>Xác suất dự đoán: <a href=\"#ref-ch4-3\" class=\"cite-ref\" data-ref=\"ref-ch4-3\" title=\"Slide 9-11: Logistic Regression Equation\">[3]</a></p>\n<div class=\"formula-box\">\n  $$P(y=1 | \\mathbf{x}) = \\sigma(\\mathbf{w}^T \\mathbf{x} + b) = \\frac{1}{1 + e^{-(\\mathbf{w}^T \\mathbf{x} + b)}}$$\n  $$\\ln\\left( \\frac{P(y=1 | \\mathbf{x})}{P(y=0 | \\mathbf{x})} \\right) = \\mathbf{w}^T \\mathbf{x} + b$$\n</div>\n"
      },
      {
        "id": "ch4-sec3",
        "title": "3. Hàm mất mát Cross-Entropy & Thuật toán Gradient Descent",
        "content_html": "\n<p>Hàm mất mát <strong>Binary Cross-Entropy Loss (Log Loss)</strong> <a href=\"#ref-ch4-4\" class=\"cite-ref\" data-ref=\"ref-ch4-4\" title=\"Slide 12-17: Training Logistic Regression\">[4]</a>:</p>\n<div class=\"formula-box\">\n  $$J(\\mathbf{w}, b) = - \\frac{1}{N} \\sum_{i=1}^N \\left[ y^{(i)} \\log(\\hat{y}^{(i)}) + (1 - y^{(i)}) \\log(1 - \\hat{y}^{(i)}) \\right]$$\n  $$w_j := w_j - \\alpha \\frac{\\partial J}{\\partial w_j}$$\n</div>\n"
      },
      {
        "id": "ch4-sec4",
        "title": "4. Ranh giới quyết định (Decision Boundary) & Regularization",
        "content_html": "\n<p>Ranh giới quyết định tại $\\mathbf{w}^T \\mathbf{x} + b = 0$ <a href=\"#ref-ch4-5\" class=\"cite-ref\" data-ref=\"ref-ch4-5\" title=\"Slide 18-21: Decision Boundary\">[5]</a>.</p>\n<h4>L1 vs L2 Regularization <a href=\"#ref-ch4-6\" class=\"cite-ref\" data-ref=\"ref-ch4-6\" title=\"Slide 22-25: Regularization L1 and L2\">[6]</a>:</h4>\n<ul>\n  <li><strong>L2 (Ridge):</strong> Phạt $(\\lambda/2) \\sum w_j^2$, kéo trọng số nhỏ đều, không triệt tiêu về 0.</li>\n  <li><strong>L1 (Lasso):</strong> Phạt $\\lambda \\sum |w_j|$, tạo độ thưa (Sparsity), triệt tiêu các trọng số rác về đúng 0 (Feature Selection).</li>\n</ul>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch4-1",
        "index": 1,
        "slide": "Slide 3-4",
        "topic": "Introduction to Logistic Regression",
        "ppt": "04. Logistic Regression.ppt",
        "excerpt": "Discriminative probabilistic binary classification directly modeling class posterior distribution."
      },
      {
        "id": "ref-ch4-2",
        "index": 2,
        "slide": "Slide 5-8",
        "topic": "Sigmoid (Logistic) Function Properties",
        "ppt": "04. Logistic Regression.ppt",
        "excerpt": "Sigmoid squashes linear real combinations into range (0, 1) with symmetric derivative sigma*(1-sigma)."
      },
      {
        "id": "ref-ch4-3",
        "index": 3,
        "slide": "Slide 9-11",
        "topic": "Logistic Regression Equation & Log-Odds",
        "ppt": "04. Logistic Regression.ppt",
        "excerpt": "Logit transformation equates the log-odds ratio directly to the linear feature combination."
      },
      {
        "id": "ref-ch4-4",
        "index": 4,
        "slide": "Slide 12-17",
        "topic": "Training Logistic Regression & Cross-Entropy Loss",
        "ppt": "04. Logistic Regression.ppt",
        "excerpt": "Gradient descent minimizes negative log-likelihood (Cross-Entropy) via residual-scaled feature gradients."
      },
      {
        "id": "ref-ch4-5",
        "index": 5,
        "slide": "Slide 18-21",
        "topic": "Decision Boundary Analysis",
        "ppt": "04. Logistic Regression.ppt",
        "excerpt": "Linear hyperplane defined by w^T*x + b = 0 separating positive and negative classification regions."
      },
      {
        "id": "ref-ch4-6",
        "index": 6,
        "slide": "Slide 22-25",
        "topic": "Regularization Techniques: L1 vs L2",
        "ppt": "04. Logistic Regression.ppt",
        "excerpt": "L2 Ridge shrinks weights smoothly; L1 Lasso drives uninformative feature weights to strict zero sparsity."
      }
    ]
  },
  {
    "id": 5,
    "title": "Chapter 5: Vector Semantics and Embeddings",
    "vn_title": "Ngữ nghĩa học véc-tơ & Nhúng từ (Word Embeddings)",
    "ppt_file": "05. Vector Semantics and Embeddings.ppt",
    "slide_count": 29,
    "summary": "Biểu diễn ngữ nghĩa bằng không gian véc-tơ: Giả thuyết phân phối (Distributional Hypothesis), Ma trận Term-Document, Trọng số TF-IDF và PPMI, Độ đo tương đồng Cosine Similarity, Mô hình Word2Vec (CBOW vs Skip-Gram), Phương pháp lấy mẫu âm tính (Negative Sampling) và GloVe.",
    "key_terms": [
      {
        "term": "Vector Semantics",
        "vn": "Ngữ nghĩa học véc-tơ",
        "def": "Representing words as points/vectors in high-dimensional semantic spaces."
      },
      {
        "term": "Distributional Hypothesis",
        "vn": "Giả thuyết phân phối",
        "def": "Firth (1957): 'You shall know a word by the company it keeps' — similar contexts imply similar meanings."
      },
      {
        "term": "TF-IDF Weighting",
        "vn": "Trọng số TF-IDF",
        "def": "TF(t,d) * log(N / DF(t)); balances word frequency in a document with overall corpus rarity."
      },
      {
        "term": "Cosine Similarity",
        "vn": "Độ tương đồng Cosine",
        "def": "Normalized dot product measuring directional alignment between vectors, invariant to text length."
      },
      {
        "term": "Pointwise Mutual Information (PPMI)",
        "vn": "Thông tin tương hỗ điểm dương",
        "def": "PPMI(w,c) = max(0, log(P(w,c) / (P(w)*P(c)))); measures non-random co-occurrence association."
      },
      {
        "term": "Word2Vec",
        "vn": "Mô hình nhúng từ Word2Vec",
        "def": "Neural embedding algorithm learning dense vectors: Continuous Bag-of-Words (CBOW) and Skip-gram."
      },
      {
        "term": "CBOW Architecture",
        "vn": "Kiến trúc CBOW",
        "def": "Predicts target central word given surrounding context words; fast and smooth on frequent words."
      },
      {
        "term": "Skip-Gram Architecture",
        "vn": "Kiến trúc Skip-Gram",
        "def": "Predicts surrounding context words given target center word; excels on rare words and smaller corpora."
      },
      {
        "term": "Negative Sampling (SGNS)",
        "vn": "Lấy mẫu âm tính",
        "def": "Reformulates multi-class softmax into binary classification distinguishing true context from k noise words."
      },
      {
        "term": "GloVe",
        "vn": "Mô hình GloVe",
        "def": "Global Vectors for Word Representation; factorizes the global log co-occurrence matrix via weighted least squares."
      }
    ],
    "sections": [
      {
        "id": "ch5-sec1",
        "title": "1. Giả thuyết phân phối & Biểu diễn từ vựng (Vector Semantics)",
        "content_html": "\n<p><strong>Distributional Hypothesis (Firth, 1957):</strong> <em>\"You shall know a word by the company it keeps\"</em> <a href=\"#ref-ch5-1\" class=\"cite-ref\" data-ref=\"ref-ch5-1\" title=\"Slide 3-8: Vector Semantics & Word Embeddings\">[1]</a>.</p>\n<p>Dense Word Embeddings (100-300 chiều) giải quyết hạn chế thưa thớt và trực giao của One-Hot Encoding <a href=\"#ref-ch5-2\" class=\"cite-ref\" data-ref=\"ref-ch5-2\" title=\"Slide 9-13: Distributed Representations\">[2]</a>.</p>\n"
      },
      {
        "id": "ch5-sec2",
        "title": "2. Trọng số TF-IDF & Độ tương đồng Cosine Similarity",
        "content_html": "\n<h4>TF-IDF & Cosine Similarity <a href=\"#ref-ch5-3\" class=\"cite-ref\" data-ref=\"ref-ch5-3\" title=\"Slide 14-17: Weighting & Similarity\">[3]</a></h4>\n<div class=\"formula-box\">\n  $$\\text{TF-IDF}(t, d, D) = \\text{TF}(t, d) \\times \\log\\left( \\frac{N}{\\text{DF}(t)} \\right)$$\n  $$\\cos(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}$$\n</div>\n"
      },
      {
        "id": "ch5-sec3",
        "title": "3. Mô hình Word2Vec: CBOW vs. Skip-Gram & Negative Sampling",
        "content_html": "\n<p>Word2Vec (Mikolov et al., 2013) <a href=\"#ref-ch5-4\" class=\"cite-ref\" data-ref=\"ref-ch5-4\" title=\"Slide 18-21: Training Word Embeddings\">[4]</a>:</p>\n<ul>\n  <li><strong>CBOW:</strong> Ngữ cảnh $\\to$ Từ trung tâm (Nhanh hơn, tốt cho từ phổ biến).</li>\n  <li><strong>Skip-Gram:</strong> Từ trung tâm $\\to$ Ngữ cảnh (Rất tốt cho từ hiếm).</li>\n</ul>\n<p>Negative Sampling chuyển bài toán thành logistic nhị phân chống lại $k$ mẫu nhiễu <a href=\"#ref-ch5-5\" class=\"cite-ref\" data-ref=\"ref-ch5-5\" title=\"Slide 22-26: Semantic Relationships & Limitations\">[5]</a>. Số học vector: $\\vec{v}_{\\text{King}} - \\vec{v}_{\\text{Man}} + \\vec{v}_{\\text{Woman}} \\approx \\vec{v}_{\\text{Queen}}$.</p>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch5-1",
        "index": 1,
        "slide": "Slide 3-8",
        "topic": "Vector Semantics & Word Embeddings",
        "ppt": "05. Vector Semantics and Embeddings.ppt",
        "excerpt": "Distributional hypothesis establishes semantic vectors derived from linguistic neighborhood contexts."
      },
      {
        "id": "ref-ch5-2",
        "index": 2,
        "slide": "Slide 9-13",
        "topic": "Distributed Representations vs Sparse Vectors",
        "ppt": "05. Vector Semantics and Embeddings.ppt",
        "excerpt": "Dense low-dimensional continuous embeddings overcome one-hot dimensionality curse and orthogonality."
      },
      {
        "id": "ref-ch5-3",
        "index": 3,
        "slide": "Slide 14-17",
        "topic": "TF-IDF Weighting & Cosine Similarity",
        "ppt": "05. Vector Semantics and Embeddings.ppt",
        "excerpt": "TF-IDF suppresses ubiquitously uninformative terms; Cosine evaluates angle normalization invariant to document size."
      },
      {
        "id": "ref-ch5-4",
        "index": 4,
        "slide": "Slide 18-21",
        "topic": "Training Word Embeddings: CBOW and Skip-Gram",
        "ppt": "05. Vector Semantics and Embeddings.ppt",
        "excerpt": "Two-layer neural architectures learning representations: CBOW predicts center token; Skip-gram predicts context window."
      },
      {
        "id": "ref-ch5-5",
        "index": 5,
        "slide": "Slide 22-26",
        "topic": "Semantic Relationships & GloVe Factorization",
        "ppt": "05. Vector Semantics and Embeddings.ppt",
        "excerpt": "Linear vector offsets represent morphological and semantic analogies; GloVe factorizes global log co-occurrences."
      }
    ]
  },
  {
    "id": 6,
    "title": "Chapter 6: Clustering for Text Similarity",
    "vn_title": "Gom cụm văn bản theo độ tương đồng (Text Clustering)",
    "ppt_file": "06. Clustering for Text Similarity.ppt",
    "slide_count": 28,
    "summary": "Học máy không giám sát cho văn bản: Tổng quan Text Clustering, Các độ đo khoảng cách, Thuật toán phân hoạch K-Means, Thuật toán gom cụm phân cấp (Hierarchical Clustering), Phân tích Dendrogram, và Phương pháp đánh giá cụm (Elbow Method & Silhouette Analysis).",
    "key_terms": [
      {
        "term": "Unsupervised Clustering",
        "vn": "Gom cụm không giám sát",
        "def": "Grouping unannotated documents such that within-cluster similarity is maximized and between-cluster similarity is minimized."
      },
      {
        "term": "K-Means Clustering",
        "vn": "Gom cụm K-Means",
        "def": "Iterative partitioning assigning documents to the nearest cluster centroid and updating centroids."
      },
      {
        "term": "Cluster Centroid",
        "vn": "Tâm cụm",
        "def": "The mean coordinate vector of all points currently assigned to that cluster."
      },
      {
        "term": "Hierarchical Clustering (HAC)",
        "vn": "Gom cụm phân cấp",
        "def": "Agglomerative (bottom-up) tree construction producing a multi-level hierarchy of clusters."
      },
      {
        "term": "Linkage Criteria",
        "vn": "Tiêu chuẩn liên kết cụm",
        "def": "Rules measuring distance between clusters: Single (min), Complete (max), Average (mean), Ward's (minimum variance)."
      },
      {
        "term": "Dendrogram",
        "vn": "Biểu đồ cây phân cấp",
        "def": "Tree diagram visualizing hierarchical clustering merges and corresponding distance thresholds."
      },
      {
        "term": "Elbow Method",
        "vn": "Phương pháp điểm uốn khuỷu tay",
        "def": "Plotting WCSS vs K to determine optimal cluster count where reduction rate decelerates."
      },
      {
        "term": "Silhouette Coefficient",
        "vn": "Hệ số Silhouette",
        "def": "s = (b - a) / max(a, b); ranges from -1 to +1 measuring cohesion versus separation."
      }
    ],
    "sections": [
      {
        "id": "ch6-sec1",
        "title": "1. Tổng quan Gom cụm văn bản & Các thước đo khoảng cách",
        "content_html": "\n<p><strong>Text Clustering</strong> phân cụm văn bản không giám sát <a href=\"#ref-ch6-1\" class=\"cite-ref\" data-ref=\"ref-ch6-1\" title=\"Slide 3-6: Clustering Overview\">[1]</a>.</p>\n<p>Khoảng cách: Cosine Distance ($1 - \\cos$), Euclidean (L2), Manhattan (L1) <a href=\"#ref-ch6-2\" class=\"cite-ref\" data-ref=\"ref-ch6-2\" title=\"Slide 7-9: Distance Metrics for Text\">[2]</a>.</p>\n"
      },
      {
        "id": "ch6-sec2",
        "title": "2. Thuật toán K-Means Clustering",
        "content_html": "\n<p>Quy trình lặp K-Means: Khởi tạo $K$ tâm cụm $\\to$ Gán văn bản vào tâm gần nhất $\\to$ Cập nhật lại tọa độ tâm bằng trung bình cộng $\\to$ Lặp đến khi hội tụ <a href=\"#ref-ch6-3\" class=\"cite-ref\" data-ref=\"ref-ch6-3\" title=\"Slide 10-12: K-Means Clustering\">[3]</a>.</p>\n"
      },
      {
        "id": "ch6-sec3",
        "title": "3. Gom cụm phân cấp (Hierarchical Clustering) & Đánh giá cụm",
        "content_html": "\n<p>HAC (Agglomerative) tiếp cận từ dưới lên hiển thị qua Dendrogram <a href=\"#ref-ch6-4\" class=\"cite-ref\" data-ref=\"ref-ch6-4\" title=\"Slide 13-16: Hierarchical Clustering\">[4]</a>.</p>\n<p>Tiêu chí liên kết: Single (min), Complete (max), Average, Ward's method. Đánh giá: Elbow method trên đồ thị WCSS và Hệ số Silhouette $s \\in [-1, +1]$ <a href=\"#ref-ch6-5\" class=\"cite-ref\" data-ref=\"ref-ch6-5\" title=\"Slide 17-25: Cluster Evaluation\">[5]</a>.</p>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch6-1",
        "index": 1,
        "slide": "Slide 3-6",
        "topic": "Clustering Overview & Objectives",
        "ppt": "06. Clustering for Text Similarity.ppt",
        "excerpt": "Unsupervised partitioning discovering latent thematic document groupings without labeled training signals."
      },
      {
        "id": "ref-ch6-2",
        "index": 2,
        "slide": "Slide 7-9",
        "topic": "Distance & Similarity Metrics for Text",
        "ppt": "06. Clustering for Text Similarity.ppt",
        "excerpt": "Comparing Cosine distance against Euclidean norm under sparse high-dimensional TF-IDF vectors."
      },
      {
        "id": "ref-ch6-3",
        "index": 3,
        "slide": "Slide 10-12",
        "topic": "K-Means Clustering Algorithm Mechanics",
        "ppt": "06. Clustering for Text Similarity.ppt",
        "excerpt": "Alternating assignment and centroid update steps minimizing sum of squared Euclidean deviations."
      },
      {
        "id": "ref-ch6-4",
        "index": 4,
        "slide": "Slide 13-16",
        "topic": "Hierarchical Clustering & Linkage Types",
        "ppt": "06. Clustering for Text Similarity.ppt",
        "excerpt": "Agglomerative tree construction utilizing Single, Complete, Average, and Ward minimum variance criteria."
      },
      {
        "id": "ref-ch6-5",
        "index": 5,
        "slide": "Slide 17-25",
        "topic": "Evaluation: Elbow Method & Silhouette Analysis",
        "ppt": "06. Clustering for Text Similarity.ppt",
        "excerpt": "Selecting optimal K via inflection points in WCSS and intra-cluster cohesion vs inter-cluster separation."
      }
    ]
  },
  {
    "id": 7,
    "title": "Chapter 7: Transformer and Pre-Trained Language Models",
    "vn_title": "Kiến trúc Transformer & Các mô hình ngôn ngữ huấn luyện trước",
    "ppt_file": "07. Transformer and Pre-Tranined Language Models.ppt",
    "slide_count": 25,
    "summary": "Cách mạng kiến trúc xử lý tuần tự: Hạn chế của RNN/LSTM, Cơ chế Self-Attention (Tự chú ý), Bộ ba véc-tơ Query-Key-Value, Tích vô hướng tỉ lệ hóa (Scaled Dot-Product), Cơ chế chú ý đa đầu (Multi-Head Attention), Mã hóa vị trí (Positional Encoding) và Tổng quan các mô hình ngôn ngữ nền tảng.",
    "key_terms": [
      {
        "term": "Transformer",
        "vn": "Kiến trúc Transformer",
        "def": "Attention-based sequence architecture discarding recurrence for parallel computation (Vaswani et al., 2017)."
      },
      {
        "term": "Self-Attention",
        "vn": "Cơ chế tự chú ý",
        "def": "Mechanism relating tokens within the same sequence to compute context-aware representations."
      },
      {
        "term": "Queries, Keys, Values (Q, K, V)",
        "vn": "Truy vấn, Khóa, Giá trị",
        "def": "Linear projections: Query (probe), Key (indexer), Value (information content)."
      },
      {
        "term": "Scaled Dot-Product",
        "vn": "Tích vô hướng tỉ lệ hóa",
        "def": "Dividing Q*K^T by sqrt(d_k) to prevent extreme values and vanishing gradients in softmax."
      },
      {
        "term": "Multi-Head Attention",
        "vn": "Cơ chế chú ý đa đầu",
        "def": "Projecting queries, keys, and values h times into lower-dimensional subspaces to attend to diverse features."
      },
      {
        "term": "Positional Encoding",
        "vn": "Mã hóa vị trí",
        "def": "Injecting sequence order into token embeddings using fixed sinusoidal formulas or learned vectors."
      },
      {
        "term": "Layer Normalization & Residuals",
        "vn": "Chuẩn hóa tầng & Kết nối phần dư",
        "def": "LayerNorm(x + Sublayer(x)); prevents vanishing gradients and accelerates deep convergence."
      }
    ],
    "sections": [
      {
        "id": "ch7-sec1",
        "title": "1. Động lực ra đời Transformer & Điểm nghẽn của RNN/LSTM",
        "content_html": "\n<p>Trước năm 2017, các mạng nơ-ron hồi quy (RNN, LSTM, GRU) thống trị lĩnh vực NLP. Tuy nhiên, kiến trúc tuần tự của RNN gặp 2 hạn chế chí mạng <a href=\"#ref-ch7-1\" class=\"cite-ref\" data-ref=\"ref-ch7-1\" title=\"Slide 3-7: Motivation for Transformer\">[1]</a>:</p>\n<ol>\n  <li><strong>Điểm nghẽn tuần tự (Sequential Bottleneck):</strong> Để tính trạng thái ẩn $h_t$, RNN bắt buộc phải đợi tính xong $h_{t-1}$. Điều này <strong>hoàn toàn ngăn cản việc tính toán song song (Parallelization)</strong> trên phần cứng GPU hiện đại, khiến việc huấn luyện trên các tập dữ liệu khổng lồ là bất khả thi.</li>\n  <li><strong>Suy hao phụ thuộc xa (Long-term Dependency Loss):</strong> Dù LSTM có thêm các cổng (Gates), thông tin ngữ nghĩa vẫn phải bị nén tuần tự qua từng bước thời gian, dẫn đến hiện tượng trôi dạt thông tin khi câu quá dài.</li>\n</ol>\n<p>Kiến trúc <strong>Transformer (Vaswani et al., 2017 - \"Attention Is All You Need\")</strong> loại bỏ hoàn toàn cấu trúc hồi quy, cho phép xử lý toàn bộ các từ trong câu cùng một lúc nhờ cơ chế <em>Self-Attention</em>.</p>\n"
      },
      {
        "id": "ch7-sec2",
        "title": "2. Cơ chế Self-Attention: Bộ ba vector Q, K, V & Scaled Dot-Product",
        "content_html": "\n<h4>Bộ ba vector Query - Key - Value ($Q, K, V$) <a href=\"#ref-ch7-2\" class=\"cite-ref\" data-ref=\"ref-ch7-2\" title=\"Slide 8-12: Architecture & Self-Attention\">[2]</a></h4>\n<p>Với mỗi vector nhúng từ $x_i$, mô hình nhân với 3 ma trận trọng số học được $W^Q, W^K, W^V$ để tạo ra 3 vector tương ứng:</p>\n<ul>\n  <li><strong>Query ($q_i$):</strong> Đại diện cho từ hiện tại đang đóng vai trò \"người hỏi\" (tìm kiếm thông tin ngữ cảnh liên quan).</li>\n  <li><strong>Key ($k_j$):</strong> Đóng vai trò \"nhãn định danh\" của các từ khác trong câu.</li>\n  <li><strong>Value ($v_j$):</strong> Chứa đựng thông tin ngữ nghĩa thực chất của từ đó.</li>\n</ul>\n\n<h4>Công thức tính Scaled Dot-Product Attention <a href=\"#ref-ch7-3\" class=\"cite-ref\" data-ref=\"ref-ch7-3\" title=\"Slide 13-15: Scaled Dot-Product Formula\">[3]</a></h4>\n<div class=\"formula-box\">\n  $$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V$$\n</div>\n<div class=\"callout callout-warning\">\n  <h4>Tại sao phải chia cho $\\sqrt{d_k}$ (Scaling Factor)?</h4>\n  <p>Khi số chiều $d_k$ lớn, tích vô hướng $Q K^T$ có thể nhận giá trị rất lớn về độ lớn. Khi đưa vào hàm Softmax, giá trị lớn sẽ đẩy hàm vào vùng bão hòa, dẫn đến <strong>đạo hàm cực kỳ nhỏ (Vanishing Gradients)</strong> khiến mô hình ngừng học. Chia cho $\\sqrt{d_k}$ giúp phương sai của tích vô hướng luôn duy trì ổn định quanh giá trị 1.</p>\n</div>\n"
      },
      {
        "id": "ch7-sec3",
        "title": "3. Multi-Head Attention & Positional Encoding",
        "content_html": "\n<h4>Cơ chế chú ý đa đầu (Multi-Head Attention) <a href=\"#ref-ch7-4\" class=\"cite-ref\" data-ref=\"ref-ch7-4\" title=\"Slide 16-19: Multi-Head & Positional Encoding\">[4]</a></h4>\n<p>Thay vì chỉ thực hiện một phép Attention duy nhất trên không gian $d_{\\text{model}}$, mô hình chiếu $Q, K, V$ vào $h$ không gian con chiều thấp hơn ($d_k = d_{\\text{model}} / h$) và tính Attention song song:</p>\n<div class=\"formula-box\">\n  $$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$$\n  $$\\text{head}_i = \\text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$$\n</div>\n<p><strong>Lợi ích:</strong> Cho phép mô hình đồng thời chú ý đến thông tin ở các khía cạnh ngữ pháp và ngữ nghĩa khác nhau (ví dụ: head 1 theo dõi chủ ngữ - vị ngữ, head 2 theo dõi quan hệ đại từ thay thế, head 3 theo dõi cụm giới từ).</p>\n\n<h4>Mã hóa vị trí (Positional Encoding)</h4>\n<p>Vì Transformer xử lý các từ song song không theo thứ tự thời gian, mô hình hoàn toàn không phân biệt được câu <em>\"Mèo đuổi chuột\"</em> và <em>\"Chuột đuổi mèo\"</em> nếu không có thông tin thứ tự. Positional Encoding cộng thêm một vector biểu diễn vị trí vào vector nhúng từ ban đầu:</p>\n<div class=\"formula-box\">\n  $$PE_{(pos, 2i)} = \\sin\\left( \\frac{pos}{10000^{2i / d_{\\text{model}}}} \\right)$$\n  $$PE_{(pos, 2i+1)} = \\cos\\left( \\frac{pos}{10000^{2i / d_{\\text{model}}}} \\right)$$\n</div>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch7-1",
        "index": 1,
        "slide": "Slide 3-7",
        "topic": "Motivation for Transformer & RNN Limits",
        "ppt": "07. Transformer and Pre-Tranined Language Models.ppt",
        "excerpt": "Overcoming sequential RNN bottlenecks and vanishing gradients via parallel attention mechanisms."
      },
      {
        "id": "ref-ch7-2",
        "index": 2,
        "slide": "Slide 8-12",
        "topic": "Transformer Architecture & Layer Stack",
        "ppt": "07. Transformer and Pre-Tranined Language Models.ppt",
        "excerpt": "Encoder-decoder layout with residual connections and layer normalization enclosing multi-head blocks."
      },
      {
        "id": "ref-ch7-3",
        "index": 3,
        "slide": "Slide 13-15",
        "topic": "Self-Attention Mechanism & Scaling",
        "ppt": "07. Transformer and Pre-Tranined Language Models.ppt",
        "excerpt": "Scaled dot-product attention formula dividing by sqrt(d_k) to prevent softmax gradient saturation."
      },
      {
        "id": "ref-ch7-4",
        "index": 4,
        "slide": "Slide 16-19",
        "topic": "Multi-Head Attention & Positional Encoding",
        "ppt": "07. Transformer and Pre-Tranined Language Models.ppt",
        "excerpt": "Parallel multi-head representation subspaces and sinusoidal positional vectors injecting order information."
      }
    ]
  },
  {
    "id": 8,
    "title": "Chapter 8: Fine-Tuning and Masked Language Models",
    "vn_title": "Tinh chỉnh mô hình (Fine-Tuning) & Mô hình ngôn ngữ che mặt nạ (MLM)",
    "ppt_file": "08. Fine-Tuning and Masked Language Models.ppt",
    "slide_count": 27,
    "summary": "Chiến lược Transfer Learning trong NLP: Huấn luyện trước (Pre-Training) vs Tinh chỉnh (Fine-Tuning), Kiến trúc BERT, Mục tiêu học Masked Language Model (MLM) và Next Sentence Prediction (NSP), Token đặc biệt [CLS] và [SEP], cùng các kỹ thuật áp dụng cho tác vụ hạ nguồn.",
    "key_terms": [
      {
        "term": "Pre-Training & Fine-Tuning",
        "vn": "Huấn luyện trước & Tinh chỉnh",
        "def": "Self-supervised pre-training on unlabeled text followed by supervised task-specific fine-tuning."
      },
      {
        "term": "BERT (Devlin et al., 2018)",
        "vn": "Mô hình BERT",
        "def": "Bidirectional Encoder Representations from Transformers trained on MLM and NSP."
      },
      {
        "term": "Masked Language Model (MLM)",
        "vn": "Mô hình ngôn ngữ che mặt nạ",
        "def": "Masking 15% of input tokens and predicting them using full bidirectional context."
      },
      {
        "term": "Special Tokens ([CLS], [SEP])",
        "vn": "Token đặc biệt",
        "def": "[CLS] aggregates sequence-level representation; [SEP] demarcates sentence boundaries."
      },
      {
        "term": "Next Sentence Prediction (NSP)",
        "vn": "Dự đoán câu kế tiếp",
        "def": "Binary classification objective predicting if Sentence B logically follows Sentence A."
      },
      {
        "term": "Downstream Classification Head",
        "vn": "Đầu phân loại tác vụ hạ nguồn",
        "def": "Linear layer on top of [CLS] vector trained with cross-entropy for sentiment or intent tasks."
      }
    ],
    "sections": [
      {
        "id": "ch8-sec1",
        "title": "1. Mô hình chuyển giao (Transfer Learning) & Quy trình Fine-Tuning",
        "content_html": "\n<p>Trước kỷ nguyên Transfer Learning, mỗi bài toán NLP đòi hỏi phải huấn luyện một mô hình từ đầu với hàng triệu mẫu dữ liệu có nhãn <a href=\"#ref-ch8-1\" class=\"cite-ref\" data-ref=\"ref-ch8-1\" title=\"Slide 3-7: Introduction to Fine-Tuning\">[1]</a>. Phương pháp <strong>Pre-Training + Fine-Tuning</strong> đã tạo nên bước nhảy vọt:</p>\n<ol>\n  <li><strong>Giai đoạn Huấn luyện trước (Pre-Training):</strong> Mô hình học các đặc trưng ngôn ngữ tổng quát (ngữ pháp, cú pháp, tri thức thế giới) trên kho văn bản khổng lồ không cần gán nhãn (Wikipedia, BookCorpus) thông qua các tác vụ tự giám sát (Self-Supervised Learning).</li>\n  <li><strong>Giai đoạn Tinh chỉnh (Fine-Tuning):</strong> Tái sử dụng trọng số của mô hình đã huấn luyện trước, thêm một lớp phân loại đơn giản (Classification Head) ở tầng trên cùng, và huấn luyện cập nhật toàn bộ tham số với <em>Tốc độ học nhỏ (Small Learning Rate: $2 \\times 10^{-5}$ đến $5 \\times 10^{-5}$)</em> trên tập dữ liệu đặc thù của bài toán.</li>\n</ol>\n"
      },
      {
        "id": "ch8-sec2",
        "title": "2. Kiến trúc BERT & Mục tiêu Masked Language Model (MLM)",
        "content_html": "\n<p><strong>BERT (Bidirectional Encoder Representations from Transformers)</strong> chỉ sử dụng phần Encoder của Transformer, cho phép mỗi từ nhìn thấy cả ngữ cảnh bên trái và bên phải đồng thời tại mọi tầng <a href=\"#ref-ch8-2\" class=\"cite-ref\" data-ref=\"ref-ch8-2\" title=\"Slide 18-23: Masked Language Models (MLM)\">[2]</a>.</p>\n\n<h4>Quy tắc che mặt nạ (The 15% Masking Rule):</h4>\n<p>Để ngăn mô hình \"nhìn thấy trước\" từ cần dự đoán, BERT chọn ngẫu nhiên 15% số token trong câu để áp dụng chiến lược <strong>80 / 10 / 10</strong>:</p>\n<ul>\n  <li><strong>80% trường hợp:</strong> Thay thế token bằng ký hiệu đặc biệt <code>[MASK]</code> (ví dụ: <em>\"The [MASK] sat on the mat\"</em>).</li>\n  <li><strong>10% trường hợp:</strong> Thay thế token bằng một từ ngẫu nhiên bất kỳ (để chống overfit vào token [MASK]).</li>\n  <li><strong>10% trường hợp:</strong> Giữ nguyên từ ban đầu không đổi (nhưng vẫn yêu cầu mô hình dự đoán lại từ đó).</li>\n</ul>\n\n<h4>Mục tiêu Next Sentence Prediction (NSP)</h4>\n<p>Đầu vào gồm cặp câu $(A, B)$ ngăn cách bởi token <code>[SEP]</code>. Mô hình dự đoán nhãn nhị phân: <code>IsNext</code> (câu $B$ thực sự đứng sau câu $A$) hoặc <code>NotNext</code> (câu $B$ được bốc ngẫu nhiên từ tài liệu khác). Vector ẩn của token đầu tiên <code>[CLS]</code> được dùng làm đại diện cho toàn bộ cặp câu.</p>\n"
      },
      {
        "id": "ch8-sec3",
        "title": "3. Tinh chỉnh trên các tác vụ hạ nguồn (Downstream Tasks)",
        "content_html": "\n<p>BERT có thể thích ứng với đa dạng bài toán NLP với kiến trúc tinh chỉnh tối giản <a href=\"#ref-ch8-3\" class=\"cite-ref\" data-ref=\"ref-ch8-3\" title=\"Slide 24-25: Downstream Tasks\">[3]</a>:</p>\n<ul>\n  <li><strong>Phân loại câu đơn (Single Sentence Classification):</strong> Lấy vector đầu ra của token <code>[CLS]</code>, đưa qua lớp tuyến tính $W \\cdot h_{\\text{[CLS]}} + b$ rồi tính Softmax để phân loại cảm xúc (Sentiment Analysis).</li>\n  <li><strong>Gán nhãn chuỗi (Token Classification / NER):</strong> Lấy vector đầu ra của từng token cụ thể, đưa qua bộ phân loại để gán nhãn thực thể B-PER, I-PER, O.</li>\n  <li><strong>Phân loại cặp câu (Sentence Pair / NLI):</strong> Nối hai câu qua <code>[CLS] Câu A [SEP] Câu B [SEP]</code> để xác định quan hệ suy luận (Entailment, Contradiction, Neutral).</li>\n</ul>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch8-1",
        "index": 1,
        "slide": "Slide 3-7",
        "topic": "Introduction to Fine-Tuning Paradigm",
        "ppt": "08. Fine-Tuning and Masked Language Models.ppt",
        "excerpt": "Self-supervised pre-training on massive corpora followed by task-specific classification fine-tuning."
      },
      {
        "id": "ref-ch8-2",
        "index": 2,
        "slide": "Slide 18-23",
        "topic": "Masked Language Models (MLM) & BERT Objectives",
        "ppt": "08. Fine-Tuning and Masked Language Models.ppt",
        "excerpt": "15% bidirectional masking ratio utilizing 80/10/10 replacement rule alongside Next Sentence Prediction."
      },
      {
        "id": "ref-ch8-3",
        "index": 3,
        "slide": "Slide 24-25",
        "topic": "Downstream NLP Task Adaptation",
        "ppt": "08. Fine-Tuning and Masked Language Models.ppt",
        "excerpt": "Adapting [CLS] sequence representations for sentence classification, pair inference, and token NER."
      }
    ]
  },
  {
    "id": 9,
    "title": "Chapter 9: Machine Translation",
    "vn_title": "Dịch máy (Machine Translation: RBMT, SMT & NMT)",
    "ppt_file": "09. Machine Translation.ppt",
    "slide_count": 24,
    "summary": "Tiến trình phát triển các thế hệ dịch máy: Dịch máy dựa trên tập luật (Rule-Based MT), Dịch máy thống kê (Statistical MT) với mô hình kênh nhiễu, Dịch máy nơ-ron (Neural MT) Seq2Seq có cơ chế Attention, Thuật toán tìm kiếm Beam Search, và Thước đo đánh giá BLEU score.",
    "key_terms": [
      {
        "term": "Machine Translation (MT)",
        "vn": "Dịch máy",
        "def": "Automated translation between natural languages preserving semantics."
      },
      {
        "term": "Rule-Based MT (RBMT)",
        "vn": "Dịch máy dựa trên luật",
        "def": "Systems relying on linguistic dictionaries and syntactic transfer rules."
      },
      {
        "term": "Statistical MT (SMT)",
        "vn": "Dịch máy thống kê",
        "def": "argmax P(T|S) = argmax P(S|T)P(T) factoring translation into translation model and language model."
      },
      {
        "term": "Neural MT (NMT)",
        "vn": "Dịch máy nơ-ron",
        "def": "End-to-end deep learning framework predicting target words conditioned on source encodings."
      },
      {
        "term": "Beam Search Decoding",
        "vn": "Giải mã tìm kiếm chùm tia",
        "def": "Heuristic search maintaining top-k probable hypotheses at each decoding step."
      },
      {
        "term": "BLEU Score",
        "vn": "Chỉ số đánh giá BLEU",
        "def": "BiLingual Evaluation Understudy computing geometric mean of n-gram precisions penalized by length."
      }
    ],
    "sections": [
      {
        "id": "ch9-sec1",
        "title": "1. Ba thế hệ Dịch máy: RBMT, SMT và NMT",
        "content_html": "\n<p>Lịch sử Dịch máy (Machine Translation) trải qua 3 kỷ nguyên kỹ thuật lớn <a href=\"#ref-ch9-1\" class=\"cite-ref\" data-ref=\"ref-ch9-1\" title=\"Slide 3-8: MT Foundations & RBMT\">[1]</a>:</p>\n<table class=\"table-content\">\n  <thead><tr><th>Thế hệ</th><th>Cơ chế hoạt động</th><th>Ưu & Nhược điểm</th></tr></thead>\n  <tbody>\n    <tr>\n      <td><strong>Rule-Based MT (RBMT)</strong></td>\n      <td>Tra từ điển song ngữ kết hợp luật ngữ pháp cú pháp do chuyên gia ngôn ngữ xây dựng thủ công (Mô hình hình chóp <em>Vauquois Triangle</em>).</td>\n      <td>Ngữ pháp chính xác trong phạm vi hẹp nhưng cực kỳ tốn công xây dựng, chi phí bảo trì cao và không thể mở rộng ra ngôn ngữ tự nhiên đa dạng.</td>\n    </tr>\n    <tr>\n      <td><strong>Statistical MT (SMT)</strong> <a href=\"#ref-ch9-2\" class=\"cite-ref\" data-ref=\"ref-ch9-2\" title=\"Slide 9-13: Statistical Machine Translation\">[2]</a></td>\n      <td>Sử dụng <strong>Mô hình kênh nhiễu (Noisy Channel Model)</strong>:<br>\n      $$\\hat{T} = \\arg\\max_T P(T | S) = \\arg\\max_T P(S | T) P(T)$$\n      Kết hợp <em>Translation Model $P(S|T)$</em> (độ trung thực bản dịch) và <em>Language Model $P(T)$</em> (độ trôi chảy ngôn ngữ đích).</td>\n      <td>Tự động học từ dữ liệu song ngữ; tuy nhiên bản dịch thường bị rời rạc, khó nắm bắt ngữ pháp tầm xa.</td>\n    </tr>\n    <tr>\n      <td><strong>Neural MT (NMT)</strong> <a href=\"#ref-ch9-3\" class=\"cite-ref\" data-ref=\"ref-ch9-3\" title=\"Slide 14-19: Neural Machine Translation\">[3]</a></td>\n      <td>Mô hình nơ-ron đầu-cuối (End-to-End Seq2Seq hoặc Transformer). Toàn bộ bản dịch được điều kiện hóa liên tục trên biểu diễn ngữ cảnh nguồn.</td>\n      <td>Bản dịch trôi chảy tự nhiên vượt trội, tự động học biểu diễn liên ngôn ngữ.</td>\n    </tr>\n  </tbody>\n</table>\n"
      },
      {
        "id": "ch9-sec2",
        "title": "2. Chiến lược giải mã Beam Search & Đánh giá chất lượng bằng BLEU Score",
        "content_html": "\n<h4>Giải mã tìm kiếm chùm tia (Beam Search Decoding)</h4>\n<p>Tìm kiếm vét cạn (Exhaustive Search) có độ phức tạp $|V|^T$ (bất khả thi); Tìm kiếm tham lam (Greedy Search) chỉ chọn từ có xác suất cao nhất tại mỗi bước nên dễ rơi vào cực trị cục bộ. <strong>Beam Search</strong> duy trì một tập hợp $k$ giả thuyết tốt nhất (gọi là <em>Beam Width $k$</em>, thường $k=4-12$) tại mỗi bước thời gian.</p>\n\n<h4>Chỉ số đánh giá BLEU (BiLingual Evaluation Understudy) <a href=\"#ref-ch9-4\" class=\"cite-ref\" data-ref=\"ref-ch9-4\" title=\"Slide 20-22: Evaluation Metrics: BLEU\">[4]</a></h4>\n<p>BLEU so sánh mức độ trùng khớp các cụm n-gram giữa bản dịch máy của hệ thống (Candidate) và một hoặc nhiều bản dịch chuẩn của con người (Reference):</p>\n<div class=\"formula-box\">\n  $$\\text{BLEU} = \\text{BP} \\times \\exp\\left( \\sum_{n=1}^N w_n \\log p_n \\right)$$\n</div>\n<p>Trong đó $p_n$ là độ chuẩn xác có cắt ngọn (Modified n-gram precision) cho cụm $n$ từ (thường $N=4$); $w_n = 1/N$.</p>\n\n<h4>Hệ số phạt câu quá ngắn (Brevity Penalty - BP)</h4>\n<p>Nếu hệ thống chỉ dịch ra 1 từ đúng duy nhất (ví dụ \"the\"), độ chính xác $p_1$ sẽ là 100%! Để ngăn chặn lỗ hổng này, Brevity Penalty phạt nặng các bản dịch quá ngắn so với độ dài câu tham chiếu:</p>\n<div class=\"formula-box\">\n  $$\\text{BP} = \\begin{cases} 1 & \\text{nếu } c > r \\\\ e^{1 - r/c} & \\text{nếu } c \\le r \\end{cases}$$\n</div>\n<p>Với $c$ là độ dài câu của hệ thống (Candidate length), $r$ là độ dài câu tham chiếu chuẩn (Reference length).</p>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch9-1",
        "index": 1,
        "slide": "Slide 3-8",
        "topic": "Machine Translation Foundations & RBMT",
        "ppt": "09. Machine Translation.ppt",
        "excerpt": "Evolution of translation paradigms from direct lexical dictionaries to syntactic structural transfers."
      },
      {
        "id": "ref-ch9-2",
        "index": 2,
        "slide": "Slide 9-13",
        "topic": "Statistical MT & Noisy Channel Model",
        "ppt": "09. Machine Translation.ppt",
        "excerpt": "Noisy channel formulation decomposing translation into fidelity likelihood P(S|T) and fluency LM P(T)."
      },
      {
        "id": "ref-ch9-3",
        "index": 3,
        "slide": "Slide 14-19",
        "topic": "Neural MT Architectures & Beam Search",
        "ppt": "09. Machine Translation.ppt",
        "excerpt": "End-to-end differentiable sequence generation with attention alignments and width-k beam search decoding."
      },
      {
        "id": "ref-ch9-4",
        "index": 4,
        "slide": "Slide 20-22",
        "topic": "BLEU Score & Brevity Penalty Metric",
        "ppt": "09. Machine Translation.ppt",
        "excerpt": "Modified n-gram geometric precision scaled by exponential Brevity Penalty checking length adherence."
      }
    ]
  },
  {
    "id": 10,
    "title": "Chapter 10: Chatbot and Dialogue Systems",
    "vn_title": "Hệ thống Chatbot & Hội thoại tương tác (Dialogue Systems)",
    "ppt_file": "10. Chatbot and Dialogue Systems.ppt",
    "slide_count": 23,
    "summary": "Kiến trúc các hệ thống hội thoại: Chatbot dựa trên luật (ELIZA, AIML), Hệ thống đối thoại hướng tác vụ (Task-Oriented Dialogue Systems) với NLU, Điền khe (Slot Filling), Nhận diện ý định (Intent Classification), Quản lý hội thoại (DST & Policy), và Chatbot sinh sinh học (Generative LLMs).",
    "key_terms": [
      {
        "term": "Dialogue System",
        "vn": "Hệ thống hội thoại",
        "def": "Interactive computational agent conversing with humans through natural language."
      },
      {
        "term": "Rule-Based Chatbot",
        "vn": "Chatbot dựa trên tập luật",
        "def": "Pattern matching systems (ELIZA, PARRY, AIML) transforming user inputs into canned responses."
      },
      {
        "term": "Task-Oriented Dialogue",
        "vn": "Hội thoại hướng tác vụ",
        "def": "Goal-driven systems assisting users to accomplish specific tasks (flight booking, support)."
      },
      {
        "term": "Natural Language Understanding (NLU)",
        "vn": "Thấu hiểu ngôn ngữ tự nhiên",
        "def": "Dialogue component responsible for Intent Classification and Slot Filling (Entity Extraction)."
      },
      {
        "term": "Slot Filling",
        "vn": "Điền khe tham số",
        "def": "Extracting concrete entity variables (origin, destination, date) to satisfy frame constraints."
      },
      {
        "term": "Dialogue State Tracking (DST)",
        "vn": "Theo dõi trạng thái hội thoại",
        "def": "Maintaining current accumulator of user goals and confirmed slots across multiple turns."
      },
      {
        "term": "Natural Language Generation (NLG)",
        "vn": "Sinh ngôn ngữ tự nhiên",
        "def": "Mapping internal dialogue acts into natural, fluent text responses for the user."
      }
    ],
    "sections": [
      {
        "id": "ch10-sec1",
        "title": "1. Phân loại Hệ thống đối thoại & Chatbot dựa trên luật",
        "content_html": "\n<p>Các hệ thống đối thoại được phân chia thành 2 nhóm lớn theo mục đích <a href=\"#ref-ch10-1\" class=\"cite-ref\" data-ref=\"ref-ch10-1\" title=\"Slide 3-9: Dialogue Types & Rule-Based\">[1]</a>:</p>\n<ul>\n  <li><strong>Chatbot phi cấu trúc (Open-domain Chatbots / Chit-chat):</strong> Trò chuyện tự do, giải trí, mô phỏng phản xạ con người (ELIZA, Cleverbot, ChatGPT phi chuyên ngành).</li>\n  <li><strong>Hệ thống hướng tác vụ (Task-Oriented Dialogue Systems):</strong> Hỗ trợ người dùng hoàn thành một mục tiêu cụ thể trong miền hẹp (đặt vé máy bay, tra cứu số dư ngân hàng, đặt bàn nhà hàng).</li>\n</ul>\n\n<h4>Chatbot dựa trên luật (Rule-Based Chatbots)</h4>\n<p>Hệ thống kinh điển <strong>ELIZA (Weizenbaum, 1966)</strong> mô phỏng nhà trị liệu tâm lý Rogerian bằng cách dùng mẫu Regex so khớp từ khóa và phản chiếu lại câu nói của người dùng: <em>\"I feel depressed\" $\\to$ \"Why do you feel depressed?\"</em>. Điểm yếu: Hoàn toàn không lưu trạng thái bộ nhớ và không hiểu ngữ nghĩa thực sự.</p>\n"
      },
      {
        "id": "ch10-sec2",
        "title": "2. Kiến trúc 4 thành phần của Task-Oriented Dialogue Systems",
        "content_html": "\n<p>Một hệ thống đối thoại hướng tác vụ tiêu chuẩn được tổ chức thành 4 phân hệ liên kết chặt chẽ <a href=\"#ref-ch10-2\" class=\"cite-ref\" data-ref=\"ref-ch10-2\" title=\"Slide 10-13: Core Components of Dialogue Systems\">[2]</a>:</p>\n<div class=\"callout callout-info\">\n  <h4>Quy trình 4 bước xử lý một lượt thoại (Dialogue Turn):</h4>\n  <ol>\n    <li><strong>NLU (Natural Language Understanding) <a href=\"#ref-ch10-3\" class=\"cite-ref\" data-ref=\"ref-ch10-3\" title=\"Slide 14-15: NLU Intent & Slots\">[3]</a>:</strong>\n      <ul>\n        <li><em>Intent Classification:</em> Xác định ý định người dùng (ví dụ: <code>book_flight</code>).</li>\n        <li><em>Slot Filling:</em> Trích xuất các thực thể điền vào khung tham số (ví dụ: <code>destination = 'Da Nang'</code>, <code>date = 'tomorrow'</code>).</li>\n      </ul>\n    </li>\n    <li><strong>DST (Dialogue State Tracking):</strong> Cập nhật trạng thái hội thoại tổng thể qua nhiều lượt thoại (lưu giữ các khe đã điền đủ, các khe còn thiếu).</li>\n    <li><strong>Dialogue Policy (Chính sách quyết định):</strong> Quyết định hành động tiếp theo của hệ thống (Dialogue Act: hỏi thêm thông tin, xác nhận, hoặc gọi API cơ sở dữ liệu).</li>\n    <li><strong>NLG (Natural Language Generation) <a href=\"#ref-ch10-4\" class=\"cite-ref\" data-ref=\"ref-ch10-4\" title=\"Slide 16-19: NLG & Generation\">[4]</a>:</strong> Biến đổi hành động hội thoại thành câu văn tiếng tự nhiên mạch lạc gửi về cho người dùng.</li>\n  </ol>\n</div>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch10-1",
        "index": 1,
        "slide": "Slide 3-9",
        "topic": "Types of Dialogue Systems & Rule Matching",
        "ppt": "10. Chatbot and Dialogue Systems.ppt",
        "excerpt": "Categorizing task-oriented vs chit-chat systems and inspecting rule-based pattern matching engines like ELIZA."
      },
      {
        "id": "ref-ch10-2",
        "index": 2,
        "slide": "Slide 10-13",
        "topic": "Components of Dialogue Systems & Flow",
        "ppt": "10. Chatbot and Dialogue Systems.ppt",
        "excerpt": "Modular architectural flow encompassing NLU, Dialogue State Tracking, Policy Action, and Generation."
      },
      {
        "id": "ref-ch10-3",
        "index": 3,
        "slide": "Slide 14-15",
        "topic": "Natural Language Understanding (NLU)",
        "ppt": "10. Chatbot and Dialogue Systems.ppt",
        "excerpt": "Joint intent classification and sequential slot-filling feature extraction over user utterances."
      },
      {
        "id": "ref-ch10-4",
        "index": 4,
        "slide": "Slide 16-19",
        "topic": "Natural Language Generation (NLG)",
        "ppt": "10. Chatbot and Dialogue Systems.ppt",
        "excerpt": "Synthesizing conversational surface strings from structured dialogue acts and database response records."
      }
    ]
  },
  {
    "id": 11,
    "title": "Chapter 11: Context-Free Grammars and Constituency Parsing",
    "vn_title": "Ngữ pháp phi ngữ cảnh (CFG) & Phân tích cú pháp thành phần",
    "ppt_file": "11. Context-Free Grammars and Constituency Parsing.ppt",
    "slide_count": 31,
    "summary": "Cú pháp học hình thức: Định nghĩa bộ 4 Ngữ pháp phi ngữ cảnh (CFG), Cây cú pháp thành phần (Parse Trees), Tính mơ hồ cú pháp (Syntactic Ambiguity), Chiến lược phân tích Top-Down vs Bottom-Up, Dạng chuẩn Chomsky (CNF), và Thuật toán quy hoạch động CKY.",
    "key_terms": [
      {
        "term": "Context-Free Grammar (CFG)",
        "vn": "Ngữ pháp phi ngữ cảnh",
        "def": "Formal generative grammar G = (N, Sigma, R, S) specifying nested syntactic structures."
      },
      {
        "term": "Terminals & Non-Terminals",
        "vn": "Ký hiệu kết thúc & Phi kết thúc",
        "def": "Sigma: lexical vocabulary words; N: syntactic category variables (NP, VP, PP)."
      },
      {
        "term": "Production Rules",
        "vn": "Luật sinh cú pháp",
        "def": "Rewrite rules of form A -> alpha, replacing non-terminal A with a string of symbols."
      },
      {
        "term": "Constituency Parsing",
        "vn": "Phân tích cú pháp thành phần",
        "def": "Constructing hierarchical trees grouping words into constituent syntactic phrases."
      },
      {
        "term": "Syntactic Ambiguity",
        "vn": "Mơ hồ cú pháp",
        "def": "Sentences permitting multiple distinct parse trees (e.g., PP-attachment ambiguity)."
      },
      {
        "term": "Chomsky Normal Form (CNF)",
        "vn": "Dạng chuẩn Chomsky",
        "def": "Grammar restriction where rules are strictly A -> B C (binary non-terminals) or A -> a (single terminal)."
      },
      {
        "term": "CKY Parsing Algorithm",
        "vn": "Thuật toán CKY",
        "def": "Dynamic programming chart parsing executing in O(n^3 * |R|) time over CNF grammars."
      }
    ],
    "sections": [
      {
        "id": "ch11-sec1",
        "title": "1. Ngữ pháp phi ngữ cảnh (CFG) & Cây cú pháp thành phần",
        "content_html": "\n<p><strong>Ngữ pháp phi ngữ cảnh (Context-Free Grammar - CFG)</strong> được định nghĩa hình thức bằng một bộ 4 toán học $G = (N, \\Sigma, R, S)$ <a href=\"#ref-ch11-1\" class=\"cite-ref\" data-ref=\"ref-ch11-1\" title=\"Slide 3-8: CFG Rules & Productions\">[1]</a>:</p>\n<ul>\n  <li>$N$: Tập hợp các <strong>ký hiệu phi kết thúc (Non-terminals)</strong> đại diện cho các nhóm cú pháp (ví dụ: $S$ - Câu, $NP$ - Cụm danh từ, $VP$ - Cụm động từ).</li>\n  <li>$\\Sigma$: Tập hợp các <strong>ký hiệu kết thúc (Terminals)</strong> chính là các từ vựng cụ thể trong ngôn ngữ ($N \\cap \\Sigma = \\emptyset$).</li>\n  <li>$R$: Tập hợp các <strong>luật sinh (Production Rules)</strong> có dạng $A \\to \\alpha$, với $A \\in N$ và $\\alpha \\in (N \\cup \\Sigma)^*$.</li>\n  <li>$S$: Ký hiệu <strong>bắt đầu (Start symbol)</strong> đại diện cho toàn bộ câu ($S \\in N$).</li>\n</ul>\n\n<h4>Tính mơ hồ cú pháp (Syntactic Ambiguity) <a href=\"#ref-ch11-2\" class=\"cite-ref\" data-ref=\"ref-ch11-2\" title=\"Slide 9-19: Parse Trees & Ambiguity\">[2]</a></h4>\n<p>Một câu có thể tương ứng với nhiều cây cú pháp hoàn toàn hợp lệ nhưng mang nghĩa khác nhau. Ví dụ kinh điển về <strong>Mơ hồ gắn kết cụm giới từ (PP-Attachment Ambiguity)</strong>:</p>\n<p class=\"quote\"><em>\"I saw the man with a telescope\"</em></p>\n<ul>\n  <li>Cây 1: Cụm giới từ <em>\"with a telescope\"</em> gắn vào $VP$ $\\implies$ Tôi dùng kính viễn vọng để nhìn người đàn ông.</li>\n  <li>Cây 2: Cụm giới từ <em>\"with a telescope\"</em> gắn vào $NP$ <em>\"the man\"</em> $\\implies$ Người đàn ông đó đang cầm chiếc kính viễn vọng.</li>\n</ul>\n"
      },
      {
        "id": "ch11-sec2",
        "title": "2. Dạng chuẩn Chomsky (CNF) & Thuật toán quy hoạch động CKY",
        "content_html": "\n<h4>Dạng chuẩn Chomsky (Chomsky Normal Form - CNF) <a href=\"#ref-ch11-3\" class=\"cite-ref\" data-ref=\"ref-ch11-3\" title=\"Slide 20-30: Parsing Algorithms & CKY\">[3]</a></h4>\n<p>Để thuật toán quy hoạch động hoạt động hiệu quả, mọi ngữ pháp CFG đều có thể chuyển đổi tương đương về dạng chuẩn CNF, trong đó các luật sinh chỉ được phép thuộc 1 trong 2 dạng:</p>\n<div class=\"formula-box\">\n  $$A \\to B \\, C \\quad (\\text{Sinh ra đúng 2 ký hiệu phi kết thúc})$$\n  $$A \\to a \\quad (\\text{Sinh ra đúng 1 ký hiệu kết thúc / từ đơn})$$\n</div>\n\n<h4>Thuật toán CKY (Cocke-Kasami-Younger)</h4>\n<p>CKY sử dụng bảng tam giác quy hoạch động 2 chiều để lưu trữ các cụm cú pháp của từng đoạn con từ vị trí $i$ đến $j$:</p>\n<ul>\n  <li>Khởi tạo (Đường chéo cơ sở $j = i+1$): Với từ thứ $i$, tìm tất cả các luật $A \\to w_i$ để đưa $A$ vào ô $[i, i+1]$.</li>\n  <li>Quy nạp ($j > i+1$): Ô $[i, j]$ được điền bằng cách duyệt qua mọi điểm chia cắt $k$ ($i < k < j$): Nếu $B \\in [i, k]$ và $C \\in [k, j]$ và tồn tại luật $A \\to B \\, C$ trong ngữ pháp, thì thêm $A$ vào ô $[i, j]$.</li>\n  <li>Nếu ký hiệu bắt đầu $S$ xuất hiện ở ô góc trên cùng bên phải $[0, n]$, câu đó được công nhận là hợp ngữ pháp! Độ phức tạp tính toán là $O(n^3 \\cdot |R|)$.</li>\n</ul>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch11-1",
        "index": 1,
        "slide": "Slide 3-8",
        "topic": "Introduction to CFG & Production Rules",
        "ppt": "11. Context-Free Grammars and Constituency Parsing.ppt",
        "excerpt": "Formal 4-tuple grammar specifications mapping non-terminals to strings of terminals and constituents."
      },
      {
        "id": "ref-ch11-2",
        "index": 2,
        "slide": "Slide 9-19",
        "topic": "Constituency Parse Trees & Ambiguity",
        "ppt": "11. Context-Free Grammars and Constituency Parsing.ppt",
        "excerpt": "Tree hierarchies representing phrase grouping alongside structural PP-attachment ambiguity."
      },
      {
        "id": "ref-ch11-3",
        "index": 3,
        "slide": "Slide 20-30",
        "topic": "Chomsky Normal Form & CKY Dynamic Parsing",
        "ppt": "11. Context-Free Grammars and Constituency Parsing.ppt",
        "excerpt": "Binary production normalization under CNF enabling cubic dynamic chart parsing via CKY."
      }
    ]
  },
  {
    "id": 12,
    "title": "Chapter 12: Dependency Parsing",
    "vn_title": "Phân tích cú pháp phụ thuộc (Dependency Parsing)",
    "ppt_file": "12. Dependency Parsing.ppt",
    "slide_count": 29,
    "summary": "Cú pháp phụ thuộc: Khái niệm Head và Dependent, Bộ nhãn Universal Dependencies (UD), Cây phụ thuộc và Tính chiếu (Projectivity), Thuật toán chuyển trạng thái Shift-Reduce Arc-Standard, Phân tích dựa trên đồ thị (MST), và Các thước đo UAS, LAS.",
    "key_terms": [
      {
        "term": "Dependency Grammar",
        "vn": "Ngữ pháp phụ thuộc",
        "def": "Syntactic theory defining sentence structure as binary asymmetric links between words."
      },
      {
        "term": "Head & Dependent",
        "vn": "Từ trung tâm & Từ phụ thuộc",
        "def": "Head word controls the syntactic behavior; Dependent modifies or completes the head."
      },
      {
        "term": "Dependency Tree",
        "vn": "Cây phụ thuộc",
        "def": "Directed rooted tree spanning all words with single-head acyclic structural constraints."
      },
      {
        "term": "Projectivity",
        "vn": "Tính chiếu",
        "def": "A dependency tree is projective if edges do not cross when words are placed in linear sequence."
      },
      {
        "term": "Transition-Based Parsing",
        "vn": "Phân tích dựa trên chuyển trạng thái",
        "def": "Parsing using Stack, Buffer, and state transitions (Shift, Left-Arc, Right-Arc)."
      },
      {
        "term": "Arc-Standard Algorithm",
        "vn": "Thuật toán Arc-Standard",
        "def": "Creates dependency relations between top two stack elements; runs in linear O(n) time."
      },
      {
        "term": "UAS & LAS Metrics",
        "vn": "Chỉ số UAS và LAS",
        "def": "UAS: Unlabeled Attachment Score (head accuracy); LAS: Labeled Attachment Score (head + label accuracy)."
      }
    ],
    "sections": [
      {
        "id": "ch12-sec1",
        "title": "1. Bản chất Ngữ pháp phụ thuộc & Các mối quan hệ (UD)",
        "content_html": "\n<p>Khác với Constituency Parsing chia câu thành các cụm đoản ngữ lồng nhau, <strong>Dependency Parsing</strong> liên kết trực tiếp giữa các từ với nhau thông qua quan hệ hai ngôi có hướng: <strong>Head (Từ trung tâm / Governor) $\\xrightarrow{\\text{relation}}$ Dependent (Từ phụ thuộc / Modifier)</strong> <a href=\"#ref-ch12-1\" class=\"cite-ref\" data-ref=\"ref-ch12-1\" title=\"Slide 3-10: Dependency Relations & Fundamentals\">[1]</a>.</p>\n\n<h4>Các nhãn quan hệ phụ thuộc phổ biến trong Universal Dependencies (UD):</h4>\n<ul>\n  <li><code>root</code>: Động từ chính của câu, nối từ nút ảo ROOT.</li>\n  <li><code>nsubj</code> (Nominal Subject): Chủ ngữ danh từ của động từ (ví dụ: <em>\"She eats\" $\\implies$ eats $\\xrightarrow{\\text{nsubj}}$ She</em>).</li>\n  <li><code>obj</code> / <code>dobj</code> (Direct Object): Tân ngữ trực tiếp (ví dụ: <em>\"eats apple\" $\\implies$ eats $\\xrightarrow{\\text{obj}}$ apple</em>).</li>\n  <li><code>amod</code> (Adjectival Modifier): Tính từ bổ nghĩa cho danh từ (ví dụ: <em>\"red apple\" $\\implies$ apple $\\xrightarrow{\\text{amod}}$ red</em>).</li>\n  <li><code>det</code> (Determiner): Từ hạn định bổ nghĩa cho danh từ (ví dụ: <em>\"the apple\" $\\implies$ apple $\\xrightarrow{\\text{det}}$ the</em>).</li>\n</ul>\n"
      },
      {
        "id": "ch12-sec2",
        "title": "2. Cây phụ thuộc, Tính chiếu (Projectivity) & Thuật toán Arc-Standard",
        "content_html": "\n<h4>Đặc điểm toán học của Cây phụ thuộc <a href=\"#ref-ch12-2\" class=\"cite-ref\" data-ref=\"ref-ch12-2\" title=\"Slide 11-16: Dependency Trees & Types\">[2]</a>:</h4>\n<ul>\n  <li>Có đúng một nút gốc (ROOT) không có cung đi vào.</li>\n  <li>Không chứa chu trình (Acyclic).</li>\n  <li>Mỗi từ trong câu có <strong>duy nhất 1 nút Head</strong> trỏ đến nó (Single-head constraint).</li>\n  <li><strong>Tính chiếu (Projectivity):</strong> Cây là projective nếu khi vẽ các cung phụ thuộc phía trên các từ theo thứ tự thẳng hàng, <strong>không có bất kỳ hai cung nào cắt nhau</strong>.</li>\n</ul>\n\n<h4>Thuật toán Transition-Based Arc-Standard (Shift-Reduce) <a href=\"#ref-ch12-3\" class=\"cite-ref\" data-ref=\"ref-ch12-3\" title=\"Slide 17-20: Arc-Standard Transition System\">[3]</a></h4>\n<p>Bộ trạng thái gồm: <strong>Stack $(\\sigma)$</strong>, <strong>Buffer $(\\beta)$</strong>, và <strong>Tập cung $(A)$</strong>. 3 phép chuyển trạng thái:</p>\n<ol>\n  <li><strong>Shift:</strong> Chuyển từ đầu tiên của Buffer vào đỉnh Stack.</li>\n  <li><strong>Left-Arc ($L_r$):</strong> Thêm cung $s_1 \\xrightarrow{r} s_2$ (với $s_1$ là phần tử trên cùng stack, $s_2$ là phần tử thứ nhì), sau đó loại bỏ $s_2$ khỏi Stack.</li>\n  <li><strong>Right-Arc ($R_r$):</strong> Thêm cung $s_2 \\xrightarrow{r} s_1$, sau đó loại bỏ $s_1$ khỏi Stack.</li>\n</ol>\n<p>Thuật toán chạy với độ phức tạp tuyến tính $O(n)$ cực nhanh!</p>\n\n<h4>Thước đo đánh giá: UAS vs. LAS <a href=\"#ref-ch12-4\" class=\"cite-ref\" data-ref=\"ref-ch12-4\" title=\"Slide 26-28: Evaluation Metrics UAS & LAS\">[4]</a></h4>\n<ul>\n  <li><strong>UAS (Unlabeled Attachment Score):</strong> Tỷ lệ phần trăm các từ được gán đúng nút Head (bỏ qua nhãn quan hệ).</li>\n  <li><strong>LAS (Labeled Attachment Score):</strong> Tỷ lệ phần trăm các từ được gán <strong>đúng đồng thời cả nút Head VÀ nhãn quan hệ</strong>. Luôn có $\\text{LAS} \\le \\text{UAS}$.</li>\n</ul>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch12-1",
        "index": 1,
        "slide": "Slide 3-10",
        "topic": "Dependency Relations & Foundations",
        "ppt": "12. Dependency Parsing.ppt",
        "excerpt": "Asymmetric head-dependent syntactic linkages and Universal Dependencies relational inventory."
      },
      {
        "id": "ref-ch12-2",
        "index": 2,
        "slide": "Slide 11-16",
        "topic": "Dependency Trees & Projectivity Conditions",
        "ppt": "12. Dependency Parsing.ppt",
        "excerpt": "Acyclic single-head rooted spanning trees and non-crossing projective planar constraints."
      },
      {
        "id": "ref-ch12-3",
        "index": 3,
        "slide": "Slide 17-20",
        "topic": "Transition-Based Parsing & Arc-Standard",
        "ppt": "12. Dependency Parsing.ppt",
        "excerpt": "Shift-reduce transitions over stack-buffer configurations achieving linear runtime complexity."
      },
      {
        "id": "ref-ch12-4",
        "index": 4,
        "slide": "Slide 26-28",
        "topic": "Evaluation Metrics: UAS and LAS",
        "ppt": "12. Dependency Parsing.ppt",
        "excerpt": "Quantifying dependency parsing fidelity via unlabeled head attachments and labeled relation accuracy."
      }
    ]
  },
  {
    "id": 13,
    "title": "Chapter 13: Logical Representations of Sentences Meaning",
    "vn_title": "Biểu diễn logic ý nghĩa câu (Computational Semantics & Logic)",
    "ppt_file": "13. Locial Representations of Sentences Meaning.ppt",
    "slide_count": 24,
    "summary": "Ngữ nghĩa học tính toán: Yêu cầu của hệ thống biểu diễn ý nghĩa, Logic mệnh đề (Propositional Logic), Logic vị từ bậc nhất (First-Order Logic - FOL), Giải tích Lambda, Phép rút gọn Beta-Reduction, Nguyên lý ngữ nghĩa cấu thành (Principle of Compositionality) và Semantic Parsing.",
    "key_terms": [
      {
        "term": "Computational Semantics",
        "vn": "Ngữ nghĩa học tính toán",
        "def": "Mapping natural language utterances into unambiguous machine-interpretable formal representations."
      },
      {
        "term": "Principle of Compositionality",
        "vn": "Nguyên lý ngữ nghĩa cấu thành (Frege)",
        "def": "The meaning of a complex expression is a function of the meanings of its parts and syntax rules."
      },
      {
        "term": "Propositional Logic",
        "vn": "Logic mệnh đề",
        "def": "Truth-functional logic operating on atomic propositions connected by boolean operators."
      },
      {
        "term": "First-Order Logic (FOL)",
        "vn": "Logic vị từ bậc nhất",
        "def": "Expressive formal language featuring Constants, Variables, Predicates, Functions, and Quantifiers."
      },
      {
        "term": "Lambda Calculus",
        "vn": "Giải tích Lambda",
        "def": "Formal system for function abstraction (lambda x. P(x)) and argument application."
      },
      {
        "term": "Beta-Reduction",
        "vn": "Rút gọn Beta",
        "def": "Substituting argument value into a lambda abstraction body: (lambda x. P(x))(c) => P(c)."
      }
    ],
    "sections": [
      {
        "id": "ch13-sec1",
        "title": "1. Bản chất Biểu diễn ý nghĩa & Logic vị từ bậc nhất (FOL)",
        "content_html": "\n<p><strong>Ngữ nghĩa học tính toán (Computational Semantics)</strong> nhằm chuyển dịch câu văn tự nhiên vốn mơ hồ thành biểu diễn logic hình thức chính xác, cho phép máy tính thực hiện các phép suy diễn tự động (Inference) <a href=\"#ref-ch13-1\" class=\"cite-ref\" data-ref=\"ref-ch13-1\" title=\"Slide 3-7: Foundations & Propositional Logic\">[1]</a>.</p>\n\n<h4>Các thành phần của Logic vị từ bậc nhất (First-Order Logic - FOL) <a href=\"#ref-ch13-2\" class=\"cite-ref\" data-ref=\"ref-ch13-2\" title=\"Slide 8-10: First-Order Logic Components\">[2]</a>:</h4>\n<ul>\n  <li><strong>Hằng đối tượng (Constants):</strong> Tên gọi các thực thể cụ thể trong thế giới (ví dụ: <code>John</code>, <code>Hanoi</code>).</li>\n  <li><strong>Biến (Variables):</strong> Ký hiệu đại diện $x, y, z$ nhận giá trị trong miền xác định.</li>\n  <li><strong>Vị từ (Predicates):</strong> Biểu diễn tính chất của đối tượng (một ngôi: <code>Student(x)</code>) hoặc mối quan hệ giữa các đối tượng (hai ngôi: <code>Loves(John, Mary)</code>).</li>\n  <li><strong>Lượng từ (Quantifiers):</strong> Lượng từ với mọi $\\forall$ (Universal) và Lượng từ tồn tại $\\exists$ (Existential).</li>\n</ul>\n<div class=\"formula-box\">\n  $$\\text{\"Mọi sinh viên đều yêu thích lập trình\"} \\implies \\forall x (\\text{Student}(x) \\to \\text{Likes}(x, \\text{Programming}))$$\n  $$\\text{\"Có một sinh viên vượt qua kỳ thi\"} \\implies \\exists x (\\text{Student}(x) \\land \\text{Passed}(x, \\text{Exam}))$$\n</div>\n"
      },
      {
        "id": "ch13-sec2",
        "title": "2. Giải tích Lambda & Nguyên lý cấu thành ngữ nghĩa (Compositionality)",
        "content_html": "\n<p>Theo <strong>Nguyên lý cấu thành (Principle of Compositionality của Frege)</strong>: <em>Ý nghĩa của một biểu thức phức hợp được hình thành từ ý nghĩa của các thành phần con và các quy tắc cú pháp kết hợp chúng</em> <a href=\"#ref-ch13-3\" class=\"cite-ref\" data-ref=\"ref-ch13-3\" title=\"Slide 11-15: Lambda Calculus & Montague\">[3]</a>.</p>\n\n<h4>Giải tích Lambda (Lambda Calculus) & Phép rút gọn Beta</h4>\n<p>Ký hiệu $\\lambda x$ cho phép trừu tượng hóa một vị từ thành hàm nhận tham số:</p>\n<div class=\"formula-box\">\n  $$\\lambda x . \\text{Sleeps}(x)$$\n</div>\n<p>Khi hàm được áp dụng cho đối số <code>John</code>, ta thực hiện <strong>Beta-Reduction (Rút gọn Beta)</strong> bằng cách thay thế biến $x$ bằng giá trị đối số:</p>\n<div class=\"formula-box\">\n  $$(\\lambda x . \\text{Sleeps}(x))(\\text{John}) \\implies \\text{Sleeps}(\\text{John})$$\n</div>\n<p>Điều này cho phép gán trực tiếp biểu thức ngữ nghĩa Lambda vào từng luật sinh cú pháp CFG (Semantic Attachments in Montague Grammar) để tạo ra cây biểu diễn ý nghĩa hoàn chỉnh <a href=\"#ref-ch13-4\" class=\"cite-ref\" data-ref=\"ref-ch13-4\" title=\"Slide 16-22: Compositional Semantics & Parsing\">[4]</a>.</p>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch13-1",
        "index": 1,
        "slide": "Slide 3-7",
        "topic": "Meaning Representation & Propositional Logic",
        "ppt": "13. Locial Representations of Sentences Meaning.ppt",
        "excerpt": "Formal requirements for semantic systems and limitations of propositional connectives."
      },
      {
        "id": "ref-ch13-2",
        "index": 2,
        "slide": "Slide 8-10",
        "topic": "First-Order Logic (FOL) Formalism",
        "ppt": "13. Locial Representations of Sentences Meaning.ppt",
        "excerpt": "Predicates, constant symbols, variables, and universal/existential quantifier scoping."
      },
      {
        "id": "ref-ch13-3",
        "index": 3,
        "slide": "Slide 11-15",
        "topic": "Lambda Calculus & Semantic Compositionality",
        "ppt": "13. Locial Representations of Sentences Meaning.ppt",
        "excerpt": "Lambda abstraction and beta-reduction implementing Frege's principle of compositionality."
      },
      {
        "id": "ref-ch13-4",
        "index": 4,
        "slide": "Slide 16-22",
        "topic": "Compositional Semantics & Parsing Pipeline",
        "ppt": "13. Locial Representations of Sentences Meaning.ppt",
        "excerpt": "Syntax-driven semantic attachment rules mapping CFG derivations to executable logical queries."
      }
    ]
  },
  {
    "id": 14,
    "title": "Chapter 14: Relation and Event Extraction",
    "vn_title": "Trích xuất thực thể, quan hệ & Sự kiện (Information Extraction)",
    "ppt_file": "14. Relation and Event Extraction.ppt",
    "slide_count": 24,
    "summary": "Khai phá tri thức có cấu trúc từ văn bản: Trích xuất thực thể (NER), Phân loại quan hệ (Relation Extraction), Mẫu Hearst (Hearst Patterns), Học có giám sát và Giám sát từ xa (Distant Supervision), và Trích xuất sự kiện (Event Triggers & Roles).",
    "key_terms": [
      {
        "term": "Information Extraction (IE)",
        "vn": "Trích xuất thông tin",
        "def": "Extracting structured knowledge representations from unstructured natural text."
      },
      {
        "term": "Named Entity Recognition (NER)",
        "vn": "Nhận dạng thực thể có tên",
        "def": "Locating and classifying textual mentions into categories (Person, Org, Loc)."
      },
      {
        "term": "Relation Extraction (RE)",
        "vn": "Trích xuất quan hệ",
        "def": "Detecting semantic relationships between pairs of entities in text."
      },
      {
        "term": "Hearst Patterns",
        "vn": "Mẫu ngữ pháp Hearst",
        "def": "Handcrafted lexico-syntactic patterns identifying is-a (hyponymy) relations automatically."
      },
      {
        "term": "Distant Supervision",
        "vn": "Giám sát từ xa",
        "def": "Automatically generating labeled training pairs by aligning knowledge bases with text corpora."
      },
      {
        "term": "Event Extraction",
        "vn": "Trích xuất sự kiện",
        "def": "Identifying event triggers, participant arguments, and associated semantic roles."
      }
    ],
    "sections": [
      {
        "id": "ch14-sec1",
        "title": "1. Tổng quan Trích xuất quan hệ (Relation Extraction)",
        "content_html": "\n<p><strong>Trích xuất quan hệ (Relation Extraction - RE)</strong> nhận đầu vào là các thực thể có tên đã được phát hiện và xác định xem giữa hai thực thể đó có tồn tại mối quan hệ ngữ nghĩa xác định nào hay không <a href=\"#ref-ch14-1\" class=\"cite-ref\" data-ref=\"ref-ch14-1\" title=\"Slide 3-6: Relation Extraction Overview\">[1]</a>. Ví dụ: từ câu <em>\"FPT University was founded in Hanoi\"</em>, trích xuất được bộ ba tri thức: <code>(FPT University, foundedIn, Hanoi)</code>.</p>\n\n<h4>Các phương pháp trích xuất quan hệ chính <a href=\"#ref-ch14-2\" class=\"cite-ref\" data-ref=\"ref-ch14-2\" title=\"Slide 7-11: Approaches to Relation Extraction\">[2]</a>:</h4>\n<ul>\n  <li><strong>Dựa trên mẫu luật cú pháp (Hearst Patterns):</strong> Khám phá quan hệ hạ danh (hyponymy / is-a) thông qua các mẫu quen thuộc như:\n    <p class=\"quote\"><em>\"NP0 such as NP1, NP2, ...\"</em> $\\implies$ <code>is_a(NP1, NP0)</code><br>\n    Ví dụ: <em>\"programming languages such as Python and Java\"</em> $\\implies$ Python là một ngôn ngữ lập trình.</p>\n  </li>\n  <li><strong>Học máy có giám sát (Supervised Machine Learning):</strong> Trích xuất đặc trưng ngữ cảnh, đường dẫn phụ thuộc ngắn nhất (Shortest Dependency Path) giữa 2 thực thể và huấn luyện bộ phân loại SVM/BERT.</li>\n  <li><strong>Giám sát từ xa (Distant Supervision):</strong> Nếu trong Knowledge Base (Wikidata) có thực thể $(e_1, R, e_2)$, thì bất kỳ câu nào trong văn bản chứa đồng thời $e_1$ và $e_2$ đều được tự động gán nhãn quan hệ $R$ để tạo dữ liệu huấn luyện lớn.</li>\n</ul>\n"
      },
      {
        "id": "ch14-sec2",
        "title": "2. Trích xuất sự kiện (Event Extraction): Triggers & Arguments",
        "content_html": "\n<p><strong>Sự kiện (Event)</strong> là một biến cố cụ thể xảy ra trong thế giới thực thường liên quan đến sự thay đổi trạng thái <a href=\"#ref-ch14-3\" class=\"cite-ref\" data-ref=\"ref-ch14-3\" title=\"Slide 12-16: Event Extraction & Types\">[3]</a>. Trích xuất sự kiện gồm 2 bài toán con:</p>\n<ol>\n  <li><strong>Event Trigger Detection:</strong> Phát hiện từ kích hoạt thể hiện sự kiện (ví dụ: trong câu <em>\"Company A acquired Company B for $2B\"</em>, từ kích hoạt là <code>acquired</code> thuộc loại sự kiện <code>Transaction.Acquisition</code>).</li>\n  <li><strong>Event Argument Extraction:</strong> Gán vai trò ngữ nghĩa (Roles) cho các thực thể tham gia:\n    <ul>\n      <li><code>Buyer / Acquirer</code>: Company A</li>\n      <li><code>Acquired Entity</code>: Company B</li>\n      <li><code>Price</code>: $2B</li>\n    </ul>\n  </li>\n</ol>\n<p><strong>Ứng dụng:</strong> Xây dựng đồ thị tri thức (Knowledge Graphs), theo dõi tin tức tài chính tự động, và hỗ trợ hệ thống hỏi đáp thông minh <a href=\"#ref-ch14-4\" class=\"cite-ref\" data-ref=\"ref-ch14-4\" title=\"Slide 17-21: Applications in Knowledge Graphs\">[4]</a>.</p>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch14-1",
        "index": 1,
        "slide": "Slide 3-6",
        "topic": "Relation Extraction Overview & Types",
        "ppt": "14. Relation and Event Extraction.ppt",
        "excerpt": "Taxonomy of semantic relations connecting named entities in informational text."
      },
      {
        "id": "ref-ch14-2",
        "index": 2,
        "slide": "Slide 7-11",
        "topic": "Hearst Patterns, Supervised & Distant Supervision",
        "ppt": "14. Relation and Event Extraction.ppt",
        "excerpt": "Rule patterns, shortest dependency paths, and distant knowledge base alignment."
      },
      {
        "id": "ref-ch14-3",
        "index": 3,
        "slide": "Slide 12-16",
        "topic": "Event Extraction Architecture & Roles",
        "ppt": "14. Relation and Event Extraction.ppt",
        "excerpt": "Event trigger detection and participant semantic argument role filling."
      },
      {
        "id": "ref-ch14-4",
        "index": 4,
        "slide": "Slide 17-21",
        "topic": "Applications in Knowledge Bases & QA",
        "ppt": "14. Relation and Event Extraction.ppt",
        "excerpt": "Populating relational knowledge graphs for enterprise intelligence and question answering."
      }
    ]
  },
  {
    "id": 15,
    "title": "Chapter 15: Time and Temporal Reasoning",
    "vn_title": "Thời gian & Suy luận thời gian trong khai phá văn bản",
    "ppt_file": "15. Time and Temporal Reasoning.ppt",
    "slide_count": 25,
    "summary": "Mô hình hóa dòng thời gian: Biểu thức thời gian tường minh vs Ngầm định, Chuẩn chú giải TimeML (TIMEX3), Chuẩn hóa mốc thời gian ISO 8601, Đại số khoảng thời gian của Allen (Allen's Interval Algebra - 13 quan hệ), và Đồ thị phụ thuộc thời gian trong tóm tắt văn bản.",
    "key_terms": [
      {
        "term": "Temporal Information Extraction",
        "vn": "Trích xuất thông tin thời gian",
        "def": "Identifying, normalizing, and ordering chronological events and temporal expressions."
      },
      {
        "term": "Explicit vs Implicit Time",
        "vn": "Thời gian tường minh vs Ngầm định",
        "def": "Explicit gives exact calendar dates; Implicit requires document anchoring (yesterday, next month)."
      },
      {
        "term": "TIMEX3 / TimeML",
        "vn": "Chuẩn biểu diễn TimeML",
        "def": "XML annotation standard representing temporal expressions (Dates, Times, Durations, Sets)."
      },
      {
        "term": "Temporal Normalization",
        "vn": "Chuẩn hóa mốc thời gian",
        "def": "Converting relative expressions into ISO 8601 standard calendar timestamps."
      },
      {
        "term": "Allen's Interval Algebra",
        "vn": "Đại số khoảng thời gian Allen",
        "def": "Formal theory defining 13 mutually exclusive qualitative temporal relations between intervals."
      },
      {
        "term": "Temporal Dependency Graph",
        "vn": "Đồ thị phụ thuộc thời gian",
        "def": "Directed graph ordering events chronologically for summarization and timeline generation."
      }
    ],
    "sections": [
      {
        "id": "ch15-sec1",
        "title": "1. Các dạng thông tin thời gian & Chuẩn hóa mốc thời gian (TimeML)",
        "content_html": "\n<p>Thời gian là trục tọa độ nền tảng để sắp xếp các sự kiện và phân tích nguyên nhân - kết quả trong văn bản <a href=\"#ref-ch15-1\" class=\"cite-ref\" data-ref=\"ref-ch15-1\" title=\"Slide 3-9: Temporal Information Types\">[1]</a>:</p>\n<ul>\n  <li><strong>Biểu thức thời gian tường minh (Explicit):</strong> Chứa đầy đủ thông tin lịch pháp (ví dụ: <em>\"26 tháng 10 năm 2026\"</em>).</li>\n  <li><strong>Biểu thức thời gian ngầm định (Implicit / Relative):</strong> Cần neo vào <strong>Thời điểm tạo tài liệu (Document Creation Time - DCT)</strong> để giải mã (ví dụ: <em>\"hôm qua\"</em>, <em>\"tuần tới\"</em>, <em>\"3 ngày sau\"</em>).</li>\n  <li><strong>Khoảng thời gian (Duration):</strong> Ví dụ: <em>\"trong 4 giờ\"</em>, <em>\"suốt 2 năm\"</em>.</li>\n</ul>\n\n<h4>Chuẩn chú giải TIMEX3 & Chuẩn hóa ISO 8601 <a href=\"#ref-ch15-2\" class=\"cite-ref\" data-ref=\"ref-ch15-2\" title=\"Slide 10-16: TIMEX3 & Normalization\">[2]</a></h4>\n<p>Biến đổi các cụm từ ngôn ngữ tự nhiên về định dạng chuẩn máy đọc được:</p>\n<div class=\"code-block\">\n<pre><code class=\"language-xml\">&lt;!-- Nếu Document Creation Time là 2026-10-26T12:00:00 --&gt;\n&lt;TIMEX3 tid=\"t1\" type=\"DATE\" value=\"2026-10-25\" temporalFunction=\"true\"&gt;yesterday&lt;/TIMEX3&gt;\n&lt;TIMEX3 tid=\"t2\" type=\"DURATION\" value=\"P2M\"&gt;two months&lt;/TIMEX3&gt;</code></pre>\n</div>\n"
      },
      {
        "id": "ch15-sec2",
        "title": "2. Đại số khoảng thời gian của Allen (Allen's Interval Algebra)",
        "content_html": "\n<p>James Allen (1983) đã chứng minh rằng giữa hai khoảng thời gian bất kỳ $X = [x_1, x_2]$ và $Y = [y_1, y_2]$ trên trục số thực, chỉ tồn tại chính xác <strong>13 mối quan hệ định tính rời nhau (Mutually Exclusive)</strong> <a href=\"#ref-ch15-3\" class=\"cite-ref\" data-ref=\"ref-ch15-3\" title=\"Slide 17-20: Allen's Interval Algebra\">[3]</a>:</p>\n<table class=\"table-content\">\n  <thead><tr><th>Quan hệ cơ sở</th><th>Ký hiệu</th><th>Ý nghĩa hình học</th><th>Quan hệ nghịch đảo</th></tr></thead>\n  <tbody>\n    <tr><td><strong>Before</strong></td><td>$X < Y$</td><td>$X$ kết thúc trước khi $Y$ bắt đầu ($x_2 < y_1$)</td><td>After ($Y > X$)</td></tr>\n    <tr><td><strong>Meets</strong></td><td>$X \\text{ m } Y$</td><td>$X$ kết thúc đúng lúc $Y$ bắt đầu ($x_2 = y_1$)</td><td>Met-by ($Y \\text{ mi } X$)</td></tr>\n    <tr><td><strong>Overlaps</strong></td><td>$X \\text{ o } Y$</td><td>$X$ bắt đầu trước, kết thúc khi $Y$ đã bắt đầu nhưng chưa kết thúc</td><td>Overlapped-by ($Y \\text{ oi } X$)</td></tr>\n    <tr><td><strong>Starts</strong></td><td>$X \\text{ s } Y$</td><td>$X$ và $Y$ bắt đầu cùng lúc, $X$ kết thúc trước</td><td>Started-by ($Y \\text{ si } X$)</td></tr>\n    <tr><td><strong>During</strong></td><td>$X \\text{ d } Y$</td><td>$X$ nằm hoàn toàn bên trong khoảng $Y$</td><td>Contains ($Y \\text{ di } X$)</td></tr>\n    <tr><td><strong>Finishes</strong></td><td>$X \\text{ f } Y$</td><td>$X$ bắt đầu sau $Y$, nhưng cả hai kết thúc cùng lúc</td><td>Finished-by ($Y \\text{ fi } X$)</td></tr>\n    <tr><td><strong>Equals</strong></td><td>$X = Y$</td><td>$X$ và $Y$ hoàn toàn trùng khớp mốc thời gian</td><td>Equals ($=$)</td></tr>\n  </tbody>\n</table>\n<p><strong>Ứng dụng trong Tóm tắt văn bản (Timeline Summarization) <a href=\"#ref-ch15-4\" class=\"cite-ref\" data-ref=\"ref-ch15-4\" title=\"Slide 21-24: Temporal Summarization\">[4]</a>:</strong> Sử dụng đồ thị phụ thuộc thời gian để sắp xếp các sự kiện theo dòng thời gian thực thay vì thứ tự xuất hiện lộn xộn trong câu chữ.</p>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch15-1",
        "index": 1,
        "slide": "Slide 3-9",
        "topic": "Types of Temporal Information in Text",
        "ppt": "15. Time and Temporal Reasoning.ppt",
        "excerpt": "Taxonomy of explicit, implicit, duration, and periodic temporal expressions."
      },
      {
        "id": "ref-ch15-2",
        "index": 2,
        "slide": "Slide 10-16",
        "topic": "TIMEX3 Recognition & Normalization",
        "ppt": "15. Time and Temporal Reasoning.ppt",
        "excerpt": "TimeML annotation anchoring relative mentions to Document Creation Time in ISO 8601."
      },
      {
        "id": "ref-ch15-3",
        "index": 3,
        "slide": "Slide 17-20",
        "topic": "Allen's Interval Algebra & 13 Relations",
        "ppt": "15. Time and Temporal Reasoning.ppt",
        "excerpt": "Formal 13 qualitative interval relations and composition constraints for temporal reasoning."
      },
      {
        "id": "ref-ch15-4",
        "index": 4,
        "slide": "Slide 21-24",
        "topic": "Temporal Summarization & Trend Analysis",
        "ppt": "15. Time and Temporal Reasoning.ppt",
        "excerpt": "Constructing chronological timelines from graph-resolved event constraints."
      }
    ]
  },
  {
    "id": 16,
    "title": "Chapter 16: Word Senses and WordNet",
    "vn_title": "Nghĩa của từ & Cơ sở dữ liệu ngữ nghĩa WordNet",
    "ppt_file": "16. Word Senses and WordNet.ppt",
    "slide_count": 20,
    "summary": "Ngữ nghĩa học từ vựng: Phân biệt Từ nhiều nghĩa (Polysemy) vs Từ đồng âm (Homonymy), Cấu trúc cơ sở dữ liệu WordNet, Khái niệm Synset, Các quan hệ phân cấp (Hypernym, Hyponym, Meronym), Thuật toán khử nhập nhằng nghĩa (Word Sense Disambiguation - WSD / Simplified Lesk), và Các thước đo tương đồng ngữ nghĩa.",
    "key_terms": [
      {
        "term": "Polysemy vs Homonymy",
        "vn": "Từ nhiều nghĩa vs Từ đồng âm",
        "def": "Polysemy: word with related senses (bank of river/bank finance); Homonymy: identical word with unrelated origins (bat animal/baseball)."
      },
      {
        "term": "Synset (Synonym Set)",
        "vn": "Tập hợp đồng nghĩa Synset",
        "def": "Core WordNet unit grouping lemmas expressing the exact same semantic concept."
      },
      {
        "term": "Hypernymy & Hyponymy",
        "vn": "Thượng danh (is-a) & Hạ danh",
        "def": "Hypernym: superordinate broad category; Hyponym: subordinate specific instance."
      },
      {
        "term": "Meronymy & Holonymy",
        "vn": "Quan hệ Bộ phận & Toàn thể",
        "def": "Meronym represents a component part; Holonym represents the entire encompassing object."
      },
      {
        "term": "Word Sense Disambiguation (WSD)",
        "vn": "Khử nhập nhằng nghĩa từ",
        "def": "Task of determining which distinct sense of a polysemous word is used in context."
      },
      {
        "term": "Simplified Lesk Algorithm",
        "vn": "Thuật toán Lesk",
        "def": "Assigns the synset whose dictionary definition (gloss) overlaps most with context words."
      },
      {
        "term": "Path Similarity",
        "vn": "Độ đo tương đồng đường dẫn",
        "def": "Sim = 1 / (path_distance + 1) measuring shortest topological distance in taxonomic hierarchy."
      }
    ],
    "sections": [
      {
        "id": "ch16-sec1",
        "title": "1. Đa nghĩa (Polysemy), Đồng âm (Homonymy) & Cơ sở dữ liệu WordNet",
        "content_html": "\n<p>Một từ có thể tương ứng với nhiều nghĩa khác nhau tùy vào ngữ cảnh <a href=\"#ref-ch16-1\" class=\"cite-ref\" data-ref=\"ref-ch16-1\" title=\"Slide 3-5: Motivation for Word Senses\">[1]</a>:</p>\n<ul>\n  <li><strong>Từ nhiều nghĩa (Polysemy):</strong> Các nghĩa khác nhau nhưng có mối liên hệ ngữ nguyên hoặc tương đồng ẩn dụ (ví dụ: <code>bank</code> - bờ sông dốc vs <code>bank</code> - tòa nhà ngân hàng).</li>\n  <li><strong>Từ đồng âm (Homonymy):</strong> Cùng cách viết/phát âm nhưng nghĩa hoàn toàn tách biệt, không có chút liên hệ ngữ nguyên nào (ví dụ: <code>bat</code> - con dơi vs <code>bat</code> - cây gậy bóng chày).</li>\n</ul>\n\n<h4>Cấu trúc WordNet & Khái niệm Synset <a href=\"#ref-ch16-2\" class=\"cite-ref\" data-ref=\"ref-ch16-2\" title=\"Slide 6-9: WordNet Structure & Synsets\">[2]</a></h4>\n<p><strong>Princeton WordNet</strong> là cơ sở dữ liệu từ vựng ngữ nghĩa lớn nhất cho tiếng Anh. Đơn vị cơ bản trong WordNet là <strong>Synset (Synonym Set)</strong> — tập hợp các từ đồng nghĩa đại diện cho một khái niệm duy nhất. Mỗi Synset đi kèm một định nghĩa ngắn (Gloss) và các câu ví dụ minh họa.</p>\n"
      },
      {
        "id": "ch16-sec2",
        "title": "2. Các mối quan hệ ngữ nghĩa & Thuật toán khử nhập nhằng Lesk (WSD)",
        "content_html": "\n<h4>Các mối quan hệ cấu trúc trong WordNet <a href=\"#ref-ch16-3\" class=\"cite-ref\" data-ref=\"ref-ch16-3\" title=\"Slide 10-12: WordNet Semantic Relations\">[3]</a></h4>\n<table class=\"table-content\">\n  <thead><tr><th>Tên quan hệ</th><th>Bản chất quan hệ</th><th>Ví dụ minh họa</th></tr></thead>\n  <tbody>\n    <tr><td><strong>Hypernym (Thượng danh)</strong></td><td>Mối quan hệ <em>is-a</em> (Khái niệm bao trùm rộng hơn)</td><td><code>Vehicle</code> là hypernym của <code>Car</code></td></tr>\n    <tr><td><strong>Hyponym (Hạ danh)</strong></td><td>Mối quan hệ thể hiện cụ thể hóa</td><td><code>Apple</code> là hyponym của <code>Fruit</code></td></tr>\n    <tr><td><strong>Meronym (Bộ phận)</strong></td><td>Mối quan hệ <em>part-of</em> (Bộ phận của một chỉnh thể)</td><td><code>Wheel</code> là meronym của <code>Car</code></td></tr>\n    <tr><td><strong>Holonym (Toàn thể)</strong></td><td>Mối quan hệ chỉnh thể bao chứa bộ phận</td><td><code>Building</code> là holonym của <code>Door</code></td></tr>\n  </tbody>\n</table>\n\n<h4>Thuật toán Simplified Lesk khử nhập nhằng nghĩa (WSD) <a href=\"#ref-ch16-4\" class=\"cite-ref\" data-ref=\"ref-ch16-4\" title=\"Slide 13-18: WSD & Lesk Algorithm\">[4]</a></h4>\n<p>Cho một từ đa nghĩa $w$ trong câu ngữ cảnh $C$. Thuật toán chọn synset $S^*$ của từ $w$ có số lượng từ trùng khớp (Overlap) lớn nhất giữa định nghĩa (Gloss + Examples) của synset đó với các từ trong câu $C$:</p>\n<div class=\"formula-box\">\n  $$\\text{Sense}^*(w) = \\arg\\max_{S \\in \\text{Synsets}(w)} |\\text{Words}(\\text{Gloss}(S)) \\cap \\text{Words}(C)|$$\n</div>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch16-1",
        "index": 1,
        "slide": "Slide 3-5",
        "topic": "Motivation for Word Senses & Homonymy",
        "ppt": "16. Word Senses and WordNet.ppt",
        "excerpt": "Polysemy vs homonymy distinctions and computational disambiguation challenges."
      },
      {
        "id": "ref-ch16-2",
        "index": 2,
        "slide": "Slide 6-9",
        "topic": "WordNet Database Organization & Synsets",
        "ppt": "16. Word Senses and WordNet.ppt",
        "excerpt": "Core synonym set representations with dictionary glosses across POS syntactic categories."
      },
      {
        "id": "ref-ch16-3",
        "index": 3,
        "slide": "Slide 10-12",
        "topic": "WordNet Semantic Relations (Taxonomy & Meronymy)",
        "ppt": "16. Word Senses and WordNet.ppt",
        "excerpt": "Hypernym/hyponym taxonomic trees and meronym/holonym part-whole associations."
      },
      {
        "id": "ref-ch16-4",
        "index": 4,
        "slide": "Slide 13-18",
        "topic": "Word Sense Disambiguation & Lesk Algorithm",
        "ppt": "16. Word Senses and WordNet.ppt",
        "excerpt": "Contextual dictionary overlap maximization via Lesk algorithm and ontological path distances."
      }
    ]
  },
  {
    "id": 17,
    "title": "Chapter 17: Lexicons for Sentiment Effect and Connotation",
    "vn_title": "Từ điển cảm xúc & Sắc thái hàm nghĩa (Sentiment & Connotation Lexicons)",
    "ppt_file": "17. Lexicons for Sentiment Effect and Connotation.ppt",
    "slide_count": 22,
    "summary": "Tài nguyên từ vựng cho phân tích cảm xúc: Phân biệt Cực tính ban đầu (Prior Polarity) vs Ngữ cảnh, Không gian 3 chiều VAD (Valence, Arousal, Dominance), Các từ điển phổ biến (SentiWordNet, VADER), Khung sắc thái hàm nghĩa (Connotation Frames), và Mô hình lai kết hợp Từ điển với Học máy.",
    "key_terms": [
      {
        "term": "Sentiment Lexicon (SL)",
        "vn": "Từ điển cảm xúc",
        "def": "Curated vocabulary mapping words to affective valence ratings and polarity classifications."
      },
      {
        "term": "Valence, Arousal, Dominance (VAD)",
        "vn": "3 Chiều cảm xúc VAD",
        "def": "Valence (pleasure/displeasure), Arousal (active/passive excitation), Dominance (controlling/submissive)."
      },
      {
        "term": "SentiWordNet",
        "vn": "Từ điển SentiWordNet",
        "def": "WordNet extension assigning PosScore + NegScore + ObjScore = 1.0 to each synset."
      },
      {
        "term": "VADER Sentiment",
        "vn": "Bộ phân tích VADER",
        "def": "Rule-based sentiment analyzer optimized for social media using heuristics (caps, exclamation, conjunctions)."
      },
      {
        "term": "Connotation Lexicons",
        "vn": "Từ điển hàm nghĩa",
        "def": "Captures nuanced connotative framing: sentiment, agency, power, and moral effects."
      },
      {
        "term": "Connotation Frames",
        "vn": "Khung sắc thái hàm nghĩa",
        "def": "Formalizes how transitive verbs project implied social power and affect onto subjects and objects."
      }
    ],
    "sections": [
      {
        "id": "ch17-sec1",
        "title": "1. Bản chất Từ điển cảm xúc & Không gian 3 chiều VAD",
        "content_html": "\n<p><strong>Từ điển cảm xúc (Sentiment Lexicon)</strong> gán cho mỗi từ vựng một giá trị cực tính cảm xúc tiên nghiệm (Prior Polarity: Tích cực, Tiêu cực, hoặc Trung tính) <a href=\"#ref-ch17-1\" class=\"cite-ref\" data-ref=\"ref-ch17-1\" title=\"Slide 3-7: Sentiment Lexicons & Dimensions\">[1]</a>.</p>\n\n<h4>Mô hình 3 chiều cảm xúc VAD (Osgood & Russell):</h4>\n<ul>\n  <li><strong>Valence (Cực tính hài lòng):</strong> Đo mức độ tích cực hay tiêu cực của cảm xúc (từ đau khổ đến vui sướng).</li>\n  <li><strong>Arousal (Mức độ kích hoạt sinh lý / Năng lượng):</strong> Đo trạng thái kích thích (từ bình thản, buồn ngủ đến phấn khích, giận dữ).</li>\n  <li><strong>Dominance (Mức độ kiểm soát / Quyền lực):</strong> Đo cảm giác làm chủ tình thế hay bị chi phối, bất lực.</li>\n</ul>\n"
      },
      {
        "id": "ch17-sec2",
        "title": "2. Các từ điển tiêu biểu: SentiWordNet & Thuật toán VADER",
        "content_html": "\n<h4>SentiWordNet <a href=\"#ref-ch17-2\" class=\"cite-ref\" data-ref=\"ref-ch17-2\" title=\"Slide 8-11: Examples of Sentiment Lexicons\">[2]</a></h4>\n<p>Gán cho mỗi synset của WordNet 3 điểm số liên tục thỏa mãn tổng bằng 1.0:</p>\n<div class=\"formula-box\">\n  $$\\text{PosScore}(s) + \\text{NegScore}(s) + \\text{ObjScore}(s) = 1.0$$\n</div>\n<p>Trong đó $\\text{ObjScore}$ đo lường tính khách quan (tính phi cảm xúc) của từ.</p>\n\n<h4>Hệ phân tích cảm xúc VADER (Valence Aware Dictionary and sEntiment Reasoner)</h4>\n<p>VADER kết hợp từ điển cực tính với <strong>5 quy tắc suy luận heuristic kinh nghiệm</strong> để xử lý sắc thái mạng xã hội:</p>\n<ol>\n  <li><strong>Dấu chấm than (Punctuation):</strong> Dấu chấm than làm tăng cường độ cảm xúc (<em>\"Great!\"</em> mạnh hơn <em>\"Great\"</em>).</li>\n  <li><strong>Viết hoa toàn bộ (Capitalization):</strong> Viết hoa tăng cường độ (<em>\"GREAT\"</em> mạnh hơn <em>\"great\"</em>).</li>\n  <li><strong>Từ bổ nghĩa mức độ (Degree Adverbs / Intensifiers):</strong> <em>\"extremely good\"</em> đẩy điểm cao hơn; <em>\"slightly good\"</em> giảm điểm.</li>\n  <li><strong>Liên từ đối lập \"but\" (Contrastive Conjunctions):</strong> Mệnh đề đi sau \"but\" chi phối cảm xúc chủ đạo (<em>\"The food was good, but the service was terrible\"</em> $\\implies$ kết luận tiêu cực).</li>\n  <li><strong>Xử lý phủ định (Negation):</strong> Đảo ngược dấu cực tính khi xuất hiện từ phủ định (<em>\"not good\"</em>).</li>\n</ol>\n"
      },
      {
        "id": "ch17-sec3",
        "title": "3. Connotation Frames & Mô hình lai ghép với Machine Learning",
        "content_html": "\n<h4>Khung sắc thái hàm nghĩa (Connotation Frames) <a href=\"#ref-ch17-3\" class=\"cite-ref\" data-ref=\"ref-ch17-3\" title=\"Slide 12-16: Connotation Lexicons & Frames\">[3]</a></h4>\n<p>Nghiên cứu cách các động từ truyền tải ngầm định vị thế xã hội và quyền năng của chủ thể và tân ngữ. Ví dụ: với động từ <em>\"X defeats Y\"</em> $\\implies$ ngụ ý $X$ có quyền năng cao (High power) và nhận hiệu ứng tích cực; trong khi $Y$ chịu hiệu ứng tiêu cực.</p>\n\n<h4>Mô hình lai ghép (Hybrid Approaches) <a href=\"#ref-ch17-4\" class=\"cite-ref\" data-ref=\"ref-ch17-4\" title=\"Slide 17-21: Applications & Hybrid Machine Learning\">[4]</a></h4>\n<p>Kết hợp điểm số trích xuất từ từ điển cảm xúc làm đặc trưng bổ trợ đưa vào mô hình học máy (Logistic Regression, Random Forest, hoặc BERT), giúp giải quyết các văn bản ngắn bị hạn chế về ngữ cảnh.</p>\n"
      }
    ],
    "references": [
      {
        "id": "ref-ch17-1",
        "index": 1,
        "slide": "Slide 3-7",
        "topic": "Sentiment Lexicons & Affective Dimensions (VAD)",
        "ppt": "17. Lexicons for Sentiment Effect and Connotation.ppt",
        "excerpt": "Lexical polarity mapping and the 3-dimensional Valence, Arousal, Dominance emotional model."
      },
      {
        "id": "ref-ch17-2",
        "index": 2,
        "slide": "Slide 8-11",
        "topic": "Prominent Lexicons: SentiWordNet & VADER",
        "ppt": "17. Lexicons for Sentiment Effect and Connotation.ppt",
        "excerpt": "Pos/Neg/Obj triplet distributions in SentiWordNet and social heuristics in VADER."
      },
      {
        "id": "ref-ch17-3",
        "index": 3,
        "slide": "Slide 12-16",
        "topic": "Connotation Lexicons & Framing Theory",
        "ppt": "17. Lexicons for Sentiment Effect and Connotation.ppt",
        "excerpt": "Implicit social power, agency, and effect relations modeled via verbal connotation frames."
      },
      {
        "id": "ref-ch17-4",
        "index": 4,
        "slide": "Slide 17-21",
        "topic": "Applications & Hybrid Machine Learning Integration",
        "ppt": "17. Lexicons for Sentiment Effect and Connotation.ppt",
        "excerpt": "Combining lexical sentiment scores with supervised discriminative classifiers for domain adaptation."
      }
    ]
  }
];
