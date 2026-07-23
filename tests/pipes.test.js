/**
 * Pipes module tests — Property-based and example-based tests.
 *
 * PBT tests verify pipe generation and movement invariants (PBT-03).
 * Example tests document specific scenarios (PBT-10).
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { randomValueArb, pipesStateArb, CONSTANTS } from './generators.js';

// Import Pipes module (CommonJS compatible)
const Pipes = require('../src/pipes.js');

// ============================================================
// PROPERTY-BASED TESTS
// ============================================================

describe('Pipes - Property-Based Tests', () => {

    describe('PBT: Pipe generation gap invariant', () => {
        it('gap top is always within valid canvas bounds', () => {
            fc.assert(
                fc.property(randomValueArb, (randomValue) => {
                    const pipe = Pipes.generatePipePair(randomValue);
                    expect(pipe.gapTop).toBeGreaterThanOrEqual(Pipes.MIN_PIPE_HEIGHT);
                    expect(pipe.gapTop).toBeLessThanOrEqual(
                        Pipes.CANVAS_HEIGHT - Pipes.GAP_SIZE - Pipes.MIN_PIPE_HEIGHT
                    );
                }),
                { numRuns: 500, verbose: true }
            );
        });

        it('gap bottom is always gapTop + GAP_SIZE', () => {
            fc.assert(
                fc.property(randomValueArb, (randomValue) => {
                    const pipe = Pipes.generatePipePair(randomValue);
                    expect(pipe.gapBottom).toBeCloseTo(pipe.gapTop + Pipes.GAP_SIZE, 10);
                }),
                { numRuns: 500, verbose: true }
            );
        });

        it('gap bottom never exceeds canvas height minus MIN_PIPE_HEIGHT', () => {
            fc.assert(
                fc.property(randomValueArb, (randomValue) => {
                    const pipe = Pipes.generatePipePair(randomValue);
                    expect(pipe.gapBottom).toBeLessThanOrEqual(
                        Pipes.CANVAS_HEIGHT - Pipes.MIN_PIPE_HEIGHT
                    );
                }),
                { numRuns: 500, verbose: true }
            );
        });
    });

    describe('PBT: Pipe generation dimensional invariants', () => {
        it('pipe always starts at CANVAS_WIDTH (right edge)', () => {
            fc.assert(
                fc.property(randomValueArb, (randomValue) => {
                    const pipe = Pipes.generatePipePair(randomValue);
                    expect(pipe.x).toBe(Pipes.CANVAS_WIDTH);
                }),
                { numRuns: 200, verbose: true }
            );
        });

        it('pipe width is always PIPE_WIDTH', () => {
            fc.assert(
                fc.property(randomValueArb, (randomValue) => {
                    const pipe = Pipes.generatePipePair(randomValue);
                    expect(pipe.width).toBe(Pipes.PIPE_WIDTH);
                }),
                { numRuns: 200, verbose: true }
            );
        });

        it('newly generated pipe is never marked as passed', () => {
            fc.assert(
                fc.property(randomValueArb, (randomValue) => {
                    const pipe = Pipes.generatePipePair(randomValue);
                    expect(pipe.passed).toBe(false);
                }),
                { numRuns: 200, verbose: true }
            );
        });
    });

    describe('PBT: Pipe movement invariant', () => {
        it('all pipes move left by PIPE_SPEED each update', () => {
            fc.assert(
                fc.property(pipesStateArb, fc.nat({ max: 200 }), (state, birdX) => {
                    // Only test if we have pipes and won't spawn new ones
                    if (state.pipes.length === 0) return;
                    // Set framesSinceSpawn low to avoid new pipe spawn
                    const safeState = { ...state, framesSinceSpawn: 0 };
                    const updated = Pipes.updateWithRandom(safeState, birdX, 0.5);

                    // Each existing pipe should have moved left
                    for (let i = 0; i < safeState.pipes.length; i++) {
                        const oldPipe = safeState.pipes[i];
                        // Find corresponding pipe in updated (by matching gapTop)
                        const newPipe = updated.pipes.find(p =>
                            Math.abs(p.gapTop - oldPipe.gapTop) < 0.001 &&
                            Math.abs(p.x - (oldPipe.x - Pipes.PIPE_SPEED)) < 0.001
                        );
                        // Pipe should exist unless it scrolled off screen
                        if (oldPipe.x + oldPipe.width - Pipes.PIPE_SPEED >= 0) {
                            expect(newPipe).toBeDefined();
                        }
                    }
                }),
                { numRuns: 100, verbose: true }
            );
        });
    });

    describe('PBT: Score invariant', () => {
        it('score never decreases after update', () => {
            fc.assert(
                fc.property(pipesStateArb, fc.nat({ max: 500 }), (state, birdX) => {
                    const updated = Pipes.updateWithRandom(state, birdX, 0.5);
                    expect(updated.score).toBeGreaterThanOrEqual(state.score);
                }),
                { numRuns: 200, verbose: true }
            );
        });
    });

    describe('PBT: Pipe count after removal', () => {
        it('pipe count after update is <= pipe count before + 1 (at most one spawned)', () => {
            fc.assert(
                fc.property(pipesStateArb, fc.nat({ max: 500 }), (state, birdX) => {
                    const updated = Pipes.updateWithRandom(state, birdX, 0.5);
                    // At most one pipe can be added per frame
                    expect(updated.pipes.length).toBeLessThanOrEqual(state.pipes.length + 1);
                }),
                { numRuns: 200, verbose: true }
            );
        });
    });
});

// ============================================================
// EXAMPLE-BASED TESTS
// ============================================================

describe('Pipes - Example-Based Tests', () => {

    describe('createPipesState', () => {
        it('creates initial state with empty pipes and zero score', () => {
            const state = Pipes.createPipesState();
            expect(state.pipes).toEqual([]);
            expect(state.framesSinceSpawn).toBe(0);
            expect(state.score).toBe(0);
        });
    });

    describe('generatePipePair', () => {
        it('generates pipe at random=0 with gap at minimum position', () => {
            const pipe = Pipes.generatePipePair(0);
            expect(pipe.gapTop).toBe(Pipes.MIN_PIPE_HEIGHT);
            expect(pipe.gapBottom).toBe(Pipes.MIN_PIPE_HEIGHT + Pipes.GAP_SIZE);
        });

        it('generates pipe at random=1 with gap at maximum position', () => {
            const pipe = Pipes.generatePipePair(1);
            const maxGapTop = Pipes.CANVAS_HEIGHT - Pipes.GAP_SIZE - Pipes.MIN_PIPE_HEIGHT;
            expect(pipe.gapTop).toBeCloseTo(maxGapTop, 10);
        });

        it('generates pipe at random=0.5 with gap at middle position', () => {
            const pipe = Pipes.generatePipePair(0.5);
            const minGapTop = Pipes.MIN_PIPE_HEIGHT;
            const maxGapTop = Pipes.CANVAS_HEIGHT - Pipes.GAP_SIZE - Pipes.MIN_PIPE_HEIGHT;
            const expectedGapTop = minGapTop + 0.5 * (maxGapTop - minGapTop);
            expect(pipe.gapTop).toBeCloseTo(expectedGapTop, 10);
        });
    });

    describe('updateWithRandom', () => {
        it('spawns pipe when framesSinceSpawn reaches SPAWN_INTERVAL', () => {
            const state = {
                pipes: [],
                framesSinceSpawn: Pipes.SPAWN_INTERVAL - 1,
                score: 0
            };
            const updated = Pipes.updateWithRandom(state, 80, 0.5);
            expect(updated.pipes.length).toBe(1);
            expect(updated.framesSinceSpawn).toBe(0);
        });

        it('does not spawn pipe before SPAWN_INTERVAL', () => {
            const state = {
                pipes: [],
                framesSinceSpawn: 0,
                score: 0
            };
            const updated = Pipes.updateWithRandom(state, 80, 0.5);
            expect(updated.pipes.length).toBe(0);
            expect(updated.framesSinceSpawn).toBe(1);
        });

        it('increments score when bird passes pipe', () => {
            const state = {
                pipes: [{ x: 50, gapTop: 200, gapBottom: 340, width: 52, passed: false }],
                framesSinceSpawn: 0,
                score: 0
            };
            // Bird x > pipe.x + pipe.width means bird has passed
            const updated = Pipes.updateWithRandom(state, 200, 0.5);
            // After moving pipe left, check if bird passed
            const movedPipeX = 50 - Pipes.PIPE_SPEED;
            if (movedPipeX + 52 < 200) {
                expect(updated.score).toBe(1);
            }
        });

        it('removes pipes that scroll off screen', () => {
            const state = {
                pipes: [{ x: -52, gapTop: 200, gapBottom: 340, width: 52, passed: true }],
                framesSinceSpawn: 0,
                score: 5
            };
            const updated = Pipes.updateWithRandom(state, 80, 0.5);
            // Pipe at x=-52 moved to x=-54.5, which means x+width = -2.5 < 0
            expect(updated.pipes.length).toBe(0);
        });
    });
});
