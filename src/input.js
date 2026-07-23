/**
 * Input module — handles keyboard input for the game.
 *
 * Listens for spacebar press events and tracks input state.
 */

'use strict';

var Input = (function () {
    var flapPressed = false;
    var keydownHandler = null;

    /**
     * Initializes keyboard input listeners.
     * Attaches event listener to the document for spacebar detection.
     */
    function init() {
        keydownHandler = function (event) {
            if (event.code === 'Space' || event.keyCode === 32) {
                event.preventDefault();
                flapPressed = true;
            }
        };

        document.addEventListener('keydown', keydownHandler);
    }

    /**
     * Checks if flap was pressed and resets the flag.
     * Should be called once per frame in the game loop.
     *
     * @returns {boolean} True if flap was pressed since last check
     */
    function consumeFlap() {
        if (flapPressed) {
            flapPressed = false;
            return true;
        }
        return false;
    }

    /**
     * Resets input state. Used when restarting the game.
     */
    function reset() {
        flapPressed = false;
    }

    /**
     * Cleans up event listeners. Called on game destruction.
     */
    function destroy() {
        if (keydownHandler) {
            document.removeEventListener('keydown', keydownHandler);
            keydownHandler = null;
        }
        flapPressed = false;
    }

    // Public API
    return {
        init: init,
        consumeFlap: consumeFlap,
        reset: reset,
        destroy: destroy
    };
})();

// Export for testing (Node.js/CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Input;
}
