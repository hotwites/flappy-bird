# Integration Test Instructions

## Purpose

Verify that all game modules work together correctly as a complete application.

## Integration Test Approach

Since this is a single-component client-side game with no external services, integration testing is performed **manually** by playing the game and verifying the complete game loop.

## Test Scenarios

### Scenario 1: Complete Game Loop
- **Description**: Verify full gameplay from start to game over
- **Setup**: Open `index.html` in browser
- **Test Steps**:
  1. Verify start screen displays "Press SPACE to start"
  2. Press spacebar — game begins, bird flaps upward
  3. Bird falls due to gravity when no input given
  4. Pipes appear from the right and scroll left
  5. Bird passes through pipe gap — score increments
  6. Bird hits pipe — game over screen appears
  7. Final score displayed matches observed passes
  8. Press spacebar — game restarts from beginning
- **Expected Results**: All steps pass without errors

### Scenario 2: Boundary Collision
- **Description**: Verify top/bottom boundary collision detection
- **Setup**: Open `index.html` in browser
- **Test Steps**:
  1. Start game and do not press spacebar (let bird fall)
  2. Bird should hit bottom — game over triggers
  3. Restart and rapidly press spacebar
  4. Bird should hit top — game over triggers
- **Expected Results**: Game over on both top and bottom boundaries

### Scenario 3: Score Accuracy
- **Description**: Verify score increments correctly
- **Setup**: Open `index.html` in browser
- **Test Steps**:
  1. Start game and pass through 3 pipe pairs
  2. Verify score displays "3"
  3. Hit a pipe to trigger game over
  4. Verify final score matches during-game score
- **Expected Results**: Score matches number of pipes passed

### Scenario 4: Error Resilience
- **Description**: Verify game handles errors gracefully (SECURITY-15)
- **Setup**: Open browser developer console (F12)
- **Test Steps**:
  1. Play game normally
  2. Check console for any unhandled errors
  3. Verify no stack traces or internal details exposed
- **Expected Results**: No errors in console during normal gameplay

## Automated Integration Verification

The unit test suite already validates module interactions through:
- `collision.test.js` — tests collision module with bird + pipe objects
- `pipes.test.js` — tests pipe state updates with bird position for scoring
- `score.test.js` — tests scoring across multiple pipe update cycles

These provide automated coverage of the key integration points between modules.
