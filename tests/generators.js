/**
 * Reusable PBT domain generators for Flappy Bird tests.
 *
 * Custom generators produce realistic, structured inputs that respect
 * game domain constraints (PBT-07).
 */

import fc from 'fast-check';

// Canvas dimensions (must match game constants)
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;

// Bird constants (must match Bird module)
const BIRD_WIDTH = 30;
const BIRD_HEIGHT = 24;
const MAX_VELOCITY = 10;
const MIN_VELOCITY = -10;

// Pipe constants (must match Pipes module)
const PIPE_WIDTH = 52;
const GAP_SIZE = 140;
const MIN_PIPE_HEIGHT = 50;

/**
 * Generates a valid bird state within canvas bounds.
 */
export const birdStateArb = fc.record({
    x: fc.constant(80), // Bird x is fixed in game
    y: fc.double({ min: 0, max: CANVAS_HEIGHT - BIRD_HEIGHT, noNaN: true }),
    velocity: fc.double({ min: MIN_VELOCITY, max: MAX_VELOCITY, noNaN: true }),
    width: fc.constant(BIRD_WIDTH),
    height: fc.constant(BIRD_HEIGHT)
});

/**
 * Generates a bird state that can be anywhere (including out of bounds)
 * for boundary testing.
 */
export const birdStateUnconstrainedArb = fc.record({
    x: fc.double({ min: -50, max: CANVAS_WIDTH + 50, noNaN: true }),
    y: fc.double({ min: -100, max: CANVAS_HEIGHT + 100, noNaN: true }),
    velocity: fc.double({ min: -20, max: 20, noNaN: true }),
    width: fc.constant(BIRD_WIDTH),
    height: fc.constant(BIRD_HEIGHT)
});

/**
 * Generates a valid pipe pair within canvas constraints.
 */
export const pipePairArb = fc.record({
    x: fc.double({ min: -PIPE_WIDTH, max: CANVAS_WIDTH + 50, noNaN: true }),
    gapTop: fc.double({ min: MIN_PIPE_HEIGHT, max: CANVAS_HEIGHT - GAP_SIZE - MIN_PIPE_HEIGHT, noNaN: true }),
    width: fc.constant(PIPE_WIDTH),
    passed: fc.boolean()
}).map(p => ({
    ...p,
    gapBottom: p.gapTop + GAP_SIZE
}));

/**
 * Generates a valid random value for pipe generation (0 to 1).
 */
export const randomValueArb = fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true });

/**
 * Generates a valid pipes state.
 */
export const pipesStateArb = fc.record({
    pipes: fc.array(pipePairArb, { minLength: 0, maxLength: 8 }),
    framesSinceSpawn: fc.integer({ min: 0, max: 100 }),
    score: fc.nat({ max: 1000 })
});

/**
 * Generates a velocity value within valid bounds.
 */
export const velocityArb = fc.double({ min: MIN_VELOCITY * 2, max: MAX_VELOCITY * 2, noNaN: true });

/**
 * Generates a bird positioned safely within a pipe gap (no collision).
 */
export const birdInGapArb = pipePairArb.chain(pipe =>
    fc.record({
        x: fc.double({ min: pipe.x - BIRD_WIDTH + 1, max: pipe.x + pipe.width - 1, noNaN: true }),
        y: fc.double({ min: pipe.gapTop + 1, max: pipe.gapBottom - BIRD_HEIGHT - 1, noNaN: true }),
        velocity: fc.double({ min: MIN_VELOCITY, max: MAX_VELOCITY, noNaN: true }),
        width: fc.constant(BIRD_WIDTH),
        height: fc.constant(BIRD_HEIGHT)
    }).map(bird => ({ bird, pipe }))
);

/**
 * Generates a bird positioned to collide with a pipe (overlapping top or bottom pipe).
 */
export const birdCollidingArb = pipePairArb.chain(pipe =>
    fc.oneof(
        // Bird above gap (hitting top pipe)
        fc.record({
            x: fc.double({ min: pipe.x - BIRD_WIDTH + 1, max: pipe.x + pipe.width - 1, noNaN: true }),
            y: fc.double({ min: 0, max: pipe.gapTop - BIRD_HEIGHT, noNaN: true }),
            velocity: fc.double({ min: MIN_VELOCITY, max: MAX_VELOCITY, noNaN: true }),
            width: fc.constant(BIRD_WIDTH),
            height: fc.constant(BIRD_HEIGHT)
        }),
        // Bird below gap (hitting bottom pipe)
        fc.record({
            x: fc.double({ min: pipe.x - BIRD_WIDTH + 1, max: pipe.x + pipe.width - 1, noNaN: true }),
            y: fc.double({ min: pipe.gapBottom, max: CANVAS_HEIGHT - BIRD_HEIGHT, noNaN: true }),
            velocity: fc.double({ min: MIN_VELOCITY, max: MAX_VELOCITY, noNaN: true }),
            width: fc.constant(BIRD_WIDTH),
            height: fc.constant(BIRD_HEIGHT)
        })
    ).map(bird => ({ bird, pipe }))
);

// Export constants for test assertions
export const CONSTANTS = {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    BIRD_WIDTH,
    BIRD_HEIGHT,
    MAX_VELOCITY,
    MIN_VELOCITY,
    PIPE_WIDTH,
    GAP_SIZE,
    MIN_PIPE_HEIGHT
};
