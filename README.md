# Flappy Bird

A simple Flappy Bird clone built with HTML5 Canvas and vanilla JavaScript.

## How to Play

1. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
2. Press **Spacebar** to make the bird flap
3. Avoid the pipes and boundaries
4. Score increases by 1 for each pipe pair you pass through
5. Press **Spacebar** to restart after game over

## Controls

| Key | Action |
|---|---|
| Spacebar | Flap (during game) / Restart (after game over) |

## Project Structure

```
├── index.html          # Game entry point
├── css/
│   └── style.css       # Game styling
├── src/
│   ├── game.js         # Game loop and state management
│   ├── bird.js         # Bird physics and rendering
│   ├── pipes.js        # Pipe generation and movement
│   ├── collision.js    # Collision detection
│   ├── renderer.js     # Canvas rendering utilities
│   └── input.js        # Keyboard input handling
├── tests/
│   ├── package.json    # Test dependencies
│   ├── generators.js   # PBT domain generators
│   ├── bird.test.js    # Bird physics tests
│   ├── pipes.test.js   # Pipe logic tests
│   ├── collision.test.js # Collision detection tests
│   └── score.test.js   # Score calculation tests
└── README.md           # This file
```

## Running Locally

No build step or server required. Simply open `index.html` directly in your browser:

```
file:///path/to/index.html
```

Or double-click `index.html` in your file explorer.

## Running Tests

```bash
cd tests
npm install
npm test
```

## Technical Details

- **Rendering**: HTML5 Canvas 2D API
- **Game Loop**: `requestAnimationFrame` for smooth 60 FPS
- **Visual Style**: Geometric shapes (colored rectangles/circles)
- **Dependencies**: None (game), fast-check + Vitest (tests only)
