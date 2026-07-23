/**
 * Pipes module — handles pipe obstacle generation, movement, and rendering.
 *
 * Pipes scroll from right to left at a constant speed. They appear as
 * top/bottom pairs with a gap for the bird to pass through.
 */

'use strict';

var Pipes = (function () {
    // Pipe constants
    var PIPE_WIDTH = 52;
    var GAP_SIZE = 140;
    var PIPE_SPEED = 2.5;
    var SPAWN_INTERVAL = 100; // frames between pipe spawns
    var MIN_PIPE_HEIGHT = 50;

    // Canvas reference dimensions
    var CANVAS_WIDTH = 400;
    var CANVAS_HEIGHT = 600;

    /**
     * Creates initial pipes state.
     * @returns {object} Pipes state with pipe array and spawn counter
     */
    function createPipesState() {
        return {
            pipes: [],
            framesSinceSpawn: 0,
            score: 0
        };
    }

    /**
     * Generates a new pipe pair with random gap position.
     * Pure function — uses provided random value for testability.
     *
     * @param {number} randomValue - Random value between 0 and 1
     * @returns {object} New pipe pair with top/bottom heights and x position
     */
    function generatePipePair(randomValue) {
        // Calculate valid range for gap top position
        var maxGapTop = CANVAS_HEIGHT - GAP_SIZE - MIN_PIPE_HEIGHT;
        var minGapTop = MIN_PIPE_HEIGHT;
        var gapTop = minGapTop + randomValue * (maxGapTop - minGapTop);

        return {
            x: CANVAS_WIDTH,
            gapTop: gapTop,
            gapBottom: gapTop + GAP_SIZE,
            width: PIPE_WIDTH,
            passed: false
        };
    }

    /**
     * Updates pipes state: moves pipes, spawns new ones, removes off-screen pipes.
     * Pure function — returns new state without mutating input.
     *
     * @param {object} state - Current pipes state
     * @param {number} birdX - Bird's x position for score calculation
     * @returns {object} Updated pipes state
     */
    function update(state, birdX) {
        var newFramesSinceSpawn = state.framesSinceSpawn + 1;
        var newPipes = [];
        var newScore = state.score;

        // Move existing pipes and check for scoring
        for (var i = 0; i < state.pipes.length; i++) {
            var pipe = state.pipes[i];
            var movedPipe = {
                x: pipe.x - PIPE_SPEED,
                gapTop: pipe.gapTop,
                gapBottom: pipe.gapBottom,
                width: pipe.width,
                passed: pipe.passed
            };

            // Remove pipes that have scrolled off screen
            if (movedPipe.x + movedPipe.width < 0) {
                continue;
            }

            // Check if bird passed this pipe (score increment)
            if (!movedPipe.passed && movedPipe.x + movedPipe.width < birdX) {
                movedPipe.passed = true;
                newScore = newScore + 1;
            }

            newPipes.push(movedPipe);
        }

        // Spawn new pipe if interval reached
        if (newFramesSinceSpawn >= SPAWN_INTERVAL) {
            var newPipe = generatePipePair(Math.random());
            newPipes.push(newPipe);
            newFramesSinceSpawn = 0;
        }

        return {
            pipes: newPipes,
            framesSinceSpawn: newFramesSinceSpawn,
            score: newScore
        };
    }

    /**
     * Updates pipes state with a provided random value (for testing).
     * Pure function — returns new state without mutating input.
     *
     * @param {object} state - Current pipes state
     * @param {number} birdX - Bird's x position for score calculation
     * @param {number} randomValue - Random value for pipe generation (0-1)
     * @returns {object} Updated pipes state
     */
    function updateWithRandom(state, birdX, randomValue) {
        var newFramesSinceSpawn = state.framesSinceSpawn + 1;
        var newPipes = [];
        var newScore = state.score;

        // Move existing pipes and check for scoring
        for (var i = 0; i < state.pipes.length; i++) {
            var pipe = state.pipes[i];
            var movedPipe = {
                x: pipe.x - PIPE_SPEED,
                gapTop: pipe.gapTop,
                gapBottom: pipe.gapBottom,
                width: pipe.width,
                passed: pipe.passed
            };

            // Remove pipes that have scrolled off screen
            if (movedPipe.x + movedPipe.width < 0) {
                continue;
            }

            // Check if bird passed this pipe (score increment)
            if (!movedPipe.passed && movedPipe.x + movedPipe.width < birdX) {
                movedPipe.passed = true;
                newScore = newScore + 1;
            }

            newPipes.push(movedPipe);
        }

        // Spawn new pipe if interval reached
        if (newFramesSinceSpawn >= SPAWN_INTERVAL) {
            var newPipe = generatePipePair(randomValue);
            newPipes.push(newPipe);
            newFramesSinceSpawn = 0;
        }

        return {
            pipes: newPipes,
            framesSinceSpawn: newFramesSinceSpawn,
            score: newScore
        };
    }

    /**
     * Renders all pipes on the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Array} pipes - Array of pipe objects to render
     */
    function render(ctx, pipes) {
        ctx.fillStyle = '#2ecc71';

        for (var i = 0; i < pipes.length; i++) {
            var pipe = pipes[i];

            // Top pipe
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.gapTop);

            // Bottom pipe
            ctx.fillRect(pipe.x, pipe.gapBottom, pipe.width, CANVAS_HEIGHT - pipe.gapBottom);

            // Pipe caps (darker green)
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(pipe.x - 3, pipe.gapTop - 20, pipe.width + 6, 20);
            ctx.fillRect(pipe.x - 3, pipe.gapBottom, pipe.width + 6, 20);
            ctx.fillStyle = '#2ecc71';
        }
    }

    // Public API
    return {
        createPipesState: createPipesState,
        generatePipePair: generatePipePair,
        update: update,
        updateWithRandom: updateWithRandom,
        render: render,
        PIPE_WIDTH: PIPE_WIDTH,
        GAP_SIZE: GAP_SIZE,
        PIPE_SPEED: PIPE_SPEED,
        SPAWN_INTERVAL: SPAWN_INTERVAL,
        MIN_PIPE_HEIGHT: MIN_PIPE_HEIGHT,
        CANVAS_WIDTH: CANVAS_WIDTH,
        CANVAS_HEIGHT: CANVAS_HEIGHT
    };
})();

// Export for testing (Node.js/CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Pipes;
}
