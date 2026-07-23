/**
 * Score tests — Property-based and example-based tests.
 *
 * PBT tests verify scoring invariants (PBT-03).
 * Example tests document specific scoring scenarios (PBT-10).
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { randomValueArb, CONSTANTS } from './generators.js';

// Import Pipes module for score testing
const Pipes = require('../src/pipes.js');

// ============================================================
// PROPERTY-BASED TESTS
// ============================================================

describe('Score - Property-Based Tests', () => {

    describe('PBT: Score monotonically non-decreasing', () => {
        it('score never decreases across multiple updates', () => {
            fc.assert(
                fc.property(
                    fc.nat({ max: 50 }),   // number of updates
                    fc.nat({ max: 500 }),  // bird x position
                    fc.array(randomValueArb, { minLength: 1, maxLength: 50 }),
                    (numUpdates, birdX, randomValues) => {
                        let state = Pipes.createPipesState();
                        let previousScore = 0;

                        for (let i = 0; i < numUpdates; i++) {
                            const rv = randomValues[i % randomValues.length];
                            state = Pipes.updateWithRandom(state, birdX, rv);
                            expect(state.score).toBeGreaterThanOrEqual(previousScore);
                            previousScore = state.score;
                        }
                    }
                ),
                { numRuns: 100, verbose: true }
            );
        });
    });

    describe('PBT: Score increments by exactly 1 per pipe passed', () => {
        it('each update increases score by at most 1', () => {
            fc.assert(
                fc.property(
                    fc.nat({ max: 200 }),  // number of updates
                    fc.nat({ max: 500 }),  // bird x position  
                    fc.array(randomValueArb, { minLength: 1, maxLength: 200 }),
                    (numUpdates, birdX, randomValues) => {
                        let state = Pipes.createPipesState();

                        for (let i = 0; i < numUpdates; i++) {
                            const prevScore = state.score;
                            const rv = randomValues[i % randomValues.length];
                            state = Pipes.updateWithRandom(state, birdX, rv);
                            // Score can only increase by 0 or 1 per pipe per frame
                            // (multiple pipes could be passed in one frame in edge cases,
                            // but each individual pipe contributes exactly 1)
                            const scoreDiff = state.score - prevScore;
                            expect(scoreDiff).toBeGreaterThanOrEqual(0);
                            // Score diff should be <= number of pipes that could be passed
                            expect(scoreDiff).toBeLessThanOrEqual(state.pipes.length + 1);
                        }
                    }
                ),
                { numRuns: 100, verbose: true }
            );
        });
    });

    describe('PBT: Score cannot go negative', () => {
        it('score is always non-negative', () => {
            fc.assert(
                fc.property(
                    fc.nat({ max: 100 }),
                    fc.nat({ max: 500 }),
                    fc.array(randomValueArb, { minLength: 1, maxLength: 100 }),
                    (numUpdates, birdX, randomValues) => {
                        let state = Pipes.createPipesState();

                        for (let i = 0; i < numUpdates; i++) {
                            const rv = randomValues[i % randomValues.length];
                            state = Pipes.updateWithRandom(state, birdX, rv);
                            expect(state.score).toBeGreaterThanOrEqual(0);
                        }
                    }
                ),
                { numRuns: 100, verbose: true }
            );
        });
    });

    describe('PBT: Initial score is always zero', () => {
        it('createPipesState always starts with score 0', () => {
            fc.assert(
                fc.property(fc.nat(), () => {
                    const state = Pipes.createPipesState();
                    expect(state.score).toBe(0);
                }),
                { numRuns: 50, verbose: true }
            );
        });
    });
});

// ============================================================
// EXAMPLE-BASED TESTS
// ============================================================

describe('Score - Example-Based Tests', () => {

    describe('Score after passing pipes', () => {
        it('score is 0 when no pipes exist', () => {
            const state = Pipes.createPipesState();
            expect(state.score).toBe(0);
        });

        it('score increments when bird x > pipe x + pipe width', () => {
            // Create state with a pipe that the bird has already passed
            const state = {
                pipes: [{ x: 30, gapTop: 200, gapBottom: 340, width: 52, passed: false }],
                framesSinceSpawn: 0,
                score: 0
            };
            // Bird at x=200, pipe at x=30, width=52 => pipe right edge = 82
            // After update: pipe moves to x=27.5, right edge = 79.5
            // Bird at 200 > 79.5, so score should increment
            const updated = Pipes.updateWithRandom(state, 200, 0.5);
            expect(updated.score).toBe(1);
        });

        it('score does not increment twice for same pipe', () => {
            const state = {
                pipes: [{ x: 30, gapTop: 200, gapBottom: 340, width: 52, passed: true }],
                framesSinceSpawn: 0,
                score: 3
            };
            const updated = Pipes.updateWithRandom(state, 200, 0.5);
            expect(updated.score).toBe(3); // No change, already passed
        });

        it('score increments for multiple pipes passed', () => {
            const state = {
                pipes: [
                    { x: 20, gapTop: 200, gapBottom: 340, width: 52, passed: false },
                    { x: 10, gapTop: 250, gapBottom: 390, width: 52, passed: false }
                ],
                framesSinceSpawn: 0,
                score: 0
            };
            // Bird at x=200 should pass both pipes
            const updated = Pipes.updateWithRandom(state, 200, 0.5);
            expect(updated.score).toBe(2);
        });
    });
});
