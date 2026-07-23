# Code Summary — Flappy Bird

## File Inventory

### Application Code (Workspace Root)

| File | Purpose | Lines |
|---|---|---|
| `index.html` | Entry point with CSP meta tags | ~20 |
| `css/style.css` | Game canvas styling | ~25 |
| `src/bird.js` | Bird entity physics and rendering | ~110 |
| `src/pipes.js` | Pipe generation, movement, scoring | ~160 |
| `src/collision.js` | Pure collision detection functions | ~80 |
| `src/input.js` | Keyboard spacebar handling | ~60 |
| `src/renderer.js` | Canvas rendering utilities | ~130 |
| `src/game.js` | Game loop, state management, error handling | ~150 |

### Test Code

| File | Purpose | PBT Properties | Example Tests |
|---|---|---|---|
| `tests/generators.js` | Reusable PBT domain generators | - | - |
| `tests/bird.test.js` | Bird physics tests | 6 properties | 7 examples |
| `tests/pipes.test.js` | Pipe logic tests | 5 properties | 5 examples |
| `tests/collision.test.js` | Collision detection tests | 5 properties | 8 examples |
| `tests/score.test.js` | Score calculation tests | 4 properties | 4 examples |

## Module Responsibilities

### src/bird.js
- Bird state management (position, velocity, dimensions)
- Gravity physics (constant downward acceleration)
- Flap mechanics (upward velocity impulse)
- Velocity clamping (min/max bounds)
- Bird rendering (yellow rectangle with eye)

### src/pipes.js
- Pipe pair generation with random gap positioning
- Pipe scrolling (constant left movement)
- Off-screen pipe removal
- Score calculation (bird passing pipe detection)
- Pipe rendering (green rectangles with caps)

### src/collision.js
- AABB rectangle collision detection
- Bird-to-pipe collision (horizontal overlap + not in gap)
- Bird-to-boundary collision (canvas top/bottom)
- Aggregate collision check (all pipes + boundaries)

### src/input.js
- Spacebar event listening
- Input state consumption (one-shot per frame)
- Cleanup/destruction

### src/renderer.js
- Canvas initialization and context management
- Background rendering (sky gradient + ground)
- Score display (centered white text with outline)
- Game over screen (overlay + final score + restart prompt)
- Start screen

### src/game.js
- Game state machine (waiting → playing → game-over)
- requestAnimationFrame game loop
- Module coordination
- Global error handler (SECURITY-15)
- Resource cleanup on destruction

## Security Compliance

| Rule | Status | Implementation |
|---|---|---|
| SECURITY-04 | Compliant | CSP, X-Content-Type-Options, Referrer-Policy meta tags in index.html |
| SECURITY-09 | Compliant | No default credentials; error handling exposes no internal details |
| SECURITY-10 | Compliant | Test dependencies pinned to exact versions in package.json |
| SECURITY-15 | Compliant | Global try/catch in game loop; resource cleanup in destroy() |
| All others | N/A | No server, no auth, no data store, no network calls |

## PBT Compliance

| Rule | Status | Implementation |
|---|---|---|
| PBT-01 | Compliant | Properties identified for physics, collision, scoring |
| PBT-02 | N/A | No serialization/round-trip operations |
| PBT-03 | Compliant | Invariants tested: gravity, velocity clamping, gap bounds, score monotonicity, collision correctness |
| PBT-04 | Compliant | Velocity clamping idempotency tested |
| PBT-05 | N/A | No reference implementation |
| PBT-06 | N/A | No complex stateful components |
| PBT-07 | Compliant | Domain generators in generators.js (birdStateArb, pipePairArb, birdInGapArb, birdCollidingArb) |
| PBT-08 | Compliant | fast-check provides automatic shrinking + seed reproducibility |
| PBT-09 | Compliant | fast-check selected and pinned in package.json |
| PBT-10 | Compliant | Example-based tests alongside PBT in every test file |
