/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { fireEvent } = require('@testing-library/dom');

// Load the HTML file to be tested
const html = fs.readFileSync(path.resolve(__dirname, '../index_o.html'), 'utf8');

describe('ChatGPT 4o: Space-Themed 2048 Game Tests', () => {
    let gameScript;

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        gameScript = require('../index_o.html'); // Assume all game logic is in this file
        gameScript.initBoard(); // Initialize the board before each test
    });

    // Chat GPT 4o R1: The game must be implemented using HTML, CSS, and JavaScript in a single file.
    test('Chat GPT 4o R1: The game is implemented in a single index_o.html file with inline JS and CSS references.', () => {
        expect(document.querySelector('html')).not.toBeNull();
        expect(document.querySelector('script')).not.toBeNull(); // Checks that JS is inline
        expect(document.querySelector('style')).not.toBeNull();  // Checks that CSS is inline or linked
    });

    // Chat GPT 4o R2: The game must have a 6x6 grid layout for the game board.
    test('Chat GPT 4o R2: The game board has a 6x6 grid.', () => {
        const container = document.getElementById('game-container');
        expect(container.children.length).toBe(36); // 6x6 grid = 36 tiles
    });

    // Chat GPT 4o R3: The game must have a space-themed background implemented using CSS.
    test('Chat GPT 4o R3: The game has a space-themed background using CSS.', () => {
        const bodyStyles = getComputedStyle(document.body);
        expect(bodyStyles.backgroundImage).toContain('url'); // Checks if background image is applied
    });

    // Chat GPT 4o R4: The game must allow players to move tiles using arrow keys.
    test('Chat GPT 4o R4: The game responds to arrow key events for moving tiles.', () => {
        const moveSpy = jest.spyOn(gameScript, 'move'); // Spy on the move function
        fireEvent.keyDown(window, { key: 'ArrowUp' });
        fireEvent.keyDown(window, { key: 'ArrowDown' });
        fireEvent.keyDown(window, { key: 'ArrowLeft' });
        fireEvent.keyDown(window, { key: 'ArrowRight' });

        expect(moveSpy).toHaveBeenCalledTimes(4);
    });

    // Chat GPT 4o R5: The game must merge tiles with the same number when they collide.
    test('Chat GPT 4o R5: Merging tiles with the same value.', () => {
        gameScript.gameBoard = [
            [2, 2, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ];
        gameScript.move('left');
        expect(gameScript.gameBoard[0][0]).toBe(4); // Merged tile
        expect(gameScript.gameBoard[0][1]).toBe(0); // Empty cell after merge
    });

    // Chat GPT 4o R6: The game must generate a new tile with a value of either 2 or 4 after each move.
    test('Chat GPT 4o R6: A new tile is generated after each move.', () => {
        const emptyTilesBefore = gameScript.getEmptyTiles().length;
        gameScript.move('left');
        const emptyTilesAfter = gameScript.getEmptyTiles().length;
        expect(emptyTilesBefore - emptyTilesAfter).toBe(1); // One new tile is added
        const newTile = gameScript.getRandomTileValue();
        expect([2, 4]).toContain(newTile); // The new tile should be 2 or 4
    });

    // Chat GPT 4o R7: The game must end and display a "You Win!" message when a tile with the value 2048 is created.
    test('Chat GPT 4o R7: The game ends and shows "You Win!" when a 2048 tile is created.', () => {
        gameScript.gameBoard = [
            [2048, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ];
        gameScript.checkWin();
        expect(document.body.textContent).toContain('You Win!');
    });

    // Chat GPT 4o R8: The game must end and display a "Game Over" message when no more moves are possible.
    test('Chat GPT 4o R8: The game ends and shows "Game Over" when no more moves are possible.', () => {
        gameScript.gameBoard = [
            [2, 4, 2, 4, 2, 4],
            [4, 2, 4, 2, 4, 2],
            [2, 4, 2, 4, 2, 4],
            [4, 2, 4, 2, 4, 2],
            [2, 4, 2, 4, 2, 4],
            [4, 2, 4, 2, 4, 2],
        ]; // No possible moves
        gameScript.checkLose();
        expect(document.body.textContent).toContain('Game Over');
    });

    // Chat GPT 4o R9: The game must display the current score.
    test('Chat GPT 4o R9: The score updates correctly when tiles are merged.', () => {
        gameScript.gameBoard = [
            [2, 2, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ];
        gameScript.move('left');
        const scoreElement = document.getElementById('score');
        expect(scoreElement.textContent).toBe('4'); // The score should update after merge
    });

    // Chat GPT 4o R10: The game must have a "New Game" button to reset the game state.
    test('Chat GPT 4o R10: The "New Game" button resets the game board.', () => {
        gameScript.gameBoard = [
            [2, 2, 0, 0, 0, 0],
            [4, 4, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ];
        fireEvent.click(document.getElementById('new-game'));
        expect(gameScript.gameBoard.flat().filter(v => v !== 0).length).toBe(2); // After reset, only 2 initial tiles
    });

    // Chat GPT 4o R11: The game must start with two randomly placed tiles on the board.
    test('Chat GPT 4o R11: The game initializes with two random tiles.', () => {
        const nonEmptyTiles = gameScript.gameBoard.flat().filter(val => val !== 0);
        expect(nonEmptyTiles.length).toBe(2); // Two initial tiles at game start
        nonEmptyTiles.forEach(tile => {
            expect([2, 4]).toContain(tile); // Initial tiles should be either 2 or 4
        });
    });
});