
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
   CHARACTER SYSTEM
========================= */

let cards = [];
let currentIndex = 0;

/* INIT CHARACTERS */
function initCharacters() {
  cards = document.querySelectorAll(".character-card");
  currentIndex = 0;
  updateCharacter();
}

/* UPDATE VISUAL STATE */
function updateCharacter() {

  if (!cards.length) return;

  cards.forEach((c, index) => {
    c.classList.remove("active", "prev", "next");

    if (index === currentIndex) {
      c.classList.add("active");
    }

    if (index === currentIndex - 1) {
      c.classList.add("prev");
    }

    if (index === currentIndex + 1) {
      c.classList.add("next");
    }

    // loop edges
    if (currentIndex === 0 && index === cards.length - 1) {
      c.classList.add("prev");
    }

    if (currentIndex === cards.length - 1 && index === 0) {
      c.classList.add("next");
    }
  });
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
   CONTROLS (ARROWS + KEYBOARD)
========================= */

function bindControls() {

  const leftArrow = document.querySelector(".arrow.left");
  const rightArrow = document.querySelector(".arrow.right");

  if (leftArrow) {
    leftArrow.onclick = () => previousCharacter();
  }

  if (rightArrow) {
    rightArrow.onclick = () => nextCharacter();
  }

  document.addEventListener("keydown", (e) => {

    const screen = document.getElementById("character-selection");

    if (!screen || screen.classList.contains("hidden")) return;

    if (e.key === "ArrowRight") nextCharacter();
    if (e.key === "ArrowLeft") previousCharacter();
  });
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
      bindControls();
    }, 50);

  });
});

/* =========================
   POPUP SYSTEM
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
