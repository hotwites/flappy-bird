/**
 * Collision module tests — Property-based and example-based tests.
 *
 * PBT tests verify collision detection invariants (PBT-03).
 * Example tests document specific edge cases (PBT-10).
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
    birdStateArb,
    pipePairArb,
    birdInGapArb,
    birdCollidingArb,
    CONSTANTS
} from './generators.js';

// Import Collision module (CommonJS compatible)
const Collision = require('../src/collision.js');

// ============================================================
// PROPERTY-BASED TESTS
// ============================================================

describe('Collision - Property-Based Tests', () => {

    describe('PBT: No collision when bird is within gap', () => {
        it('bird positioned inside pipe gap never collides with that pipe', () => {
            fc.assert(
                fc.property(birdInGapArb, ({ bird, pipe }) => {
                    const collision = Collision.checkPipeCollision(bird, pipe);
                    expect(collision).toBe(false);
                }),
                { numRuns: 500, verbose: true }
            );
        });
    });

    describe('PBT: Collision when bird overlaps pipe', () => {
        it('bird positioned outside gap always collides', () => {
            fc.assert(
                fc.property(birdCollidingArb, ({ bird, pipe }) => {
                    const collision = Collision.checkPipeCollision(bird, pipe);
                    expect(collision).toBe(true);
                }),
                { numRuns: 500, verbose: true }
            );
        });
    });

    describe('PBT: Boundary collision invariant', () => {
        it('bird with y < 0 always triggers boundary collision', () => {
            fc.assert(
                fc.property(
                    fc.double({ min: -500, max: -0.01, noNaN: true }),
                    (y) => {
                        const bird = { x: 80, y: y, width: 30, height: 24 };
                        expect(Collision.checkBoundaryCollision(bird, CONSTANTS.CANVAS_HEIGHT)).toBe(true);
                    }
                ),
                { numRuns: 200, verbose: true }
            );
        });

        it('bird with y + height > canvasHeight always triggers boundary collision', () => {
            fc.assert(
                fc.property(
                    fc.double({ min: CONSTANTS.CANVAS_HEIGHT - CONSTANTS.BIRD_HEIGHT + 0.01, max: CONSTANTS.CANVAS_HEIGHT + 500, noNaN: true }),
                    (y) => {
                        const bird = { x: 80, y: y, width: 30, height: 24 };
                        expect(Collision.checkBoundaryCollision(bird, CONSTANTS.CANVAS_HEIGHT)).toBe(true);
                    }
                ),
                { numRuns: 200, verbose: true }
            );
        });

        it('bird within bounds never triggers boundary collision', () => {
            fc.assert(
                fc.property(
                    fc.double({ min: 0, max: CONSTANTS.CANVAS_HEIGHT - CONSTANTS.BIRD_HEIGHT, noNaN: true }),
                    (y) => {
                        const bird = { x: 80, y: y, width: 30, height: 24 };
                        expect(Collision.checkBoundaryCollision(bird, CONSTANTS.CANVAS_HEIGHT)).toBe(false);
                    }
                ),
                { numRuns: 200, verbose: true }
            );
        });
    });

    describe('PBT: No collision when bird is horizontally distant from pipe', () => {
        it('bird far from pipe x-range never collides regardless of y', () => {
            fc.assert(
                fc.property(
                    pipePairArb,
                    fc.double({ min: -100, max: CONSTANTS.CANVAS_HEIGHT + 100, noNaN: true }),
                    (pipe, birdY) => {
                        // Place bird far to the left of pipe
                        const bird = {
                            x: pipe.x - CONSTANTS.BIRD_WIDTH - 10,
                            y: birdY,
                            width: CONSTANTS.BIRD_WIDTH,
                            height: CONSTANTS.BIRD_HEIGHT
                        };
                        expect(Collision.checkPipeCollision(bird, pipe)).toBe(false);
                    }
                ),
                { numRuns: 200, verbose: true }
            );
        });
    });

    describe('PBT: checkAnyPipeCollision consistency', () => {
        it('returns true if and only if at least one individual pipe collision is true', () => {
            fc.assert(
                fc.property(
                    birdStateArb,
                    fc.array(pipePairArb, { minLength: 0, maxLength: 5 }),
                    (bird, pipes) => {
                        const anyCollision = Collision.checkAnyPipeCollision(bird, pipes);
                        const manualCheck = pipes.some(pipe => Collision.checkPipeCollision(bird, pipe));
                        expect(anyCollision).toBe(manualCheck);
                    }
                ),
                { numRuns: 200, verbose: true }
            );
        });
    });
});

// ============================================================
// EXAMPLE-BASED TESTS
// ============================================================

describe('Collision - Example-Based Tests', () => {

    describe('checkPipeCollision', () => {
        const pipe = { x: 200, gapTop: 200, gapBottom: 340, width: 52 };

        it('returns false when bird is in the gap', () => {
            const bird = { x: 210, y: 250, width: 30, height: 24 };
            expect(Collision.checkPipeCollision(bird, pipe)).toBe(false);
        });

        it('returns true when bird hits top pipe', () => {
            const bird = { x: 210, y: 100, width: 30, height: 24 };
            expect(Collision.checkPipeCollision(bird, pipe)).toBe(true);
        });

        it('returns true when bird hits bottom pipe', () => {
            const bird = { x: 210, y: 350, width: 30, height: 24 };
            expect(Collision.checkPipeCollision(bird, pipe)).toBe(true);
        });

        it('returns false when bird is to the left of pipe', () => {
            const bird = { x: 100, y: 100, width: 30, height: 24 };
            expect(Collision.checkPipeCollision(bird, pipe)).toBe(false);
        });

        it('returns false when bird is to the right of pipe', () => {
            const bird = { x: 300, y: 100, width: 30, height: 24 };
            expect(Collision.checkPipeCollision(bird, pipe)).toBe(false);
        });

        it('returns true when bird exactly touches top of gap', () => {
            // Bird top edge at gapTop - 1 pixel (partially in top pipe)
            const bird = { x: 210, y: 190, width: 30, height: 24 };
            // y=190, y+height=214, gapTop=200 => bird.y < gapTop, so not fully in gap
            expect(Collision.checkPipeCollision(bird, pipe)).toBe(true);
        });
    });

    describe('checkBoundaryCollision', () => {
        it('returns true when bird goes above canvas', () => {
            const bird = { x: 80, y: -1, width: 30, height: 24 };
            expect(Collision.checkBoundaryCollision(bird, 600)).toBe(true);
        });

        it('returns true when bird goes below canvas', () => {
            const bird = { x: 80, y: 580, width: 30, height: 24 };
            expect(Collision.checkBoundaryCollision(bird, 600)).toBe(true);
        });

        it('returns false when bird is at top edge', () => {
            const bird = { x: 80, y: 0, width: 30, height: 24 };
            expect(Collision.checkBoundaryCollision(bird, 600)).toBe(false);
        });

        it('returns false when bird is at bottom edge', () => {
            const bird = { x: 80, y: 576, width: 30, height: 24 };
            expect(Collision.checkBoundaryCollision(bird, 600)).toBe(false);
        });
    });

    describe('checkCollision', () => {
        it('returns true when boundary collision occurs even with no pipes', () => {
            const bird = { x: 80, y: -5, width: 30, height: 24 };
            expect(Collision.checkCollision(bird, [], 600)).toBe(true);
        });

        it('returns false when no collision at all', () => {
            const bird = { x: 80, y: 300, width: 30, height: 24 };
            const pipes = [{ x: 300, gapTop: 200, gapBottom: 340, width: 52 }];
            expect(Collision.checkCollision(bird, pipes, 600)).toBe(false);
        });
    });
});
