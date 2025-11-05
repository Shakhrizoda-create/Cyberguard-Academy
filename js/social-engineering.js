let score = 0; 
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

  if (correct) {score += 10; // 10 points per correct answer
document.getElementById('score').textContent = "Score: " + score;

    feedback.textContent = "✅ Correct! " + s.explain;
    score++;
  } else {score -= 5;
if(score < 0) score = 0;
document.getElementById('score').textContent = "Score: " + score;
          
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
const scenarios = [
  {
    id: 1,
    text: `You get a message from "IT Support" asking you to confirm your password via a link.`,
    choices: ["Trust it", "Report to IT", "Ignore"],  // new multi-choice
    answer: "Report to IT",
    explain: "Legitimate IT won't ask for passwords via links. Always report suspicious messages."
  },
  {
    id: 2,
    text: `A coworker asks you to wire money urgently to a supplier you never heard of.`,
    choices: ["Wire it immediately", "Call them to confirm", "Ignore"],
    answer: "Call them to confirm",
    explain: "Always verify financial requests through known channels."
  },
  {
    id: 3,
    text: `You receive a USB drive in the parking lot.`,
    choices: ["Plug in", "Hand to IT", "Leave it"],
    answer: "Hand to IT",
    explain: "Unknown USBs can carry malware — never plug them in."
  },
  {
    id: 4,
    text: `You get an email that says 'Click here for a free gift!'`,
    choices: ["Click immediately", "Check sender carefully", "Forward to friend"],
    answer: "Check sender carefully",
    explain: "Free gift emails are often phishing. Inspect carefully before taking action."
  },
  {
    id: 5,
    text: `Your boss asks for your credentials over chat urgently.`,
    choices: ["Give them", "Verify via call", "Ignore"],
    answer: "Verify via call",
    explain: "Even if it looks like your boss, always verify unusual requests."
  },
  {
    id: 6,
    text: `A website asks you to download a 'security update' as a PDF.`,
    choices: ["Download it", "Check official site", "Ignore"],
    answer: "Check official site",
    explain: "Never download updates from unknown sources; go to the official site."
  }
];
let timer;
function startTimer() {
  let time = 15; // 15 seconds per question
  const timerEl = document.getElementById('timer');
  timerEl.textContent = time;
  timer = setInterval(() => {
    time--;
    timerEl.textContent = time;
    if(time <= 0){
      clearInterval(timer);
      feedback.textContent = "⏰ Time's up! The correct answer was: " + scenarios[currentIndex].answer;
      nextBtn.classList.remove('hidden');
      choices.forEach(b => b.disabled = true);
    }
  }, 1000);
}

function showScenario() {
  // existing code...
  startTimer(); // start timer for each scenario
}
