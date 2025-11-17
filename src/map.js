export const TILE = {
  WALL: 0,
  DOT: 1,
  EMPTY: 2,
};

export const TILE_SIZE = 24;
export const COLS = 19;
export const ROWS = 21;

// Matriz del mapa
export const map = [];

for (let row = 0; row < ROWS; row++) {
  const rowData = [];
  for (let col = 0; col < COLS; col++) {
    const isBorder =
      row === 0 || row === ROWS - 1 || col === 0 || col === COLS - 1;

    // Por ahora: sólo bordes como pared y el interior lleno de puntos.
    rowData.push(isBorder ? TILE.WALL : TILE.DOT);
  }
  map.push(rowData);
}

// Añadimos unas paredes simples internas para que no sea un cuadrado vacío.
for (let col = 3; col < COLS - 3; col++) {
  map[4][col] = TILE.WALL;
  map[ROWS - 5][col] = TILE.WALL;
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
        // Pared
        ctx.fillStyle = "#0022aa";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      } else if (tile === TILE.DOT) {
        // Punto
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
      }
      // TILE.EMPTY no dibuja nada extra (solo el fondo).
    }
  }
}
