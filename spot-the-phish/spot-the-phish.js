/* =========================================================
   CYBERSECURITY EMAIL THREAT GAME (FINAL VERSION)
   Slide-style gameplay — 10 questions — Timer ends game
   ========================================================= */

// =========================
//  QUESTIONS (10 total)
// =========================
const emails = [
    {
        fromName: "School Admin",
        fromEmail: "admin@school.edu",
        subject: "Class Schedule Updated",
        date: "Wed, 13 Nov 2025 09:10 AM",
        attachments: [{ name: "Schedule_Fall2025.docx", size: "56 KB" }],
        body: "Your class schedule has been updated. Please review the changes on the school portal.",
        correct: "safe",
        difficulty: "Easy"
    },
    {
        fromName: "Bank Alert",
        fromEmail: "alert@bank-verify-secure.com",
        subject: "Important: Account Verification Required",
        date: "Thu, 14 Nov 2025 10:24 AM",
        attachments: [],
        body: "Suspicious activity detected. Please verify your identity to avoid suspension.",
        correct: "malicious",
        difficulty: "Hardest"
    },
    {
        fromName: "IT Support",
        fromEmail: "it-help@school.edu",
        subject: "Password Expiry Notice",
        date: "Fri, 15 Nov 2025 11:30 AM",
        attachments: [],
        body: "Your password expires today. Reset it using the link provided.",
        correct: "malicious",
        difficulty: "Medium Hard"
    },
    {
        fromName: "HR Department",
        fromEmail: "hr@school.edu",
        subject: "Mandatory Policy Update",
        date: "Mon, 18 Nov 2025 08:00 AM",
        attachments: [{ name: "policy_update.docx", size: "22 KB" }],
        body: "Please read and acknowledge the updated school policies.",
        correct: "safe",
        difficulty: "Easy"
    },
    {
        fromName: "Lottery Notification",
        fromEmail: "winner@lucky-prize.net",
        subject: "Congratulations! You Won!",
        date: "Tue, 19 Nov 2025 14:15 PM",
        attachments: [],
        body: "Claim your $500,000 reward by clicking the secure link below.",
        correct: "malicious",
        difficulty: "Hardest"
    },
    {
        fromName: "Library Admin",
        fromEmail: "library@school.edu",
        subject: "Reminder: Overdue Books",
        date: "Wed, 20 Nov 2025 09:45 AM",
        attachments: [],
        body: "You have overdue library books. Please return them as soon as possible.",
        correct: "safe",
        difficulty: "Easy"
    },
    {
        fromName: "Social Media Team",
        fromEmail: "support@socialmedia-security.com",
        subject: "Your Account Has Been Locked",
        date: "Thu, 21 Nov 2025 16:00 PM",
        attachments: [],
        body: "Your account violated the terms. Log in to restore access.",
        correct: "malicious",
        difficulty: "Medium Hard"
    },
    {
        fromName: "Finance Dept",
        fromEmail: "finance@school.edu",
        subject: "Invoice Payment Due",
        date: "Fri, 22 Nov 2025 10:30 AM",
        attachments: [{ name: "invoice_2025.pdf", size: "45 KB" }],
        body: "Attached is the invoice that must be settled by the end of the week.",
        correct: "safe",
        difficulty: "Medium"
    },
    {
        fromName: "Security Alert",
        fromEmail: "security@secure-login-auth.net",
        subject: "Unusual Login Attempt",
        date: "Sat, 23 Nov 2025 12:00 PM",
        attachments: [],
        body: "Your account was accessed from a new device. Confirm it was you.",
        correct: "malicious",
        difficulty: "Medium Hard"
    },
    {
        fromName: "Course Coordinator",
        fromEmail: "courses@school.edu",
        subject: "New Material Available",
        date: "Sun, 24 Nov 2025 09:00 AM",
        attachments: [{ name: "Lecture_12.pptx", size: "32 MB" }],
        body: "The newest lecture slides have been uploaded. See attachment.",
        correct: "safe",
        difficulty: "Easy"
    }
];


// =========================
//  DIFFICULTY PENALTIES
// =========================
const penalties = {
    "Easy": 10000,
    "Medium": 50000,
    "Medium Hard": 100000,
    "Hardest": 200000
};


// =========================
//  GAME STATE
// =========================
let current = 0;
let budget = 850000;
let timeLeft = 150; // 2:30
let timerInterval = null;


// =========================
//  SOUNDS
// =========================
const bgMusic = document.getElementById("bg-music");
const clickSound = document.getElementById("click-sound");
const penaltySound = document.getElementById("penalty-sound");


// =========================
//  DOM ELEMENTS
// =========================
const startScreen = document.getElementById("start-screen");
const gameUI = document.getElementById("game-ui");
const endScreen = document.getElementById("end-screen");

const emailContainer = document.getElementById("email-container");
const timerBox = document.getElementById("timer");
const budgetBox = document.getElementById("budget-amount");
const penaltyDisplay = document.getElementById("penalty-display");


// =========================
//  UTILS
// =========================
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.random() * (i + 1) | 0;
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function format(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
}


// =========================
//  PENALTY ANIMATION
// =========================
function showPenalty(amount) {
    penaltyDisplay.textContent = `-${amount.toLocaleString()}$`;
    penaltyDisplay.style.opacity = "1";
    penaltyDisplay.style.transform = "translate(-50%, -50%) scale(1.5)";

    penaltySound.play();

    setTimeout(() => {
        penaltyDisplay.style.opacity = "0";
        penaltyDisplay.style.transform = "translate(-50%, -50%) scale(1)";
    }, 1200);
}


// =========================
//  RENDER EMAIL
// =========================
function loadEmail() {
    const q = emails[current];

    let attachmentsHTML = "";
    if (q.attachments.length > 0) {
        attachmentsHTML = "<strong>Attachments:</strong><ul>";
        q.attachments.forEach(a => {
            attachmentsHTML += `<li>${a.name} (${a.size})</li>`;
        });
        attachmentsHTML += "</ul>";
    }

    emailContainer.innerHTML = `
        <p><strong>From:</strong> ${q.fromName} &lt;${q.fromEmail}&gt;</p>
        <p><strong>Subject:</strong> ${q.subject}</p>
        <p><strong>Date:</strong> ${q.date}</p>
        <p><strong>Message:</strong> ${q.body}</p>
        ${attachmentsHTML}
    `;

    budgetBox.textContent = `${budget.toLocaleString()} USD`;
}


// =========================
//  TIMER LOGIC
// =========================
function startTimer() {
    timerBox.textContent = format(timeLeft);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerBox.textContent = format(timeLeft);

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}


// =========================
//  HANDLE ANSWER
// =========================
function handleAnswer(type) {
    clickSound.play();

    const q = emails[current];
    const penalty = penalties[q.difficulty];

    if (type !== q.correct) {
        budget -= penalty;
        if (budget < 0) budget = 0;
        showPenalty(penalty);
    }

    current++;

    if (current >= emails.length) {
        endGame();
    } else {
        loadEmail();
    }
}


// =========================
//  END GAME
// =========================
function endGame() {
    clearInterval(timerInterval);
    bgMusic.pause();

    gameUI.classList.add("hidden");
    endScreen.classList.remove("hidden");

    document.getElementById("final-budget").textContent =
        `${budget.toLocaleString()} USD`;
}


// =========================
//  START GAME
// =========================
document.getElementById("start-btn").onclick = () => {
    bgMusic.volume = 0.5;
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


// =========================
//  BUTTON EVENTS
// =========================
document.getElementById("infected-btn").onclick = () => handleAnswer("malicious");
document.getElementById("safe-btn").onclick = () => handleAnswer("safe");

document.getElementById("restart-btn").onclick = () => location.reload();
document.getElementById("back-btn").onclick = () => location.reload();


