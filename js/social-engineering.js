// js/social-engineering.js
// Social Engineering mini-game logic

const scenarios = [
  {
    id: 1,
    text: `You get a message from "IT Support" asking you to confirm your password because "there was a problem with your account" and they include a link to a login page.`,
    answer: "suspicious",
    explain: "Legitimate IT won't ask you to send your password or log in via an unexpected link. Verify via known IT contact channels."
  },
  {
    id: 2,
    text: `A coworker you know sends a quick chat: "Can you approve invoice #452?" The message is short and seems like them.`,
    answer: "safe",
    explain: "This could be safe — but if anything about the request is unusual (amount, link, urgency), verify directly with them via a call."
  },
  {
    id: 3,
    text: `You find a USB drive in the office parking lot. A note says "Free photos."`,
    answer: "suspicious",
    explain: "Plugging unknown USBs can infect your device. Turn it in to IT instead of plugging it in."
  },
  {
    id: 4,
    text: `A person at the building entrance claims they forgot their badge and asks you to let them in quickly; they look rushed and say "I'm late for a meeting."`,
    answer: "suspicious",
    explain: "Tailgating is common. Politely ask to see ID or direct them to reception. Don't let strangers follow you in."
  },
  {
    id: 5,
    text: `You receive an email from your bank showing your last transactions and saying no action is required — it contains no links and matches your account.`,
    answer: "safe",
    explain: "If the email contains no links and appears accurate, it's likely informational. When in doubt, log into the bank via the official site (not email links) to check."
  }
];

let currentIndex = 0;
let score = 0;

const startBtn = document.getElementById('startBtn');
const gameSection = document.getElementById('game');
const introSection = document.getElementById('intro');
const scenarioEl = document.getElementById('scenario');
const choices = Array.from(document.querySelectorAll('.choice'));
const feedback = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const currentEl = document.getElementById('current');
const totalEl = document.getElementById('total');

function init() {
  currentIndex = 0;
  score = 0;
  totalEl.textContent = scenarios.length;
  currentEl.textContent = 0;
  feedback.textContent = '';
  scoreEl.textContent = '';
  nextBtn.classList.add('hidden');
  restartBtn.classList.add('hidden');
  choices.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct','incorrect');
  });
}

function startGame() {
  introSection.classList.add('hidden');
  gameSection.classList.remove('hidden');
  init();
  showScenario();
}

function showScenario() {
  const s = scenarios[currentIndex];
  scenarioEl.textContent = s.text;
  currentEl.textContent = currentIndex + 1;
  feedback.textContent = '';
  feedback.setAttribute('aria-hidden', 'true');
  choices.forEach(b => {
    b.disabled = false;
    b.classList.remove('correct','incorrect');
  });
  nextBtn.classList.add('hidden');
}

function handleChoice(choice) {
  const s = scenarios[currentIndex];
  const correct = choice === s.answer;
  choices.forEach(b => b.disabled = true);

  if (correct) {
    feedback.textContent = "✅ Correct! " + s.explain;
    score++;
  } else {
    feedback.textContent = "❌ Not quite. " + s.explain;
  }
  feedback.setAttribute('aria-hidden', 'false');
  scoreEl.textContent = `Score: ${score} / ${scenarios.length}`;
  nextBtn.classList.remove('hidden');

  if (currentIndex === scenarios.length - 1) {
    nextBtn.textContent = "See Results";
  } else {
    nextBtn.textContent = "Next";
  }
}

function next() {
  currentIndex++;
  if (currentIndex < scenarios.length) {
    showScenario();
  } else {
    endGame();
  }
}

function endGame() {
  scenarioEl.textContent = `Game complete! You scored ${score} out of ${scenarios.length}.`;
  feedback.textContent = "Great job learning to spot tricks. Review the tips below to stay safer.";
  scoreEl.textContent = '';
  nextBtn.classList.add('hidden');
  restartBtn.classList.remove('hidden');
}

if (startBtn) startBtn.addEventListener('click', startGame);
choices.forEach(btn => {
  btn.addEventListener('click', () => {
    const choice = btn.getAttribute('data-choice');
    handleChoice(choice);
  });
});
if (nextBtn) nextBtn.addEventListener('click', next);
if (restartBtn) restartBtn.addEventListener('click', () => {
  introSection.classList.remove('hidden');
  gameSection.classList.add('hidden');
});
