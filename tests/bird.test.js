/**
 * Bird module tests — Property-based and example-based tests.
 *
 * PBT tests verify invariants across generated inputs (PBT-03).
 * Example tests document specific known scenarios (PBT-10).
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { birdStateArb, velocityArb, CONSTANTS } from './generators.js';

// Import Bird module (CommonJS compatible)
const Bird = require('../src/bird.js');

// ============================================================
// PROPERTY-BASED TESTS
// ============================================================

describe('Bird - Property-Based Tests', () => {

    describe('PBT: Gravity invariant', () => {
        it('velocity always increases (becomes more positive) after gravity without flap', () => {
            fc.assert(
                fc.property(birdStateArb, (bird) => {
                    const updated = Bird.applyGravity(bird);
                    // Velocity should increase by GRAVITY (or be clamped at MAX)
                    const expectedVelocity = Math.min(bird.velocity + Bird.GRAVITY, Bird.MAX_VELOCITY);
                    expect(updated.velocity).toBeCloseTo(expectedVelocity, 10);
                }),
                { numRuns: 200, verbose: true }
            );
        });

        it('y position always moves in direction of velocity after gravity', () => {
            fc.assert(
                fc.property(birdStateArb, (bird) => {
                    const updated = Bird.applyGravity(bird);
                    // New position = old position + new velocity
                    const expectedY = bird.y + updated.velocity;
                    expect(updated.y).toBeCloseTo(expectedY, 10);
                }),
                { numRuns: 200, verbose: true }
            );
        });
    });

    describe('PBT: Flap invariant', () => {
        it('velocity after flap is always the flap strength value', () => {
            fc.assert(
                fc.property(birdStateArb, (bird) => {
                    const flapped = Bird.flap(bird);
                    // Flap sets velocity to FLAP_STRENGTH (negative = upward)
                    expect(flapped.velocity).toBe(Bird.FLAP_STRENGTH);
                }),
                { numRuns: 200, verbose: true }
            );
        });

        it('flap does not change bird position (only velocity)', () => {
            fc.assert(
                fc.property(birdStateArb, (bird) => {
                    const flapped = Bird.flap(bird);
                    expect(flapped.x).toBe(bird.x);
                    expect(flapped.y).toBe(bird.y);
                    expect(flapped.width).toBe(bird.width);
                    expect(flapped.height).toBe(bird.height);
                }),
                { numRuns: 200, verbose: true }
            );
        });
    });

    describe('PBT: Velocity clamping', () => {
        it('velocity never exceeds MAX_VELOCITY after any operation', () => {
            fc.assert(
                fc.property(velocityArb, (velocity) => {
                    const clamped = Bird.clampVelocity(velocity);
                    expect(clamped).toBeLessThanOrEqual(Bird.MAX_VELOCITY);
                    expect(clamped).toBeGreaterThanOrEqual(Bird.MIN_VELOCITY);
                }),
                { numRuns: 500, verbose: true }
            );
        });

        it('clamping is idempotent: clamp(clamp(v)) === clamp(v)', () => {
            fc.assert(
                fc.property(velocityArb, (velocity) => {
                    const once = Bird.clampVelocity(velocity);
                    const twice = Bird.clampVelocity(once);
                    expect(twice).toBe(once);
                }),
                { numRuns: 200, verbose: true }
            );
        });
    });

    describe('PBT: Gravity preserves bird dimensions', () => {
        it('width and height never change after gravity', () => {
            fc.assert(
                fc.property(birdStateArb, (bird) => {
                    const updated = Bird.applyGravity(bird);
                    expect(updated.width).toBe(bird.width);
                    expect(updated.height).toBe(bird.height);
                }),
                { numRuns: 200, verbose: true }
            );
        });

        it('x position never changes (bird only moves vertically)', () => {
            fc.assert(
                fc.property(birdStateArb, (bird) => {
                    const updated = Bird.applyGravity(bird);
                    expect(updated.x).toBe(bird.x);
                }),
                { numRuns: 200, verbose: true }
            );
        });
    });
});

// ============================================================
// EXAMPLE-BASED TESTS
// ============================================================

describe('Bird - Example-Based Tests', () => {

    describe('createBird', () => {
        it('creates bird at starting position with zero velocity', () => {
            const bird = Bird.createBird();
            expect(bird.x).toBe(80);
            expect(bird.y).toBe(250);
            expect(bird.velocity).toBe(0);
            expect(bird.width).toBe(30);
            expect(bird.height).toBe(24);
        });
    });

    describe('applyGravity', () => {
        it('increases velocity by GRAVITY from rest', () => {
            const bird = { x: 80, y: 250, velocity: 0, width: 30, height: 24 };
            const updated = Bird.applyGravity(bird);
            expect(updated.velocity).toBe(0.5);
            expect(updated.y).toBe(250.5);
        });

        it('clamps velocity at MAX_VELOCITY', () => {
            const bird = { x: 80, y: 250, velocity: 9.8, width: 30, height: 24 };
            const updated = Bird.applyGravity(bird);
            expect(updated.velocity).toBe(10);
        });
    });

    describe('flap', () => {
        it('sets velocity to FLAP_STRENGTH regardless of current velocity', () => {
            const falling = { x: 80, y: 300, velocity: 5, width: 30, height: 24 };
            const flapped = Bird.flap(falling);
            expect(flapped.velocity).toBe(-8);
        });

        it('does not change y position immediately', () => {
            const bird = { x: 80, y: 300, velocity: 5, width: 30, height: 24 };
            const flapped = Bird.flap(bird);
            expect(flapped.y).toBe(300);
        });
    });

    describe('clampVelocity', () => {
        it('returns value unchanged when within bounds', () => {
            expect(Bird.clampVelocity(5)).toBe(5);
            expect(Bird.clampVelocity(-5)).toBe(-5);
            expect(Bird.clampVelocity(0)).toBe(0);
        });

        it('clamps to MAX_VELOCITY when exceeding upper bound', () => {
            expect(Bird.clampVelocity(15)).toBe(10);
            expect(Bird.clampVelocity(100)).toBe(10);
        });

        it('clamps to MIN_VELOCITY when exceeding lower bound', () => {
            expect(Bird.clampVelocity(-15)).toBe(-10);
            expect(Bird.clampVelocity(-100)).toBe(-10);
        });
    });
});
