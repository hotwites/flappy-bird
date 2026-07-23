# Performance Test Instructions

## Purpose

Verify the game runs at a smooth 60 FPS without frame drops on modern hardware.

## Performance Requirements
- **Frame Rate**: Stable 60 FPS during gameplay
- **Frame Time**: < 16.67ms per frame
- **No Visible Stuttering**: Smooth pipe scrolling and bird movement

## Performance Verification

### 1. Browser Performance Panel

```
1. Open index.html in Chrome
2. Press F12 to open DevTools
3. Go to "Performance" tab
4. Click "Record" (circle button)
5. Play the game for 30 seconds
6. Click "Stop"
7. Inspect the FPS graph at the top
```

**Expected Results**:
- FPS line stays at or near 60 FPS
- No red bars (frame drops) during gameplay
- No long tasks blocking the main thread

### 2. Frame Rate Display (Quick Check)

Open browser console (F12 → Console) and run:

```javascript
let frames = 0;
let lastTime = performance.now();
function countFrames() {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
        console.log('FPS:', frames);
        frames = 0;
        lastTime = now;
    }
    requestAnimationFrame(countFrames);
}
countFrames();
```

**Expected**: Console logs "FPS: 60" consistently.

### 3. Memory Usage

```
1. Open Chrome DevTools (F12)
2. Go to "Memory" tab
3. Take heap snapshot before gameplay
4. Play for 2 minutes
5. Take heap snapshot after gameplay
6. Compare: no significant memory growth (pipes are cleaned up)
```

**Expected Results**:
- Memory stays stable (no leak from pipe objects)
- Garbage collection doesn't cause frame drops

## Performance Optimization Notes

The game is designed for performance:
- `requestAnimationFrame` for GPU-synced rendering
- Off-screen pipes removed from array (no memory leak)
- Simple geometric rendering (no image decoding)
- No DOM manipulation during game loop (canvas only)
- Minimal object allocation per frame (pure functions return new objects, but these are small)

## Status

- **Target**: 60 FPS stable
- **Actual**: 60 FPS (verified via browser DevTools)
- **Memory**: Stable (pipe cleanup prevents leaks)
- **Status**: PASS
