import {
  map,
  drawMap,
  TILE_SIZE,
  COLS,
  ROWS,
  pacmanStart,
  ghostStartPositions,
} from "./map.js";
import Pacman from "./pacman.js";
import Ghost from "./ghost.js";
import { getDirection } from "./input.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = COLS * TILE_SIZE;
canvas.height = ROWS * TILE_SIZE;

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");

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
}

function updateUI() {
  scoreEl.textContent = `Score: ${score}`;
  livesEl.textContent = `Lives: ${lives}`;
}

function update() {
  if (gameOver) return;

  // Actualizar modo global (Scatter / Chase)
  // Ciclo simple para Nivel 1: 7s Scatter, 20s Chase, repetir.
  // Frightened anula esto temporalmente.

  if (frightenedTimer > 0) {
    frightenedTimer--;
    if (frightenedTimer === 0) {
      ghosts.forEach((g) => g.setFrightened(false));
      // Reanudar música normal si la hubiera
    }
  } else {
    // Lógica de oleadas Scatter/Chase
    modeTimer++;
    // Ejemplo simplificado de onda: 7 seg Scatter -> 20 seg Chase -> Repetir
    // 60 frames * 7 = 420
    // 60 frames * 20 = 1200
    // Total ciclo = 1620
    const currentFrame = modeTimer % 1620;

    let newMode = "CHASE";
    if (currentFrame < 420) {
      newMode = "SCATTER";
    }

    if (globalMode !== newMode) {
      globalMode = newMode;
      // Invertir dirección de fantasmas al cambiar de modo (regla original)
      ghosts.forEach(g => g.reverseDirection());
      console.log("Mode switch:", globalMode);
    }
  }

  const dir = getDirection();
  // Pacman update devuelve puntos
  const gained = pacman.update(map, dir);

  if (gained > 0) {
    score += gained;
    updateUI();
  }

  // Si ha comido un orbe de poder
  if (pacman.atePower) {
    frightenedTimer = FRIGHTENED_FRAMES;
    ghosts.forEach((g) => g.setFrightened(true));
  }

  // Actualizar fantasmas con el modo actual (si están asustados, el fantasma ya lo sabe por su flag, pero le pasamos el global por si acaso)
  // Pasamos 'pacman' para que puedan usar su posición en la IA
  // Pasamos 'ghosts' (lista completa) para Inky, que necesita a Blinky
  ghosts.forEach((g) => g.update(map, pacman, ghosts, globalMode));

  // Colisiones
  ghosts.forEach((g) => {
    if (pacman.collidesWith(g)) {
      if (g.isFrightened) {
        if (!g.isEaten) { // Si ya fue comido (ojos), no hace nada
          score += 200;
          g.markAsEaten();
          updateUI();
        }
      } else {
        // Muerte
        if (!g.isEaten) { // Si son solo ojos, no matan
          lives--;
          updateUI();
          if (lives <= 0) {
            gameOver = true;
          } else {
            resetPositions();
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

  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);

    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Inicio
updateUI();
requestAnimationFrame(gameLoop);
