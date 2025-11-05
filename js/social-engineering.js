// ====== Global Variables ======
let score = 0;
let currentIndex = 0;
let timer;

// ====== DOM Elements ======
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const introSection = document.getElementById('intro');
const gameSection = document.getElementById('game');
const scenarioEl = document.getElementById('scenario');
const choices = Array.from(document.querySelectorAll('.choice'));
const feedback = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('nextBtn');
const currentEl = document.getElementById('current');
const totalEl = document.getElementById('total');

// ====== Scenarios Array ======
const scenarios = [
  {
    text: `You get a message from "IT Support" asking you to confirm your password via a link.`,
    choices: ["Trust it", "Report to IT", "Ignore"],
    answer: "Report to IT",
    explain: "Legitimate IT won't ask for passwords via links. Always report suspicious messages."
  },
  {
    text: `A coworker asks you to wire money urgently to a supplier you never heard of.`,
    choices: ["Wire it immediately", "Call them to confirm", "Ignore"],
    answer: "Call them to confirm",
    explain: "Always verify financial requests through known channels."
  },
  {
    text: `You receive a USB drive in the parking lot.`,
    choices: ["Plug in", "Hand to IT", "Leave it"],
    answer: "Hand to IT",
    explain: "Unknown USBs can carry malware — never plug them in."
  },
  {
    text: `You get an email that says 'Click here for a free gift!'`,
    choices: ["Click immediately", "Check sender carefully", "Forward to friend"],
    answer: "Check sender carefully",
    explain: "Free gift emails are often phishing. Inspect carefully before taking action."
  }
];

// ====== Initialize Game ======
function init() {
  currentIndex = 0;
  score = 0;
  scoreEl.textContent = `Score: ${score}`;
  totalEl.textContent = scenarios.length;
  currentEl.textContent = 0;
  feedback.textContent = '';
  nextBtn.classList.add('hidden');
  restartBtn.classList.add('hidden');
  choices.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct','incorrect');
  });
}

// ====== Start Game ======
function startGame() {
  introSection.classList.add('hidden');
  gameSection.classList.remove('hidden');
  init();
  showScenario();
}

// ====== Timer ======
function startTimer() {
  let time = 15;
  const timerEl = document.getElementById('timer');
  timerEl.textContent = time;
  clearInterval(timer);
  timer = setInterval(() => {
    time--;
    timerEl.textContent = time;
    if(time <= 0){
      clearInterval(timer);
      feedback.textContent = `⏰ Time's up! Correct answer: ${scenarios[currentIndex].answer}`;
      nextBtn.classList.remove('hidden');
      choices.forEach(b => b.disabled = true);
    }
  }, 1000);
}

// ====== Show Scenario ======
function showScenario() {
  const s = scenarios[currentIndex];
  scenarioEl.textContent = s.text;
  currentEl.textContent = currentIndex + 1;
  feedback.textContent = '';
  choices.forEach((btn, i) => {
    btn.textContent = s.choices[i];
    btn.disabled = false;
    btn.classList.remove('correct','incorrect');
  });
  nextBtn.classList.add('hidden');
  startTimer();
}

// ====== Handle Choice ======
function handleChoice(selectedText) {
  clearInterval(timer);
  const s = scenarios[currentIndex];
  choices.forEach(b => b.disabled = true);

  if(selectedText === s.answer){
    score += 10;
    feedback.textContent = `✅ Correct! ${s.explain}`;
  } else {
    feedback.textContent = `❌ Not quite. ${s.explain}`;
  }

  scoreEl.textContent = `Score: ${score}`;
  nextBtn.classList.remove('hidden');

  if(currentIndex === scenarios.length - 1){
    nextBtn.textContent = "See Results";
  } else {
    nextBtn.textContent = "Next";
  }
}

// ====== Next Scenario ======
function nextScenario() {
  currentIndex++;
  if(currentIndex < scenarios.length){
    showScenario();
  } else {
    endGame();
  }
}

// ====== End Game ======
function endGame() {
  scenarioEl.textContent = `Game complete! You scored ${score} out of ${scenarios.length * 10}.`;
  feedback.textContent = "Great job learning to spot tricks!";
  nextBtn.classList.add('hidden');
  restartBtn.classList.remove('hidden');
}

// ====== Event Listeners ======
if(startBtn) startBtn.addEventListener('click', startGame);
if(restartBtn) restartBtn.addEventListener('click', () => {
  introSection.classList.remove('hidden');
  gameSection.classList.add('hidden');
});

choices.forEach(btn => {
  btn.addEventListener('click', () => handleChoice(btn.textContent));
});
if(nextBtn) nextBtn.addEventListener('click', nextScenario);

