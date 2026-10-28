/**
 * TMG301 Master Exam Prep - Local Single Page Application
 * Core Application Logic, State Management, Engines for Knowledge, Quiz, Exam, and Glossary
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentView: 'knowledge', // 'knowledge' | 'quiz' | 'exam' | 'glossary'
    currentChapter: 1,        // 1 to 17
    theme: localStorage.getItem('tmg_theme') || 'dark',
    
    // Quiz Progress Cache (saved to localStorage)
    quizAnswers: JSON.parse(localStorage.getItem('tmg_quiz_answers') || '{}'),
    
    // Live Exam State
    liveExam: null,
    
    // Exam History
    examHistory: JSON.parse(localStorage.getItem('tmg_exam_history') || '[]'),

    // Search query
    searchQuery: '',
    glossaryQuery: '',

    // Question Bank Explorer Filters
    bankChapterFilter: 'all',
    bankSearchQuery: '',
    bankStatusFilter: 'all',
    bankCurrentLimit: 50,
    bankShowAllAnswers: false,
    bankRevealedAnswers: {},

    // Exam Review Filter
    examReviewFilter: 'all'
  };

  // Utility: HTML Sanitizer / Escaper
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Utility: Uniform Fisher-Yates Array Shuffle
  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Utility: Hydrate Exam Questions from IDs
  function getQuestionsForRecord(record) {
    if (record.questions && record.questions.length > 0) return record.questions;
    const qMap = new Map((window.TMG_QUESTIONS || []).map(q => [q.id, q]));
    return (record.questionIds || []).map(id => qMap.get(id)).filter(Boolean);
  }

  // Utility: KaTeX Mathematical Typesetting Engine
  function typesetMath(element) {
    const target = element || dom.contentArea || document.body;
    if (!target) return;

    if (typeof window.renderMathInElement === 'function') {
      try {
        window.renderMathInElement(target, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false }
          ],
          ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'annotation', 'annotation-xml'],
          ignoredClasses: ['no-math', 'btn-search-trigger'],
          throwOnError: false,
          errorColor: '#ef4444',
          strict: false
        });
      } catch (err) {
        console.warn('KaTeX typesetting warning:', err);
      }
    }
  }

  // Utility: Lightweight Content & Markdown Formatter (F07)
  function formatContentText(str) {
    if (!str) return '';
    if (typeof str !== 'string') return String(str);

    // 1. Stash KaTeX math delimiters ($$...$$ and $...$)
    const mathStash = [];
    let processed = str.replace(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g, (match) => {
      mathStash.push(match);
      return `___MATH_PLACEHOLDER_${mathStash.length - 1}___`;
    });

    // 2. Stash pre-existing safe HTML tags like <code>$</code>, <span>...</span>, <i>...</i>
    const tagStash = [];
    processed = processed.replace(/(<code[^>]*>[\s\S]*?<\/code>|<span[^>]*>[\s\S]*?<\/span>|<i[^>]*>[\s\S]*?<\/i>)/gi, (match) => {
      tagStash.push(match);
      return `___TAG_PLACEHOLDER_${tagStash.length - 1}___`;
    });

    // 3. Escape raw HTML entities on remaining text
    processed = processed
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 4. Markdown inline code: `code`
    processed = processed.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>');

    // 5. Markdown bold: **text**
    processed = processed.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');

    // 6. Markdown italic: *text*
    processed = processed.replace(/(^|[^*])\*([^*\n]+)\*([^*]|$)/g, '$1<em>$2</em>$3');

    // 7. Restore safe HTML tags
    processed = processed.replace(/___TAG_PLACEHOLDER_(\d+)___/g, (_, idx) => tagStash[Number(idx)] || '');

    // 8. Restore math placeholders
    processed = processed.replace(/___MATH_PLACEHOLDER_(\d+)___/g, (_, idx) => mathStash[Number(idx)] || '');

    return processed;
  }

  // Utility: Debounce function for smooth search keystrokes (F12)
  function debounce(fn, delay = 200) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // DOM Elements Cache
  const dom = {};

  function initDOMElements() {
    dom.html = document.documentElement;
    dom.sidebarChapters = document.getElementById('sidebar-chapters');
    dom.contentArea = document.getElementById('app-content-area');
    dom.navTabBtns = document.querySelectorAll('.nav-tab-btn');
    dom.themeToggleBtn = document.getElementById('btn-theme-toggle');
    dom.themeIcon = document.getElementById('theme-icon');
    dom.mobileMenuBtn = document.getElementById('btn-mobile-menu');
    dom.appSidebar = document.getElementById('app-sidebar');
    dom.globalSearchModal = document.getElementById('global-search-modal');
    dom.globalSearchInput = document.getElementById('global-search-input');
    dom.globalSearchResults = document.getElementById('global-search-results');
    dom.btnSearchTrigger = document.getElementById('btn-search-trigger');
  }

  // --- THEME MANAGEMENT ---
  function applyTheme(theme) {
    state.theme = theme;
    dom.html.setAttribute('data-theme', theme);
    localStorage.setItem('tmg_theme', theme);
    if (dom.themeIcon) {
      dom.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  function toggleTheme() {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  // --- ROUTING & NAVIGATION ---
  function setView(viewName, chapterId) {
    state.currentView = viewName;
    if (chapterId !== undefined) {
      state.currentChapter = parseInt(chapterId, 10);
    }

    // Update Tab Navigation Active State
    dom.navTabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Update Sidebar Active Chapter
    updateSidebarActiveState();

    // Render View
    renderCurrentView();

    // Close mobile sidebar if open
    if (dom.appSidebar) {
      dom.appSidebar.classList.remove('mobile-open');
    }

    // Scroll window to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateSidebarActiveState() {
    const btns = dom.sidebarChapters ? dom.sidebarChapters.querySelectorAll('.chapter-item-btn') : [];
    btns.forEach(btn => {
      const ch = parseInt(btn.dataset.chapter, 10);
      btn.classList.toggle('active', ch === state.currentChapter);
    });
  }

  function renderSidebar() {
    if (!dom.sidebarChapters || !window.TMG_CHAPTERS) return;

    dom.sidebarChapters.innerHTML = window.TMG_CHAPTERS.map(ch => `
      <li>
        <button class="chapter-item-btn ${ch.id === state.currentChapter ? 'active' : ''}" data-chapter="${ch.id}">
          <span class="ch-num-tag">Chapter ${ch.id}</span>
          <span class="ch-title-text">${ch.title}</span>
          <div class="ch-meta-row">
            <span><i class="far fa-file-powerpoint"></i> Slide 1-${window.TMG_KNOWLEDGE[ch.id]?.references?.length * 5 || 25}</span>
            <span><i class="far fa-question-circle"></i> 50 câu</span>
          </div>
        </button>
      </li>
    `).join('');

    dom.sidebarChapters.querySelectorAll('.chapter-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ch = parseInt(btn.dataset.chapter, 10);
        setView(state.currentView, ch);
      });
    });
  }

  // --- VIEW RENDERERS ---
  function renderCurrentView() {
    if (!dom.contentArea) return;

    dom.contentArea.classList.remove('view-animate');
    void dom.contentArea.offsetWidth;
    dom.contentArea.classList.add('view-animate');

    switch (state.currentView) {
      case 'knowledge':
        renderKnowledgeView();
        break;
      case 'quiz':
        renderQuizView();
        break;
      case 'exam':
        renderExamBannerView();
        break;
      case 'bank':
        renderQuestionBankView();
        break;
      case 'glossary':
        renderGlossaryView();
        break;
      default:
        renderKnowledgeView();
    }

    typesetMath(dom.contentArea);
  }

  // 1. KNOWLEDGE VIEW
  function renderKnowledgeView() {
    const chData = window.TMG_CHAPTERS.find(c => c.id === state.currentChapter);
    const knowData = window.TMG_KNOWLEDGE[state.currentChapter];

    if (!chData || !knowData) {
      dom.contentArea.innerHTML = `<div class="p-4">Dữ liệu chương ${state.currentChapter} đang được tải...</div>`;
      return;
    }

    const refsHtml = (knowData.references || []).map(ref => `
      <div class="ref-item-card" id="ref-${ref.id}">
        <div class="ref-top-row">
          <span class="ref-id-badge">[${ref.id}]</span>
          <span class="ref-slide-badge"><i class="fas fa-desktop"></i> ${ref.slide_range}</span>
        </div>
        <div class="ref-title">${ref.title}</div>
        <div class="ref-file-name"><i class="far fa-file-powerpoint"></i> File: <strong>${ref.file}</strong></div>
        <div class="ref-excerpt">"${ref.excerpt}"</div>
      </div>
    `).join('');

    dom.contentArea.innerHTML = `
      <div class="chapter-hero">
        <span class="ch-hero-category"><i class="${chData.icon}"></i> ${chData.category}</span>
        <h1 class="ch-hero-title">Chapter ${chData.id}: ${chData.title}</h1>
        <p class="ch-hero-subtitle">${chData.title_vn}</p>
        <div class="ch-hero-file"><i class="far fa-file-powerpoint"></i> Nguồn slide gốc: ${chData.file}</div>
      </div>

      <div class="chapter-action-bar">
        <div style="font-size: 0.9rem; color: var(--text-muted);">
          <i class="fas fa-book-open"></i> Kiến thức cô đọng kèm ví dụ & trích dẫn Slide PPT
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-primary" id="btn-jump-quiz">
            <i class="fas fa-pencil-alt"></i> Luyện tập 50 câu Ch.${chData.id}
          </button>
        </div>
      </div>

      <article class="knowledge-article">
        ${knowData.content_html}
      </article>

      <section class="references-container" id="chapter-references">
        <div class="references-header">
          <i class="fas fa-bookmark" style="color: var(--accent-primary); font-size: 1.25rem;"></i>
          <h3>Tài liệu trích dẫn Slide PPT (References)</h3>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          Mỗi mục kiến thức phía trên đều được đối chiếu chính xác với các trang slide và đề mục trong tệp bài giảng gốc <code>${chData.file}</code>.
        </p>
        <div class="references-list">
          ${refsHtml}
        </div>
      </section>
    `;

    // Action button jump to quiz
    const jumpQuizBtn = document.getElementById('btn-jump-quiz');
    if (jumpQuizBtn) {
      jumpQuizBtn.addEventListener('click', () => {
        setView('quiz', state.currentChapter);
      });
    }

    // Attach citation anchor click handlers & tooltip titles
    dom.contentArea.querySelectorAll('.cite-ref').forEach(citeLink => {
      const refId = citeLink.getAttribute('href');
      const refNum = refId ? refId.replace('#ref-', '') : '';
      const refData = (knowData.references || []).find(r => String(r.id) === String(refNum));
      if (refData) {
        const slideLabel = refData.slide_range.startsWith('Slide') ? refData.slide_range : `Slide ${refData.slide_range}`;
        citeLink.setAttribute('title', `${slideLabel}: ${refData.title}`);
      }

      citeLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetCard = document.querySelector(refId);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetCard.classList.add('highlighted');
          setTimeout(() => {
            targetCard.classList.remove('highlighted');
          }, 2500);
        }
      });
    });

    typesetMath(dom.contentArea);
  }

  // 2. QUIZ PRACTICE VIEW (50 Questions per Chapter)
  let quizFilter = 'all'; // 'all' | 'unanswered' | 'wrong'

  function renderQuizView() {
    const chData = window.TMG_CHAPTERS.find(c => c.id === state.currentChapter);
    const questions = (window.TMG_QUESTIONS || []).filter(q => q.chapter === state.currentChapter);

    const answeredCount = questions.filter(q => state.quizAnswers[q.id] !== undefined).length;
    const correctCount = questions.filter(q => state.quizAnswers[q.id] === q.correct).length;

    dom.contentArea.innerHTML = `
      <div class="quiz-header-card">
        <div class="quiz-title-group">
          <h2><i class="fas fa-edit"></i> Luyện tập Trắc nghiệm Chapter ${state.currentChapter}</h2>
          <p id="quiz-stats-summary" style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">
            ${chData ? chData.title : ''} • Đã làm: <strong>${answeredCount}/50</strong> (Đúng: <strong style="color: var(--accent-success);">${correctCount}</strong>)
          </p>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
          <div class="quiz-filter-bar">
            <button class="filter-btn ${quizFilter === 'all' ? 'active' : ''}" data-filter="all">Tất cả (50)</button>
            <button class="filter-btn ${quizFilter === 'unanswered' ? 'active' : ''}" data-filter="unanswered">Chưa làm</button>
            <button class="filter-btn ${quizFilter === 'wrong' ? 'active' : ''}" data-filter="wrong">Làm sai</button>
          </div>
          <button class="btn-outline" id="btn-reset-quiz" title="Đặt lại kết quả làm bài chương này">
            <i class="fas fa-redo"></i> Reset
          </button>
        </div>
      </div>

      <div class="questions-stream" id="quiz-questions-stream">
        ${renderQuizQuestionsList(questions)}
      </div>
    `;

    // Filter events
    dom.contentArea.querySelectorAll('.quiz-filter-bar .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        quizFilter = btn.dataset.filter;
        renderQuizView();
      });
    });

    // Reset quiz
    const resetBtn = document.getElementById('btn-reset-quiz');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm(`Bạn có chắc muốn xóa kết quả làm bài của Chapter ${state.currentChapter}?`)) {
          questions.forEach(q => delete state.quizAnswers[q.id]);
          localStorage.setItem('tmg_quiz_answers', JSON.stringify(state.quizAnswers));
          renderQuizView();
        }
      });
    }

    // Attach answer option click events
    attachQuizOptionHandlers();

    typesetMath(dom.contentArea);
  }

  function renderQuizQuestionsList(questions) {
    const letters = ['A', 'B', 'C', 'D', 'E'];

    return questions.map((q, idx) => {
      const userAns = state.quizAnswers[q.id];
      const isAnswered = userAns !== undefined;
      const isCorrect = isAnswered && userAns === q.correct;

      // Filter check
      if (quizFilter === 'unanswered' && isAnswered) return '';
      if (quizFilter === 'wrong' && (!isAnswered || isCorrect)) return '';

      let cardStatusClass = '';
      if (isAnswered) {
        cardStatusClass = isCorrect ? 'answered-correct' : 'answered-wrong';
      }

      const optionsHtml = q.options.map((opt, optIdx) => {
        let optClass = 'option-btn';
        if (isAnswered) {
          if (optIdx === q.correct) optClass += ' correct';
          else if (optIdx === userAns) optClass += ' wrong';
        }
        return `
          <button class="${optClass}" data-qid="${q.id}" data-opt="${optIdx}" ${isAnswered ? 'disabled' : ''}>
            <span class="opt-letter">${letters[optIdx]}</span>
            <span>${formatContentText(opt)}</span>
          </button>
        `;
      }).join('');

      return `
        <div class="question-card ${cardStatusClass}" id="q-card-${q.id}">
          <div class="q-card-header">
            <span class="q-index-badge">Câu ${idx + 1}/50</span>
            <span class="q-topic-tag"><i class="fas fa-tag"></i> ${escapeHtml(q.topic)}</span>
          </div>
          <div class="q-text">${formatContentText(q.question)}</div>
          <div class="options-grid">
            ${optionsHtml}
          </div>
          <div class="explanation-box ${isAnswered ? 'show' : ''}" id="exp-box-${q.id}">
            <div class="exp-header">
              <i class="fas fa-lightbulb"></i> Giải thích chi tiết & Đáp án đúng:
            </div>
            <div>${formatContentText(q.explanation)}</div>
            <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-muted);">
              <i class="far fa-file-powerpoint"></i> Nguồn tham khảo: ${escapeHtml(q.slide_ref)}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function attachQuizOptionHandlers() {
    dom.contentArea.querySelectorAll('.option-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        const opt = parseInt(btn.dataset.opt, 10);
        state.quizAnswers[qid] = opt;
        localStorage.setItem('tmg_quiz_answers', JSON.stringify(state.quizAnswers));

        // In-place DOM update (Contract 3 & F11)
        const card = document.getElementById(`q-card-${qid}`);
        const qMap = new Map((window.TMG_QUESTIONS || []).map(q => [q.id, q]));
        const q = qMap.get(qid);

        if (card && q && quizFilter === 'all') {
          const isCorrect = opt === q.correct;
          card.classList.remove('answered-correct', 'answered-wrong');
          card.classList.add(isCorrect ? 'answered-correct' : 'answered-wrong');

          const optBtns = card.querySelectorAll('.option-btn');
          optBtns.forEach((b, idx) => {
            b.disabled = true;
            b.classList.remove('correct', 'wrong');
            if (idx === q.correct) b.classList.add('correct');
            else if (idx === opt) b.classList.add('wrong');
          });

          const expBox = card.querySelector('.explanation-box');
          if (expBox) {
            expBox.classList.add('show');
          }

          updateQuizStatsHeader();
          typesetMath(card);
          return;
        }

        renderQuizView();
      });
    });
  }

  function updateQuizStatsHeader() {
    const statsElem = document.getElementById('quiz-stats-summary');
    if (!statsElem) return;
    const chData = window.TMG_CHAPTERS.find(c => c.id === state.currentChapter);
    const questions = (window.TMG_QUESTIONS || []).filter(q => q.chapter === state.currentChapter);
    const answeredCount = questions.filter(q => state.quizAnswers[q.id] !== undefined).length;
    const correctCount = questions.filter(q => state.quizAnswers[q.id] === q.correct).length;

    statsElem.innerHTML = `
      ${chData ? escapeHtml(chData.title) : ''} • Đã làm: <strong>${answeredCount}/50</strong> (Đúng: <strong style="color: var(--accent-success);">${correctCount}</strong>)
    `;
  }

  // 3. EXAM SIMULATION (50 Mins / 50 Random Questions from 950 questions)
  function renderExamBannerView() {
    if (state.liveExam && state.liveExam.isActive) {
      renderLiveExamInterface();
      return;
    }

    const historyHtml = state.examHistory.length === 0 
      ? '<p style="color: var(--text-muted); font-style: italic;">Bạn chưa thực hiện bài thi thử nào.</p>'
      : `
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Ngày thi</th>
                <th>Điểm số</th>
                <th>Tỷ lệ</th>
                <th>Kết quả</th>
                <th>Thời gian làm</th>
                <th style="text-align: center;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              ${state.examHistory.slice(-10).reverse().map(h => `
                <tr>
                  <td>${escapeHtml(h.date)}</td>
                  <td><strong>${h.score}/50</strong></td>
                  <td>${Math.round((h.score / 50) * 100)}%</td>
                  <td><span style="color: ${h.score >= 30 ? 'var(--accent-success)' : 'var(--accent-danger)'}; font-weight: 700;">${h.score >= 30 ? 'ĐẠT (PASS)' : 'CHƯA ĐẠT'}</span></td>
                  <td>${escapeHtml(h.timeSpent)}</td>
                  <td style="text-align: center;">
                    <button class="btn-outline btn-sm btn-view-history" data-exam-id="${h.id}">
                      <i class="fas fa-eye"></i> Xem lại
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

    dom.contentArea.innerHTML = `
      <div class="exam-banner">
        <h2><i class="fas fa-stopwatch"></i> Thi thử mô phỏng TMG301 (50 Phút / 50 Câu)</h2>
        <p style="opacity: 0.9; line-height: 1.5;">
          Hệ thống ngân hàng đề thi chuẩn bị <strong>950 câu hỏi</strong> (850 câu hỏi từ 17 chương + 100 câu hỏi tổng hợp liên chương). 
          Mỗi lượt thi thử, hệ thống sẽ bốc ngẫu nhiên 50 câu hỏi phân bổ đều khắp các chuyên đề giúp bạn kiểm tra toàn diện năng lực.
        </p>

        <div class="exam-specs-grid">
          <div class="spec-card">
            <div class="spec-val">50</div>
            <div class="spec-label">Số lượng câu hỏi</div>
          </div>
          <div class="spec-card">
            <div class="spec-val">50:00</div>
            <div class="spec-label">Thời gian đếm ngược</div>
          </div>
          <div class="spec-card">
            <div class="spec-val">30 / 50</div>
            <div class="spec-label">Điểm đạt (≥ 60%)</div>
          </div>
          <div class="spec-card">
            <div class="spec-val">950</div>
            <div class="spec-label">Ngân hàng câu hỏi</div>
          </div>
        </div>

        <button class="btn-primary" id="btn-start-exam" style="background: white; color: #1e1b4b; font-size: 1.05rem; padding: 0.8rem 1.75rem;">
          <i class="fas fa-play"></i> BẮT ĐẦU LÀM BÀI THI MỚI
        </button>
      </div>

      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.75rem;">
        <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">
          <i class="fas fa-history"></i> Lịch sử thi thử gần đây
        </h3>
        ${historyHtml}
      </div>
    `;

    const startBtn = document.getElementById('btn-start-exam');
    if (startBtn) {
      startBtn.addEventListener('click', startNewExam);
    }

    // Attach history review click handlers
    dom.contentArea.querySelectorAll('.btn-view-history').forEach(btn => {
      btn.addEventListener('click', () => {
        const examId = parseInt(btn.dataset.examId, 10);
        const record = state.examHistory.find(h => h.id === examId);
        if (record) {
          const qs = getQuestionsForRecord(record);
          renderExamResultScorecard({
            ...record,
            questions: qs
          });
        }
      });
    });
  }

  function startNewExam() {
    // Clear any existing active timer to prevent memory leaks / duplicate intervals
    if (state.liveExam && state.liveExam.timerInterval) {
      clearInterval(state.liveExam.timerInterval);
    }

    const allQs = window.TMG_QUESTIONS || [];
    if (allQs.length === 0) {
      alert("Ngân hàng câu hỏi chưa sẵn sàng!");
      return;
    }

    // Stratified random sampling: 2 questions per chapter (17 * 2 = 34) + 6 comprehensive synthesis + 10 random
    const sampled = [];
    for (let ch = 1; ch <= 17; ch++) {
      const chPool = allQs.filter(q => String(q.chapter) === String(ch));
      const shuffled = shuffleArray(chPool);
      sampled.push(...shuffled.slice(0, 2)); // 2 per chapter = 34
    }

    // Guarantee synthesis questions coverage
    const synthPool = allQs.filter(q => String(q.chapter) === 'comp' || String(q.chapter) === '0');
    const shuffledSynth = shuffleArray(synthPool);
    sampled.push(...shuffledSynth.slice(0, 6)); // 6 comprehensive questions

    // Fill remaining up to 50 from general pool
    const remainingPool = allQs.filter(q => !sampled.some(s => s.id === q.id));
    const shuffledRemaining = shuffleArray(remainingPool);
    sampled.push(...shuffledRemaining.slice(0, 50 - sampled.length)); // fill up to 50

    // Shuffle the 50 exam questions uniformly
    const examQuestions = shuffleArray(sampled);

    state.liveExam = {
      isActive: true,
      questions: examQuestions,
      answers: {},        // qId -> selected option
      flagged: {},        // qId -> boolean
      currentQuestionIdx: 0,
      totalSeconds: 50 * 60, // 50 minutes
      timeRemaining: 50 * 60,
      timerInterval: null,
      startTime: new Date()
    };

    // Start timer interval
    state.liveExam.timerInterval = setInterval(() => {
      state.liveExam.timeRemaining--;
      updateExamTimerDisplay();
      if (state.liveExam.timeRemaining <= 0) {
        clearInterval(state.liveExam.timerInterval);
        alert("Đã hết thời gian làm bài (50 phút)! Hệ thống tự động thu bài và tính điểm.");
        submitExam(true); // auto submit
      }
    }, 1000);

    renderLiveExamInterface();
  }

  function renderLiveExamInterface() {
    const exam = state.liveExam;
    if (!exam) return;

    const currentQ = exam.questions[exam.currentQuestionIdx];
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const currentAns = exam.answers[currentQ.id];
    const isFlagged = exam.flagged[currentQ.id] || false;

    // Palette buttons HTML
    const paletteBtns = exam.questions.map((q, idx) => {
      const ans = exam.answers[q.id];
      const flag = exam.flagged[q.id];
      let cls = 'pal-btn';
      if (idx === exam.currentQuestionIdx) cls += ' current';
      if (ans !== undefined) cls += ' answered';
      if (flag) cls += ' flagged';
      return `<button class="${cls}" data-qidx="${idx}">${idx + 1}</button>`;
    }).join('');

    const optionsHtml = currentQ.options.map((opt, optIdx) => `
      <button class="option-btn ${currentAns === optIdx ? 'selected' : ''}" data-opt="${optIdx}">
        <span class="opt-letter">${letters[optIdx]}</span>
        <span>${formatContentText(opt)}</span>
      </button>
    `).join('');

    dom.contentArea.innerHTML = `
      <div class="exam-timer-bar">
        <div class="timer-display" id="exam-timer-text">
          <i class="far fa-clock"></i> ${formatTime(exam.timeRemaining)}
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn-outline" id="btn-toggle-flag" style="color: ${isFlagged ? 'var(--accent-warning)' : 'inherit'};">
            <i class="${isFlagged ? 'fas' : 'far'} fa-flag"></i> ${isFlagged ? 'Đã đánh dấu' : 'Đánh dấu câu hỏi'}
          </button>
          <button class="btn-danger" id="btn-cancel-exam">
            <i class="fas fa-times-circle"></i> Hủy bài thi
          </button>
          <button class="btn-primary" id="btn-submit-exam" style="background: var(--accent-success);">
            <i class="fas fa-check-circle"></i> Nộp bài thi
          </button>
        </div>
      </div>

      <div class="live-exam-container">
        <!-- Question Workspace -->
        <div class="exam-question-workspace">
          <div class="question-card" style="margin-bottom: 1.5rem;">
            <div class="q-card-header">
              <span class="q-index-badge">Câu hỏi ${exam.currentQuestionIdx + 1} / 50</span>
              <span class="q-topic-tag"><i class="fas fa-tag"></i> Chapter ${escapeHtml(currentQ.chapter)}: ${escapeHtml(currentQ.topic)}</span>
            </div>
            <div class="q-text">${formatContentText(currentQ.question)}</div>
            <div class="options-grid">
              ${optionsHtml}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <button class="btn-outline" id="btn-prev-q" ${exam.currentQuestionIdx === 0 ? 'disabled' : ''}>
              <i class="fas fa-arrow-left"></i> Câu trước
            </button>
            <span style="font-size: 0.85rem; color: var(--text-muted);">
              Đã trả lời: ${Object.keys(exam.answers).length} / 50
            </span>
            <button class="btn-outline" id="btn-next-q" ${exam.currentQuestionIdx === 49 ? 'disabled' : ''}>
              Câu tiếp <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Question Navigation Grid -->
        <div class="exam-palette-sidebar">
          <div class="palette-title">Bảng điều hướng câu hỏi</div>
          <div class="palette-grid">
            ${paletteBtns}
          </div>
          <div style="margin-top: 1rem; font-size: 0.72rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.35rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 12px; height: 12px; background: var(--accent-primary); border-radius: 2px;"></span> Đã làm
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 12px; height: 12px; border: 1px solid var(--accent-warning); background: rgba(245, 158, 11, 0.2); border-radius: 2px;"></span> Đánh dấu xem lại
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 12px; height: 12px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 2px;"></span> Chưa làm
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach event listeners for Live Exam
    dom.contentArea.querySelectorAll('.options-grid .option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const opt = parseInt(btn.dataset.opt, 10);
        exam.answers[currentQ.id] = opt;
        renderLiveExamInterface();
      });
    });

    dom.contentArea.querySelectorAll('.palette-grid .pal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        exam.currentQuestionIdx = parseInt(btn.dataset.qidx, 10);
        renderLiveExamInterface();
      });
    });

    const prevBtn = document.getElementById('btn-prev-q');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (exam.currentQuestionIdx > 0) {
          exam.currentQuestionIdx--;
          renderLiveExamInterface();
        }
      });
    }

    const nextBtn = document.getElementById('btn-next-q');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (exam.currentQuestionIdx < 49) {
          exam.currentQuestionIdx++;
          renderLiveExamInterface();
        }
      });
    }

    const flagBtn = document.getElementById('btn-toggle-flag');
    if (flagBtn) {
      flagBtn.addEventListener('click', () => {
        exam.flagged[currentQ.id] = !exam.flagged[currentQ.id];
        renderLiveExamInterface();
      });
    }

    const cancelBtn = document.getElementById('btn-cancel-exam');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (confirm("Bạn có chắc chắn muốn hủy lượt thi thử này? Toàn bộ tiến trình làm bài sẽ không được lưu.")) {
          clearInterval(exam.timerInterval);
          state.liveExam = null;
          renderExamBannerView();
        }
      });
    }

    const submitBtn = document.getElementById('btn-submit-exam');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const answeredCount = Object.keys(exam.answers).length;
        if (answeredCount < 50) {
          if (!confirm(`Bạn mới trả lời ${answeredCount}/50 câu hỏi. Bạn có chắc chắn muốn nộp bài sớm?`)) {
            return;
          }
        } else {
          if (!confirm("Bạn có chắc chắn muốn nộp bài để tính điểm?")) {
            return;
          }
        }
        submitExam(false);
      });
    }

    typesetMath(dom.contentArea);
  }

  function updateExamTimerDisplay() {
    const timerElem = document.getElementById('exam-timer-text');
    if (timerElem && state.liveExam) {
      timerElem.innerHTML = `<i class="far fa-clock"></i> ${formatTime(state.liveExam.timeRemaining)}`;
      if (state.liveExam.timeRemaining <= 300) { // < 5 mins
        timerElem.classList.add('danger');
      }
    }
  }

  function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function submitExam(isAutoSubmit) {
    const exam = state.liveExam;
    if (!exam) return;

    clearInterval(exam.timerInterval);
    exam.isActive = false;

    // Calculate score
    let correctCount = 0;
    exam.questions.forEach(q => {
      if (exam.answers[q.id] === q.correct) {
        correctCount++;
      }
    });

    const timeSpentSeconds = exam.totalSeconds - exam.timeRemaining;
    const timeSpentStr = `${Math.floor(timeSpentSeconds / 60)}p ${timeSpentSeconds % 60}s`;

    const resultRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      score: correctCount,
      percentage: Math.round((correctCount / 50) * 100),
      timeSpent: timeSpentStr,
      answers: exam.answers,
      flagged: exam.flagged || {},
      questionIds: exam.questions.map(q => q.id),
      questions: exam.questions
    };

    // Keep last 30 attempts, store ID-based record to optimize localStorage
    const historyEntry = { ...resultRecord };
    delete historyEntry.questions;

    state.examHistory.push(historyEntry);
    if (state.examHistory.length > 30) {
      state.examHistory = state.examHistory.slice(-30);
    }
    localStorage.setItem('tmg_exam_history', JSON.stringify(state.examHistory));

    renderExamResultScorecard(resultRecord);
  }

  function renderExamResultScorecard(result) {
    const questions = getQuestionsForRecord(result);
    const isPassed = result.score >= 30;
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const wrongCount = 50 - result.score;
    const correctCount = result.score;
    const flagged = result.flagged || (state.liveExam?.flagged) || {};
    const flaggedCount = questions.filter(q => flagged[q.id]).length;

    // 1. Calculate Chapter-by-Chapter Diagnostic Mastery Breakdown
    const chapterStats = {};
    questions.forEach(q => {
      const chKey = q.chapter === 'comp' || q.chapter === 0 || String(q.chapter) === '0' ? 'comp' : String(q.chapter);
      if (!chapterStats[chKey]) {
        let chTitle = 'Tổng hợp liên chương (Synthesis)';
        if (chKey !== 'comp') {
          const chObj = (window.TMG_CHAPTERS || []).find(c => String(c.id) === chKey);
          chTitle = chObj ? `Ch.${chKey}: ${chObj.title}` : `Chapter ${chKey}`;
        }
        chapterStats[chKey] = {
          id: chKey,
          title: chTitle,
          total: 0,
          correct: 0
        };
      }
      chapterStats[chKey].total++;
      if (result.answers[q.id] === q.correct) {
        chapterStats[chKey].correct++;
      }
    });

    const weakChapters = [];
    const chCardsHtml = Object.values(chapterStats).map(cs => {
      const pct = Math.round((cs.correct / cs.total) * 100);
      let levelClass = 'high';
      let levelLabel = 'Thành thạo';
      if (pct < 50) {
        levelClass = 'low';
        levelLabel = 'Cần ôn lại';
        weakChapters.push(cs);
      } else if (pct < 80) {
        levelClass = 'medium';
        levelLabel = 'Trung bình';
      }

      return `
        <div class="mastery-card">
          <div class="mastery-card-top">
            <span class="mastery-ch-title">${escapeHtml(cs.title)}</span>
            <span class="mastery-badge ${levelClass}">${levelLabel} (${pct}%)</span>
          </div>
          <div class="mastery-bar-track">
            <div class="mastery-bar-fill ${levelClass}" style="width: ${pct}%;"></div>
          </div>
          <div class="mastery-stats-text">
            <span>Đúng: <strong>${cs.correct}/${cs.total}</strong> câu</span>
            <span>Tỷ lệ: <strong>${pct}%</strong></span>
          </div>
        </div>
      `;
    }).join('');

    let adviceHtml = '';
    if (weakChapters.length > 0) {
      adviceHtml = `
        <div class="diagnostic-advice-box">
          <div style="font-weight: 700; color: var(--accent-warning); margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-exclamation-triangle"></i> Gợi ý lộ trình ôn tập trọng tâm:
          </div>
          <div>
            Bạn đang có tỷ lệ làm đúng thấp (< 50%) ở các chuyên đề: 
            <strong>${escapeHtml(weakChapters.map(w => w.title).join(', '))}</strong>. 
            Hãy ưu tiên mở lại các chuyên đề này ở tab <strong>Lý thuyết</strong> hoặc <strong>Luyện tập (50 câu)</strong> để củng cố ngay trước khi thi chính thức!
          </div>
        </div>
      `;
    }

    // Function to render review questions by filter
    function getReviewQuestionsHtml(filter) {
      const filtered = questions.filter(q => {
        const userAns = result.answers[q.id];
        const isCorrect = userAns === q.correct;
        const isFlag = !!flagged[q.id];

        if (filter === 'wrong') return !isCorrect;
        if (filter === 'correct') return isCorrect;
        if (filter === 'flagged') return isFlag;
        return true; // 'all'
      });

      if (filtered.length === 0) {
        return `<div style="padding: 2rem; text-align: center; color: var(--text-muted); font-style: italic;">Không có câu hỏi nào phù hợp với bộ lọc đã chọn.</div>`;
      }

      return filtered.map((q, idx) => {
        const userAns = result.answers[q.id];
        const isCorrect = userAns === q.correct;
        const isFlag = !!flagged[q.id];

        return `
          <div class="question-card ${isCorrect ? 'answered-correct' : 'answered-wrong'}" style="margin-bottom: 1.25rem;">
            <div class="q-card-header">
              <div>
                <span class="q-index-badge">Câu ${idx + 1}</span>
                <span class="q-topic-tag" style="margin-left: 0.5rem;">
                  <i class="fas fa-tag"></i> ${q.chapter === 'comp' || q.chapter === 0 ? 'Tổng hợp liên chương' : 'Chapter ' + escapeHtml(q.chapter)} • ${escapeHtml(q.topic || 'NLP')}
                </span>
                ${isFlag ? '<span style="margin-left: 0.5rem; color: var(--accent-warning); font-size: 0.8rem; font-weight: 700;"><i class="fas fa-flag"></i> Đã gắn cờ</span>' : ''}
              </div>
              <span style="font-size: 0.85rem; font-weight: 700; color: ${isCorrect ? 'var(--accent-success)' : 'var(--accent-danger)'};">
                ${isCorrect ? '<i class="fas fa-check-circle"></i> ĐÚNG' : '<i class="fas fa-times-circle"></i> SAI'}
              </span>
            </div>
            <div class="q-text">${formatContentText(q.question)}</div>
            <div class="options-grid">
              ${q.options.map((opt, optIdx) => {
                let cls = 'option-btn';
                if (optIdx === q.correct) cls += ' correct';
                else if (optIdx === userAns) cls += ' wrong';
                return `
                  <div class="${cls}">
                    <span class="opt-letter">${letters[optIdx]}</span>
                    <span>${formatContentText(opt)}</span>
                  </div>
                `;
              }).join('')}
            </div>
            <div class="explanation-box show" style="margin-top: 0.75rem;">
              <div class="exp-header"><i class="fas fa-lightbulb"></i> Giải thích chi tiết & Đáp án đúng:</div>
              <div>${formatContentText(q.explanation)}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem;">
                <i class="far fa-file-powerpoint"></i> Nguồn tham khảo: ${escapeHtml(q.slide_ref)}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    dom.contentArea.innerHTML = `
      <!-- Overall Scorecard -->
      <div class="scorecard-card">
        <div class="score-circle">
          <span class="score-num">${result.score}</span>
          <span class="score-total">/ 50 câu</span>
        </div>
        <div class="score-verdict ${isPassed ? 'passed' : 'failed'}">
          ${isPassed ? '<i class="fas fa-check-circle"></i> CHÚC MỪNG: BẠN ĐÃ ĐẠT (PASS)!' : '<i class="fas fa-times-circle"></i> KẾT QUẢ: CHƯA ĐẠT (FAIL)'}
        </div>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem;">
          Điểm số: <strong>${result.percentage}%</strong> • Thời gian làm bài: <strong>${result.timeSpent}</strong> • Điểm đạt chuẩn FPT: ≥ 30/50 (60%)
        </p>
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <button class="btn-primary" id="btn-retake-exam">
            <i class="fas fa-redo"></i> Thi lại đề mới (Random 50 câu khác)
          </button>
          <button class="btn-outline" id="btn-back-exam-home">
            <i class="fas fa-home"></i> Về trang thi thử
          </button>
        </div>
      </div>

      <!-- Chapter Diagnostic Mastery Breakdown -->
      <div class="diagnostic-container">
        <div class="diagnostic-header">
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
              <i class="fas fa-chart-pie" style="color: var(--accent-primary);"></i> Chẩn đoán độ thành thạo theo từng chuyên đề
            </h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 0.25rem;">
              Phân tích tỷ lệ làm đúng trên 50 câu hỏi thi thử theo từng chương để phát hiện lỗ hổng kiến thức kịp thời.
            </p>
          </div>
        </div>

        <div class="diagnostic-grid">
          ${chCardsHtml}
        </div>

        ${adviceHtml}
      </div>

      <!-- Full Question Review Section -->
      <div style="margin-top: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
          <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">
            <i class="fas fa-list-check"></i> Xem lại chi tiết từng câu hỏi & Đáp án
          </h3>
          <div class="review-filter-bar">
            <button class="filter-btn active" data-rfilter="all">Tất cả (50)</button>
            <button class="filter-btn" data-rfilter="wrong" style="color: var(--accent-danger);">Sai (${wrongCount})</button>
            <button class="filter-btn" data-rfilter="correct" style="color: var(--accent-success);">Đúng (${correctCount})</button>
            ${flaggedCount > 0 ? `<button class="filter-btn" data-rfilter="flagged" style="color: var(--accent-warning);">Gắn cờ (${flaggedCount})</button>` : ''}
          </div>
        </div>

        <div id="review-questions-list">
          ${getReviewQuestionsHtml('all')}
        </div>
      </div>
    `;

    // Retake and Home listeners
    document.getElementById('btn-retake-exam')?.addEventListener('click', startNewExam);
    document.getElementById('btn-back-exam-home')?.addEventListener('click', () => {
      state.liveExam = null;
      renderExamBannerView();
    });

    // Review filter click listeners
    dom.contentArea.querySelectorAll('.review-filter-bar .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        dom.contentArea.querySelectorAll('.review-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.rfilter;
        const reviewList = document.getElementById('review-questions-list');
        if (reviewList) {
          reviewList.innerHTML = getReviewQuestionsHtml(filter);
          typesetMath(reviewList);
        }
      });
    });

    typesetMath(dom.contentArea);
  }

  // 5. QUESTION BANK EXPLORER (950 Questions)
  function renderQuestionBankView() {
    const allQs = window.TMG_QUESTIONS || [];
    const query = state.bankSearchQuery.toLowerCase().trim();

    // Filter questions
    const filtered = allQs.filter(q => {
      // Chapter filter
      if (state.bankChapterFilter !== 'all') {
        if (state.bankChapterFilter === 'comp') {
          if (String(q.chapter) !== 'comp' && String(q.chapter) !== '0') return false;
        } else {
          if (String(q.chapter) !== String(state.bankChapterFilter)) return false;
        }
      }

      // Status filter
      const userAns = state.quizAnswers[q.id];
      const isAnswered = userAns !== undefined;
      const isCorrect = isAnswered && userAns === q.correct;

      if (state.bankStatusFilter === 'unanswered' && isAnswered) return false;
      if (state.bankStatusFilter === 'correct' && !isCorrect) return false;
      if (state.bankStatusFilter === 'wrong' && (!isAnswered || isCorrect)) return false;

      // Text query
      if (query) {
        const matchQ = q.question.toLowerCase().includes(query);
        const matchTopic = (q.topic || '').toLowerCase().includes(query);
        const matchRef = (q.slide_ref || '').toLowerCase().includes(query);
        const matchOpts = (q.options || []).some(opt => opt.toLowerCase().includes(query));
        if (!matchQ && !matchTopic && !matchRef && !matchOpts) return false;
      }

      return true;
    });

    const displayQs = filtered.slice(0, state.bankCurrentLimit);
    const letters = ['A', 'B', 'C', 'D', 'E'];

    dom.contentArea.innerHTML = `
      <div class="bank-controls-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 0.6rem;">
              <i class="fas fa-database" style="color: var(--accent-primary);"></i> Ngân hàng 950 câu hỏi trắc nghiệm TMG301
            </h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.35rem;">
              Bao gồm 850 câu hỏi từ 17 Chapters (50 câu/chương) và 100 câu hỏi Tổng hợp liên chương kèm lời giải & đối chiếu Slide PPT.
            </p>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn-outline" id="btn-toggle-all-bank-exp">
              <i class="fas ${state.bankShowAllAnswers ? 'fa-eye-slash' : 'fa-lightbulb'}"></i> ${state.bankShowAllAnswers ? 'Ẩn tất cả đáp án' : 'Hiện tất cả đáp án'}
            </button>
            <button class="btn-outline" id="btn-reset-bank-filters">
              <i class="fas fa-undo"></i> Đặt lại bộ lọc
            </button>
          </div>
        </div>

        <div class="bank-filters-grid">
          <input type="text" class="search-input-field" id="bank-search-input" 
            placeholder="Tìm kiếm theo từ khóa câu hỏi, khái niệm hoặc nội dung đáp án..." 
            value="${escapeHtml(state.bankSearchQuery)}">
          
          <select class="bank-select" id="bank-chapter-select">
            <option value="all" ${state.bankChapterFilter === 'all' ? 'selected' : ''}>Tất cả các chương (950 câu)</option>
            ${(window.TMG_CHAPTERS || []).map(c => `
              <option value="${c.id}" ${String(state.bankChapterFilter) === String(c.id) ? 'selected' : ''}>
                Chapter ${c.id}: ${c.title.slice(0, 32)}...
              </option>
            `).join('')}
            <option value="comp" ${state.bankChapterFilter === 'comp' ? 'selected' : ''}>Tổng hợp liên chương (100 câu)</option>
          </select>

          <select class="bank-select" id="bank-status-select">
            <option value="all" ${state.bankStatusFilter === 'all' ? 'selected' : ''}>Tất cả trạng thái</option>
            <option value="unanswered" ${state.bankStatusFilter === 'unanswered' ? 'selected' : ''}>Chưa làm</option>
            <option value="correct" ${state.bankStatusFilter === 'correct' ? 'selected' : ''}>Đã làm đúng</option>
            <option value="wrong" ${state.bankStatusFilter === 'wrong' ? 'selected' : ''}>Đã làm sai</option>
          </select>
        </div>

        <div class="bank-stats-bar">
          <span>Đang hiển thị: <strong>${displayQs.length}</strong> / <strong>${filtered.length}</strong> câu phù hợp (Tổng ngân hàng: 950 câu)</span>
          <span>Đã làm: <strong>${Object.keys(state.quizAnswers).length}</strong> / 950 câu</span>
        </div>
      </div>

      <div class="bank-questions-stream" id="bank-questions-stream">
        ${displayQs.map((q, idx) => {
          const userAns = state.quizAnswers[q.id];
          const isAnswered = userAns !== undefined;
          const isCorrect = isAnswered && userAns === q.correct;
          const isRevealed = isAnswered || state.bankShowAllAnswers || !!state.bankRevealedAnswers[q.id];
          let cardStatus = '';
          if (isAnswered) cardStatus = isCorrect ? 'answered-correct' : 'answered-wrong';

          return `
            <div class="question-card ${cardStatus}" id="bank-q-${q.id}">
              <div class="q-card-header">
                <div>
                  <span class="q-index-badge">#${idx + 1}</span>
                  <span class="q-topic-tag" style="margin-left: 0.5rem;">
                    <i class="fas fa-tag"></i> ${q.chapter === 'comp' || q.chapter === 0 ? 'Tổng hợp liên chương' : 'Chapter ' + escapeHtml(q.chapter)} • ${escapeHtml(q.topic || 'NLP')}
                  </span>
                </div>
                ${isAnswered ? `
                  <span style="font-size: 0.8rem; font-weight: 700; color: ${isCorrect ? 'var(--accent-success)' : 'var(--accent-danger)'};">
                    ${isCorrect ? '<i class="fas fa-check"></i> ĐÚNG' : '<i class="fas fa-times"></i> SAI'}
                  </span>
                ` : ''}
              </div>
              <div class="q-text">${formatContentText(q.question)}</div>
              <div class="options-grid">
                ${q.options.map((opt, optIdx) => {
                  let cls = 'option-btn';
                  if (isRevealed || isAnswered) {
                    if (optIdx === q.correct) cls += ' correct';
                    else if (optIdx === userAns) cls += ' wrong';
                  }
                  return `
                    <button class="${cls}" data-qid="${q.id}" data-opt="${optIdx}">
                      <span class="opt-letter">${letters[optIdx]}</span>
                      <span>${formatContentText(opt)}</span>
                    </button>
                  `;
                }).join('')}
              </div>
              <div style="display: flex; justify-content: flex-end; margin-top: 0.25rem;">
                <button class="bank-toggle-exp-btn" data-qid="${q.id}">
                  <i class="fas ${isRevealed ? 'fa-eye-slash' : 'fa-eye'}"></i> ${isRevealed ? 'Ẩn đáp án & giải thích' : 'Xem đáp án & giải thích'}
                </button>
              </div>
              <div class="explanation-box ${isRevealed ? 'show' : ''}" id="bank-exp-${q.id}">
                <div class="exp-header"><i class="fas fa-lightbulb"></i> Giải thích chi tiết & Đáp án đúng:</div>
                <div>${formatContentText(q.explanation)}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.4rem;">
                  <i class="far fa-file-powerpoint"></i> Nguồn trích dẫn: ${escapeHtml(q.slide_ref)}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${filtered.length > state.bankCurrentLimit ? `
        <div style="text-align: center; margin: 2rem 0;">
          <button class="btn-primary" id="btn-load-more-bank" style="padding: 0.75rem 2rem;">
            <i class="fas fa-arrow-down"></i> Hiển thị thêm 50 câu hỏi tiếp theo (${filtered.length - state.bankCurrentLimit} câu còn lại)
          </button>
        </div>
      ` : ''}
    `;

    // Attach bank controls event handlers
    const searchInput = document.getElementById('bank-search-input');
    if (searchInput) {
      const debouncedBankSearch = debounce((val) => {
        state.bankSearchQuery = val;
        state.bankCurrentLimit = 50;
        renderQuestionBankView();
        const fresh = document.getElementById('bank-search-input');
        if (fresh) {
          fresh.focus();
          fresh.setSelectionRange(fresh.value.length, fresh.value.length);
        }
      }, 200);

      searchInput.addEventListener('input', (e) => {
        debouncedBankSearch(e.target.value);
      });
    }

    const chSelect = document.getElementById('bank-chapter-select');
    if (chSelect) {
      chSelect.addEventListener('change', (e) => {
        state.bankChapterFilter = e.target.value;
        state.bankCurrentLimit = 50;
        renderQuestionBankView();
      });
    }

    const stSelect = document.getElementById('bank-status-select');
    if (stSelect) {
      stSelect.addEventListener('change', (e) => {
        state.bankStatusFilter = e.target.value;
        state.bankCurrentLimit = 50;
        renderQuestionBankView();
      });
    }

    const toggleAllBtn = document.getElementById('btn-toggle-all-bank-exp');
    if (toggleAllBtn) {
      toggleAllBtn.addEventListener('click', () => {
        state.bankShowAllAnswers = !state.bankShowAllAnswers;
        renderQuestionBankView();
      });
    }

    const resetFiltersBtn = document.getElementById('btn-reset-bank-filters');
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        state.bankChapterFilter = 'all';
        state.bankSearchQuery = '';
        state.bankStatusFilter = 'all';
        state.bankCurrentLimit = 50;
        state.bankShowAllAnswers = false;
        state.bankRevealedAnswers = {};
        renderQuestionBankView();
      });
    }

    const loadMoreBtn = document.getElementById('btn-load-more-bank');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        state.bankCurrentLimit += 50;
        renderQuestionBankView();
      });
    }

    // Attach toggle individual explanation buttons in bank (in-place)
    dom.contentArea.querySelectorAll('.bank-toggle-exp-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qid = btn.dataset.qid;
        const expBox = document.getElementById(`bank-exp-${qid}`);
        if (expBox) {
          expBox.classList.toggle('show');
          const isNowShown = expBox.classList.contains('show');
          state.bankRevealedAnswers[qid] = isNowShown;
          btn.innerHTML = `<i class="fas ${isNowShown ? 'fa-eye-slash' : 'fa-eye'}"></i> ${isNowShown ? 'Ẩn đáp án & giải thích' : 'Xem đáp án & giải thích'}`;
          if (isNowShown) typesetMath(expBox);
          return;
        }
        state.bankRevealedAnswers[qid] = !state.bankRevealedAnswers[qid];
        renderQuestionBankView();
      });
    });

    // Attach option click handlers inside question bank (in-place)
    dom.contentArea.querySelectorAll('.bank-questions-stream .option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        const opt = parseInt(btn.dataset.opt, 10);
        state.quizAnswers[qid] = opt;
        localStorage.setItem('tmg_quiz_answers', JSON.stringify(state.quizAnswers));

        const card = document.getElementById(`bank-q-${qid}`);
        const q = (window.TMG_QUESTIONS || []).find(it => it.id === qid);
        if (card && q && state.bankStatusFilter === 'all') {
          const isCorrect = opt === q.correct;
          card.classList.remove('answered-correct', 'answered-wrong');
          card.classList.add(isCorrect ? 'answered-correct' : 'answered-wrong');

          const optBtns = card.querySelectorAll('.option-btn');
          optBtns.forEach((b, idx) => {
            b.classList.remove('correct', 'wrong');
            if (idx === q.correct) b.classList.add('correct');
            else if (idx === opt) b.classList.add('wrong');
          });

          const expBox = document.getElementById(`bank-exp-${qid}`);
          if (expBox) expBox.classList.add('show');
          typesetMath(card);
          return;
        }

        renderQuestionBankView();
      });
    });

    typesetMath(dom.contentArea);
  }

  // 4. GLOSSARY VIEW
  function renderGlossaryView() {
    const items = window.TMG_GLOSSARY || [];
    const query = state.glossaryQuery.toLowerCase().trim();

    const filtered = items.filter(it => 
      it.term.toLowerCase().includes(query) ||
      it.vn.toLowerCase().includes(query) ||
      it.def.toLowerCase().includes(query)
    );

    dom.contentArea.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">
          <i class="fas fa-book"></i> Từ điển thuật ngữ chuyên ngành Text Mining (Glossary)
        </h2>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
          Tổng hợp <strong>${items.length} thuật ngữ gốc tiếng Anh</strong> trọng tâm từ Slide 17 Chapters, định nghĩa học thuật và đối chiếu Slide PPT.
        </p>

        <div class="glossary-search-row">
          <input type="text" class="search-input-field" id="glossary-search-input" 
            placeholder="Tra cứu nhanh thuật ngữ (ví dụ: Perplexity, Transformer, CKY, Naive Bayes, SDIT...)" 
            value="${escapeHtml(state.glossaryQuery)}">
        </div>

        <div class="glossary-grid">
          ${filtered.map(it => `
            <div class="glossary-card">
              <div class="gloss-top">
                <div class="gloss-term">${escapeHtml(it.term)}</div>
                <div class="gloss-vn">${escapeHtml(it.vn)}</div>
              </div>
              <div class="gloss-def">${escapeHtml(it.def)}</div>
              <div class="gloss-footer">
                <span><i class="fas fa-bookmark" style="color: var(--accent-primary);"></i> Chapter ${escapeHtml(it.ch)}</span>
                <span><i class="far fa-file-powerpoint"></i> ${escapeHtml(it.slide)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const searchInput = document.getElementById('glossary-search-input');
    if (searchInput) {
      const debouncedGlossarySearch = debounce((val) => {
        state.glossaryQuery = val;
        renderGlossaryView();
        const freshInput = document.getElementById('glossary-search-input');
        if (freshInput) {
          freshInput.focus();
          freshInput.setSelectionRange(freshInput.value.length, freshInput.value.length);
        }
      }, 200);

      searchInput.addEventListener('input', (e) => {
        debouncedGlossarySearch(e.target.value);
      });
    }

    typesetMath(dom.contentArea);
  }

  // --- GLOBAL SEARCH MODAL (Ctrl + K) ---
  function openGlobalSearch() {
    if (!dom.globalSearchModal) return;
    dom.globalSearchModal.classList.add('open');
    if (dom.globalSearchInput) {
      dom.globalSearchInput.value = '';
      dom.globalSearchInput.focus();
    }
    renderGlobalSearchResults('');
  }

  function closeGlobalSearch() {
    if (!dom.globalSearchModal) return;
    dom.globalSearchModal.classList.remove('open');
  }

  function renderGlobalSearchResults(query) {
    if (!dom.globalSearchResults) return;
    const q = query.toLowerCase().trim();

    if (!q) {
      dom.globalSearchResults.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
          Gõ từ khóa để tìm kiếm nhanh bài giảng, câu hỏi trắc nghiệm hoặc thuật ngữ...
        </div>
      `;
      return;
    }

    const matchedChapters = (window.TMG_CHAPTERS || []).filter(c => 
      c.title.toLowerCase().includes(q) || c.title_vn.toLowerCase().includes(q)
    );

    const matchedGlossary = (window.TMG_GLOSSARY || []).filter(g => 
      g.term.toLowerCase().includes(q) || g.vn.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedQuestions = (window.TMG_QUESTIONS || []).filter(ques => 
      ques.question.toLowerCase().includes(q) || ques.topic.toLowerCase().includes(q)
    ).slice(0, 5);

    dom.globalSearchResults.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${matchedChapters.length > 0 ? `
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem;">Chương học (${matchedChapters.length})</div>
            ${matchedChapters.map(c => `
              <div class="search-result-item" onclick="window.app.goToChapter(${c.id})" style="padding: 0.5rem; border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <strong>Chapter ${c.id}: ${escapeHtml(c.title)}</strong>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(c.title_vn)}</div>
                </div>
                <i class="fas fa-chevron-right" style="color: var(--text-muted);"></i>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${matchedGlossary.length > 0 ? `
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem;">Thuật ngữ Glossary</div>
            ${matchedGlossary.map(g => `
              <div style="padding: 0.5rem; border-radius: var(--radius-sm); background: var(--bg-primary); margin-bottom: 0.35rem;">
                <strong>${escapeHtml(g.term)}</strong> (${escapeHtml(g.vn)})
                <div style="font-size: 0.8rem; color: var(--text-secondary);">${escapeHtml(g.def)}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${matchedQuestions.length > 0 ? `
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem;">Câu hỏi trắc nghiệm</div>
            ${matchedQuestions.map(ques => `
              <div style="padding: 0.5rem; border-radius: var(--radius-sm); background: var(--bg-primary); margin-bottom: 0.35rem;">
                <div style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 600;">Chapter ${escapeHtml(ques.chapter)} • ${escapeHtml(ques.topic)}</div>
                <div style="font-size: 0.85rem; color: var(--text-primary);">${escapeHtml(ques.question)}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${matchedChapters.length === 0 && matchedGlossary.length === 0 && matchedQuestions.length === 0 ? `
          <div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
            Không tìm thấy kết quả phù hợp cho "${escapeHtml(query)}".
          </div>
        ` : ''}
      </div>
    `;

    typesetMath(dom.globalSearchResults);
  }

  // Global helper for code copy
  window.copyCode = function (btn) {
    const container = btn.closest('.code-container');
    const code = container.querySelector('code').innerText;
    navigator.clipboard.writeText(code).then(() => {
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 2000);
    });
  };

  // Exposed API
  window.app = {
    goToChapter: function (id) {
      closeGlobalSearch();
      setView('knowledge', id);
    }
  };

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();
    applyTheme(state.theme);
    renderSidebar();
    setView('knowledge', 1);

    // Tab buttons click
    dom.navTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        setView(btn.dataset.view);
      });
    });

    // Theme toggle
    if (dom.themeToggleBtn) {
      dom.themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Mobile menu toggle
    if (dom.mobileMenuBtn && dom.appSidebar) {
      dom.mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dom.appSidebar.classList.toggle('mobile-open');
      });

      // Close mobile sidebar on outside click
      document.addEventListener('click', (e) => {
        if (dom.appSidebar.classList.contains('mobile-open')) {
          if (!dom.appSidebar.contains(e.target) && !dom.mobileMenuBtn.contains(e.target)) {
            dom.appSidebar.classList.remove('mobile-open');
          }
        }
      });
    }

    // Search trigger
    if (dom.btnSearchTrigger) {
      dom.btnSearchTrigger.addEventListener('click', openGlobalSearch);
    }

    // Search Input with Debounce
    if (dom.globalSearchInput) {
      const debouncedGlobalSearch = debounce((val) => {
        renderGlobalSearchResults(val);
      }, 150);
      dom.globalSearchInput.addEventListener('input', (e) => {
        debouncedGlobalSearch(e.target.value);
      });
    }

    // Keyboard shortcuts (Ctrl+K or Cmd+K)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openGlobalSearch();
      }
      if (e.key === 'Escape') {
        closeGlobalSearch();
      }
    });

    // Modal close when clicking outside
    if (dom.globalSearchModal) {
      dom.globalSearchModal.addEventListener('click', (e) => {
        if (e.target === dom.globalSearchModal) {
          closeGlobalSearch();
        }
      });
    }
  });

})();
