let currentIndex = 0;

const questionText = document.getElementById('question-text');
const categoryTag = document.getElementById('category-tag');
const answerText = document.getElementById('answer-text');
const answerCard = document.getElementById('answer-card');
const resultCard = document.getElementById('result-card');
const actionArea = document.getElementById('action-area');
const showAnswerBtn = document.getElementById('show-answer-btn');
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
    
    // UIのリセット
    answerCard.classList.add('hidden');
    actionArea.classList.remove('hidden');
    
    // スクロールを一番上に戻す(スマホ用に便利)
    window.scrollTo(0, 0);
    
    updateProgress();
}

function showAnswer() {
    const q = questions[currentIndex];
    answerText.innerText = q.answer;
    
    answerCard.classList.remove('hidden');
    actionArea.classList.add('hidden');
    
    // 答えのカードが見えるように少し下へスクロール
    setTimeout(() => {
        answerCard.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
}

function showResult() {
    document.querySelector('.question-card').classList.add('hidden');
    answerCard.classList.add('hidden');
    actionArea.classList.add('hidden');
    resultCard.classList.remove('hidden');
    
    progressText.innerText = `完了!`;
    progressFill.style.width = `100%`;
}

showAnswerBtn.addEventListener('click', showAnswer);
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
