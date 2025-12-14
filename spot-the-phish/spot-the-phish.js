// Elements
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const introBox = document.getElementById("intro-box");
const gameTitle = document.querySelector(".game-title");
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
const cyberCubesContainer = document.getElementById("cyber-cubes");

// Game state
let budget = 850000;
let time = 100;
let currentIndex = 0;
let timer;

/* ===== ORIGINAL typing logic RESTORED ===== */
function typeHTML(element, html, speed = 20, callback) {
    let i = 0;
    element.innerHTML = "";
    function typeNext() {
        if (i >= html.length) {
            if (callback) callback();
            return;
        }
        if (html[i] === "<") {
            const tagEnd = html.indexOf(">", i);
            element.innerHTML += html.substring(i, tagEnd + 1);
            i = tagEnd + 1;
            typeNext();
        } else {
            element.innerHTML += html[i++];
            setTimeout(typeNext, speed);
        }
    }
    typeNext();
}

// Spawn cubes (intro only)
function spawnCubes(amount) {
    for (let i = 0; i < amount; i++) {
        const cube = document.createElement("div");
        cube.classList.add("cube");
        cube.style.left = Math.random() * 100 + "vw";
        cube.style.width = cube.style.height = (15 + Math.random() * 30) + "px";
        cube.style.animationDuration = (6 + Math.random() * 4) + "s";
        cyberCubesContainer.appendChild(cube);
    }
}
spawnCubes(40);

// Intro typing
const introHTML = introBox.innerHTML;
typeHTML(introBox, introHTML, 30, () => {
    setTimeout(() => {
        introBox.classList.add("fade-out");
        startBtn.classList.remove("hidden");
        startBtn.classList.add("show");
    }, 800);
});

// START GAME
startBtn.addEventListener("click", () => {

    // RESET STATE (CRITICAL FIX)
    budget = 850000;
    time = 100;
    currentIndex = 0;

    introBox.style.display = "none";
    gameTitle.style.display = "none";
    startBtn.style.display = "none";

    cyberCubesContainer.classList.add("hide");

    document.getElementById("bg-overlay").classList.add("clear");

    gameUI.classList.remove("hidden");

    startTimer();
    updateEmail();
});

// Timer
function startTimer() {
    timer = setInterval(() => {
        if (time <= 0) return endGame();
        time--;
        timerDisplay.textContent =
            `${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`;
    }, 1000);
}

// Emails (UNCHANGED)
const emails = [ /* your original email array stays here */ ];
emails.sort(() => Math.random() - 0.5);

// Update email
function updateEmail() {
    if (currentIndex >= emails.length) {
        endGame();
        return;
    }
    const e = emails[currentIndex];
    emailContainer.innerHTML =
        `<h2>${e.subject}</h2><h3>From: ${e.from}</h3>` +
        e.blocks.map(b => `<p>${b}</p>`).join("");
}

// Buttons
infectedBtn.onclick = () => answer("infected");
safeBtn.onclick = () => answer("safe");

function answer(choice) {
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

// End
function endGame() {
    clearInterval(timer);
    gameUI.classList.add("hidden");
    endScreen.classList.remove("hidden");
    finalBudget.textContent = `${budget.toLocaleString()} USD`;
}

// Restart / Back
restartBtn.onclick = () => location.reload();
backBtn.onclick = () => location.href = "index.html";
