/* =========================
   Spot the Phish Game Logic
========================= */

let emails = [
    {
        text: "Your PayPal account has been locked. Click here to restore access immediately.",
        isPhish: true,
        explanation: "Urgent messages asking you to click a link are classic phishing tactics."
    },
    {
        text: "Your package has been shipped. Track it here: https://ups.com/track/90sd33",
        isPhish: false,
        explanation: "Legitimate shipping links are usually safe, especially with proper domains."
    },
    {
        text: "We detected suspicious login attempts. Verify your account or it will be deleted.",
        isPhish: true,
        explanation: "Threatening to delete accounts is a common pressure tactic."
    },
    {
        text: "Your friend shared a Google Doc with you.",
        isPhish: false,
        explanation: "This email is normal unless the domain looks strange."
    },
    {
        text: "You won a free iPhone! Claim your prize now!",
        isPhish: true,
        explanation: "Unsolicited prize offers are almost always scams."
    },
    {
        text: "Your school posted new exam dates on the dashboard.",
        isPhish: false,
        explanation: "Informational school messages are usually trustworthy."
    },
    {
        text: "We noticed unusual activity. Login here to verify: http://security-alert-login.com",
        isPhish: true,
        explanation: "Fake login pages often imitate security services."
    },
    {
        text: "Your Microsoft 365 subscription renews next week.",
        isPhish: false,
        explanation: "Normal subscription notifications don’t ask for urgent action."
    },
    {
        text: "Your tax refund is ready! Submit your bank info now to receive it.",
        isPhish: true,
        explanation: "Authorities never ask for bank info through email."
    },
    {
        text: "Your gaming friend added you to a new group.",
        isPhish: false,
        explanation: "Casual account notifications are typically safe."
    }
];

let round = 0;
let score = 0;

// DOM elements
const roundText = document.getElementById("round");
const scoreText = document.getElementById("score");
const emailContainer = document.getElementById("email-container");
const resultDiv = document.getElementById("result");
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");

// Load the first email
loadRound();

function loadRound() {
    resultDiv.innerText = "";
    nextBtn.style.display = "none";

    let current = emails[round];

    emailContainer.innerHTML = `
        <div class="email-box" onclick="chooseEmail(true)">
            🚨 This is a PHISH attempt
        </div>
        <div class="email-box" onclick="chooseEmail(false)">
            👍 This is SAFE
        </div>

        <p class="email-message" style="color:#fff; margin-top:20px; font-size:1.3em;">
            "${current.text}"
        </p>
    `;

    roundText.innerText = round + 1;
    scoreText.innerText = score;
}

window.chooseEmail = function(playerChoice) {
    let current = emails[round];
    let correct = (playerChoice === current.isPhish);

    if (correct) {
        score++;
        resultDiv.style.color = "#00ff88";
        resultDiv.innerText = "✔ Correct! " + current.explanation;
    } else {
        resultDiv.style.color = "#ff4c4c";
        resultDiv.innerText = "✘ Wrong! " + current.explanation;
    }

    scoreText.innerText = score;

    nextBtn.style.display = "inline-block";
};

nextBtn.onclick = () => {
    round++;

    if (round >= emails.length) {
        endGame();
        return;
    }

    loadRound();
};

function endGame() {
    emailContainer.innerHTML = "";
    resultDiv.style.color = "#ffd700";
    resultDiv.innerHTML = `
        <h2>🏁 Finished!</h2>
        <p>You scored <b>${score} / ${emails.length}</b></p>
        <p>Great job analyzing emails and spotting phishing attempts.</p>
    `;

    nextBtn.innerText = "Restart";
    nextBtn.style.display = "inline-block";

    nextBtn.onclick = () => {
        round = 0;
        score = 0;
        nextBtn.innerText = "Next";
        loadRound();
    };
};

// back button
backBtn.onclick = () => {
    window.location.href = "index.html";
};

