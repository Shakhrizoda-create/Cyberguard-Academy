// ==========================
// GAME DATA - 10 QUESTIONS
// ==========================
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
        fromEmail: "alert@fakesbank.com",
        subject: "Urgent: Verify Your Account",
        date: "Thu, 14 Nov 2025 10:20 AM",
        attachments: [],
        body: "Your account has been compromised. Click the link to verify immediately!",
        correct: "malicious",
        difficulty: "Hardest Hardest"
    },
    {
        fromName: "IT Support",
        fromEmail: "support@school.edu",
        subject: "Password Reset Required",
        date: "Fri, 15 Nov 2025 11:30 AM",
        attachments: [],
        body: "Please reset your password using the link provided.",
        correct: "malicious",
        difficulty: "Medium harder"
    },
    {
        fromName: "HR Department",
        fromEmail: "hr@school.edu",
        subject: "Mandatory Survey",
        date: "Mon, 18 Nov 2025 08:00 AM",
        attachments: [{ name: "survey.docx", size: "12 KB" }],
        body: "Please fill out the attached employee survey.",
        correct: "safe",
        difficulty: "Easy"
    },
    {
        fromName: "Unknown Sender",
        fromEmail: "prize@lottery.win",
        subject: "You Won a Prize!",
        date: "Tue, 19 Nov 2025 14:15 PM",
        attachments: [],
        body: "Click here to claim your $1,000,000 prize now.",
        correct: "malicious",
        difficulty: "Hardest Hardest"
    },
    {
        fromName: "Library Admin",
        fromEmail: "library@school.edu",
        subject: "Overdue Books Notice",
        date: "Wed, 20 Nov 2025 09:45 AM",
        attachments: [],
        body: "Your books are overdue. Please return them immediately.",
        correct: "safe",
        difficulty: "Easy"
    },
    {
        fromName: "Social Media Team",
        fromEmail: "notify@socialmedia.fake",
        subject: "Account Suspended",
        date: "Thu, 21 Nov 2025 16:00 PM",
        attachments: [],
        body: "Your account has been suspended. Click here to reactivate.",
        correct: "malicious",
        difficulty: "Medium harder"
    },
    {
        fromName: "Finance Dept",
        fromEmail: "finance@school.edu",
        subject: "Invoice Payment Due",
        date: "Fri, 22 Nov 2025 10:30 AM",
        attachments: [{ name: "invoice.pdf", size: "45 KB" }],
        body: "Please pay the attached invoice by the due date.",
        correct: "safe",
        difficulty: "A bit harder"
    },
    {
        fromName: "Unknown Sender",
        fromEmail: "security@secure-login.net",
        subject: "Security Alert",
        date: "Sat, 23 Nov 2025 12:00 PM",
        attachments: [],
        body: "We noticed suspicious activity on your account. Log in to secure your account.",
        correct: "malicious",
        difficulty: "Medium harder"
    },
    {
        fromName: "Course Coordinator",
        fromEmail: "courses@school.edu",
        subject: "New Lecture Material",
        date: "Sun, 24 Nov 2025 09:00 AM",
        attachments: [{ name: "lecture1.pptx", size: "32 MB" }],
        body: "Please find the new lecture materials attached.",
        correct: "safe",
        difficulty: "Easy"
    }
];

// ==========================
// DIFFICULTY PENALTIES
// ==========================
const difficultyPenalties = {
    "Easy": 10000,
    "A bit harder": 20000,
    "Medium": 50000,
    "Medium harder": 100000,
    "Hardest Hardest": 200000
};

// ==========================
// GAME STATE
// ==========================
let currentEmailIndex = 0;
let budget = 850000;
let timerSeconds = 150;
let timerInterval;

// ==========================
// AUDIO ELEMENTS
// ==========================
const bgMusic = document.getElementById("bg-music");
const clickSound = document.getElementById("click-sound");
const penaltySound = document.getElementById("penalty-sound");

// ==========================
// DOM ELEMENTS
// ==========================
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const gameUI = document.getElementById("game-ui");
const emailContainer = document.getElementById("email-container");
const infectedBtn = document.getElementById("infected-btn");
const safeBtn = document.getElementById("safe-btn");
const budgetAmount = document.getElementById("budget-amount");
const timerDisplay = document.getElementById("timer");
const penaltyDisplay = document.getElementById("penalty-display");
const endScreen = document.getElementById("end-screen");
const finalBudget = document.getElementById("final-budget");
const restartBtn = document.getElementById("restart-btn");
const backBtn = document.getElementById("back-btn");

// ==========================
// UTILITY FUNCTIONS
// ==========================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function showPenaltyGhost(amount) {
    penaltyDisplay.textContent = `-${amount.toLocaleString()}$`;
    penaltyDisplay.style.opacity = "1";
    penaltyDisplay.style.transform = "translate(-50%, -50%) scale(1.6)";

    // Play penalty audio
    if (penaltySound) penaltySound.play();

    setTimeout(() => {
        penaltyDisplay.style.opacity = "0";
        penaltyDisplay.style.transform = "translate(-50%, -50%) scale(1)";
    }, 1200);
}

// ==========================
// GAME LOGIC
// ==========================
function showEmail() {
    const email = emails[currentEmailIndex];
    let attachmentsHTML = "";

    if (email.attachments.length > 0) {
        attachmentsHTML = "<ul>";
        email.attachments.forEach(a => {
            attachmentsHTML += `<li>${a.name} (${a.size})</li>`;
        });
        attachmentsHTML += "</ul>";
    }

    emailContainer.innerHTML = `
        <p><strong>From:</strong> ${email.fromName} &lt;${email.fromEmail}&gt;</p>
        <p><strong>Subject:</strong> ${email.subject}</p>
        <p><strong>Date:</strong> ${email.date}</p>
        <p><strong>Body:</strong> ${email.body}</p>
        ${attachmentsHTML}
    `;

    budgetAmount.textContent = `${budget.toLocaleString()} USD`;
}

function handleChoice(choice) {
    clickSound.play();

    const email = emails[currentEmailIndex];
    const penaltyAmount = difficultyPenalties[email.difficulty];

    if (choice !== email.correct) {
        budget -= penaltyAmount;
        if (budget < 0) budget = 0;
        showPenaltyGhost(penaltyAmount);
    }

    budgetAmount.textContent = `${budget.toLocaleString()} USD`;

    currentEmailIndex++;

    if (currentEmailIndex >= emails.length) {
        endGame();
    } else {
        showEmail();
    }
}

function startTimer() {
    timerDisplay.textContent = formatTime(timerSeconds);

    timerInterval = setInterval(() => {
        timerSeconds--;
        timerDisplay.textContent = formatTime(timerSeconds);

        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    bgMusic.pause();

    gameUI.classList.add("hidden");
    endScreen.classList.remove("hidden");

    finalBudget.textContent = `${budget.toLocaleString()} USD`;
}

// ==========================
// EVENT LISTENERS
// ==========================
startBtn.addEventListener("click", () => {
    bgMusic.volume = 0.5;
    bgMusic.play();

    shuffleArray(emails);
    currentEmailIndex = 0;
    budget = 850000;
    timerSeconds = 150;

    startScreen.classList.add("hidden");
    gameUI.classList.remove("hidden");

    showEmail();
    startTimer();
});

infectedBtn.addEventListener("click", () => handleChoice("malicious"));
safeBtn.addEventListener("click", () => handleChoice("safe"));

restartBtn.addEventListener("click", () => {
    bgMusic.currentTime = 0;
    bgMusic.play();

    shuffleArray(emails);
    currentEmailIndex = 0;
    budget = 850000;
    timerSeconds = 150;

    endScreen.classList.add("hidden");
    gameUI.classList.remove("hidden");

    showEmail();
    startTimer();
});

backBtn.addEventListener("click", () => {
    endScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
});
// ==========================
// GAME DATA - 10 QUESTIONS
// ==========================
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
        fromEmail: "alert@fakesbank.com",
        subject: "Urgent: Verify Your Account",
        date: "Thu, 14 Nov 2025 10:20 AM",
        attachments: [],
        body: "Your account has been compromised. Click the link to verify immediately!",
        correct: "malicious",
        difficulty: "Hardest Hardest"
    },
    {
        fromName: "IT Support",
        fromEmail: "support@school.edu",
        subject: "Password Reset Required",
        date: "Fri, 15 Nov 2025 11:30 AM",
        attachments: [],
        body: "Please reset your password using the link provided.",
        correct: "malicious",
        difficulty: "Medium harder"
    },
    {
        fromName: "HR Department",
        fromEmail: "hr@school.edu",
        subject: "Mandatory Survey",
        date: "Mon, 18 Nov 2025 08:00 AM",
        attachments: [{ name: "survey.docx", size: "12 KB" }],
        body: "Please fill out the attached employee survey.",
        correct: "safe",
        difficulty: "Easy"
    },
    {
        fromName: "Unknown Sender",
        fromEmail: "prize@lottery.win",
        subject: "You Won a Prize!",
        date: "Tue, 19 Nov 2025 14:15 PM",
        attachments: [],
        body: "Click here to claim your $1,000,000 prize now.",
        correct: "malicious",
        difficulty: "Hardest Hardest"
    },
    {
        fromName: "Library Admin",
        fromEmail: "library@school.edu",
        subject: "Overdue Books Notice",
        date: "Wed, 20 Nov 2025 09:45 AM",
        attachments: [],
        body: "Your books are overdue. Please return them immediately.",
        correct: "safe",
        difficulty: "Easy"
    },
    {
        fromName: "Social Media Team",
        fromEmail: "notify@socialmedia.fake",
        subject: "Account Suspended",
        date: "Thu, 21 Nov 2025 16:00 PM",
        attachments: [],
        body: "Your account has been suspended. Click here to reactivate.",
        correct: "malicious",
        difficulty: "Medium harder"
    },
    {
        fromName: "Finance Dept",
        fromEmail: "finance@school.edu",
        subject: "Invoice Payment Due",
        date: "Fri, 22 Nov 2025 10:30 AM",
        attachments: [{ name: "invoice.pdf", size: "45 KB" }],
        body: "Please pay the attached invoice by the due date.",
        correct: "safe",
        difficulty: "A bit harder"
    },
    {
        fromName: "Unknown Sender",
        fromEmail: "security@secure-login.net",
        subject: "Security Alert",
        date: "Sat, 23 Nov 2025 12:00 PM",
        attachments: [],
        body: "We noticed suspicious activity on your account. Log in to secure your account.",
        correct: "malicious",
        difficulty: "Medium harder"
    },
    {
        fromName: "Course Coordinator",
        fromEmail: "courses@school.edu",
        subject: "New Lecture Material",
        date: "Sun, 24 Nov 2025 09:00 AM",
        attachments: [{ name: "lecture1.pptx", size: "32 MB" }],
        body: "Please find the new lecture materials attached.",
        correct: "safe",
        difficulty: "Easy"
    }
];

// ==========================
// DIFFICULTY PENALTIES
// ==========================
const difficultyPenalties = {
    "Easy": 10000,
    "A bit harder": 20000,
    "Medium": 50000,
    "Medium harder": 100000,
    "Hardest Hardest": 200000
};

// ==========================
// GAME STATE
// ==========================
let currentEmailIndex = 0;
let budget = 850000;
let timerSeconds = 150;
let timerInterval;

// ==========================
// AUDIO ELEMENTS
// ==========================
const bgMusic = document.getElementById("bg-music");
const clickSound = document.getElementById("click-sound");
const penaltySound = document.getElementById("penalty-sound");

// ==========================
// DOM ELEMENTS
// ==========================
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const gameUI = document.getElementById("game-ui");
const emailContainer = document.getElementById("email-container");
const infectedBtn = document.getElementById("infected-btn");
const safeBtn = document.getElementById("safe-btn");
const budgetAmount = document.getElementById("budget-amount");
const timerDisplay = document.getElementById("timer");
const penaltyDisplay = document.getElementById("penalty-display");
const endScreen = document.getElementById("end-screen");
const finalBudget = document.getElementById("final-budget");
const restartBtn = document.getElementById("restart-btn");
const backBtn = document.getElementById("back-btn");

// ==========================
// UTILITY FUNCTIONS
// ==========================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function showPenaltyGhost(amount) {
    penaltyDisplay.textContent = `-${amount.toLocaleString()}$`;
    penaltyDisplay.style.opacity = "1";
    penaltyDisplay.style.transform = "translate(-50%, -50%) scale(1.6)";

    // Play penalty audio
    if (penaltySound) penaltySound.play();

    setTimeout(() => {
        penaltyDisplay.style.opacity = "0";
        penaltyDisplay.style.transform = "translate(-50%, -50%) scale(1)";
    }, 1200);
}

// ==========================
// GAME LOGIC
// ==========================
function showEmail() {
    const email = emails[currentEmailIndex];
    let attachmentsHTML = "";

    if (email.attachments.length > 0) {
        attachmentsHTML = "<ul>";
        email.attachments.forEach(a => {
            attachmentsHTML += `<li>${a.name} (${a.size})</li>`;
        });
        attachmentsHTML += "</ul>";
    }

    emailContainer.innerHTML = `
        <p><strong>From:</strong> ${email.fromName} &lt;${email.fromEmail}&gt;</p>
        <p><strong>Subject:</strong> ${email.subject}</p>
        <p><strong>Date:</strong> ${email.date}</p>
        <p><strong>Body:</strong> ${email.body}</p>
        ${attachmentsHTML}
    `;

    budgetAmount.textContent = `${budget.toLocaleString()} USD`;
}

function handleChoice(choice) {
    clickSound.play();

    const email = emails[currentEmailIndex];
    const penaltyAmount = difficultyPenalties[email.difficulty];

    if (choice !== email.correct) {
        budget -= penaltyAmount;
        if (budget < 0) budget = 0;
        showPenaltyGhost(penaltyAmount);
    }

    budgetAmount.textContent = `${budget.toLocaleString()} USD`;

    currentEmailIndex++;

    if (currentEmailIndex >= emails.length) {
        endGame();
    } else {
        showEmail();
    }
}

function startTimer() {
    timerDisplay.textContent = formatTime(timerSeconds);

    timerInterval = setInterval(() => {
        timerSeconds--;
        timerDisplay.textContent = formatTime(timerSeconds);

        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    bgMusic.pause();

    gameUI.classList.add("hidden");
    endScreen.classList.remove("hidden");

    finalBudget.textContent = `${budget.toLocaleString()} USD`;
}

// ==========================
// EVENT LISTENERS
// ==========================
startBtn.addEventListener("click", () => {
    bgMusic.volume = 0.5;
    bgMusic.play();

    shuffleArray(emails);
    currentEmailIndex = 0;
    budget = 850000;
    timerSeconds = 150;

    startScreen.classList.add("hidden");
    gameUI.classList.remove("hidden");

    showEmail();
    startTimer();
});

infectedBtn.addEventListener("click", () => handleChoice("malicious"));
safeBtn.addEventListener("click", () => handleChoice("safe"));

restartBtn.addEventListener("click", () => {
    bgMusic.currentTime = 0;
    bgMusic.play();

    shuffleArray(emails);
    currentEmailIndex = 0;
    budget = 850000;
    timerSeconds = 150;

    endScreen.classList.add("hidden");
    gameUI.classList.remove("hidden");

    showEmail();
    startTimer();
});

backBtn.addEventListener("click", () => {
    endScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
});




