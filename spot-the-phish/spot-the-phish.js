// ============================================================
// VARIABLES & DOM ELEMENTS
// ============================================================

let budget = 850000;
let currentIndex = 0;
let timerSeconds = 150;
let timerInterval = null;

const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const gameUI = document.getElementById("game-ui");
const emailContainer = document.getElementById("email-container");

const timerBox = document.getElementById("timer");
const budgetAmount = document.getElementById("budget-amount");

const safeBtn = document.getElementById("safe-btn");
const suspiciousBtn = document.getElementById("suspicious-btn");
const maliciousBtn = document.getElementById("malicious-btn");

const penaltyDisplay = document.getElementById("penalty-display");

const endScreen = document.getElementById("end-screen");
const finalBudget = document.getElementById("final-budget");
const restartBtn = document.getElementById("restart-btn");
const backBtn = document.getElementById("back-btn");

// ============================================================
// EMAIL DATABASE
// ============================================================

const emails = [
    {
        fromName: "PayPal Security",
        fromEmail: "noreply@paypal-alert.com",
        subject: "Your account is locked!",
        date: "Tue, 12 Nov 2025 08:41 AM",
        attachments: [{ name: "Security_Report_84729.pdf", size: "142 KB" }],
        body: "We detected unusual login attempts on your account. Please download the attached report or click the verification link below.",
        correct: "malicious",
        penalty: 10000,
        difficulty: "Easy"
    },
    {
        fromName: "School Admin",
        fromEmail: "admin@school.edu",
        subject: "Class Schedule Updated",
        date: "Wed, 13 Nov 2025 09:10 AM",
        attachments: [{ name: "Schedule_Fall2025.docx", size: "56 KB" }],
        body: "Your class schedule has been updated. Please review the changes on the school portal.",
        correct: "safe",
        penalty: 10000,
        difficulty: "Easy"
    },
    {
        fromName: "Amazon Orders",
        fromEmail: "orders@amazon.com",
        subject: "Package Delivery Update",
        date: "Thu, 14 Nov 2025 06:12 PM",
        attachments: [{ name: "Delivery_Invoice_92218.png", size: "684 KB" }],
        body: "Your order #118-9921 is delayed due to weather conditions. Check attachment for details.",
        correct: "safe",
        penalty: 20000,
        difficulty: "Low-Moderate"
    },
    {
        fromName: "Apple Security",
        fromEmail: "noreply@apple-secure.com",
        subject: "Apple ID Verification Required",
        date: "Fri, 15 Nov 2025 11:30 AM",
        attachments: [{ name: "Verification_Link.htm", size: "4 KB" }],
        body: "Your Apple ID has been temporarily locked. Click the link to restore access immediately.",
        correct: "malicious",
        penalty: 50000,
        difficulty: "Moderate"
    },
    {
        fromName: "HR Department",
        fromEmail: "hr@company.com",
        subject: "Payroll Report Q4",
        date: "Mon, 18 Nov 2025 08:00 AM",
        attachments: [{ name: "Payroll_Report_Q4_2025.xlsm", size: "220 KB" }],
        body: "Attached is your payroll report for Q4 2025. Open the file for details.",
        correct: "malicious",
        penalty: 100000,
        difficulty: "Hard"
    },
    {
        fromName: "Colleague",
        fromEmail: "jane.doe@company.com",
        subject: "Project Update",
        date: "Tue, 19 Nov 2025 02:20 PM",
        attachments: [{ name: "Project_Update_Nov19.pdf", size: "125 KB" }],
        body: "Please find attached the latest project update.",
        correct: "safe",
        penalty: 50000,
        difficulty: "Moderate"
    },
    {
        fromName: "Bank Alert",
        fromEmail: "alert@banking.com",
        subject: "Suspicious Activity Detected",
        date: "Wed, 20 Nov 2025 07:15 AM",
        attachments: [],
        body: "We detected unusual activity in your account. Verify your identity immediately.",
        correct: "suspicious",
        penalty: 200000,
        difficulty: "Very Hard"
    },
    {
        fromName: "LinkedIn",
        fromEmail: "notifications@linkedin.com",
        subject: "New Connection Request",
        date: "Thu, 21 Nov 2025 09:50 AM",
        attachments: [],
        body: "John Smith has sent you a connection request.",
        correct: "safe",
        penalty: 10000,
        difficulty: "Easy"
    },
    {
        fromName: "Unknown Sender",
        fromEmail: "unknown@malicious.site",
        subject: "Urgent: Download Now",
        date: "Fri, 22 Nov 2025 01:05 PM",
        attachments: [{ name: "Install_Update.exe", size: "512 KB" }],
        body: "Your system requires immediate update. Download attached file.",
        correct: "malicious",
        penalty: 200000,
        difficulty: "Very Hard"
    },
    {
        fromName: "Dropbox",
        fromEmail: "notifications@dropbox.com",
        subject: "Shared Document",
        date: "Sat, 23 Nov 2025 10:30 AM",
        attachments: [{ name: "Budget_Proposal_2025.pdf", size: "178 KB" }],
        body: "A colleague has shared a document with you.",
        correct: "safe",
        penalty: 50000,
        difficulty: "Moderate"
    }
];

// ============================================================
// START SIMULATION
// ============================================================

startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    gameUI.classList.remove("hidden");
    loadEmail();
    startTimer();
});

// ============================================================
// TIMER SYSTEM
// ============================================================

function startTimer() {
    timerInterval = setInterval(() => {
        timerSeconds--;
        let minutes = Math.floor(timerSeconds / 60);
        let seconds = timerSeconds % 60;
        if (seconds < 10) seconds = "0" + seconds;
        timerBox.textContent = `${minutes}:${seconds}`;
        if (timerSeconds <= 0) endGame();
    }, 1000);
}

// ============================================================
// LOAD EMAIL
// ============================================================

function loadEmail() {
    const email = emails[currentIndex];
    let attachmentsHTML = "";
    if (email.attachments.length > 0) {
        attachmentsHTML = '<div class="attachments">';
        email.attachments.forEach(att => {
            attachmentsHTML += `<span class="attachment">${att.name} (${att.size})</span>`;
        });
        attachmentsHTML += '</div>';
    }

    emailContainer.innerHTML = `
        <div class="email-card">
            <div class="email-meta"><strong>From:</strong> ${email.fromName} &lt;${email.fromEmail}&gt;</div>
            <div class="email-meta"><strong>Subject:</strong> ${email.subject}</div>
            <div class="email-meta"><strong>Date:</strong> ${email.date}</div>
            <div class="email-body">${email.body}</div>
            ${attachmentsHTML}
        </div>
    `;
}

// ============================================================
// CHOICE BUTTONS
// ============================================================

safeBtn.onclick = () => handleChoice("safe");
suspiciousBtn.onclick = () => handleChoice("suspicious");
maliciousBtn.onclick = () => handleChoice("malicious");

function handleChoice(choice) {
    const email = emails[currentIndex];
    if (choice !== email.correct) applyPenalty(email.penalty);

    currentIndex++;
    if (currentIndex >= emails.length) endGame();
    else loadEmail();
}

// ============================================================
// PENALTY + ANIMATION
// ============================================================

function applyPenalty(amount) {
    budget -= amount;
    budgetAmount.textContent = `${budget.toLocaleString()} USD`;

    // Red HACKED text
    penaltyDisplay.innerHTML = `HACKED!`;
    penaltyDisplay.classList.add("penalty-show");

    // Yellow money loss
    const moneyLoss = document.createElement("div");
    moneyLoss.classList.add("penalty-money");
    moneyLoss.textContent = `-${amount.toLocaleString()} USD`;
    document.body.appendChild(moneyLoss);

    setTimeout(() => {
        penaltyDisplay.classList.remove("penalty-show");
        moneyLoss.style.opacity = "1";
        moneyLoss.style.transform = "translate(-50%, -55%) scale(1.2)";
        setTimeout(() => {
            moneyLoss.remove();
        }, 1200);
    }, 500);
}

// ============================================================
// END SIMULATION
// ============================================================

function endGame() {
    clearInterval(timerInterval);
    gameUI.classList.add("hidden");
    endScreen.classList.remove("hidden");
    finalBudget.textContent = `${budget.toLocaleString()} USD`;
}

// ============================================================
// RESTART / BACK
// ============================================================

restartBtn.onclick = () => {
    budget = 850000;
    currentIndex = 0;
    timerSeconds = 150;
    endScreen.classList.add("hidden");
    gameUI.classList.remove("hidden");
    budgetAmount.textContent = `${budget.toLocaleString()} USD`;
    loadEmail();
    startTimer();
};

backBtn.onclick = () => {
    window.location.href = "index.html";
};

