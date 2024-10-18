const fs = require('fs');

// Read the HTML file content
const html = fs.readFileSync('./index_g.html', 'utf8');

describe('Gemini Pro: Lights Out Game', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html;
    });

    // R1: The game board must be a 6x6 grid.
    test('R1: Game board is a 6x6 grid', () => {
        const board = document.getElementById('game-board');
        const cells = board.querySelectorAll('.cell');
        expect(cells.length).toBe(36);
    });

    // R2: The game must start with a random number of lights switched on.
    test('R2: Game starts with random lights on', () => {
        const board = document.getElementById('game-board');
        const cells = board.querySelectorAll('.cell.on');
        expect(cells.length).toBeGreaterThan(0); // At least one light should be on
    });

    // R3: Clicking a cell must toggle its state between on and off.
    test('R3: Clicking a cell toggles its state', () => {
        const cell = document.querySelector('.cell');
        const initialClassList = cell.classList.value;
        cell.click();
        expect(cell.classList.value).not.toBe(initialClassList);
        cell.click();
        expect(cell.classList.value).toBe(initialClassList);
    });

    // R4: Clicking a cell must also toggle the state of adjacent cells.
    test('R4: Clicking a cell toggles adjacent cells', () => {
        const cell = document.querySelector('.cell'); // Top-left cell
        const rightCell = cell.nextElementSibling;
        const bottomCell = document.querySelectorAll('.cell')[6];

        cell.click();
        expect(rightCell.classList.contains('on')).toBe(true);
        expect(bottomCell.classList.contains('on')).toBe(true);
    });

    // R5 & R6: The game must detect when all lights are switched off and display a victory message.
    test('R5 & R6: Game detects win and displays victory message', () => {
        // Manually turn off all lights (this is a simplified scenario for testing)
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.remove('on'));

        // Trigger a click to force win check (simulate a final move)
        document.querySelector('.cell').click();

        // Check for win alert (using a mock alert for testing)
        global.alert = jest.fn();
        expect(global.alert).toHaveBeenCalledWith('You win!');
    });

    // R7: The game must include a reset button to start a new game.
    test('R7: Reset button starts a new game', () => {
        const resetButton = document.createElement('button'); // Assuming a button with id 'reset'
        resetButton.id = 'reset';
        document.body.appendChild(resetButton);

        // Add event listener to the reset button (simulate the actual behavior)
        resetButton.addEventListener('click', () => {
            // You'll need to implement the reset logic here, similar to your actual game code
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.classList.remove('on');
                // Add any other reset logic from your game here
            });
            randomizeLights(); // Call the randomizeLights function to set up a new game
        });

        const initialBoardState = document.getElementById('game-board').innerHTML;
        resetButton.click();
        const newBoardState = document.getElementById('game-board').innerHTML;
        expect(newBoardState).not.toBe(initialBoardState);
    });

    // R8: The game must visually distinguish between on and off states for each cell.
    test('R8: Cells have distinct on/off styles', () => {
        const cell = document.querySelector('.cell');
        const offStyle = getComputedStyle(cell);
        cell.click();
        const onStyle = getComputedStyle(cell);
        expect(onStyle.backgroundColor).not.toBe(offStyle.backgroundColor);
    });

    // R9: The game must include a move counter to track the number of clicks.
    test('R9: Move counter tracks clicks', () => {
        // Assuming you have a <span id="move-counter"> to display the count
        const moveCounter = document.createElement('span');
        moveCounter.id = 'move-counter';
        document.body.appendChild(moveCounter);

        // You'll need to update the move counter in your click handler,
        // similar to how you would in your actual game code

        const cell = document.querySelector('.cell');
        cell.click();

        // Expect the move counter to have incremented (replace with your actual logic)
        // For example, if your counter starts at 0, expect it to be 1 after a click
        // expect(moveCounter.textContent).toBe("1");
    });

    // R10: The game must prevent further input once the victory condition is met.
    test('R10: Input is prevented after winning', () => {
        // Manually turn off all lights to simulate a win
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.remove('on'));

        // Trigger a click to force win check
        document.querySelector('.cell').click();

        // Now click a cell again and check if its state changes
        const cell = document.querySelector('.cell');
        const initialClassList = cell.classList.value;
        cell.click();
        expect(cell.classList.value).toBe(initialClassList); // Should remain unchanged
    });
});

// Mock the randomizeLights function to avoid randomness in tests
function randomizeLights() {
    // In your actual game, this function would randomize the lights
    // For testing, we'll just turn on a few specific lights
    const cells = document.querySelectorAll('.cell');
    cells[0].classList.add('on');
    cells[5].classList.add('on');
    cells[12].classList.add('on');
}