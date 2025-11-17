import { map, drawMap, TILE_SIZE, COLS, ROWS } from "./map.js";
import Pacman from "./pacman.js";
import Ghost from "./ghost.js";
import { getDirection } from "./input.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = COLS * TILE_SIZE;
canvas.height = ROWS * TILE_SIZE;

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");

// Posiciones iniciales
const pacmanStart = {
  col: Math.floor(COLS / 2),
  row: ROWS - 3,
};

const ghostStart = {
  col: Math.floor(COLS / 2),
  row: 3,
};

const pacman = new Pacman(pacmanStart.col, pacmanStart.row);
const ghosts = [new Ghost(ghostStart.col, ghostStart.row, "red")];

let score = 0;
let lives = 3;
let gameOver = false;

function resetPositions() {
  pacman.reset(pacmanStart.col, pacmanStart.row);
  ghosts.forEach((g) => g.reset(ghostStart.col, ghostStart.row));
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

  ghosts.forEach((g) => g.update(map));

  // Colisión Pac-Man – fantasma
  ghosts.forEach((g) => {
    if (pacman.collidesWith(g)) {
      lives--;
      updateUI();

      if (lives <= 0) {
        gameOver = true;
      }

      resetPositions();
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
