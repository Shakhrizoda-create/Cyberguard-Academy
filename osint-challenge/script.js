
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
   BRIEFING SYSTEM
========================= */

const briefingSlides = [

  {
    image: "./assets/background/briefing/slide1.png",
    text: "Explore the forest and investigate suspicious locations."
  },

  {
    image: "./assets/background/briefing/slide2.png",
    text: "Find 3 hidden devices hidden across the environment."
  },

  {
    image: "./assets/background/briefing/slide3.png",
    text: "Use terminals to decode recovered intelligence."
  },

  {
    image: "./assets/background/briefing/slide4.png",
    text: "Solve mysterious puzzles and uncover hidden connections."
  },

  {
    image: "./assets/background/briefing/slide5.png",
    text: "Recover passwords to unlock the next stage."
  }

];

let currentSlide = 0;

function showBriefingSlide() {

  const img = document.getElementById("briefing-image");
  const text = document.getElementById("briefing-text");

  img.src = briefingSlides[currentSlide].image;
  text.textContent = briefingSlides[currentSlide].text;
}

function nextBriefingSlide() {

  currentSlide++;

  if (currentSlide >= briefingSlides.length) {

    showScreen("game-screen");
    startGame();
    return;
  }

  showBriefingSlide();
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

 /* BRIEFING CLICK */
  const nextSlideBtn = document.getElementById("next-slide");

  nextSlideBtn?.addEventListener("click", nextBriefingSlide);

  /* GLOBAL KEYBOARD CONTROLS */
  document.addEventListener("keydown", (e) => {

    const briefing = document.getElementById("briefing-screen");

    if (briefing && !briefing.classList.contains("hidden")) {

      if (
        e.key === " " ||
        e.code === "Space" ||
        e.key === "n" ||
        e.key === "N" ||
        e.key === "ArrowRight"
      ) {
        nextBriefingSlide();
      }
    }
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
