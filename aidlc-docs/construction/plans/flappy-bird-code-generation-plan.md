# Code Generation Plan — Flappy Bird

## Unit Context
- **Unit**: flappy-bird (single unit)
- **Type**: Greenfield, single-component browser game
- **Technology**: HTML5 Canvas + Vanilla JavaScript (ES6+)
- **Dependencies**: None (game code), fast-check (testing only)
- **Target Location**: Workspace root (`e:\aidlc-flappy-bird\`)

## Project Structure
```
e:\aidlc-flappy-bird\
├── index.html              # Game entry point with CSP meta tags
├── css/
│   └── style.css           # Minimal game styling
├── src/
│   ├── game.js             # Game loop, initialization, state management
│   ├── bird.js             # Bird entity (physics, rendering)
│   ├── pipes.js            # Pipe generation, movement, rendering
│   ├── collision.js        # Collision detection logic
│   ├── renderer.js         # Canvas rendering utilities
│   └── input.js            # Keyboard input handling
├── tests/
│   ├── package.json        # Test dependencies (fast-check, vitest)
│   ├── bird.test.js        # Bird physics PBT + example tests
│   ├── pipes.test.js       # Pipe generation PBT + example tests
│   ├── collision.test.js   # Collision detection PBT + example tests
│   ├── score.test.js       # Score calculation tests
│   └── generators.js       # Reusable PBT domain generators
└── README.md               # Project README with run instructions
```

## Code Generation Steps

### Step 1: Project Structure Setup
- [x] Create directory structure (`css/`, `src/`, `tests/`)
- [x] Create `README.md` with project overview and run instructions

### Step 2: HTML Entry Point
- [x] Create `index.html` with:
  - Canvas element (400x600)
  - CSP meta tag (Content-Security-Policy: default-src 'self'; script-src 'self')
  - X-Content-Type-Options meta tag
  - Referrer-Policy meta tag
  - Script references to all JS modules
  - `data-testid` attributes on interactive elements

### Step 3: CSS Styling
- [x] Create `css/style.css` with:
  - Canvas centering
  - Body/page styling (dark background)
  - Minimal game presentation styles

### Step 4: Bird Module
- [x] Create `src/bird.js` with:
  - Bird state (x, y, velocity, size)
  - Gravity application (constant downward acceleration)
  - Flap mechanic (upward velocity impulse)
  - Velocity clamping (max up/down speed)
  - Bird rendering (colored rectangle/circle)
  - Reset function for game restart
  - Module exports for testability

### Step 5: Pipes Module
- [x] Create `src/pipes.js` with:
  - Pipe state management (array of pipe pairs)
  - Pipe generation (random gap position, fixed gap size)
  - Pipe movement (constant left scroll speed)
  - Off-screen pipe removal
  - Pipe rendering (green rectangles)
  - Score tracking (passed pipe detection)
  - Reset function for game restart
  - Module exports for testability

### Step 6: Collision Detection Module
- [x] Create `src/collision.js` with:
  - Bird-to-pipe collision (rectangle overlap detection)
  - Bird-to-boundary collision (top/bottom canvas edges)
  - Pure function design (no side effects) for testability
  - Module exports

### Step 7: Input Handler Module
- [x] Create `src/input.js` with:
  - Keyboard event listener (spacebar)
  - Input state tracking
  - Event cleanup for restart
  - Module exports

### Step 8: Renderer Module
- [x] Create `src/renderer.js` with:
  - Canvas context management
  - Background rendering
  - Score display rendering
  - Game over screen rendering
  - Clear/reset functions
  - Module exports

### Step 9: Main Game Module
- [x] Create `src/game.js` with:
  - Game state management (playing, game-over)
  - Game loop (requestAnimationFrame)
  - Physics update cycle
  - Collision check integration
  - Score management
  - Game over handling
  - Restart logic
  - Global error handler (try/catch in game loop — SECURITY-15)
  - Initialization and startup

### Step 10: Test Infrastructure
- [x] Create `tests/package.json` with:
  - fast-check (pinned version — SECURITY-10)
  - vitest (pinned version — SECURITY-10)
  - Test scripts
- [x] Create `tests/generators.js` with:
  - Bird state generator (constrained position, velocity)
  - Pipe pair generator (valid gap positions, dimensions)
  - Game state generator
  - Canvas bounds generator

### Step 11: Bird Property-Based Tests
- [x] Create `tests/bird.test.js` with:
  - PBT: Gravity invariant — velocity always increases downward without flap (PBT-03)
  - PBT: Flap invariant — velocity after flap is always negative/upward (PBT-03)
  - PBT: Velocity clamping — velocity never exceeds bounds (PBT-03)
  - PBT: Position update idempotent physics — apply(apply(state)) consistent with time (PBT-04 if applicable)
  - Example: Specific gravity scenarios (PBT-10)
  - Example: Specific flap scenarios (PBT-10)

### Step 12: Pipes Property-Based Tests
- [x] Create `tests/pipes.test.js` with:
  - PBT: Pipe generation invariant — gap always within canvas bounds (PBT-03)
  - PBT: Pipe movement invariant — pipes always move left (PBT-03)
  - PBT: Size preservation — pipe count after removal <= pipe count before (PBT-03)
  - PBT: Score invariant — score never decreases (PBT-03)
  - Example: Specific pipe generation scenarios (PBT-10)

### Step 13: Collision Property-Based Tests
- [x] Create `tests/collision.test.js` with:
  - PBT: No collision when bird within gap — for all valid gap positions (PBT-03)
  - PBT: Always collision when bird overlaps pipe — for all overlap positions (PBT-03)
  - PBT: Boundary collision when bird y < 0 or y > canvas height (PBT-03)
  - PBT: Commutativity — collision(bird, pipe) same regardless of check order (PBT-04 if applicable)
  - Example: Specific collision edge cases (PBT-10)

### Step 14: Score Tests
- [x] Create `tests/score.test.js` with:
  - PBT: Score monotonically non-decreasing (PBT-03)
  - PBT: Score increments by exactly 1 per pipe passed (PBT-03)
  - Example: Score after N pipes = N (PBT-10)

### Step 15: Documentation Summary
- [x] Create `aidlc-docs/construction/flappy-bird/code/code-summary.md` with:
  - File inventory
  - Module responsibility descriptions
  - Test coverage summary
  - Security compliance notes
  - PBT compliance notes

## PBT Compliance Mapping
| Rule | Status | Coverage |
|---|---|---|
| PBT-01 | Covered | Properties identified in Steps 11-14 |
| PBT-02 | N/A | No serialization/round-trip operations |
| PBT-03 | Covered | Invariants for physics, pipes, collision, score |
| PBT-04 | Covered | Idempotency where applicable |
| PBT-05 | N/A | No reference implementation available |
| PBT-06 | N/A | No complex stateful components (game state is simple) |
| PBT-07 | Covered | Custom generators in generators.js |
| PBT-08 | Covered | fast-check provides shrinking + seed reproducibility |
| PBT-09 | Covered | fast-check selected as framework |
| PBT-10 | Covered | Example tests alongside PBT in each test file |

## Security Compliance Mapping
| Rule | Status | Notes |
|---|---|---|
| SECURITY-01 | N/A | No data stores |
| SECURITY-02 | N/A | No network intermediaries |
| SECURITY-03 | N/A | No server-side application (client-only) |
| SECURITY-04 | Covered | CSP, X-Content-Type-Options, Referrer-Policy via meta tags |
| SECURITY-05 | N/A | No API endpoints |
| SECURITY-06 | N/A | No IAM/access policies |
| SECURITY-07 | N/A | No network configuration |
| SECURITY-08 | N/A | No authentication/authorization |
| SECURITY-09 | Covered | No default credentials, error handling in game loop |
| SECURITY-10 | Covered | Pinned test dependencies, no runtime dependencies |
| SECURITY-11 | N/A | No security-critical logic (no auth, payments) |
| SECURITY-12 | N/A | No authentication |
| SECURITY-13 | N/A | No deserialization, no CDN resources, no CI/CD |
| SECURITY-14 | N/A | No server-side monitoring needed |
| SECURITY-15 | Covered | Global error handler in game loop, resource cleanup |
