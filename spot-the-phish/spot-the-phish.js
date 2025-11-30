// ================= ELEMENTS =================
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const gameUI = document.getElementById("game-ui");
const timerDisplay = document.getElementById("timer");
const budgetDisplay = document.getElementById("budget-amount");
const emailContainer = document.getElementById("email-container");
const infectedBtn = document.getElementById("infected-btn");
const safeBtn = document.getElementById("safe-btn");
const penaltyDisplay = document.getElementById("penalty-display");
const endScreen = document.getElementById("end-screen");
const finalBudget = document.getElementById("final-budget");
const restartBtn = document.getElementById("restart-btn");
const backBtn = document.getElementById("back-btn");
const introBox = document.getElementById("intro-box");

// ================= GAME VARIABLES =================
let budget = 850000;
let time = 100;
let currentIndex = 0;
let timer;

// ================= START SCREEN LOGIC =================

// Typing effect
function typeText(element, text, speed=30, callback=null) {
    element.innerHTML = "";
    let i = 0;
    const interval = setInterval(() => {
        element.innerHTML += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, speed);
}

// Start the typing
const introText = `Welcome! Your task is to evaluate incoming emails and determine which are safe or malicious.

You are provided with a security budget of 850,000 USD.

Incorrect decisions reduce your funds depending on the threat level.

Protect your organization—your cybersecurity awareness is the key.`;

typeText(introBox, introText, 25, () => {
    // Fade out text slowly
    introBox.classList.add("fade-out");
    // Show start button after fade
    setTimeout(() => {
        startBtn.classList.remove("hidden");
        startBtn.classList.add("show");
    }, 1200);
});

// Cyber cubes
const cyberCubesContainer = document.getElementById("cyber-cubes");

function spawnCubes(amount) {
    for (let i = 0; i < amount; i++) {
        const cube = document.createElement("div");
        cube.classList.add("cube");
        cube.style.left = Math.random() * 100 + "vw";
        cube.style.animationDuration = 6 + Math.random() * 4 + "s";
        cube.style.width = cube.style.height = (15 + Math.random() * 30) + "px";
        cube.style.opacity = 0.2 + Math.random() * 0.6;
        cyberCubesContainer.appendChild(cube);
    }
}

spawnCubes(40);

// Start game
startBtn.addEventListener("click", startGame);

// ================= GAME LOGIC =================
const emails = [
    {subject:"Class Update",from:"School Admin",blocks:["Schedule updated.","Check portal.","Attached document included.","Review all classes.","Contact admin if questions.","Do not ignore."],correct:"safe",penalty:10000},
    {subject:"Urgent Password Reset",from:"IT Dept",blocks:["Your account was compromised.","Reset password immediately.","Ignore at your own risk.","Link expires soon.","Confirm identity.","Do not share credentials."],correct:"infected",penalty:50000},
    {subject:"Workshop Invite",from:"HR Team",blocks:["Join the cybersecurity workshop.","Monday 10AM.","RSVP online.","Materials attached.","Be punctual.","Certificate provided."],correct:"safe",penalty:10000},
    {subject:"Suspicious Login",from:"IT Security",blocks:["Unusual login detected.","Click link to verify.","Account may be at risk.","Do not ignore.","Confirm identity.","Report issues."],correct:"infected",penalty:50000},
    {subject:"Invoice Notice",from:"Accounting",blocks:["Invoice #12345 overdue.","Immediate payment required.","Attached document has details.","Late fee may apply.","Contact finance.","Do not ignore."],correct:"infected",penalty:20000},
    {subject:"Team Lunch",from:"HR Team",blocks:["You are invited to lunch.","Date: Friday 12PM.","RSVP required.","Check menu attached.","Bring ID badge.","Enjoy the meal!"],correct:"safe",penalty:10000},
    {subject:"Phishing Test",from:"Security Dept",blocks:["This is a phishing test.","Do not click links.","Report suspicious emails.","Your awareness counts.","No penalty this time.","Thank you."],correct:"safe",penalty:10000},
    {subject:"Bank Alert",from:"Bank",blocks:["Suspicious activity detected.","Verify account now.","Attached form required.","Failure may cause lockout.","Do not ignore.","Contact support."],correct:"infected",penalty:50000},
    {subject:"Project Deadline",from:"Manager",blocks:["Project submission due.","Check attached timeline.","Ensure tasks complete.","Contact manager if late.","Do not skip steps.","Submit on time."],correct:"safe",penalty:10000},
    {subject:"Win a Prize!",from:"Unknown",blocks:["You won a prize!","Click link to claim.","Provide details quickly.","Offer expires soon.","Do not miss this.","Be cautious!"],correct:"infected",penalty:50000}
];

// Shuffle emails
emails.sort(() => Math.random() - 0.5);

function startGame() {
    startScreen.style.display = "none";
    gameUI.classList.remove("hidden");
    updateEmail();
    timer = setInterval(countdown, 1000);
}

function countdown() {
    if (time <= 0) return endGame();
    time--;
    let min = Math.floor(time / 60), sec = time % 60;
    timerDisplay.textContent = `${min}:${sec < 10 ? "0" + sec : sec}`;
}

function updateEmail() {
    if (currentIndex >= emails.length) return endGame();
    const e = emails[currentIndex];
    emailContainer.innerHTML =
        `<h2>${e.subject}</h2><h3>From: ${e.from}</h3>` +
        e.blocks.map(b => `<p>${b}</p>`).join("");
}

infectedBtn.addEventListener("click", () => checkAnswer("infected"));
safeBtn.addEventListener("click", () => checkAnswer("safe"));

function checkAnswer(choice) {
    const e = emails[currentIndex];
    if (choice !== e.correct) {
        budget -= e.penalty;
        penaltyDisplay.textContent = `-${e.penalty.toLocaleString()} USD`;
        setTimeout(() => penaltyDisplay.textContent = "", 1000);
    }
    budgetDisplay.textContent = `${budget.toLocaleString()} USD`;
    currentIndex++;
    updateEmail();
}

// ================= END SCREEN =================
function endGame() {
    clearInterval(timer);
    gameUI.classList.add("hidden");
    endScreen.style.display = "flex";
    finalBudget.textContent = `${budget.toLocaleString()} USD`;
}

restartBtn.addEventListener("click", () => location.reload());
backBtn.addEventListener("click", () => window.location.href="index.html");


