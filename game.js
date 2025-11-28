/* ===== CLICK SOUND FUNCTION ===== */
function playClick() {
  const clickSound = document.getElementById("click-sound");
  clickSound.currentTime = 0; // rewind to start
  clickSound.play();
}

/* ===== QUESTIONS (full 10) ===== */
const questions = [
  {
    text: "Which of these messages is safe?",
    options: [
      { text: "Hey, is this you in this photo? 😳", correct: false },
      { text: "Yo, today we have the team meeting at 3 PM.", correct: true },
      { text: "Your account has been locked! Click here to fix it.", correct: false },
      { text: "Check out this video, you’re in it 😂", correct: false }
    ]
  },
  {
    text: "Spot the safe message:",
    options: [
      { text: "Your bank account has been suspended, confirm your info now!", correct: false },
      { text: "Reminder: don’t forget to submit your homework tonight.", correct: true },
      { text: "Urgent! Your device is infected, click here to clean it!", correct: false },
      { text: "Click to win a free phone!", correct: false }
    ]
  },
  {
    text: "Choose the real message:",
    options: [
      { text: "Bro, we’re at the café, come join!", correct: true },
      { text: "You’ve won a $500 gift card!", correct: false },
      { text: "Your email password expired, update here.", correct: false },
      { text: "This video of you is going viral 😬", correct: false }
    ]
  },
  {
    text: "Which message seems trustworthy?",
    options: [
      { text: "Your parcel delivery failed, click to reschedule.", correct: false },
      { text: "The teacher said we can use notes for the exam.", correct: true },
      { text: "We found suspicious login activity, confirm here.", correct: false },
      { text: "You must verify your Instagram now!", correct: false }
    ]
  },
  {
    text: "Find the safe message:",
    options: [
      { text: "Yo, want to play that new game tonight?", correct: true },
      { text: "Click this link to claim your crypto reward.", correct: false },
      { text: "System alert! Your password is weak!", correct: false },
      { text: "Is this your TikTok video? 😂", correct: false }
    ]
  },
  {
    text: "Which is safe?",
    options: [
      { text: "Mom said dinner at 7, don’t be late!", correct: true },
      { text: "Verify your Apple ID here immediately!", correct: false },
      { text: "Win a free trip by clicking this link!", correct: false },
      { text: "Account alert: login from Russia detected!", correct: false }
    ]
  },
  {
    text: "Choose the safe text:",
    options: [
      { text: "We added you to the project group chat.", correct: true },
      { text: "Click here to view your salary details.", correct: false },
      { text: "Urgent: your files will be deleted soon!", correct: false },
      { text: "Tap here to get your free NFT.", correct: false }
    ]
  },
  {
    text: "Which message is normal?",
    options: [
      { text: "Happy Birthday! 🎉", correct: true },
      { text: "You have been hacked, click here to protect yourself!", correct: false },
      { text: "Your email will be deactivated unless you log in here.", correct: false },
      { text: "Is this your photo? 😱", correct: false }
    ]
  },
  {
    text: "Pick the safe message:",
    options: [
      { text: "Don’t forget the quiz tomorrow!", correct: true },
      { text: "Click here for exclusive prizes!", correct: false },
      { text: "Warning! Account access limited!", correct: false },
      { text: "Free gift for loyal users! 🎁", correct: false }
    ]
  },
  {
    text: "Which message would you trust?",
    options: [
      { text: "Can you send me your phone number again?", correct: true },
      { text: "You are in this video! 😂", correct: false },
      { text: "We have detected a virus, click to remove.", correct: false },
      { text: "Your card has been blocked, verify now!", correct: false }
    ]
  }
];

let currentQuestion = 0;
let score = 0;

/* ===== SHUFFLE FUNCTION ===== */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ===== SHOW QUESTION ===== */
function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question").innerText = q.text;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  shuffle([...q.options]).forEach(opt => {
    const btn = document.createElement("button");
    btn.classList.add("message");
    btn.innerText = opt.text;
    btn.onclick = () => {
      playClick();        // Play click sound on option click
      checkAnswer(opt.correct);
    };
    optionsDiv.appendChild(btn);
  });

  document.getElementById("feedback").innerHTML = "";
}

/* ===== CELEBRATION ===== */
function celebrate() {
  confetti({ particleCount: 200, spread: 80 });
}

/* ===== SKULL RAIN ===== */
function skullRain() {
  confetti({
    particleCount: 80,
    spread: 60,
    emojis: ['💀'],
    emojiSize: 50
  });
}

/* ===== CHECK ANSWER ===== */
function checkAnswer(correct) {
  const feedback = document.getElementById("feedback");

  if (correct) {
    feedback.innerHTML = "✔️ Safe!";
    score++;
  } else {
    feedback.innerHTML = "💀 Hacked!";
  }

  currentQuestion++;

  if (currentQuestion < questions.length) {
    setTimeout(showQuestion, 1200);
  } else {
    document.getElementById("question").innerText = "🎯 Game Over!";
    document.getElementById("options").innerHTML = "";

    feedback.innerHTML = "Your final score: " + score + " / " + questions.length;

    if (score >= 5) celebrate();
    else skullRain();
  }

  document.getElementById("score").innerText = "Score: " + score;
}

/* ===== START GAME ===== */
showQuestion();
