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

  const dir = getDirection();
  const gained = pacman.update(map, dir);

  if (gained > 0) {
    score += gained;
    updateUI();
  }

  // Si ha comido un orbe de poder, activamos modo asustado
  if (pacman.atePower) {
    frightenedTimer = FRIGHTENED_FRAMES;
    ghosts.forEach((g) => g.setFrightened(true));
  }

  // Actualizamos el temporizador del modo asustado
  if (frightenedTimer > 0) {
    frightenedTimer--;
    if (frightenedTimer === 0) {
      ghosts.forEach((g) => g.setFrightened(false));
    }
  }

  // Actualizar fantasmas
  ghosts.forEach((g) => g.update(map));

  // Colisiones Pac-Man – fantasmas
  ghosts.forEach((g) => {
    if (pacman.collidesWith(g)) {
      if (g.isFrightened) {
        // Pac-Man se come al fantasma
        score += 200; // puedes subirlo o hacer combo
        g.eaten();
        updateUI();
      } else {
        // Fantasma mata a Pac-Man
        lives--;
        updateUI();

        if (lives <= 0) {
          gameOver = true;
        }

        resetPositions();
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
