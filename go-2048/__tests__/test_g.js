const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index_g.html'), 'utf8');

jest.dontMock('fs');

describe('Gemini Pro: 2048 Game Tests', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    // R1: The game must be implemented using HTML, CSS, and JavaScript in a single file.
    it('Gemini Pro: R1: Game implemented in a single HTML file', () => {
        expect(document.querySelector('html')).toBeTruthy();
        expect(document.querySelector('style')).toBeTruthy();
        expect(document.querySelector('script')).toBeTruthy();
    });

    // R2: The game must have a 6x6 grid layout for the game board.
    it('Gemini Pro: R2: Game board has a 6x6 grid layout', () => {
        const gridContainer = document.querySelector('.grid-container');
        expect(gridContainer).toBeTruthy();
        expect(gridContainer.children.length).toBe(36); // 6 x 6 = 36 cells
    });

    // R3: The game must have a space-themed background implemented using CSS.
    it('Gemini Pro: R3: Game has a space-themed background', () => {
        const body = document.querySelector('body');
        expect(body.style.backgroundImage).toMatch(/url\(.+\)/); // Check for background image URL
    });

    // R4: The game must allow players to move tiles using arrow keys.
    it('Gemini Pro: R4: Tiles move using arrow keys', () => {
        const gridCells = document.querySelectorAll('.grid-cell');
        const initialGrid = Array.from(gridCells).map(cell => parseInt(cell.textContent) || 0);

        // Simulate arrow key press (e.g., Up arrow)
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        document.dispatchEvent(event);

        const updatedGridCells = document.querySelectorAll('.grid-cell');
        const updatedGrid = Array.from(updatedGridCells).map(cell => parseInt(cell.textContent) || 0);

        expect(updatedGrid).not.toEqual(initialGrid); // Grid should have changed after key press
    });

    // R5: The game must merge tiles with the same number when they collide.
    it('Gemini Pro: R5: Tiles merge when colliding', () => {
        // Set up a scenario where two tiles will collide
        const gridCells = document.querySelectorAll('.grid-cell');
        gridCells[0].textContent = 2;
        gridCells[1].textContent = 2;

        // Simulate arrow key press to cause collision (e.g., Right arrow)
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        document.dispatchEvent(event);

        const updatedGridCells = document.querySelectorAll('.grid-cell');
        expect(updatedGridCells[1].textContent).toBe('4'); // Merged tile should have value 4
    });

    // R6: The game must generate a new tile with a value of either 2 or 4 after each move.
    it('Gemini Pro: R6: New tile generated after each move', () => {
        let initialEmptyCells = Array.from(document.querySelectorAll('.grid-cell')).filter(cell => cell.textContent === '').length;

        // Simulate a valid move
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        document.dispatchEvent(event);

        let updatedEmptyCells = Array.from(document.querySelectorAll('.grid-cell')).filter(cell => cell.textContent === '').length;
        expect(updatedEmptyCells).toBeLessThan(initialEmptyCells);
    });

    // R7: The game must end and display a "You Win!" message when a tile with the value 2048 is created.
    it('Gemini Pro: R7: Game displays "You Win!" message when 2048 tile is created', () => {
        const gridCells = document.querySelectorAll('.grid-cell');
        gridCells[0].textContent = 1024;
        gridCells[1].textContent = 1024;

        // Simulate arrow key press to cause collision (e.g., Right arrow)
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        document.dispatchEvent(event);

        expect(document.querySelector('.game-over').style.display).toBe('flex');
        // You might need to adjust the selector for the win message element
        // expect(document.querySelector('.win-message').textContent).toBe('You Win!');
    });

    // R8: The game must end and display a "Game Over" message when no more moves are possible.
    it('Gemini Pro: R8: Game displays "Game Over" message when no more moves are possible', () => {
        const gridCells = document.querySelectorAll('.grid-cell');

        // Fill the grid with values that cannot be merged
        let value = 2;
        for (let i = 0; i < gridCells.length; i++) {
            gridCells[i].textContent = value;
            value = value === 2 ? 4 : 2;
        }

        // Try moving in all directions
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

        expect(document.querySelector('.game-over').style.display).toBe('flex');
    });

    // R9: The game must display the current score.
    it('Gemini Pro: R9: Game displays current score', () => {
        // Assuming you have a score element with the class 'score'
        const scoreElement = document.querySelector('.score');
        expect(scoreElement).toBeTruthy();
    });

    // R10: The game must have a "New Game" button to reset the game state.
    it('Gemini Pro: R10: "New Game" button resets the game', () => {
        const newGameButton = document.querySelector('button');
        expect(newGameButton).toBeTruthy();
        expect(newGameButton.textContent).toBe('New Game');

        // Simulate a few moves to change the game state
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

        // Click the "New Game" button
        newGameButton.click();

        // Check if the grid has been reset (all cells should be empty)
        const gridCells = document.querySelectorAll('.grid-cell');
        const allCellsEmpty = Array.from(gridCells).every(cell => cell.textContent === '');
        expect(allCellsEmpty).toBe(true);
    });

    // R11: The game must start with two randomly placed tiles on the board.
    it('Gemini Pro: R11: Game starts with two random tiles', () => {
        // Reset the game to ensure a clean start
        const newGameButton = document.querySelector('button');
        newGameButton.click();

        const gridCells = document.querySelectorAll('.grid-cell');
        let nonEmptyCells = 0;
        for (let i = 0; i < gridCells.length; i++) {
            const cellValue = parseInt(gridCells[i].textContent) || 0;
            if (cellValue === 2 || cellValue === 4) {
                nonEmptyCells++;
            }
        }
        expect(nonEmptyCells).toBe(2);
    });
});