import { TILE_SIZE, TILE, COLS, ROWS } from "./map.js";

const DIRECTIONS = [
  { x: 0, y: -1 }, // UP (Priority 1)
  { x: -1, y: 0 }, // LEFT (Priority 2)
  { x: 0, y: 1 },  // DOWN (Priority 3)
  { x: 1, y: 0 },  // RIGHT (Priority 4)
];

// Compara dos tiles
const sameTile = (t1, t2) => t1.col === t2.col && t1.row === t2.row;

export default class Ghost {
  constructor(col, row, color = "red") {
    this.baseSpeed = 1; // Igual que pacman
    this.speed = this.baseSpeed;
    this.radius = TILE_SIZE / 2 - 2;
    this.color = color;
    this.startCol = col;
    this.startRow = row;

    this.isFrightened = false;
    this.isEaten = false;

    this.reset(col, row);
  }

  reset(col = this.startCol, row = this.startRow) {
    this.x = col * TILE_SIZE + TILE_SIZE / 2;
    this.y = row * TILE_SIZE + TILE_SIZE / 2;
    // Por defecto empiezan moviéndose a la izquierda o derecha según posición, 
    // pero para simplificar, "Left" suele ser safe inicial.
    this.dir = { x: -1, y: 0 };
    this.isFrightened = false;
    this.isEaten = false;
    this.speed = this.baseSpeed;
  }

  setFrightened(active) {
    if (this.isEaten) return; // Si ya está comido, ignora esto

    // Si pasamos a asustado, invertimos dirección inmediatamente (regla original)
    if (active && !this.isFrightened) {
      this.reverseDirection();
    }

    this.isFrightened = active;
    this.speed = active ? this.baseSpeed * 0.5 : this.baseSpeed;
  }

  reverseDirection() {
    this.dir = { x: -this.dir.x, y: -this.dir.y };
  }

  markAsEaten() {
    this.isEaten = true;
    this.isFrightened = false;
    this.speed = this.baseSpeed * 2.0; // Vuelve muy rápido a casa
  }

  // update ahora recibe el estado global
  update(map, pacman, allGhosts, globalMode) {
    const col = Math.floor(this.x / TILE_SIZE);
    const row = Math.floor(this.y / TILE_SIZE);

    // Check si estamos en el centro de un tile (aproximadamente) para tomar decisiones
    // Usamos lógica de intersección
    const centerCol = col * TILE_SIZE + TILE_SIZE / 2;
    const centerRow = row * TILE_SIZE + TILE_SIZE / 2;

    const distToCenter = Math.abs(this.x - centerCol) + Math.abs(this.y - centerRow);

    // Si estamos llegando al centro y no hemos decidido ya para este tile...
    // Simplificación: Ejecutamos lógica de decisión cada frame que estemos "en el centro" 
    // pero solo si nos estamos moviendo hacia él.
    // O mejor: Si la distancia al centro es menor que la velocidad (nos vamos a pasar)

    // Para simplificar: alinearse al centro si estamos muy cerca y cambiar dirección
    if (distToCenter <= this.speed / 1.5) {
      this.x = centerCol;
      this.y = centerRow;

      // Decidir nueva dirección
      this.dir = this.chooseNextDirection(map, pacman, allGhosts, { col, row }, globalMode);
    }

    // Moverse
    this.x += this.dir.x * this.speed;
    this.y += this.dir.y * this.speed;

    // Tunnel logic simple
    if (this.x < -this.radius) this.x = COLS * TILE_SIZE + this.radius;
    if (this.x > COLS * TILE_SIZE + this.radius) this.x = -this.radius;

    // If eaten and reached home base (simplificado: start position)
    if (this.isEaten) {
      const distHome = Math.abs(this.x - (this.startCol * TILE_SIZE + TILE_SIZE / 2)) +
        Math.abs(this.y - (this.startRow * TILE_SIZE + TILE_SIZE / 2));
      if (distHome < 5) { // Llegó a casa
        this.isEaten = false;
        this.speed = this.baseSpeed;
        this.dir = { x: 0, y: -1 }; // Sale de la casa hacia arriba
      }
    }
  }

  chooseNextDirection(map, pacman, allGhosts, currentTile, globalMode) {
    // 1. Determinar Target Tile
    let target = { col: 0, row: 0 };

    if (this.isEaten) {
      target = { col: this.startCol, row: this.startRow };
    } else if (this.isFrightened) {
      // Random mode logic: target is random override
      // En realidad PacMan original usa generador pseudo-aleatorio en intersecciones
      // Aquí simularemos escogiendo un target aleatorio lejos
      target = {
        col: Math.floor(Math.random() * COLS),
        row: Math.floor(Math.random() * ROWS)
      };
    } else {
      // SCATTER o CHASE
      if (globalMode === "SCATTER") {
        // Esquinas fijas
        switch (this.color) {
          case "red": target = { col: COLS - 2, row: 1 }; break; // Top Right
          case "pink": target = { col: 1, row: 1 }; break; // Top Left
          case "cyan": target = { col: COLS - 2, row: ROWS - 2 }; break; // Bottom Right
          case "orange": target = { col: 1, row: ROWS - 2 }; break; // Bottom Left
          default: target = { col: 1, row: 1 };
        }
      } else {
        // CHASE: Personalidades
        const pacCol = Math.floor(pacman.x / TILE_SIZE);
        const pacRow = Math.floor(pacman.y / TILE_SIZE);
        const pacDir = pacman.currentDir;

        switch (this.color) {
          case "red": // Blinky: Directo a Pacman
            target = { col: pacCol, row: pacRow };
            break;

          case "pink": // Pinky: 4 tiles delante
            target = {
              col: pacCol + pacDir.x * 4,
              row: pacRow + pacDir.y * 4
            };
            break;

          case "cyan": // Inky: Vector complejo usando a Blinky
            // Target intermedio: 2 delante de Pacman
            const tempX = pacCol + pacDir.x * 2;
            const tempY = pacRow + pacDir.y * 2;
            const blinky = allGhosts.find(g => g.color === "red");
            if (blinky) {
              const blinkyCol = Math.floor(blinky.x / TILE_SIZE);
              const blinkyRow = Math.floor(blinky.y / TILE_SIZE);
              // Vector Blinky -> Temp
              const vecX = tempX - blinkyCol;
              const vecY = tempY - blinkyRow;
              // Doble del vector
              target = {
                col: blinkyCol + vecX * 2,
                row: blinkyRow + vecY * 2
              };
            } else {
              target = { col: pacCol, row: pacRow };
            }
            break;

          case "orange": // Clyde: Lejos -> Chase, Cerca -> Scatter
            const distStr = Math.sqrt(Math.pow(currentTile.col - pacCol, 2) + Math.pow(currentTile.row - pacRow, 2));
            if (distStr > 8) {
              target = { col: pacCol, row: pacRow };
            } else {
              target = { col: 1, row: ROWS - 2 }; // Su esquina Scatter
            }
            break;

          default:
            target = { col: pacCol, row: pacRow };
        }
      }
    }

    // 2. Seleccionar dirección que minimiza distancia euclidiana al Target
    // REGLA CLAVE: No se puede invertir la dirección (no volver por donde vino)
    const reverseDir = { x: -this.dir.x, y: -this.dir.y };

    let bestDir = this.dir;
    let minDist = Infinity;

    // Si estamos asustados, elegimos aleatoriamente entre las válidas
    // Pero manteniendo la regla de no reversa si es posible
    const availableDirs = [];

    for (const d of DIRECTIONS) {
      // No reverse
      if (d.x === reverseDir.x && d.y === reverseDir.y) continue;

      if (this.canMove(map, d.x, d.y, currentTile)) {
        availableDirs.push(d);

        // Calcular distancia al target del TILE VECINO
        const nextTileCol = currentTile.col + d.x;
        const nextTileRow = currentTile.row + d.y;

        const dist = Math.pow(nextTileCol - target.col, 2) + Math.pow(nextTileRow - target.row, 2);

        if (dist < minDist) {
          minDist = dist;
          bestDir = d;
        }
      }
    }

    if (availableDirs.length === 0) {
      // Callejón sin salida (solo pasa en respawn box a veces), permitimos reverse
      return reverseDir;
    }

    if (this.isFrightened && !this.isEaten) {
      // Selección aleatoria válida
      return availableDirs[Math.floor(Math.random() * availableDirs.length)];
    }

    return bestDir;
  }

  canMove(map, dirX, dirY, currentTile) {
    const nextCol = currentTile.col + dirX;
    const nextRow = currentTile.row + dirY;

    if (nextRow < 0 || nextRow >= ROWS || nextCol < 0 || nextCol >= COLS) {
      // Permitir túnel solo si es izquierda/derecha
      if (nextCol < 0 || nextCol >= COLS) return true;
      return false;
    }
    const tile = map[nextRow][nextCol];
    return tile !== TILE.WALL;
    // Nota: Deberíamos bloquear la entrada a la casa si no son ojos ("Eaten"),
    // pero para simplificar lo dejamos pasar.
  }

  draw(ctx) {
    // Si está comido, solo dibujamos ojos
    if (this.isEaten) {
      this.drawEyes(ctx);
      return;
    }

    // Color: azul si está asustado
    // Blanco/destello si está por acabar asustado (omitted for brevity)
    const bodyColor = this.isFrightened ? "#0000ff" : this.color;

    // Cuerpo del fantasma
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, Math.PI, 0, false);
    ctx.lineTo(this.x + this.radius, this.y + this.radius);
    // Patas onduladas simplificadas
    ctx.lineTo(this.x - this.radius, this.y + this.radius);
    ctx.closePath();
    ctx.fill();

    // Ojos y pupilas
    this.drawEyes(ctx);
  }

  drawEyes(ctx) {
    // Ojos
    ctx.fillStyle = "white";
    ctx.beginPath();
    // Ojo izq
    ctx.arc(this.x - 4, this.y - 4, 4, 0, Math.PI * 2);
    ctx.arc(this.x + 4, this.y - 4, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pupilas (miran dirección)
    ctx.fillStyle = "blue";
    const offX = this.dir.x * 2;
    const offY = this.dir.y * 2;

    ctx.beginPath();
    ctx.arc(this.x - 4 + offX, this.y - 4 + offY, 2, 0, Math.PI * 2);
    ctx.arc(this.x + 4 + offX, this.y - 4 + offY, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
