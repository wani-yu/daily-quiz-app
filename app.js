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

const answerDetailContainer = document.getElementById('answer-detail-container');
const answerMoreBtn = document.getElementById('answer-more-btn');
const answerDetailedExplanation = document.getElementById('answer-detailed-explanation');

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
    if (answerDetailContainer) {
        answerDetailContainer.classList.add('hidden');
        answerDetailedExplanation.classList.add('hidden');
        answerMoreBtn.innerHTML = 'もっと詳しく <span>▾</span>';
        answerMoreBtn.classList.remove('active');
    }
    
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
    
    // もっと詳しくボタンの表示制御
    if (q.detailedExplanation) {
        answerDetailedExplanation.innerHTML = q.detailedExplanation;
        answerDetailContainer.classList.remove('hidden');
        
        answerMoreBtn.onclick = () => {
            const isHidden = answerDetailedExplanation.classList.contains('hidden');
            if (isHidden) {
                answerDetailedExplanation.classList.remove('hidden');
                answerMoreBtn.innerHTML = '閉じる <span>▴</span>';
                answerMoreBtn.classList.add('active');
                setTimeout(() => {
                    answerDetailedExplanation.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 100);
            } else {
                answerDetailedExplanation.classList.add('hidden');
                answerMoreBtn.innerHTML = 'もっと詳しく <span>▾</span>';
                answerMoreBtn.classList.remove('active');
            }
        };
    } else {
        answerDetailContainer.classList.add('hidden');
    }
    
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
            ${q.detailedExplanation ? `
                <div class="detail-container">
                    <button class="more-btn" onclick="toggleDetail(${idx})">もっと詳しく <span>▾</span></button>
                    <div id="detail-${idx}" class="detailed-explanation hidden">
                        ${q.detailedExplanation}
                    </div>
                </div>
            ` : ''}
        </div>`;
    });
    reviewContent.innerHTML = html;
});

// 詳細解説の開閉制御
window.toggleDetail = function(index) {
    const detailDiv = document.getElementById(`detail-${index}`);
    const btn = detailDiv.previousElementSibling;
    const isHidden = detailDiv.classList.contains('hidden');
    
    if (isHidden) {
        detailDiv.classList.remove('hidden');
        btn.innerHTML = '閉じる <span>▴</span>';
        btn.classList.add('active');
    } else {
        detailDiv.classList.add('hidden');
        btn.innerHTML = 'もっと詳しく <span>▾</span>';
        btn.classList.remove('active');
    }
};

// アプリの起動時に最初の問題を読み込む
loadQuestion();
