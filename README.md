# 🟡 Pac-Man Game JS  
Recreación completa del clásico **Pac-Man (1980)** desarrollada en **JavaScript**, **HTML5 Canvas** y **CSS**, con el mapa original, los 4 fantasmas clásicos, puntos, orbes de poder y sistema de vidas, todo implementado desde cero.

Este proyecto está hecho para aprender y demostrar:
- Programación de videojuegos 2D
- Movimiento en tilemaps
- Detección de colisiones
- IA básica de enemigos
- Organización de proyecto en módulos ES6

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

### ✔️ 4 fantasmas clásicos
- **Blinky (Rojo)**  
- **Pinky (Rosa)**  
- **Inky (Cian)**  
- **Clyde (Naranja)**  

Con:
- Movimiento autónomo  
- Estados: normal, asustado, comido  
- Velocidad reducida cuando están asustados  

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
- **Python HTTP Server**

## 📂 Estructura del proyecto

```
pacman-game-js/
├─ src/
│  ├─ game.js
│  ├─ map.js
│  ├─ pacman.js
│  ├─ ghost.js
│  └─ input.js
├─ index.html
├─ styles.css
└─ README.md
```

## ▶️ Cómo ejecutar el juego

### Opción 1 — Con Python (recomendado)
```bash
cd pacman-game-js
python -m http.server 8000
```
Luego abre:
```
http://localhost:8000
```

### Opción 2 — Script de lanzamiento
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

## 🗺️ Mapa original
Incluye el laberinto clásico de Pac-Man (28x31), con túneles laterales, jaula central y distribución exacta de puntos.

## 📅 Roadmap

- [ ] IA avanzada  
- [ ] Animación de Pac-Man  
- [ ] Bonus fruit  
- [ ] Sonidos  
- [ ] Highscores  
- [ ] Niveles múltiples  

## 🤝 Contribuciones
Abre un Issue o Pull Request para mejorar el proyecto.

## 📜 Licencia
Licencia **MIT**. Pac-Man es una marca registrada de Bandai Namco; este proyecto es recreativo y educativo.
