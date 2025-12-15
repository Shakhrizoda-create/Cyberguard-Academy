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
backBtn.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    setTimeout(() => {
        window.location.href = "index.html";
    }, 150);
});

// ================= BACKGROUND MUSIC =================
const bgMusic = new Audio("assets-3/singularity-abstract-electronica-281092.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.25;

const clickSound = new Audio("assets-3/computer-mouse-click-352734.mp3");
clickSound.volume = 0.5;

// ================= BUTTONS =================
const restartBtn = document.getElementById("restart-btn");
const backBtn = document.getElementById("back-btn");

backBtn.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    setTimeout(() => {
        window.location.href = "index.html";
    }, 150);
});

// Game variables
let budget = 850000;
let time = 100;
let currentIndex = 0;
let timer;

// ================= ENTRANCE SECTION FIX =================
// Cyber cubes only for start
const cyberCubesContainer = document.getElementById("cyber-cubes");
function spawnCubes(amount){
    for(let i=0;i<amount;i++){
        const cube = document.createElement("div");
        cube.classList.add("cube");
        cube.style.left = Math.random()*100 + "vw";
        cube.style.width = cube.style.height = (15+Math.random()*30)+"px";
        cube.style.opacity = 0.2+Math.random()*0.6;
        cube.style.animationDuration = (6+Math.random()*4) + "s";
        cube.style.animationName = "cubeMove"; // original falling animation
        cyberCubesContainer.appendChild(cube);
    }
}
spawnCubes(40);

// Typing animation
function typeHTML(element, html, speed=30, callback){
    let i = 0;
    function typeNext(){
        if(i>=html.length){
            if(callback) callback();
            return;
        }
        if(html[i]==="<"){
            let tagEnd = html.indexOf(">", i);
            element.innerHTML += html.substring(i, tagEnd+1);
            i = tagEnd+1;
            typeNext();
        } else {
            element.innerHTML += html[i];
            i++;
            setTimeout(typeNext, speed);
        }
    }
    element.innerHTML = "";
    typeNext();
}

// Start screen typing
const introHTML = introBox.innerHTML;
introBox.innerHTML = "";
typeHTML(introBox, introHTML, 30, () => {
    // Fade out intro text
    introBox.classList.add("fade-out");

    // Wait for fade-out to finish (1s as per CSS)
    setTimeout(() => {
        // Show start button in the same place
        startBtn.classList.remove("hidden");
        startBtn.classList.add("show");
    }, 1000);
});

startBtn.addEventListener("click", () => {
    // Click sound
    clickSound.currentTime = 0;
    clickSound.play();

    // Start background music
    bgMusic.play().catch(() => {});

    cyberCubesContainer.style.opacity = "0";

    setTimeout(() => {
        startScreen.style.display = "none";
        gameUI.classList.remove("hidden");
        startTimer();
        updateEmail();
    }, 800);
});
// ==========================================================

// Timer
function startTimer(){
    timer = setInterval(() => {
        if(time<=0) return endGame();
        time--;
        let min=Math.floor(time/60), sec=time%60;
        timerDisplay.textContent = `${min}:${sec<10?"0"+sec:sec}`;
    },1000);
}

// Emails (hacker-style, longer, shuffled)
const emails = [
    {subject:"Urgent: Verify Your Bank Account", time:"02:50 PM", from:"security@yourbank.com",
     blocks:["We detected unusual activity in your account.",
             "Please verify your identity immediately to avoid suspension.",
             "Click the link below to confirm your details.",
             "Failure to comply may result in account lockout.",
             "Do NOT ignore this message."],
     correct:"infected", penalty:750000, difficulty:"hard"},

    {subject:"Team Lunch Invitation", time:"09:10 AM", from:"HR Team",
     blocks:["You are invited to the team lunch next Friday at 12PM.",
             "RSVP is required via our portal.",
             "Menu options and dietary requirements attached.",
             "Looking forward to seeing everyone.",
             "Enjoy your meal!"],
     correct:"safe", penalty:150000, difficulty:"easy"},

    {subject:"Suspicious Login Attempt", time:"08:10 AM", from:"IT Security",
     blocks:["Unusual login detected from a new device.",
             "Verify your credentials immediately to avoid account compromise.",
             "Click the verification link provided.",
             "Report any suspicious activity immediately.",
             "Do not ignore."],
     correct:"infected", penalty:300000, difficulty:"medium"},

    {subject:"Workshop Reminder", time:"12:00 AM", from:"Cybersecurity Dept",
     blocks:["Cybersecurity workshop is scheduled for Monday 10AM.",
             "Ensure you RSVP online.",
             "Materials and agenda attached.",
             "Participation is highly recommended.",
             "Certificate will be provided for attendees."],
     correct:"safe", penalty:150000, difficulty:"easy"},

    {subject:"Invoice Overdue Notice", time:"01:20 PM", from:"Accounting",
     blocks:["Invoice #98765 is overdue.",
             "Immediate payment required to avoid late fees.",
             "Attached PDF contains payment details.",
             "Please contact finance for questions.",
             "Do not ignore this notice."],
     correct:"infected", penalty:300000, difficulty:"medium"},

    {subject:"Phishing Test", time:"11:45 AM", from:"Security Dept",
     blocks:["This is a simulated phishing test.",
             "Do not click any links.",
             "Report suspicious emails as instructed.",
             "Your awareness helps the organization.",
             "No penalty for this test."],
     correct:"safe", penalty:150000, difficulty:"easy"},

    {subject:"Password Expiration Alert", time:"07:30 PM", from:"IT Dept",
     blocks:["Your password will expire in 24 hours.",
             "Reset your password immediately using the link below.",
             "Failure to reset may lock your account.",
             "Do not share credentials with anyone.",
             "Contact IT if you face issues."],
     correct:"infected", penalty:750000, difficulty:"hard"},

    {subject:"Project Deadline", time:"05:59 PM", from:"Manager",
     blocks:["Project submission is due Friday 5PM.",
             "Check attached timeline and ensure all tasks are completed.",
             "Contact manager if clarification is needed.",
             "Do not skip steps in workflow.",
             "Submit on time."],
     correct:"safe", penalty:150000, difficulty:"easy"},

    {subject:"Bank Account Alert", time:"08:30 AM", from:"Bank",
     blocks:["Suspicious activity detected in your bank account.",
             "Verify your account immediately to prevent lockout.",
             "Attached form must be completed.",
             "Failure may cause account suspension.",
             "Do not ignore this alert."],
     correct:"infected", penalty:300000, difficulty:"medium"},

    {subject:"Congratulations! You won a prize!", time:"06:40 AM", from:"unknown@promo.com",
     blocks:["You have won a grand prize!",
             "Click the link to claim it immediately.",
             "Provide personal details to proceed.",
             "Offer expires soon.",
             "Be cautious but hurry!"],
     correct:"infected", penalty:750000, difficulty:"hard"}
];

// Shuffle emails
emails.sort(()=>Math.random()-0.5);

// Update email
function updateEmail(){
    if(currentIndex>=emails.length) return endGame();
    const e=emails[currentIndex];
    emailContainer.innerHTML = `<h2>${e.subject}</h2><h3>From: ${e.from} | ${e.time}</h3>` +
        e.blocks.map(b=>`<p>${b}</p>`).join("");
}

// Buttons
infectedBtn.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();
    checkAnswer("infected");
});

safeBtn.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();
    checkAnswer("safe");
});

function checkAnswer(choice){
    const e=emails[currentIndex];
    if(choice!==e.correct){
        budget -= e.penalty;
        penaltyDisplay.textContent = `-${e.penalty.toLocaleString()} USD`;
        setTimeout(()=>penaltyDisplay.textContent="",1000);
    }
    budgetDisplay.textContent = `${budget.toLocaleString()} USD`;
    currentIndex++;
    updateEmail();
}

// =================== END GAME & CYBER EFFECT FIX ===================
function endGame() {
    clearInterval(timer);

    // Hide game UI & start screen
    gameUI.classList.add("hidden");
    startScreen.style.display = "none";

    // Show end screen
    endScreen.classList.remove("hidden");

    // Add Cyber Cyan label dynamically if not already present
    if (!document.querySelector("#end-screen .remaining-budget-text")) {
        const label = document.createElement("div");
        label.classList.add("remaining-budget-text");
        label.textContent = "YOUR REMAINING BUDGET";
        endScreen.querySelector("#end-details").insertBefore(label, finalBudget);
    }

    // Update final budget
    finalBudget.textContent = `${budget.toLocaleString()} USD`;

    // Create subtle Cyber effect behind the end screen text
    createCyberEffect();
    
    // Create Matrix-style Cyber Cyan code rain
    createMatrixRain();
}

function createCyberEffect() {
    // Remove existing canvas if present (to prevent duplicates)
    const existing = document.getElementById("cyber-effect");
    if (existing) existing.remove();

    const canvas = document.createElement("canvas");
    canvas.id = "cyber-effect";
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "50"; // behind end screen text (z-index 3000)
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const lines = [];
    for (let i = 0; i < 30; i++) {
        lines.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: 50 + Math.random() * 150,
            speed: 0.5 + Math.random(),
            opacity: 0.1 + Math.random() * 0.3
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines.forEach(l => {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 229, 255, ${l.opacity})`;
            ctx.moveTo(l.x, l.y);
            ctx.lineTo(l.x, l.y + l.length);
            ctx.stroke();
            l.y += l.speed;
            if (l.y > canvas.height) l.y = -l.length;
        });
        requestAnimationFrame(animate);
    }

    animate();

    // Make canvas responsive on window resize
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ================= MATRIX CYBER CODE RAIN ===================
function createMatrixRain() {
    // Remove existing canvas if present
    const existing = document.getElementById("matrix-canvas");
    if (existing) existing.remove();

    const canvas = document.createElement("canvas");
    canvas.id = "matrix-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "45"; // behind end screen text (z-index 3000)
    canvas.style.pointerEvents = "none"; // so buttons still work
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%<>*!^&".split("");
    const fontSize = 18;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    function draw() {
        // Semi-transparent black background for fade effect
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00e5ff"; // Cyber Cyan color
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Move drop
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        requestAnimationFrame(draw);
    }

    draw();

    // Make responsive on window resize
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

