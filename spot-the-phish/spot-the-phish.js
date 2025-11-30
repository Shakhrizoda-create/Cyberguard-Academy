// ========================
// GAME QUESTIONS
// ========================
const emails = [
    {
        fromName: "School Admin",
        fromEmail: "admin@school.edu",
        subject: "Class Schedule Updated",
        date: "Wed, 13 Nov 2025 09:10 AM",
        attachments: [{ name: "Schedule_Fall2025.docx", size: "56 KB" }],
        body: "Your class schedule has been updated. Review changes on the school portal.",
        correct: "safe",
        difficulty: "Easy"
    },
    {
        fromName: "Bank Security",
        fromEmail: "verify@secure-banking-alert.com",
        subject: "URGENT: Account Verification",
        date: "Thu, 14 Nov 2025 13:55 PM",
        attachments: [],
        body: "Unusual activity detected. Verify your identity.",
        correct: "malicious",
        difficulty: "Hardest"
    },
    {
        fromName: "IT Support",
        fromEmail: "support@school.edu",
        subject: "Password Expired",
        date: "Fri, 15 Nov 2025 11:30 AM",
        attachments: [],
        body: "Your password expired today. Reset using the link below.",
        correct: "malicious",
        difficulty: "Medium Hard"
    },
    {
        fromName: "HR Department",
        fromEmail: "hr@school.edu",
        subject: "Policy Update",
        date: "Mon, 18 Nov 2025 08:00 AM",
        attachments: [{ name: "policy.docx", size: "22 KB" }],
        body: "Please review the updated policy.",
        correct: "safe",
        difficulty: "Easy"
    },
    {
        fromName: "Prize Center",
        fromEmail: "win@big-prize.net",
        subject: "You Won!",
        date: "Tue, 19 Nov 2025 14:15 PM",
        attachments: [],
        body: "Claim your prize by clicking here.",
        correct: "malicious",
        difficulty: "Hardest"
    },
];

const penalties = {
    "Easy": 10000,
    "Medium": 50000,
    "Medium Hard": 100000,
    "Hardest": 200000
};

let index = 0;
let budget = 850000;
let timeLeft = 150;
let timer;

// DOM
const intro = document.getElementById("start-screen");
const startButtonScreen = document.getElementById("start-button-screen");
const bigStartBtn = document.getElementById("big-start-btn");
const gameUI = document.getElementById("game-ui");
const endScreen = document.getElementById("end-screen");

const emailContainer = document.getElementById("email-container");
const timerDisplay = document.getElementById("timer");
const budgetDisplay = document.getElementById("budget-amount");
const penaltyDisplay = document.getElementById("penalty-display");

const bgMusic = document.getElementById("bg-music");
const clickSound = document.getElementById("click-sound");
const penaltySound = document.getElementById("penalty-sound");

// After 10 seconds → show big START PAGE
setTimeout(() => {
    intro.style.display = "none";
    startButtonScreen.style.display = "flex";
}, 10000);

// Shuffle
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
}

// Load an email
function loadEmail() {
    const m = emails[index];
    let att = "";
    if (m.attachments.length) {
        att = "<ul>";
        m.attachments.forEach(x => {
            att += `<li>${x.name} (${x.size})</li>`;
        });
        att += "</ul>";
    }

    emailContainer.innerHTML = `
        <p><strong>From:</strong> ${m.fromName} &lt;${m.fromEmail}&gt;</p>
        <p><strong>Subject:</strong> ${m.subject}</p>
        <p><strong>Date:</strong> ${m.date}</p>
        <p>${m.body}</p>
        ${att}
    `;
}

// Timer
function startTimer() {
    timerDisplay.textContent = format(timeLeft);
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = format(timeLeft);
        if (timeLeft <= 0) endGame();
    }, 1000);
}

// Format mm:ss
function format(t) {
    let m = Math.floor(t / 60);
    let s = t % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

// Penalty animation
function showPenalty(val) {
    penaltyDisplay.textContent = `-${val}$`;
    penaltyDisplay.style.opacity = "1";
    penaltyDisplay.style.transform = "scale(1.5)";
    penaltySound.play();

    setTimeout(() => {
        penaltyDisplay.style.opacity = "0";
        penaltyDisplay.style.transform = "scale(1)";
    }, 1000);
}

// Answering
function answer(type) {
    clickSound.play();

    let q = emails[index];
    let pen = penalties[q.difficulty];

    if (type !== q.correct) {
        budget -= pen;
        if (budget < 0) budget = 0;
        showPenalty(pen);
    }

    index++;
    if (index >= emails.length) {
        endGame();
    } else {
        loadEmail();
        budgetDisplay.textContent = `${budget} USD`;
    }
}

// END GAME
function endGame() {
    clearInterval(timer);
    bgMusic.pause();

    gameUI.style.display = "none";
    endScreen.style.display = "block";

    document.getElementById("final-budget").textContent = `${budget} USD`;
}

// BIG START BUTTON CLICK
bigStartBtn.onclick = () => {
    startButtonScreen.style.display = "none";
    gameUI.style.display = "block";

    shuffle(emails);
    loadEmail();
    startTimer();

    bgMusic.volume = 0.4;
    bgMusic.play();
};

// Buttons
document.getElementById("infected-btn").onclick = () => answer("malicious");
document.getElementById("safe-btn").onclick = () => answer("safe");

