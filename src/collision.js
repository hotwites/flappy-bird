/**
 * Collision module — pure functions for detecting collisions.
 *
 * Handles bird-to-pipe and bird-to-boundary collision detection
 * using rectangle overlap (AABB) checks.
 */

'use strict';

var Collision = (function () {
    var CANVAS_HEIGHT = 600;

    /**
     * Checks if the bird collides with a single pipe pair.
     * Uses AABB (Axis-Aligned Bounding Box) rectangle overlap detection.
     * Pure function — no side effects.
     *
     * @param {object} bird - Bird state {x, y, width, height}
     * @param {object} pipe - Pipe state {x, gapTop, gapBottom, width}
     * @returns {boolean} True if collision detected
     */
    function checkPipeCollision(bird, pipe) {
        // Check if bird is horizontally aligned with pipe
        var horizontalOverlap = bird.x < pipe.x + pipe.width &&
                                bird.x + bird.width > pipe.x;

        if (!horizontalOverlap) {
            return false;
        }

        // Check if bird is within the safe gap
        var inGap = bird.y >= pipe.gapTop && bird.y + bird.height <= pipe.gapBottom;

        // Collision if horizontally aligned but NOT in the gap
        return !inGap;
    }

    /**
     * Checks if the bird collides with canvas boundaries.
     * Pure function — no side effects.
     *
     * @param {object} bird - Bird state {x, y, width, height}
     * @param {number} canvasHeight - Height of the game canvas
     * @returns {boolean} True if bird is out of bounds
     */
    function checkBoundaryCollision(bird, canvasHeight) {
        var height = canvasHeight !== undefined ? canvasHeight : CANVAS_HEIGHT;
        return bird.y < 0 || bird.y + bird.height > height;
    }

    /**
     * Checks if the bird collides with any pipe in the array.
     * Pure function — no side effects.
     *
     * @param {object} bird - Bird state {x, y, width, height}
     * @param {Array} pipes - Array of pipe objects
     * @returns {boolean} True if any collision detected
     */
    function checkAnyPipeCollision(bird, pipes) {
        for (var i = 0; i < pipes.length; i++) {
            if (checkPipeCollision(bird, pipes[i])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks all collisions (pipes + boundaries).
     * Pure function — no side effects.
     *
     * @param {object} bird - Bird state
     * @param {Array} pipes - Array of pipe objects
     * @param {number} canvasHeight - Canvas height
     * @returns {boolean} True if any collision detected
     */
    function checkCollision(bird, pipes, canvasHeight) {
        if (checkBoundaryCollision(bird, canvasHeight)) {
            return true;
        }
        return checkAnyPipeCollision(bird, pipes);
    }

    // Public API
    return {
        checkPipeCollision: checkPipeCollision,
        checkBoundaryCollision: checkBoundaryCollision,
        checkAnyPipeCollision: checkAnyPipeCollision,
        checkCollision: checkCollision
    };
})();

// Export for testing (Node.js/CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Collision;
}
