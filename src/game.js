/**
 * Game module — main game loop, state management, and initialization.
 *
 * Coordinates all other modules (Bird, Pipes, Collision, Input, Renderer)
 * and manages game states (waiting, playing, game-over).
 *
 * Includes global error handler per SECURITY-15.
 */

'use strict';

var Game = (function () {
    // Game states
    var STATE_WAITING = 'waiting';
    var STATE_PLAYING = 'playing';
    var STATE_GAME_OVER = 'gameOver';

    // Game state
    var gameState = STATE_WAITING;
    var bird = null;
    var pipesState = null;
    var animationId = null;

    /**
     * Initializes the game — sets up canvas, input, and initial state.
     */
    function init() {
        try {
            var canvas = document.getElementById('gameCanvas');
            if (!canvas) {
                throw new Error('Game canvas element not found');
            }

            Renderer.init(canvas);
            Input.init();
            reset();
            gameLoop();
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Resets the game to initial state.
     */
    function reset() {
        bird = Bird.createBird();
        pipesState = Pipes.createPipesState();
        gameState = STATE_WAITING;
        Input.reset();
    }

    /**
     * Main game loop — called every frame via requestAnimationFrame.
     * Wrapped in try/catch for error safety (SECURITY-15).
     */
    function gameLoop() {
        try {
            update();
            render();
            animationId = requestAnimationFrame(gameLoop);
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Updates game state based on current state and input.
     */
    function update() {
        var flapPressed = Input.consumeFlap();

        switch (gameState) {
            case STATE_WAITING:
                if (flapPressed) {
                    gameState = STATE_PLAYING;
                    bird = Bird.flap(bird);
                }
                break;

            case STATE_PLAYING:
                // Apply bird physics
                if (flapPressed) {
                    bird = Bird.flap(bird);
                }
                bird = Bird.applyGravity(bird);

                // Update pipes
                pipesState = Pipes.update(pipesState, bird.x);

                // Check collisions
                if (Collision.checkCollision(bird, pipesState.pipes, 600)) {
                    gameState = STATE_GAME_OVER;
                }
                break;

            case STATE_GAME_OVER:
                if (flapPressed) {
                    reset();
                    gameState = STATE_PLAYING;
                    bird = Bird.flap(bird);
                }
                break;
        }
    }

    /**
     * Renders the current game frame.
     */
    function render() {
        var ctx = Renderer.getContext();

        Renderer.clear();
        Renderer.renderBackground();

        switch (gameState) {
            case STATE_WAITING:
                Bird.render(ctx, bird);
                Renderer.renderStartScreen();
                break;

            case STATE_PLAYING:
                Pipes.render(ctx, pipesState.pipes);
                Bird.render(ctx, bird);
                Renderer.renderScore(pipesState.score);
                break;

            case STATE_GAME_OVER:
                Pipes.render(ctx, pipesState.pipes);
                Bird.render(ctx, bird);
                Renderer.renderGameOver(pipesState.score);
                break;
        }
    }

    /**
     * Global error handler — logs errors safely without exposing
     * internal details to the user (SECURITY-15).
     *
     * @param {Error} error - The error that occurred
     */
    function handleError(error) {
        // Log error for debugging (console only, no user-facing details)
        if (typeof console !== 'undefined' && console.error) {
            console.error('[FlappyBird] An error occurred:', error.message);
        }

        // Cancel animation frame to prevent further errors
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        // Attempt to show generic error on canvas
        try {
            var ctx = Renderer.getContext();
            if (ctx) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, 400, 600);
                ctx.fillStyle = '#ffffff';
                ctx.font = '18px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('An error occurred.', 200, 290);
                ctx.fillText('Please refresh the page.', 200, 320);
            }
        } catch (renderError) {
            // Silently fail — nothing more we can do
        }
    }

    /**
     * Destroys the game — cleans up resources (SECURITY-15).
     */
    function destroy() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        Input.destroy();
    }

    // Public API
    return {
        init: init,
        reset: reset,
        destroy: destroy
    };
})();

// Start game when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    Game.init();
});
