/* ================= ELEMENTS ================= */
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
const endMessage = document.getElementById("end-message");
const endDetails = document.getElementById("end-details");
const finalBudget = document.getElementById("final-budget");
const restartBtn = document.getElementById("restart-btn");
const backBtn = document.getElementById("back-btn");

/* ================= VARIABLES ================= */
let budget = 850000;
let time = 100;
let currentIndex = 0;
let timer;

/* ================= START SCREEN EFFECTS ================= */
const introBox = document.getElementById("intro-box");
const cyberCubesContainer = document.getElementById("cyber-cubes");
const hexGrid = document.getElementById("hex-grid");
const particlesCanvas = document.getElementById("particles");

startBtn.addEventListener("click", startGame);

/* --- Fade intro and show START button after 10s --- */
setTimeout(() => {
    introBox.classList.add("fade-out");
    startBtn.classList.remove("hidden");
    startBtn.classList.add("show");
}, 10000);

/* --- Cyber cubes --- */
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

/* --- Hex grid --- */
const hexCtx = hexGrid.getContext("2d");
function resizeHex() {
    hexGrid.width = window.innerWidth;
    hexGrid.height = window.innerHeight;
}
window.addEventListener("resize", resizeHex);
resizeHex();

function drawHexGrid() {
    hexCtx.clearRect(0,0,hexGrid.width,hexGrid.height);
    const hexSize = 40;
    for(let y=0; y<hexGrid.height+hexSize; y+=hexSize*1.5){
        for(let x=0; x<hexGrid.width+hexSize; x+=hexSize*Math.sqrt(3)){
            hexCtx.strokeStyle = "rgba(255,235,59,0.05)";
            hexCtx.lineWidth = 1;
            hexCtx.beginPath();
            for(let i=0;i<6;i++){
                const angle = Math.PI/3*i;
                const dx = x + hexSize*Math.cos(angle);
                const dy = y + hexSize*Math.sin(angle);
                if(i===0) hexCtx.moveTo(dx,dy);
                else hexCtx.lineTo(dx,dy);
            }
            hexCtx.closePath();
            hexCtx.stroke();
        }
    }
    requestAnimationFrame(drawHexGrid);
}
drawHexGrid();

/* --- Particles --- */
const pCtx = particlesCanvas.getContext("2d");
particlesCanvas.width = window.innerWidth;
particlesCanvas.height = window.innerHeight;

let particles = [];
for(let i=0;i<100;i++){
    particles.push({
        x: Math.random()*particlesCanvas.width,
        y: Math.random()*particlesCanvas.height,
        size: Math.random()*3+1,
        speed: Math.random()*1+0.2
    });
}
function animateParticles(){
    pCtx.clearRect(0,0,particlesCanvas.width,particlesCanvas.height);
    particles.forEach(p=>{
        p.y+=p.speed;
        if(p.y>particlesCanvas.height)p.y=0;
        pCtx.fillStyle="rgba(255,235,59,0.3)";
        pCtx.beginPath();
        pCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
        pCtx.fill();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* ================= GAME LOGIC ================= */
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

/* ================= END SCREEN ================= */
function endGame() {
    clearInterval(timer);
    gameUI.classList.add("hidden");
    endScreen.style.display = "flex";
    finalBudget.textContent = `${budget.toLocaleString()} USD`;
    endMessage.style.transform = "translateY(0)";
    endDetails.style.opacity = 0;
    endDetails.style.display = "flex";
    setTimeout(() => {
        endMessage.style.transform = "translateY(-20%)";
        endDetails.style.opacity = 1;
    }, 3000);
}

restartBtn.addEventListener("click", () => location.reload());
backBtn.addEventListener("click", () => window.location.href="index.html");

