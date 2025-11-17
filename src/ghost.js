import { TILE_SIZE, TILE, COLS, ROWS } from "./map.js";

const DIRECTIONS = [
  { x: -1, y: 0 }, // izquierda
  { x: 1, y: 0 },  // derecha
  { x: 0, y: -1 }, // arriba
  { x: 0, y: 1 },  // abajo
];

function getRandomDirection() {
  return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
}

export default class Ghost {
  constructor(col, row, color = "red") {
    this.baseSpeed = 1.5;
    this.speed = this.baseSpeed;
    this.radius = TILE_SIZE / 2 - 2;
    this.color = color;
    this.startCol = col;
    this.startRow = row;

    this.isFrightened = false;

    this.reset(col, row);
  }

  reset(col = this.startCol, row = this.startRow) {
    this.x = col * TILE_SIZE + TILE_SIZE / 2;
    this.y = row * TILE_SIZE + TILE_SIZE / 2;
    this.dir = getRandomDirection();
  }

  setFrightened(active) {
    this.isFrightened = active;
    this.speed = active ? this.baseSpeed * 0.6 : this.baseSpeed;
  }

  eaten() {
    // Cuando Pac-Man se lo come, vuelve a la casa
    this.isFrightened = false;
    this.speed = this.baseSpeed;
    this.reset();
  }

  update(map) {
    // Si la dirección actual lleva a pared, cambiamos
    if (!this.canMove(map, this.dir.x, this.dir.y)) {
      this.dir = this.chooseNewDirection(map);
    }

    this.x += this.dir.x * this.speed;
    this.y += this.dir.y * this.speed;
  }

  canMove(map, dirX, dirY) {
    const nextX = this.x + dirX * this.speed;
    const nextY = this.y + dirY * this.speed;
    const col = Math.floor(nextX / TILE_SIZE);
    const row = Math.floor(nextY / TILE_SIZE);

    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false;
    return map[row][col] !== TILE.WALL;
  }

  chooseNewDirection(map) {
    const possible = DIRECTIONS.filter((d) => this.canMove(map, d.x, d.y));
    if (possible.length === 0) {
      return { x: 0, y: 0 };
    }
    return possible[Math.floor(Math.random() * possible.length)];
  }

  draw(ctx) {
    // Color: azul si está asustado
    const bodyColor = this.isFrightened ? "#0000ff" : this.color;

    // Cuerpo del fantasma
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, Math.PI, 0, false);
    ctx.lineTo(this.x + this.radius, this.y + this.radius);
    ctx.lineTo(this.x - this.radius, this.y + this.radius);
    ctx.closePath();
    ctx.fill();

    // Ojos
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(
      this.x - this.radius / 3,
      this.y - this.radius / 3,
      this.radius / 5,
      0,
      Math.PI * 2
    );
    ctx.arc(
      this.x + this.radius / 3,
      this.y - this.radius / 3,
      this.radius / 5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(
      this.x - this.radius / 3,
      this.y - this.radius / 3,
      this.radius / 10,
      0,
      Math.PI * 2
    );
    ctx.arc(
      this.x + this.radius / 3,
      this.y - this.radius / 3,
      this.radius / 10,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}
