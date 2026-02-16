const questions = [
    {
        question: "¿Cuál es el planeta más grande del sistema solar?",
        options: ["Tierra", "Júpiter", "Saturno", "Marte"],
        correct: 1
    },
    {
        question: "¿En qué continente se encuentra Egipto?",
        options: ["Asia", "Europa", "África", "América"],
        correct: 2
    },
    {
        question: "¿Cuánto es 9 x 7?",
        options: ["63", "56", "72", "49"],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 10;
let timer;
let progressInterval;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const timerEl = document.getElementById("timer");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

function startQuiz() {
    score = 0;
    currentQuestion = 0;
    restartBtn.style.display = "none";
    scoreEl.textContent = "";
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        showResults();
        return;
    }

    const q = questions[currentQuestion];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = "";
    feedbackEl.textContent = "";

    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.addEventListener("click", () => selectAnswer(i));
        optionsEl.appendChild(btn);
    });

    timeLeft = 10;
    timerEl.textContent = `Tiempo restante: ${timeLeft}s`;
    progressEl.style.width = "100%";

    clearInterval(timer);
    clearInterval(progressInterval);
    timer = setInterval(updateTimer, 1000);
    progressInterval = setInterval(updateProgress, 1000);
}

function updateTimer() {
    timeLeft--;
    timerEl.textContent = `Tiempo restante: ${timeLeft}s`;

    if (timeLeft <= 0) {
        clearInterval(timer);
        clearInterval(progressInterval);
        feedbackEl.textContent = "⏰ ¡Tiempo agotado!";
        nextQuestion();
    }
}

function updateProgress() {
    const percent = (timeLeft / 10) * 100;
    progressEl.style.width = `${percent}%`;
    if (percent <= 30) progressEl.style.backgroundColor = "#ff3333";
    else if (percent <= 60) progressEl.style.backgroundColor = "#ffcc00";
    else progressEl.style.backgroundColor = "#00cc66";
}

function selectAnswer(index) {
    clearInterval(timer);
    clearInterval(progressInterval);
    const correctIndex = questions[currentQuestion].correct;
    if (index === correctIndex) {
        feedbackEl.textContent = "✅ ¡Correcto!";
        score++;
    } else {
        feedbackEl.textContent = `❌ Incorrecto. Respuesta correcta: ${questions[currentQuestion].options[correctIndex]}`;
    }

    setTimeout(nextQuestion, 1500);
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

function showResults() {
    questionEl.textContent = "🏁 ¡Quiz finalizado!";
    optionsEl.innerHTML = "";
    feedbackEl.textContent = "";
    timerEl.textContent = "";
    progressEl.style.width = "0";
    scoreEl.textContent = `Puntuación: ${score} / ${questions.length}`;
    restartBtn.style.display = "block";
}

restartBtn.addEventListener("click", startQuiz);

// Inicialización
startQuiz();
