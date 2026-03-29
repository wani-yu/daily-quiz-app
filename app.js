let currentIndex = 0;

const questionText = document.getElementById('question-text');
const categoryTag = document.getElementById('category-tag');
const answerText = document.getElementById('answer-text');
const answerCard = document.getElementById('answer-card');
const resultCard = document.getElementById('result-card');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');

function updateProgress() {
    progressText.innerText = `${currentIndex + 1} / ${questions.length}`;
    const percentage = ((currentIndex + 1) / questions.length) * 100;
    progressFill.style.width = `${percentage}%`;
}

function loadQuestion() {
    if (currentIndex >= questions.length) {
        showResult();
        return;
    }
    const q = questions[currentIndex];
    questionText.innerText = q.question;
    categoryTag.innerText = q.category;
    
    // 選択肢の生成
    optionsContainer.innerHTML = '';
    optionsContainer.classList.remove('hidden');
    
    if (q.options) {
        q.options.forEach((optionText, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = optionText;
            btn.onclick = () => selectOption(index);
            optionsContainer.appendChild(btn);
        });
    }
    
    // UIのリセット
    answerCard.classList.add('hidden');
    
    // スクロールを一番上に戻す(スマホ用に便利)
    window.scrollTo(0, 0);
    
    updateProgress();
}

function selectOption(selectedIndex) {
    const q = questions[currentIndex];
    const isCorrect = selectedIndex === q.answerIndex;
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answerIndex) {
            btn.classList.add('correct');
        } else if (idx === selectedIndex && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    // 答えのテキストに正解・不正解のラベルも追加して表示
    if (isCorrect) {
        answerText.innerHTML = `<span style="color: #4ade80; font-weight: bold; font-size: 1.2rem;">⭕ 大正解！</span>\n\n` + q.answer;
    } else {
        answerText.innerHTML = `<span style="color: #f87171; font-weight: bold; font-size: 1.2rem;">❌ 残念...正解は「${q.options[q.answerIndex]}」でした。</span>\n\n` + q.answer;
    }
    
    answerCard.classList.remove('hidden');
    
    // 答えのカードが見えるように少し下へスクロール
    setTimeout(() => {
        answerCard.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
}

function showResult() {
    document.querySelector('.question-card').classList.add('hidden');
    answerCard.classList.add('hidden');
    if(optionsContainer) optionsContainer.classList.add('hidden');
    resultCard.classList.remove('hidden');
    
    progressText.innerText = `完了!`;
    progressFill.style.width = `100%`;
}

nextBtn.addEventListener('click', () => {
    currentIndex++;
    loadQuestion();
});

const reviewBtn = document.getElementById('review-btn');
const reviewCard = document.getElementById('review-card');
const reviewContent = document.getElementById('review-content');

reviewBtn.addEventListener('click', () => {
    resultCard.classList.add('hidden');
    reviewCard.classList.remove('hidden');
    
    // スクロールを一番上に戻す
    window.scrollTo(0, 0);
    
    let html = '';
    questions.forEach((q, idx) => {
        html += `<div class="review-item">
            <div class="review-q"><span class="review-number">Q${idx + 1}.</span> ${q.question}</div>
            <div class="review-a">${q.answer}</div>
        </div>`;
    });
    reviewContent.innerHTML = html;
});

// アプリの起動時に最初の問題を読み込む
loadQuestion();
