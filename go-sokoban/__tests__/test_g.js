const fs = require('fs');
const path = require('path');

/**
 * @jest-environment jsdom
 */

describe('Nature Sokoban Game', () => {
    let htmlContent;
    let document;
    let window;

    beforeAll(() => {
        htmlContent = fs.readFileSync(path.resolve(__dirname, '../index_g.html'), 'utf-8');
        // document = window.document;
        document.body.innerHTML = htmlContent;
        window = document.defaultView;
    });

    // R1: The game must be implemented as a single HTML file containing HTML, CSS, and JavaScript.
    it('R1: Game is implemented in a single HTML file', () => {
        expect(htmlContent).toContain('<html>');
        expect(htmlContent).toContain('<head>');
        expect(htmlContent).toContain('<style>');
        expect(htmlContent).toContain('</style>');
        expect(htmlContent).toContain('<script>');
        expect(htmlContent).toContain('</script>');
    });

    // R2: The game must have a nature theme, using emojis to represent game elements.
    it('R2: Game uses nature-themed emojis', () => {
        expect(document.body.innerHTML).toContain('🚶🏻‍♀️'); // Player
        expect(document.body.innerHTML).toContain('🌳'); // Tree
        expect(document.body.innerHTML).toContain('🪨'); // Rock
        expect(document.body.innerHTML).toContain('🕳'); // Hole
    });

    // R3: The game must have at least 3 distinct levels.
    it('R3: Game has at least 3 levels', () => {
        const levels = window.levels;
        expect(levels.length).toBeGreaterThanOrEqual(3);
        expect(levels[0]).not.toEqual(levels[1]);
        expect(levels[1]).not.toEqual(levels[2]);
        expect(levels[0]).not.toEqual(levels[2]);
    });

    // Helper function to simulate key presses
    function simulateKeyPress(key) {
        const event = new window.KeyboardEvent('keydown', { key });
        document.dispatchEvent(event);
    }

    // R4: The game must allow the player to move using arrow keys or WASD keys.
    it('R4: Player can move using arrow keys', () => {
        let initialPlayerPosition = getPlayerPosition();
        simulateKeyPress('ArrowRight');
        let newPlayerPosition = getPlayerPosition();
        expect(newPlayerPosition).not.toEqual(initialPlayerPosition);
    });

    it('R4: Player can move using WASD keys', () => {
        let initialPlayerPosition = getPlayerPosition();
        simulateKeyPress('d');
        let newPlayerPosition = getPlayerPosition();
        expect(newPlayerPosition).not.toEqual(initialPlayerPosition);
    });

    // R5: The player must be able to push rocks.
    it('R5: Player can push rocks', () => {
        // Assuming level 1 has a pushable rock setup
        window.loadLevel();
        const initialRockPosition = getRockPositions()[0];
        simulateKeyPress('ArrowRight'); // Move player towards the rock
        simulateKeyPress('ArrowRight'); // Push the rock
        const newRockPosition = getRockPositions()[0];
        expect(newRockPosition).not.toEqual(initialRockPosition);
    });

    // R6: The player must not be able to move through trees.
    it('R6: Player cannot move through trees', () => {
        // Assuming level 1 has a tree blocking the player's path
        window.loadLevel();
        const initialPlayerPosition = getPlayerPosition();
        simulateKeyPress('ArrowUp'); // Attempt to move into a tree
        const newPlayerPosition = getPlayerPosition();
        expect(newPlayerPosition).toEqual(initialPlayerPosition);
    });

    // R7: The game must detect when all holes are covered by rocks.
    it('R7: Game detects when all holes are covered', () => {
        // Assuming level 1 can be solved in a few moves
        window.loadLevel();
        // Simulate moves to solve the level (replace with actual moves needed)
        simulateKeyPress('ArrowRight');
        simulateKeyPress('ArrowRight');
        // ... more moves to solve the level ...
        expect(window.checkWin()).toBe(true);
    });

    // R8: The game must display a victory message when a level is completed.
    it('R8: Game displays a victory message when a level is completed', () => {
        // Assuming level 1 can be solved in a few moves
        window.loadLevel();
        // Simulate moves to solve the level (replace with actual moves needed)
        simulateKeyPress('ArrowRight');
        simulateKeyPress('ArrowRight');
        // ... more moves to solve the level ...
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Level complete'));
    });

    // R9: The game must allow progression to the next level after completing the current level.
    it('R9: Game progresses to the next level after completing the current level', () => {
        window.loadLevel(); // Start at level 1
        // Simulate moves to solve the level (replace with actual moves needed)
        simulateKeyPress('ArrowRight');
        simulateKeyPress('ArrowRight');
        // ... more moves to solve the level ...
        expect(window.currentLevel).toBe(1); // Should now be level 2
    });

    // R10: The game must have a reset button to restart the current level.
    it('R10: Game has a reset button that restarts the current level', () => {
        const initialBoardState = getBoardState();
        simulateKeyPress('ArrowRight'); // Make a move
        document.querySelector('button').click(); // Click the reset button
        const resetBoardState = getBoardState();
        expect(resetBoardState).toEqual(initialBoardState);
    });

    // R11: The game must keep track of and display the number of moves made by the player.
    it('R11: Game tracks and displays the number of moves', () => {
        window.loadLevel();
        const initialMoves = getMoveCount();
        simulateKeyPress('ArrowRight'); // Make a move
        const newMoves = getMoveCount();
        expect(newMoves).toBe(initialMoves + 1);
    });

    // R12: The game must prevent invalid moves (e.g., pushing a rock into a tree).
    it('R12: Game prevents invalid moves', () => {
        // Assuming level 1 has a rock next to a tree
        window.loadLevel();
        const initialRockPosition = getRockPositions()[0];
        simulateKeyPress('ArrowUp'); // Move player towards the rock
        simulateKeyPress('ArrowUp'); // Attempt to push the rock into a tree
        const newRockPosition = getRockPositions()[0];
        expect(newRockPosition).toEqual(initialRockPosition); // Rock should not have moved
    });

    // R13: The game must display the current level number.
    it('R13: Game displays the current level number', () => {
        window.loadLevel();
        const levelNumElement = document.getElementById('levelNum');
        expect(levelNumElement.textContent).toBe('1');
    });

    // Helper functions to get game state
    function getPlayerPosition() {
        return window.player;
    }

    function getRockPositions() {
        return window.rocks;
    }

    function getBoardState() {
        return window.levels[window.currentLevel].board.map(row => row.split(''));
    }

    function getMoveCount() {
        // Replace with actual logic to get the move count from the DOM
        // Example: return parseInt(document.getElementById('moveCount').textContent, 10);
        return 0; // Replace with actual implementation
    }
});