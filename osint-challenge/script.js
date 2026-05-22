
let selectedCharacter = null;

/* =========================
   TYPEWRITER
========================= */

const text = "Tracking encrypted signals across OSINT network...";
let i = 0;

function typeWriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  if (i < text.length) {
    el.innerHTML += text.charAt(i);
    i++;
    setTimeout(typeWriter, 40);
  }
}

/* =========================
   SCREEN SYSTEM
========================= */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id)?.classList.remove("hidden");
}

/* =========================
   CHARACTER SYSTEM (NEW FIXED VERSION)
========================= */

let cards = [];
let currentIndex = 0;

/* INIT */
function initCharacters() {
  cards = document.querySelectorAll(".character-card");

  updateCharacter();
}

/* UPDATE ACTIVE CHARACTER */
function updateCharacter() {

  cards.forEach(c => c.classList.remove("active"));

  if (cards[currentIndex]) {
    cards[currentIndex].classList.add("active");
  }
}

/* NEXT */
function nextCharacter() {
  if (!cards.length) return;

  currentIndex++;
  if (currentIndex >= cards.length) currentIndex = 0;

  updateCharacter();
}

/* PREVIOUS */
function previousCharacter() {
  if (!cards.length) return;

  currentIndex--;
  if (currentIndex < 0) currentIndex = cards.length - 1;

  updateCharacter();
}

/* =========================
   SELECT CHARACTER
========================= */

function selectCharacter(name) {
  selectedCharacter = name;

  console.log("Selected:", selectedCharacter);

  showScreen("game-screen");
  startGame();
}

/* =========================
   GAME START
========================= */

function startGame() {
  console.log("Mission started with:", selectedCharacter);
}

/* =========================
   START BUTTON
========================= */

document.addEventListener("DOMContentLoaded", () => {

  typeWriter();

  const startBtn = document.getElementById("start-btn");

  startBtn?.addEventListener("click", () => {

    showScreen("character-selection");

    setTimeout(() => {
      initCharacters();
    }, 50);

  });
});

/* =========================
   KEYBOARD CONTROL
========================= */

document.addEventListener("keydown", (e) => {

  const screen = document.getElementById("character-selection");

  if (!screen || screen.classList.contains("hidden")) return;

  if (e.key === "ArrowRight") nextCharacter();
  if (e.key === "ArrowLeft") previousCharacter();
});

/* =========================
   POPUP SYSTEM (UNCHANGED)
========================= */

function openMessage(lines) {

  const popup = document.getElementById("message-popup");
  if (!popup) return;

  popup.classList.remove("hidden");

  const content = popup.querySelector(".popup");

  content.innerHTML = `
    <h2>ENCRYPTED OSINT DATA</h2>
    ${lines.map(l => `<p>${l}</p>`).join("")}
    <button id="close-popup">CLOSE TERMINAL</button>
  `;

  document.getElementById("close-popup").onclick = () => {
    popup.classList.add("hidden");
  };
}

/* fallback close */
document.addEventListener("click", (e) => {
  if (e.target.id === "close-popup") {
    document.getElementById("message-popup")?.classList.add("hidden");
  }
});

