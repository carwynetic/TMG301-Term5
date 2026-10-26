# 🎓 TMG301 Master Exam Prep Portal

> **Hệ thống Ôn tập & Thi thử Khai phá Văn bản (Text Mining - TMG301) Toàn diện**  
> Dành cho sinh viên ngành Trí tuệ Nhân tạo (AI) - Đại học FPT (Term 5).

---

## 🚀 Hướng Dẫn Khởi Chạy (Quickstart)

Hệ thống được thiết kế hoàn toàn theo mô hình **Zero-Dependency & Offline First**, không cần kết nối Internet, không cần cài đặt `npm` hay `node_modules`.

### Cách 1: Khởi chạy bằng Local Server (Khuyên dùng)
1. Double-click vào file **`start_server.bat`** (hoặc mở terminal chạy: `python server.py`).
2. Trình duyệt mặc định sẽ tự động mở địa chỉ: **`http://localhost:8000`**.
3. Để dừng server, nhấn `Ctrl + C` trong cửa sổ lệnh.

### Cách 2: Mở trực tiếp không cần Server
- Nhấp đúp chuột mở trực tiếp file **`index.html`** trong trình duyệt (Chrome, Edge, Firefox, Brave).
- Toàn bộ cơ sở dữ liệu bài học và 950 câu hỏi đều được bundle dưới dạng tệp dữ liệu cục bộ (`data/*.js`), đảm bảo chạy mượt mà ngay cả trên giao thức `file://` mà không bị lỗi CORS!

---

## 📚 Tính Năng Trọng Tâm

### 1. Cơ sở tri thức 17 Chuyên đề (17 Chapters Knowledge Base)
- Bao phủ đầy đủ 17 bộ slide bài giảng chính thức môn TMG301 tại FPT University.
- Mỗi chương đều có:
  - **Mục lục kiến thức chuẩn hóa**: Phân tách rõ ràng các phần lý thuyết, mô hình toán học, công thức tính toán và khối mã lệnh (Python, NLTK, spaCy, Transformers, Scikit-learn).
  - **Trích dẫn nội văn tương tác (`[1]`, `[2]`, ...)**: Hover chuột để xem thông tin trang slide; nhấp chuột để cuộn mượt (smooth-scroll) kèm hiệu ứng phát sáng (glow) tới thẻ tài liệu tham khảo chi tiết ở chân trang.
  - **Mục Tài liệu tham khảo (References)**: Đối chiếu chính xác số trang slide (`Slide Range`) và tên tệp bài giảng gốc (`.ppt`).

### 2. Luyện tập trắc nghiệm theo chương (50 câu / chương = 850 câu)
- 17 chương × 50 câu hỏi = **850 câu hỏi** trắc nghiệm tiếng Anh bám sát đề thi PE/FE.
- Phân loại rõ ràng: *Theory, Calculation, Code, Scenario*.
- Chấm điểm tức thì, tô màu trực quan (xanh lá = Đúng, đỏ = Sai).
- Hộp giải thích học thuật chuyên sâu và nguồn trang slide đối chiếu.
- Tự động lưu tiến độ làm bài vào `localStorage`.

### 3. Động cơ Thi thử Mô phỏng (50 phút / 50 câu ngẫu nhiên)
- **Quy mô đề thi**: 50 câu hỏi bốc ngẫu nhiên từ ngân hàng **950 câu hỏi** (850 câu 17 chương + 100 câu tổng hợp liên chương).
- **Phân bổ phân tầng (Stratified Sampling)**: Đảm bảo phủ đều 17 chương học (mỗi chương 2 câu) cùng các câu hỏi tổng hợp liên chương.
- **Đồng hồ đếm ngược thời gian thực**: 50:00 (3000 giây) kèm cảnh báo chuyển màu khi sắp hết giờ; tự động thu bài khi hết 50 phút.
- **Bảng điều hướng câu hỏi (Palette Grid)**: 50 nút bấm trực quan (Đã làm, Chưa làm, Đánh dấu cờ Flag).
- **Chẩn đoán độ thành thạo theo từng chuyên đề (Chapter Mastery Breakdown)**:
  - Bảng thống kê chi tiết tỷ lệ làm đúng trên từng chương học trong đề thi.
  - Phân loại mức độ: *Thành thạo (≥80%)*, *Trung bình (50-79%)*, *Cần ôn lại (<50%)*.
  - **Hộp gợi ý trọng tâm**: Chỉ rõ những chương sinh viên đang bị hổng kiến thức để ôn tập cấp tốc.
- **Chế độ Xem lại toàn diện (Full Review Mode)**: Xem lại chi tiết 50 câu thi kèm bộ lọc (*Tất cả*, *Chỉ xem câu sai*, *Chỉ xem câu đúng*, *Chỉ xem câu gắn cờ*).
- **Lưu lịch sử thi**: Ghi nhớ lịch sử các lần thi thử, điểm số, tỷ lệ % và thời gian làm bài.

### 4. Khám phá Ngân hàng 950 câu hỏi (Question Bank Explorer)
- Duyệt và tra cứu toàn bộ **950 câu hỏi trắc nghiệm**.
- Bộ lọc đa chiều: Theo từng chương (Chapter 1-17, Tổng hợp), theo trạng thái làm bài (Tất cả, Chưa làm, Đúng, Sai), và tìm kiếm văn bản tức thì theo từ khóa.

### 5. Từ điển thuật ngữ (Glossary) & Tìm kiếm nhanh (`Ctrl + K`)
- Từ điển thuật ngữ chuyên ngành NLP / Text Mining: Thuật ngữ tiếng Anh, dịch nghĩa tiếng Việt, định nghĩa học thuật và vị trí chương/slide.
- Hộp tìm kiếm thông minh toàn cục (`Ctrl + K` hoặc `Cmd + K`): Tìm nhanh chương học, câu hỏi hoặc thuật ngữ bất cứ lúc nào.

### 6. Giao diện & Trải nghiệm
- Chế độ Sáng / Tối (Light / Dark mode) lưu trữ tự động.
- Giao diện đáp ứng (Responsive) tối ưu trên cả máy tính, máy tính bảng và điện thoại.

---

## 🗂️ Danh Mục 17 Chuyên Đề & Tệp Slide Đối Chiếu

| Chương | Tên Chuyên Đề (English / Tiếng Việt) | Tệp Slide Gốc | Số Câu Hỏi |
| :---: | :--- | :--- | :---: |
| **01** | Regular Expressions, Text Normalization & SDIT Distance | `01. Regular Expressions - Text Normalization - SDIT Distance.ppt` | 50 câu |
| **02** | N-Gram Language Models & Smoothing Techniques | `02. N-Gram Language Models.ppt` | 50 câu |
| **03** | Naive Bayes, Text Classification & Sentiment | `03. Naive Bayes - Text Classification and Sentiment.ppt` | 50 câu |
| **04** | Logistic Regression, Sigmoid & Regularization | `04. Logistic Regression.ppt` | 50 câu |
| **05** | Vector Semantics, Embeddings, TF-IDF & Word2Vec | `05. Vector Semantics and Embeddings.ppt` | 50 câu |
| **06** | Clustering for Text Similarity (K-Means & Hierarchical) | `06. Clustering for Text Similarity.ppt` | 50 câu |
| **07** | Transformer Architecture & Pre-Trained Language Models | `07. Transformer and Pre-Tranined Language Models.ppt` | 50 câu |
| **08** | Fine-Tuning & Masked Language Models (BERT, RoBERTa) | `08. Fine-Tuning and Masked Language Models.ppt` | 50 câu |
| **09** | Machine Translation & Seq2Seq Models | `09. Machine Translation.ppt` | 50 câu |
| **10** | Chatbots & Dialogue Systems | `10. Chatbot and Dialogue Systems.ppt` | 50 câu |
| **11** | Context-Free Grammars (CFG) & Constituency Parsing | `11. Context-Free Grammars and Constituency Parsing.ppt` | 50 câu |
| **12** | Dependency Parsing & Transition/Graph Systems | `12. Dependency Parsing.ppt` | 50 câu |
| **13** | Logical Representations of Sentence Meaning & FOL | `13. Locial Representations of Sentences Meaning.ppt` | 50 câu |
| **14** | Relation & Event Extraction (SRL, FrameNet, AMR) | `14. Relation and Event Extraction.ppt` | 50 câu |
| **15** | Time & Temporal Reasoning (TimeML, TIMEX3) | `15. Time and Temporal Reasoning.ppt` | 50 câu |
| **16** | Word Senses, WordNet & WSD Algorithms | `16. Word Senses and WordNet.ppt` | 50 câu |
| **17** | Lexicons for Sentiment Effect & Connotation (VADER) | `17. Lexicons for Sentiment Effect and Connotation.ppt` | 50 câu |
| **Comp**| Comprehensive Synthesis & Cross-Chapter Pipelines | `Comprehensive Synthesis` | 100 câu |
| **TỔNG**| **17 Chuyên đề + Bộ Tổng hợp liên chương** | **Toàn bộ giáo trình TMG301** | **950 CÂU** |

---

## 🛠️ Cấu Trúc Thư Mục Dự Án

```
TMG301-Term5/
├── index.html            # Giao diện chính Single-Page Web App
├── server.py             # HTTP Server Python siêu nhẹ tự mở trình duyệt
├── start_server.bat      # Script khởi chạy 1-click trên Windows
├── README.md             # Tài liệu hướng dẫn sử dụng chi tiết
├── css/
│   └── style.css         # Hệ thống thiết kế học thuật, Dark/Light theme, bố cục responsive
├── js/
│   ├── app.js            # Điều khiển logic ứng dụng, thi thử, ngân hàng câu hỏi, tra cứu
│   ├── data-chapters.js  # Bundle dữ liệu 17 chương học (Offline)
│   └── data-questions.js # Bundle dữ liệu 950 câu hỏi trắc nghiệm (Offline)
└── data/
    ├── chapters.js       # Metadata 17 chương học
    ├── chapters.json     # JSON 17 chương học
    ├── knowledge.js      # Nội dung bài giảng chi tiết & trích dẫn slide
    ├── knowledge.json    # JSON cơ sở tri thức 17 chương
    ├── questions.js      # 950 câu hỏi trắc nghiệm kèm giải thích
    ├── questions.json    # JSON ngân hàng 950 câu hỏi
    └── glossary.js       # Từ điển thuật ngữ chuyên ngành TMG301
```

---

*Chúc các bạn sinh viên FPT University ôn thi thật tốt và đạt điểm số xuất sắc trong kỳ thi TMG301!*
