# Build Instructions

## Prerequisites
- **Runtime**: Any modern web browser (Chrome 80+, Firefox 78+, Edge 80+, Safari 14+)
- **Testing**: Node.js 18+ and npm 9+ (for running tests only)
- **System Requirements**: Any OS, minimal resources

## Build Steps

### 1. Game Application (No Build Required)

The game has **zero dependencies** and requires no build step. It runs directly in the browser from local files.

```bash
# No build command needed — open index.html directly
# On Windows:
start index.html

# On macOS:
open index.html

# On Linux:
xdg-open index.html
```

### 2. Install Test Dependencies

Test dependencies are isolated in the `tests/` directory:

```bash
cd tests
npm install
```

This installs:
- `fast-check@3.19.0` — Property-based testing framework
- `vitest@1.6.0` — Test runner

### 3. Verify Application

Open `index.html` in a browser and verify:
- Canvas renders with sky gradient background
- "Flappy Bird" title and "Press SPACE to start" text appears
- Pressing spacebar starts the game
- Bird responds to gravity and flap input
- Pipes scroll from right to left
- Score increments on pipe pass
- Game over triggers on collision
- Restart works after game over

## Build Artifacts

| Artifact | Location | Description |
|---|---|---|
| Game application | `index.html` | Entry point (open in browser) |
| Game logic | `src/*.js` | 6 JavaScript modules |
| Game styles | `css/style.css` | Canvas styling |
| Test suite | `tests/` | PBT + example tests |

## Troubleshooting

### Game Doesn't Load
- **Cause**: Browser blocking local file scripts due to CORS/CSP
- **Solution**: Some browsers restrict `file://` loading. Try:
  1. Use a different browser (Chrome typically works)
  2. Start a simple HTTP server: `npx serve .` or `python -m http.server 8000`

### Tests Fail to Install
- **Cause**: Node.js not installed or wrong version
- **Solution**: Install Node.js 18+ from https://nodejs.org/

### Tests Fail to Run
- **Cause**: Dependencies not installed
- **Solution**: Run `cd tests && npm install` first
