## 🟡 Pac-Man Game JS  
Recreación completa del clásico **Pac-Man (1980)** desarrollada en **JavaScript**, **HTML5 Canvas** y **CSS**, con el mapa original, los 4 fantasmas clásicos con sus personalidades únicas, efectos de sonido, puntos, orbes de poder y sistema de vidas.

Este proyecto está hecho para aprender y demostrar:
- Programación de videojuegos 2D
- Movimiento en tilemaps
- Detección de colisiones
- **IA de enemigos compleja (Scatter/Chase y personalidades)**
- Organización de proyecto en módulos ES6
- **Empaquetado de aplicaciones web a escritorio (.exe)**

## 🧩 Características principales

### ✔️ Mapa original (28x31)
Incluye todos los elementos del laberinto oficial:
- Muros azules  
- Puntos  
- Orbes de poder  
- Túneles laterales  
- Jaula de los fantasmas  
- Spawns precisos  

### ✔️ Pac-Man funcional
- Movimiento fluido  
- Control con **WASD** o **Flechas**  
- Detección de colisiones  
- Come puntos y orbes  
- Cambia el estado de los fantasmas al comer un orbe  

### ✔️ 4 fantasmas clásicos con IA Avanzada
Cada fantasma tiene su propia personalidad y alterna entre modos **Scatter** (dispersión) y **Chase** (persecución):

- **Blinky (Rojo)**: 'Shadow'. Persigue directamente a Pac-Man.
- **Pinky (Rosa)**: 'Speedy'. Intenta emboscar a Pac-Man situándose 4 casillas por delante.
- **Inky (Cian)**: 'Bashful'. Su objetivo depende de la posición de Blinky y Pac-Man, creando movimientos impredecibles.
- **Clyde (Naranja)**: 'Pokey'. Persigue a Pac-Man pero huye a su esquina si se acerca demasiado.

Con:
- Algoritmo de búsqueda de rutas (Pathfinding)
- Modos globales: Scatter (van a sus esquinas) y Chase (atacan)
- Estados: normal, asustado (huyen aleatoriamente), comido (ojos vuelven a casa)
- Velocidad dinámica

### ✔️ Audio y Efectos
- Sonido "Waka Waka" al moverse
- Sirena de fondo
- Efectos de muerte y comer fantasmas
- Botón de Mute disponible

### ✔️ Power-Ups
Los 4 orbes grandes permiten:
- Poner a los fantasmas en **modo asustado** (color azul)  
- Hacerlos comestibles durante unos segundos  

### ✔️ HUD
- Puntuación  
- Vidas  
- Pantalla de Game Over  

## 🛠️ Tecnologías utilizadas

- **JavaScript (ES Modules)**
- **HTML5 Canvas API**
- **CSS3**
- **Python** (para servidor local y launcher)
- **PyInstaller** (para el ejecutable)

## 📂 Estructura del proyecto

```
pacman-game-js/
├─ src/
│  ├─ game.js       # Bucle principal y lógica de juego
│  ├─ map.js        # Definición del laberinto
│  ├─ pacman.js     # Lógica del jugador
│  ├─ ghost.js      # IA y estados de los fantasmas
│  ├─ sounds.js     # Gestor de audio
│  └─ input.js      # Manejo de teclado
├─ assets/          # Archivos de sonido
├─ index.html
├─ styles.css
├─ Pacman.exe       # Ejecutable para Windows
└─ README.md
```

## ▶️ Cómo ejecutar el juego

### Opción 1 — Ejecutable de Windows (Fácil)
Simplemente haz doble clic en el archivo:
```
Pacman.exe
```
¡No requiere instalar nada!

### Opción 2 — Con Python (Dev)
```bash
cd pacman-game-js
python -m http.server 8000
```
Luego abre: `http://localhost:8000`

### Opción 3 — Script de lanzamiento
```
start-pacman.bat
```

## 🎮 Controles

| Acción | Tecla |
|-------|-------|
| Mover arriba | W / ↑ |
| Mover abajo | S / ↓ |
| Mover izquierda | A / ← |
| Mover derecha | D / → |
| Silenciar Audio | Clic en botón de sonido |

## 🗺️ Mapa original
Incluye el laberinto clásico de Pac-Man (28x31), con túneles laterales, jaula central y distribución exacta de puntos.

## 📅 Roadmap

- [x] IA avanzada (Personalidades y Modos)
- [x] Animación de Pac-Man  
- [ ] Bonus fruit  
- [x] Sonidos  
- [ ] Highscores  
- [ ] Niveles múltiples  
- [x] Ejecutable de escritorio

## 🤝 Contribuciones
Abre un Issue o Pull Request para mejorar el proyecto.

## 📜 Licencia
Licencia **MIT**. Pac-Man es una marca registrada de Bandai Namco; este proyecto es recreativo y educativo.
