import { TILE_SIZE, TILE } from "./map.js";

export default class Pacman {
  constructor(col, row) {
    this.speed = 2; // píxeles por frame
    this.radius = TILE_SIZE / 2 - 2;
    this.currentDir = { x: 0, y: 0 };

    this.reset(col, row);
  }

  reset(col, row) {
    this.x = col * TILE_SIZE + TILE_SIZE / 2;
    this.y = row * TILE_SIZE + TILE_SIZE / 2;
    this.currentDir = { x: 0, y: 0 };
  }

  /**
   * Actualiza la posición de Pac-Man según la dirección de input.
   * Devuelve los puntos obtenidos en este frame.
   */
  update(map, inputDir) {
    // Intentamos cambiar de dirección según el input
    if (
      inputDir &&
      (inputDir.x !== this.currentDir.x || inputDir.y !== this.currentDir.y)
    ) {
      if (this.canMove(map, inputDir.x, inputDir.y)) {
        this.currentDir = { ...inputDir };
      }
    }

    // Si la dirección actual nos lleva a una pared, no nos movemos
    if (!this.canMove(map, this.currentDir.x, this.currentDir.y)) {
      return 0;
    }

    // Movimiento
    this.x += this.currentDir.x * this.speed;
    this.y += this.currentDir.y * this.speed;

    // Comer puntos
    const col = Math.floor(this.x / TILE_SIZE);
    const row = Math.floor(this.y / TILE_SIZE);

    if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
      return 0;
    }

    let points = 0;
    const tile = map[row][col];
    if (tile === TILE.DOT) {
      map[row][col] = TILE.EMPTY;
      points = 10;
    }

    return points;
  }

  /**
   * Comprueba si el siguiente paso en la dirección dada es válido (no hay pared).
   */
  canMove(map, dirX, dirY) {
    if (dirX === 0 && dirY === 0) return false;

    const nextX = this.x + dirX * this.speed;
    const nextY = this.y + dirY * this.speed;
    const col = Math.floor(nextX / TILE_SIZE);
    const row = Math.floor(nextY / TILE_SIZE);

    if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
      return false;
    }

    return map[row][col] !== TILE.WALL;
  }

  draw(ctx) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Comprueba colisión con un fantasma.
   */
  collidesWith(ghost) {
    const dx = this.x - ghost.x;
    const dy = this.y - ghost.y;
    const distSq = dx * dx + dy * dy;
    const minDist = this.radius + ghost.radius;
    return distSq < minDist * minDist;
  }
}
