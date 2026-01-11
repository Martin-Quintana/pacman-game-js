import {
  map,
  drawMap,
  TILE_SIZE,
  COLS,
  ROWS,
  pacmanStart,
  ghostStartPositions,
  resetMap,
} from "./map.js";
import Pacman from "./pacman.js";
import Ghost from "./ghost.js";
import { getDirection, setDirection } from "./input.js";
import { sounds } from "./sounds.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = COLS * TILE_SIZE;
canvas.height = ROWS * TILE_SIZE;

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const startOverlay = document.getElementById("start-overlay");
const startBtn = document.getElementById("start-btn");
const muteBtn = document.getElementById("mute-btn");

// UI Events
startBtn.addEventListener("click", startGame);
muteBtn.addEventListener("click", () => {
  const isMuted = sounds.toggleMute();
  muteBtn.textContent = isMuted ? "🔇 SOUND OFF" : "🔊 SOUND ON";
  muteBtn.style.color = isMuted ? "#f00" : "#888";
});

// Instancias
const pacman = new Pacman(pacmanStart.col, pacmanStart.row);

// 4 fantasmas como el original: rojo, rosa, cian, naranja
const ghostColors = ["red", "pink", "cyan", "orange"];
const ghosts = ghostStartPositions.map(
  (pos, index) => new Ghost(pos.col, pos.row, ghostColors[index] || "red")
);

let score = 0;
let lives = 3;
let gameOver = false;
let gameRunning = false; // Estado de espera inicial

// Tiempo que dura el modo asustado (en frames aprox. 60 fps)
const FRIGHTENED_FRAMES = 60 * 7; // ~7 segundos
let frightenedTimer = 0;

let globalMode = "SCATTER"; // "SCATTER" | "CHASE"
let modeTimer = 0;

function resetPositions() {
  pacman.reset(pacmanStart.col, pacmanStart.row);
  ghosts.forEach((g, index) => {
    const pos = ghostStartPositions[index];
    g.reset(pos.col, pos.row);
  });

  // Reset direction input too
  setDirection({ x: 0, y: 0 });
}

function startGame() {
  if (gameRunning) return;

  // Audio Context requirement
  sounds.init();
  sounds.resume();
  sounds.startSiren();

  startOverlay.style.display = 'none';
  gameRunning = true;
  gameOver = false;
  score = 0;
  lives = 3;
  resetMap(); // Reset dots and power pellets!
  resetPositions();
  updateUI();

  // Restart loop if needed, though we keep it running to draw
}

function updateUI() {
  scoreEl.textContent = `${score}`;
  livesEl.textContent = `${lives}`;
}

function update() {
  if (!gameRunning || gameOver) return;

  // Actualizar modo global (Scatter / Chase)
  if (frightenedTimer > 0) {
    frightenedTimer--;
    if (frightenedTimer === 0) {
      ghosts.forEach((g) => g.setFrightened(false));
      sounds.startSiren(); // Back to normal siren
    } else {
      // Here we could have a "frightened siren"
    }
  } else {
    // Lógica de oleadas Scatter/Chase
    modeTimer++;
    const currentFrame = modeTimer % 1620;

    let newMode = "CHASE";
    if (currentFrame < 420) {
      newMode = "SCATTER";
    }

    if (globalMode !== newMode) {
      globalMode = newMode;
      ghosts.forEach(g => g.reverseDirection());
    }
  }

  const dir = getDirection();

  // Guardamos posición anterior para saber si se movió
  const prevX = pacman.x;
  const prevY = pacman.y;

  const gained = pacman.update(map, dir);

  // Sound: Waka if moving
  if (pacman.x !== prevX || pacman.y !== prevY) {
    if (modeTimer % 15 === 0) { // No need to play every frame
      sounds.playWaka();
    }
  }

  if (gained > 0) {
    score += gained;
    updateUI();
    // Maybe a tiny sound for pellet? Waka covers it usually.
  }

  // Si ha comido un orbe de poder
  if (pacman.atePower) {
    frightenedTimer = FRIGHTENED_FRAMES;
    ghosts.forEach((g) => g.setFrightened(true));
    sounds.stopSiren();
    // Maybe play a power pellet loop? For now silence the siren or keep it
  }

  // Actualizar fantasmas
  ghosts.forEach((g) => g.update(map, pacman, ghosts, globalMode));

  // Colisiones
  ghosts.forEach((g) => {
    if (pacman.collidesWith(g)) {
      if (g.isFrightened) {
        if (!g.isEaten) {
          score += 200;
          g.markAsEaten();
          updateUI();
          sounds.playEatGhost();
        }
      } else {
        // Muerte
        if (!g.isEaten) {
          lives--;
          updateUI();
          sounds.playDeath();

          if (lives <= 0) {
            gameOver = true;
            gameRunning = false;
            sounds.stopSiren();
            startOverlay.style.display = 'flex';
            startOverlay.querySelector('p').textContent = "GAME OVER";
            startOverlay.querySelector('button').textContent = "TRY AGAIN";
          } else {
            resetPositions();
            // Pause briefly?
          }
        }
      }
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMap(ctx, map);
  ghosts.forEach((g) => g.draw(ctx));
  pacman.draw(ctx);

  // Remove old Game Over draw since it is handled by overlay now
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Initial Draw
draw();
updateUI();
requestAnimationFrame(gameLoop);
