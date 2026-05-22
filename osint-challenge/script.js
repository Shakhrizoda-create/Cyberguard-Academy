
let selectedCharacter = null;

/* =========================
   TYPEWRITER INTRO
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
   SCREEN CONTROL SYSTEM
========================= */

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.add("hidden");
  });

  const target = document.getElementById(screenId);
  if (target) target.classList.remove("hidden");
}

/* =========================
   GAME START
========================= */

function startGame() {
  console.log("OSINT Mission Started");
}

/* =========================
   CHARACTER SELECT
========================= */

function selectCharacter(name) {
  selectedCharacter = name;

  console.log("Selected agent:", selectedCharacter);

  showScreen("game-screen");

  startGame();
}

/* =========================
   CAROUSEL SYSTEM
========================= */

let currentIndex = 0;

let cards = [];
let track = null;
let leftArrow = null;
let rightArrow = null;

/* INIT */
function initCarousel() {

  cards = document.querySelectorAll(".character-card");
  track = document.querySelector(".character-track");

  leftArrow = document.querySelector(".arrow.left");
  rightArrow = document.querySelector(".arrow.right");

  if (leftArrow) leftArrow.onclick = previousCharacter;
  if (rightArrow) rightArrow.onclick = nextCharacter;

  updateCarousel();
}

/* UPDATE VIEW */
function updateCarousel() {

  if (!cards || cards.length === 0) return;

  cards.forEach(card => card.classList.remove("active"));

  if (cards[currentIndex]) {
    cards[currentIndex].classList.add("active");
  }

  const offset = currentIndex * 360;

  if (track) {
    track.style.transform =
      `translateX(calc(50vw - ${offset}px - 180px))`;
  }
}

/* NEXT */
function nextCharacter() {
  currentIndex++;
  if (currentIndex >= cards.length) currentIndex = 0;
  updateCarousel();
}

/* PREVIOUS */
function previousCharacter() {
  currentIndex--;
  if (currentIndex < 0) currentIndex = cards.length - 1;
  updateCarousel();
}

/* KEYBOARD CONTROLS */
document.addEventListener("keydown", (e) => {

  const screen = document.getElementById("character-selection");

  if (!screen || screen.classList.contains("hidden")) return;

  if (e.key === "ArrowRight") nextCharacter();
  if (e.key === "ArrowLeft") previousCharacter();
});

/* =========================
   POPUP SYSTEM
========================= */

function openMessage(textLines) {

  const popup = document.getElementById("message-popup");
  if (!popup) return;

  popup.classList.remove("hidden");

  const content = popup.querySelector(".popup");

  content.innerHTML = `
    <h2>ENCRYPTED OSINT DATA</h2>
    ${textLines.map(line => `<p>${line}</p>`).join("")}
    <button id="close-popup">CLOSE TERMINAL</button>
  `;

  const btn = document.getElementById("close-popup");
  if (btn) {
    btn.onclick = () => popup.classList.add("hidden");
  }
}

/* fallback close */
document.addEventListener("click", (e) => {
  if (e.target.id === "close-popup") {
    document.getElementById("message-popup")?.classList.add("hidden");
  }
});

/* =========================
   START SYSTEM
========================= */

document.addEventListener("DOMContentLoaded", () => {

  typeWriter();

  const startBtn = document.getElementById("start-btn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {

      showScreen("character-selection");

      setTimeout(() => {
        initCarousel(); // IMPORTANT FIX
      }, 50);

    });
  }

});
