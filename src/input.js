const Direction = {
  NONE: { x: 0, y: 0 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
};

let currentDirection = Direction.NONE;

function handleKeyDown(e) {
  let handled = true;

  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      currentDirection = Direction.UP;
      break;
    case "ArrowDown":
    case "s":
    case "S":
      currentDirection = Direction.DOWN;
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      currentDirection = Direction.LEFT;
      break;
    case "ArrowRight":
    case "d":
    case "D":
      currentDirection = Direction.RIGHT;
      break;
    default:
      handled = false;
      break;
  }

  if (handled) {
    e.preventDefault();
  }
}

window.addEventListener("keydown", handleKeyDown);

/**
 * Devuelve la dirección actual en forma de { x, y }.
 */
export function getDirection() {
  return currentDirection;
}

export function setDirection(dir) {
  if (dir.x === 0 && dir.y === 0) {
    currentDirection = Direction.NONE;
  } else {
    // Find matching direction if needed, but for reset we mostly need NONE
    // Or if we want to programmatically set it
    currentDirection = dir;
  }
}
