import { TILE_SIZE, TILE } from "./map.js";

export default class Pacman {
  constructor(col, row) {
    this.speed = 1; // píxeles por frame, debe ser divisor de TILE_SIZE/2 idealmente
    this.radius = TILE_SIZE / 2 - 2;
    this.currentDir = { x: 0, y: 0 };
    this.nextDir = { x: 0, y: 0 }; // Dirección en buffer
    this.atePower = false;

    this.reset(col, row);
  }

  reset(col, row) {
    this.x = col * TILE_SIZE + TILE_SIZE / 2;
    this.y = row * TILE_SIZE + TILE_SIZE / 2;
    this.currentDir = { x: 0, y: 0 };
    this.nextDir = { x: 0, y: 0 };
    this.atePower = false;
  }

  /**
   * Actualiza la posición de Pac-Man según la dirección de input.
   * Devuelve los puntos obtenidos en este frame.
   */
  update(map, inputDir) {
    this.atePower = false;

    // 1. Gestionar Input
    // Si el input es válido...
    if (inputDir && (inputDir.x !== 0 || inputDir.y !== 0)) {
      // Si es la opuesta, girar inmediatamente
      if (inputDir.x === -this.currentDir.x && inputDir.y === -this.currentDir.y) {
        this.currentDir = { ...inputDir };
        this.nextDir = { x: 0, y: 0 };
      } else if (inputDir.x !== this.currentDir.x || inputDir.y !== this.currentDir.y) {
        // Si es perpendicular, guardamos en buffer
        this.nextDir = { ...inputDir };
      }
    }

    // 2. Intentar girar con nextDir (si existe)
    if (this.nextDir.x !== 0 || this.nextDir.y !== 0) {
      // Para girar, verificamos si al "encarrilarnos" al centro y movernos en nextDir
      // chocaríamos INMEDIATAMENTE con una pared.

      const centerCol = Math.floor(this.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
      const centerRow = Math.floor(this.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;

      // Estamos cerca del punto de giro?
      if (Math.abs(this.x - centerCol) <= this.speed + 1 &&
        Math.abs(this.y - centerRow) <= this.speed + 1) {

        // Verificamos si PODEMOS ir en esa dirección desde el centro
        if (this.canMoveInDir(map, centerCol, centerRow, this.nextDir)) {
          this.x = centerCol;
          this.y = centerRow;
          this.currentDir = { ...this.nextDir };
          this.nextDir = { x: 0, y: 0 };
        }
      }
    }

    // 3. Moverse en currentDir
    // Calculamos nueva posición teórica
    let nextX = this.x + this.currentDir.x * this.speed;
    let nextY = this.y + this.currentDir.y * this.speed;

    // Verificar colisión con paredes en la dirección actual
    // Usamos un "sensor" en la punta del personaje
    const sensorOffset = this.radius + 1; // Un pixel más allá del radio
    const sensorX = nextX + this.currentDir.x * sensorOffset;
    const sensorY = nextY + this.currentDir.y * sensorOffset;

    const sensorCol = Math.floor(sensorX / TILE_SIZE);
    const sensorRow = Math.floor(sensorY / TILE_SIZE);

    // Check de limites del mapa
    if (sensorRow >= 0 && sensorRow < map.length && sensorCol >= 0 && sensorCol < map[0].length) {
      if (map[sensorRow][sensorCol] === TILE.WALL || map[sensorRow][sensorCol] === TILE.DOOR) {
        // Chocamos. Nos ajustamos al borde de la celda actual para no traspasar
        // Si íbamos derecha, nos quedamos en el borde derecho del tile anterior
        // (Tile Size * col_actual + Tile Size - radius)
        // Mejor simplemente: NO movemos si choca. 
        // PERO: Si falta un poquito para llegar a la pared, sí deberíamos movernos.

        // Simplificación: si el sensor toca pared, alineamos a la posición máxima permitida
        // y paramos.

        // Alineación:
        // Si dirX = 1 (derecha), la pared está en sensorCol.
        // La posición máxima es sensorCol * TILE_SIZE - sensorOffset
        // Bueno, en realidad sensorCol * TILE_SIZE es el borde IZQUIERDO de la pared.

        if (this.currentDir.x > 0) { // Derecha
          nextX = sensorCol * TILE_SIZE - this.radius;
        } else if (this.currentDir.x < 0) { // Izquierda
          nextX = (sensorCol + 1) * TILE_SIZE + this.radius;
        } else if (this.currentDir.y > 0) { // Abajo
          nextY = sensorRow * TILE_SIZE - this.radius;
        } else if (this.currentDir.y < 0) { // Arriba
          nextY = (sensorRow + 1) * TILE_SIZE + this.radius;
        }
      }
    }

    // Tunnel Warping
    if (nextX < -this.radius) {
      nextX = map[0].length * TILE_SIZE + this.radius;
    } else if (nextX > map[0].length * TILE_SIZE + this.radius) {
      nextX = -this.radius;
    }

    this.x = nextX;
    this.y = nextY;

    // 4. Comer
    const centerCol = Math.floor(this.x / TILE_SIZE);
    const centerRow = Math.floor(this.y / TILE_SIZE);

    if (centerRow >= 0 && centerRow < map.length && centerCol >= 0 && centerCol < map[0].length) {
      let points = 0;
      const tile = map[centerRow][centerCol];

      if (tile === TILE.DOT) {
        map[centerRow][centerCol] = TILE.EMPTY;
        points = 10;
      } else if (tile === TILE.POWER) {
        map[centerRow][centerCol] = TILE.EMPTY;
        points = 50;
        this.atePower = true;
      }
      return points;
    }

    return 0;
  }

  /**
   * Helper simple para ver si un tile es transitable
   */
  canMoveInDir(map, x, y, dir) {
    const nextTileX = Math.floor((x + dir.x * (this.radius + 2)) / TILE_SIZE);
    const nextTileY = Math.floor((y + dir.y * (this.radius + 2)) / TILE_SIZE);

    if (nextTileY < 0 || nextTileY >= map.length) return false;
    // Tunnel
    if (nextTileX < 0 || nextTileX >= map[0].length) return true;

    const tile = map[nextTileY][nextTileX];
    return tile !== TILE.WALL && tile !== TILE.DOOR;
  }

  draw(ctx) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();

    // Dibujo simple, se podría mejorar con boca abierta/cerrada
    // Dirección del ángulo de la boca
    let angle = 0;
    if (this.currentDir.x === 1) angle = 0;
    if (this.currentDir.x === -1) angle = Math.PI;
    if (this.currentDir.y === 1) angle = Math.PI / 2;
    if (this.currentDir.y === -1) angle = -Math.PI / 2;

    const biteOpen = 0.2 * Math.PI; // 36 grados
    // Animación de boca podría ir aquí con un timer

    ctx.arc(this.x, this.y, this.radius, angle + biteOpen, angle + 2 * Math.PI - biteOpen);

    // Linea al centro para "cerrar" la boca (pacman style)
    ctx.lineTo(this.x, this.y);

    ctx.fill();
  }

  collidesWith(ghost) {
    const dx = this.x - ghost.x;
    const dy = this.y - ghost.y;
    // Distancia simple
    return (dx * dx + dy * dy) < (this.radius + ghost.radius) * (this.radius + ghost.radius);
  }
}
