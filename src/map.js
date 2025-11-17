// Definición de tiles
export const TILE = {
  WALL: 0,
  DOT: 1,
  EMPTY: 2,
  POWER: 3,
};

export const TILE_SIZE = 24;

// Mapa inspirado en el nivel clásico de Pac-Man (versión compacta 19x20)
const LEVEL = [
  "###################",
  "#........#........#",
  "#.####.#.#.####.#.#",
  "#o####.#.#.####.#o#",
  "#.####.#.#.####.#.#",
  "#.................#",
  "#.####.#####.####.#",
  "#.####.#####.####.#",
  "#......##P##......#",
  "######.## ##.######",
  "######.##1234######",
  "######.## ##.######",
  "#........#........#",
  "#.####.#.#.####.#.#",
  "#o...#.#...#...#o.#",
  "###.#.#####.#.###.#",
  "#...#...#...#...#.#",
  "#.#####.#.#####.#.#",
  "#.................#",
  "###################",
];

// Columnas y filas derivadas del nivel
export const ROWS = LEVEL.length;
export const COLS = LEVEL[0].length;

// Mapa en forma de matriz de tiles
export const map = [];

// Posiciones iniciales
export let pacmanStart = { col: 0, row: 0 };
export const ghostStartPositions = []; // {col, row}

for (let row = 0; row < ROWS; row++) {
  const rowData = [];
  for (let col = 0; col < COLS; col++) {
    const ch = LEVEL[row][col];
    let tile;

    switch (ch) {
      case "#":
        tile = TILE.WALL;
        break;
      case ".":
        tile = TILE.DOT;
        break;
      case "o":
        tile = TILE.POWER;
        break;
      case "P":
        pacmanStart = { col, row };
        // Pac-Man está sobre un punto normal
        tile = TILE.DOT;
        break;
      case "1":
      case "2":
      case "3":
      case "4":
        ghostStartPositions.push({ col, row });
        // Fantasmas sobre suelo vacío
        tile = TILE.EMPTY;
        break;
      case " ":
      default:
        tile = TILE.EMPTY;
        break;
    }

    rowData.push(tile);
  }
  map.push(rowData);
}

/**
 * Dibuja el mapa en el canvas.
 */
export function drawMap(ctx, mapData) {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const tile = mapData[row][col];
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      // Fondo del tile
      ctx.fillStyle = "black";
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

      if (tile === TILE.WALL) {
        // Pared azul
        ctx.fillStyle = "#0022aa";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      } else if (tile === TILE.DOT) {
        // Punto pequeño
        ctx.fillStyle = "#ffcc00";
        ctx.beginPath();
        ctx.arc(
          x + TILE_SIZE / 2,
          y + TILE_SIZE / 2,
          TILE_SIZE / 8,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (tile === TILE.POWER) {
        // Orbe de poder más grande
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(
          x + TILE_SIZE / 2,
          y + TILE_SIZE / 2,
          TILE_SIZE / 4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      // EMPTY no dibuja nada extra
    }
  }
}
