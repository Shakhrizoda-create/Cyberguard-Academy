// ========================
// GAME DATA - 10 SHUFFLED QUESTIONS
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
        fromName: "IT Support",
        fromEmail: "support@school.edu",
        subject: "Password Expired",
        date: "Fri, 15 Nov 2025 11:30 AM",
        attachments: [],
        body: "Your password expired today. Reset using the link below.",
        correct: "infected",
        difficulty: "Medium"
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
        correct: "infected",
        difficulty: "Hardest"
    },
    {
        fromName: "Bank Security",
        fromEmail: "verify@secure-banking-alert.com",
        subject: "URGENT: Account Verification",
        date: "Thu, 14 Nov 2025 13:55 PM",
        attachments: [],
        body: "Unusual activity detected. Verify your identity.",
        correct: "infected",
        difficulty: "Hardest"
    },
    {
        fromName: "Event Team",
        fromEmail: "event@school.edu",
        subject: "Upcoming Event Details",
        date: "Tue, 20 Nov 2025 10:00 AM",
        attachments: [{ name: "EventDetails.pdf", size: "45 KB" }],
        body: "Details of upcoming school event.",
        correct: "safe",
        difficulty: "Medium"
    },
    {
        fromName: "Social Media Alert",
        fromEmail: "security@social.com",
        subject: "New Login Detected",
        date: "Wed, 21 Nov 2025 09:15 AM",
        attachments: [],
        body: "A new login detected from unknown device.",
        correct: "infected",
        difficulty: "Medium Hard"
    },
    {
        fromName: "Library",
        fromEmail: "library@school.edu",
        subject: "Book Overdue Notice",
        date: "Thu, 22 Nov 2025 12:00 PM",
        attachments: [],
        body: "Your borrowed book is overdue.",
        correct: "safe",
        difficulty: "Easy"
    },
    {
        fromName: "Tech Support",
        fromEmail: "support@school.edu",
        subject: "Install New Software",
        date: "Fri, 23 Nov 2025 15:45 PM",
        attachments: [{ name: "software.exe", size: "120 MB" }],
        body: "Install the latest software to improve performance.",
        correct: "infected",
        difficulty: "Medium Hard"
    },
    {
        fromName: "Newsletter",
        fromEmail: "news@school.edu",
        subject: "Weekly Updates",
        date: "Sat, 24 Nov 2025 08:30 AM",
        attachments: [{ name: "updates.pdf", size: "10 KB" }],
        body: "Here are this week’s school updates.",
        correct: "safe",
        difficulty: "Medium"
    }
];

const penalties = {
    "Easy": 10000,
    "Medium": 50000,
    "Medium Hard": 100000,
    "Hardest": 200000
};

// ========================
// GAME VARIABLES
// ========================
let index = 0;
let budget = 850000;
let timeLeft = 100; // 1:40 = 100s
let timer;

// DOM
const introScreen = document.getElementById("intro-screen");
const startScreen = document.getElementById("start-screen");
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

// ========================
// FUNCTIONS
// ========================
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// FORMAT TIMER
function format(t) {
    let m = Math.floor(t / 60);
    let s = t % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

// LOAD EMAIL
function loadEmail() {
    const m = emails[index];
    let att = "";
    if (m.attachments.length) {
        att = "<ul>";
        m.attachments.forEach(x => att += `<li>${x.name} (${x.size})</li>`);
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

// START TIMER
function startTimer() {
    timerDisplay.textContent = format(timeLeft);
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = format(timeLeft);
        if (timeLeft <= 0) endGame();
    }, 1000);
}

// SHOW PENALTY ANIMATION
function showPenalty(val) {
    penaltyDisplay.textContent = `-${val}$`;
    penaltyDisplay.style.opacity = "1";
    penaltyDisplay.style.transform = "translate(-50%, -50%) scale(1.5)";
    penaltySound.play();

    setTimeout(() => {
        penaltyDisplay.style.opacity = "0";
        penaltyDisplay.style.transform = "translate(-50%, -50%) scale(1)";
    }, 1000);
}

// HANDLE ANSWER
function answer(type) {
    clickSound.play();
    const q = emails[index];
    const pen = penalties[q.difficulty];

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

// ========================
// EVENTS
// ========================

// SHOW START SCREEN AFTER 10s
setTimeout(() => {
    introScreen.style.display = "none";
    startScreen.style.display = "flex";
}, 10000);

// START BUTTON CLICK
bigStartBtn.onclick = () => {
    startScreen.style.display = "none";
    gameUI.style.display = "block";

    shuffle(emails); // Shuffle 10 questions
    loadEmail();
    startTimer();

    bgMusic.volume = 0.4;
    bgMusic.play();
};

// CHOICE BUTTONS
document.getElementById("safe-btn").onclick = () => answer("safe");
document.getElementById("infected-btn").onclick = () => answer("infected");

// END SCREEN BUTTONS
document.getElementById("restart-btn").onclick = () => location.reload();
document.getElementById("home-btn").onclick = () => location.reload();

