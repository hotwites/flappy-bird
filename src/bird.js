/**
 * Bird module — handles bird entity state, physics, and rendering.
 *
 * The bird is affected by gravity (constant downward acceleration)
 * and can flap (upward velocity impulse). Velocity is clamped to
 * prevent unnatural movement.
 */

'use strict';

var Bird = (function () {
    // Physics constants
    var GRAVITY = 0.5;
    var FLAP_STRENGTH = -8;
    var MAX_VELOCITY = 10;
    var MIN_VELOCITY = -10;

    // Bird dimensions
    var WIDTH = 30;
    var HEIGHT = 24;

    // Initial position
    var START_X = 80;
    var START_Y = 250;

    /**
     * Creates a new bird state object.
     * @returns {object} Bird state with position, velocity, and dimensions
     */
    function createBird() {
        return {
            x: START_X,
            y: START_Y,
            velocity: 0,
            width: WIDTH,
            height: HEIGHT
        };
    }

    /**
     * Applies gravity to the bird and updates position.
     * Pure function — returns new state without mutating input.
     *
     * @param {object} bird - Current bird state
     * @returns {object} Updated bird state with gravity applied
     */
    function applyGravity(bird) {
        var newVelocity = bird.velocity + GRAVITY;
        newVelocity = clampVelocity(newVelocity);

        return {
            x: bird.x,
            y: bird.y + newVelocity,
            velocity: newVelocity,
            width: bird.width,
            height: bird.height
        };
    }

    /**
     * Applies flap impulse to the bird.
     * Pure function — returns new state without mutating input.
     *
     * @param {object} bird - Current bird state
     * @returns {object} Updated bird state with flap applied
     */
    function flap(bird) {
        var newVelocity = clampVelocity(FLAP_STRENGTH);

        return {
            x: bird.x,
            y: bird.y,
            velocity: newVelocity,
            width: bird.width,
            height: bird.height
        };
    }

    /**
     * Clamps velocity to prevent extreme speeds.
     *
     * @param {number} velocity - Raw velocity value
     * @returns {number} Clamped velocity within bounds
     */
    function clampVelocity(velocity) {
        if (velocity > MAX_VELOCITY) {
            return MAX_VELOCITY;
        }
        if (velocity < MIN_VELOCITY) {
            return MIN_VELOCITY;
        }
        return velocity;
    }

    /**
     * Renders the bird on the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {object} bird - Bird state to render
     */
    function render(ctx, bird) {
        // Bird body (yellow rectangle)
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

        // Bird eye (small white circle)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(bird.x + bird.width - 6, bird.y + 7, 4, 0, Math.PI * 2);
        ctx.fill();

        // Bird pupil (small black circle)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(bird.x + bird.width - 5, bird.y + 7, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Public API
    return {
        createBird: createBird,
        applyGravity: applyGravity,
        flap: flap,
        clampVelocity: clampVelocity,
        render: render,
        GRAVITY: GRAVITY,
        FLAP_STRENGTH: FLAP_STRENGTH,
        MAX_VELOCITY: MAX_VELOCITY,
        MIN_VELOCITY: MIN_VELOCITY,
        WIDTH: WIDTH,
        HEIGHT: HEIGHT
    };
})();

// Export for testing (Node.js/CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Bird;
}
