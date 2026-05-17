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

  document.getElementById(screenId).classList.remove("hidden");
}

/* =========================
   START MISSION
========================= */

document.addEventListener("DOMContentLoaded", () => {

  typeWriter();

  const startBtn = document.getElementById("start-btn");

  startBtn.addEventListener("click", () => {
    showScreen("character-selection");
  });

});

/* =========================
   CHARACTER SELECTION
========================= */

function selectCharacter(name) {
  selectedCharacter = name;

  console.log("Selected agent:", selectedCharacter);

  // transition to game
  showScreen("game-screen");

  startGame();
}

/* =========================
   GAME START
========================= */

function startGame() {
  console.log("OSINT Mission Started");

  // later we will:
  // - spawn player
  // - enable movement
  // - activate computers
}

/* =========================
   POPUP SYSTEM
========================= */

function openMessage(textLines) {
  const popup = document.getElementById("message-popup");

  popup.classList.remove("hidden");

  const content = popup.querySelector(".popup");
  content.innerHTML = `
    <h2>ENCRYPTED OSINT DATA</h2>
    ${textLines.map(line => `<p>${line}</p>`).join("")}
    <button id="close-popup">CLOSE TERMINAL</button>
  `;

  document.getElementById("close-popup").onclick = () => {
    popup.classList.add("hidden");
  };
}

/* =========================
   CLOSE POPUP (fallback)
========================= */

document.addEventListener("click", (e) => {
  if (e.target.id === "close-popup") {
    document.getElementById("message-popup").classList.add("hidden");
  }
});
