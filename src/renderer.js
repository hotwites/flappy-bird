/**
 * Renderer module — canvas drawing utilities for the game.
 *
 * Handles background rendering, score display, and game over screen.
 */

'use strict';

var Renderer = (function () {
    var canvas = null;
    var ctx = null;

    /**
     * Initializes the renderer with a canvas element.
     *
     * @param {HTMLCanvasElement} canvasElement - The game canvas
     * @returns {CanvasRenderingContext2D} The 2D rendering context
     */
    function init(canvasElement) {
        canvas = canvasElement;
        ctx = canvas.getContext('2d');
        return ctx;
    }

    /**
     * Clears the entire canvas.
     */
    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * Renders the sky background with a gradient.
     */
    function renderBackground() {
        // Sky gradient
        var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.7, '#98D8E8');
        gradient.addColorStop(1, '#90EE90');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ground
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, canvas.height - 24, canvas.width, 4);
    }

    /**
     * Renders the current score on the canvas.
     *
     * @param {number} score - Current game score
     */
    function renderScore(score) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';

        var text = String(score);
        ctx.strokeText(text, canvas.width / 2, 50);
        ctx.fillText(text, canvas.width / 2, 50);
    }

    /**
     * Renders the game over screen with final score.
     *
     * @param {number} score - Final score to display
     */
    function renderGameOver(score) {
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Game Over text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40);

        // Score
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 10);

        // Restart instruction
        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#cccccc';
        ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 60);
    }

    /**
     * Renders the start screen with instructions.
     */
    function renderStartScreen() {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Flappy Bird', canvas.width / 2, canvas.height / 2 - 40);

        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#333333';
        ctx.fillText('Press SPACE to start', canvas.width / 2, canvas.height / 2 + 20);
    }

    /**
     * Returns the canvas context for direct rendering by other modules.
     *
     * @returns {CanvasRenderingContext2D} The 2D rendering context
     */
    function getContext() {
        return ctx;
    }

    /**
     * Returns the canvas element.
     *
     * @returns {HTMLCanvasElement} The canvas element
     */
    function getCanvas() {
        return canvas;
    }

    // Public API
    return {
        init: init,
        clear: clear,
        renderBackground: renderBackground,
        renderScore: renderScore,
        renderGameOver: renderGameOver,
        renderStartScreen: renderStartScreen,
        getContext: getContext,
        getCanvas: getCanvas
    };
})();

// Export for testing (Node.js/CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Renderer;
}
