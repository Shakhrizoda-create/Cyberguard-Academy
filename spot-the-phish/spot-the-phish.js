// ========================
// GAME QUESTIONS (10)
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
        body: "We detected unusual activity. Verify your account immediately.",
        correct: "malicious",
        difficulty: "Hardest"
    },
    {
        fromName: "IT Support",
        fromEmail: "support@school.edu",
        subject: "Password Expiry",
        date: "Fri, 15 Nov 2025 11:30 AM",
        attachments: [],
        body: "Your password expires today. Reset it with the link provided.",
        correct: "malicious",
        difficulty: "Medium Hard"
    },
    {
        fromName: "HR Department",
        fromEmail: "hr@school.edu",
        subject: "Policy Update",
        date: "Mon, 18 Nov 2025 08:00 AM",
        attachments: [{ name: "policy.docx", size: "22 KB" }],
        body: "Please review the attached updated policies.",
        correct: "safe",
        difficulty: "Easy"
    },
    {
        fromName: "Prize Center",
        fromEmail: "win@big-prize.net",
        subject: "You Won!",
        date: "Tue, 19 Nov 2025 14:15 PM",
        attachments: [],
        body: "Claim your $500,000 prize by clicking here.",
        correct: "malicious",
        difficulty: "Hardest"
    },
    {
        fromName: "Library Admin",
        fromEmail: "library@school.edu",
        subject: "Overdue Books",
        date: "Wed, 20 Nov 2025 09:45 AM",
        attachments: [],
        body: "You must return the overdue books as soon as possible.",
        correct: "safe",
        difficulty: "Easy"
    },
    {
        fromName: "Social Media",
        fromEmail: "verify@account-support.com",
        subject: "Account Locked",
        date: "Thu, 21 Nov 2025 16:00 PM",
        attachments: [],
        body: "Your account was locked. Log in to verify identity.",
        correct: "malicious",
        difficulty: "Medium Hard"
    },
    {
        fromName: "Finance Dept",
        fromEmail: "finance@school.edu",
        subject: "Invoice Due",
        date: "Fri, 22 Nov 2025 10:30 AM",
        attachments: [{ name: "invoice.pdf", size: "45 KB" }],
        body: "Please review and pay the attached invoice.",
        correct: "safe",
        difficulty: "Medium"
    },
    {
        fromName: "Security Team",
        fromEmail: "login-alert@secure-auth.co",
        subject: "Unusual Login Attempt",
        date: "Sat, 23 Nov 2025 12:00 PM",
        attachments: [],
        body: "A login was attempted from a new device. Confirm if it was you.",
        correct: "malicious",
        difficulty: "Medium Hard"
    },
    {
        fromName: "Course Coordinator",
        fromEmail: "courses@school.edu",
        subject: "New Lecture Material",
        date: "Sun, 24 Nov 2025 09:00 AM",
        attachments: [{ name: "Lecture12.pptx", size: "32 MB" }],
        body: "New lecture materials are attached.",
        correct: "safe",
        difficulty: "Easy"
    }
];

const penalties = {
    "Easy": 10000,
    "Medium": 50000,
    "Medium Hard": 100000,
    "Hardest": 200000
};

let current = 0;
let budget = 850000;
let timeLeft = 150;
let timerInterval;

// DOM
const startScreen = document.getElementById("start-screen");
const gameUI = document.getElementById("game-ui");
const endScreen = document.getElementById("end-screen");

const emailContainer = document.getElementById("email-container");
const timerDisplay = document.getElementById("timer");
const budgetDisplay = document.getElementById("budget-amount");
const penaltyDisplay = document.getElementById("penalty-display");

const bgMusic = document.getElementById("bg-music");
const clickSound = document.getElementById("click-sound");
const penaltySound = document.getElementById("penalty-sound");

// Shuffle
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// Format time
function format(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

// Show email
function loadEmail() {
    const q = emails[current];

    let att = "";
    if (q.attachments.length > 0) {
        att = "<ul>";
        q.attachments.forEach(a => {
            att += `<li>${a.name} (${a.size})</li>`;
        });
        att += "</ul>";
    }

    emailContainer.innerHTML = `
        <p><strong>From:</strong> ${q.fromName} &lt;${q.fromEmail}&gt;</p>
        <p><strong>Subject:</strong> ${q.subject}</p>
        <p><strong>Date:</strong> ${q.date}</p>
        <p><strong>Message:</strong> ${q.body}</p>
        ${att}
    `;

    budgetDisplay.textContent = `${budget.toLocaleString()} USD`;
}

// Timer
function startTimer() {
    timerDisplay.textContent = format(timeLeft);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = format(timeLeft);
        if (timeLeft <= 0) endGame();
    }, 1000);
}

// Penalty animation
function showPenalty(amount) {
    penaltyDisplay.textContent = `-${amount.toLocaleString()}$`;
    penaltyDisplay.style.opacity = "1";
    penaltyDisplay.style.transform = "translate(-50%, -50%) scale(1.4)";

    penaltySound.play();

    setTimeout(() => {
        penaltyDisplay.style.opacity = "0";
        penaltyDisplay.style.transform = "translate(-50%, -50%) scale(1)";
    }, 1200);
}

// Answer handling
function answer(type) {
    clickSound.play();

    const q = emails[current];
    const punish = penalties[q.difficulty];

    if (type !== q.correct) {
        budget -= punish;
        if (budget < 0) budget = 0;
        showPenalty(punish);
    }

    current++;

    if (current >= emails.length) {
        endGame();
    } else {
        loadEmail();
    }
}

// End game
function endGame() {
    clearInterval(timerInterval);
    bgMusic.pause();

    gameUI.classList.add("hidden");
    endScreen.classList.remove("hidden");

    document.getElementById("final-budget").textContent =
        `${budget.toLocaleString()} USD`;
}

// Start
document.getElementById("start-btn").onclick = () => {
    bgMusic.volume = 0.4;
    bgMusic.play();

    shuffle(emails);

    current = 0;
    budget = 850000;
    timeLeft = 150;

    startScreen.classList.add("hidden");
    gameUI.classList.remove("hidden");

    loadEmail();
    startTimer();
};

document.getElementById("infected-btn").onclick = () => answer("malicious");
document.getElementById("safe-btn").onclick = () => answer("safe");

document.getElementById("restart-btn").onclick = () => location.reload();
document.getElementById("back-btn").onclick = () => location.reload();

