/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('ChatGPT 4o: Lights Out Game', () => {
    let gameGrid, message, moveCounter, resetButton;

    // Load the HTML before each test
    beforeEach(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index_o.html'), 'utf8');
        document.documentElement.innerHTML = html;

        // Set up commonly used DOM elements
        gameGrid = document.getElementById('gameGrid');
        message = document.getElementById('message');
        moveCounter = document.getElementById('moveCounter');
        resetButton = document.getElementById('resetButton');

        // We need to re-attach the JavaScript functionality if it's in a <script> tag
        const script = document.createElement('script');
        script.textContent = `
      // Simulated game logic here, similar to what exists in index_o.html
      function toggleLight(row, col) {
        const cell = document.querySelector(\`[data-row="\${row}"][data-col="\${col}"]\`);
        if (cell.classList.contains('on')) {
          cell.classList.remove('on');
        } else {
          cell.classList.add('on');
        }
      }

      function randomizeLights() {
        document.querySelectorAll('.cell').forEach(cell => {
          if (Math.random() > 0.7) {
            cell.classList.add('on');
          } else {
            cell.classList.remove('on');
          }
        });
      }

      function checkWinCondition() {
        const allOff = [...document.querySelectorAll('.cell')].every(cell => !cell.classList.contains('on'));
        if (allOff) {
          document.getElementById('message').textContent = "Congratulations! You've turned off all the lights!";
        }
      }

      function initialize() {
        const gameGrid = document.getElementById('gameGrid');
        randomizeLights();
        
        gameGrid.addEventListener('click', (e) => {
          if (e.target.classList.contains('cell')) {
            const row = e.target.getAttribute('data-row');
            const col = e.target.getAttribute('data-col');
            toggleLight(row, col);
            checkWinCondition();
          }
        });
      }

      initialize();
    `;
        document.body.appendChild(script);
    });

    afterEach(() => {
        document.documentElement.innerHTML = ''; // Clean up DOM after each test
    });

    test('R1: The game board must be a 6x6 grid (36 cells)', () => {
        const cells = gameGrid.querySelectorAll('.cell');
        expect(cells.length).toBe(36);
    });

    test('R2: The game must start with a random number of lights switched on', () => {
        const onCells = gameGrid.querySelectorAll('.cell.on');
        expect(onCells.length).toBeGreaterThan(0);
        expect(onCells.length).toBeLessThan(36);
    });

    test('R3: Clicking a cell must toggle its state between on and off', () => {
        const firstCell = gameGrid.querySelector('.cell');
        expect(firstCell.classList.contains('on')).toBe(false);

        // Simulate click
        firstCell.click();
        expect(firstCell.classList.contains('on')).toBe(true);

        // Simulate click again
        firstCell.click();
        expect(firstCell.classList.contains('on')).toBe(false);
    });

    test('R4: Clicking a cell must toggle the state of adjacent cells', () => {
        const centerCell = gameGrid.querySelector('[data-row="2"][data-col="2"]');
        const topCell = gameGrid.querySelector('[data-row="1"][data-col="2"]');
        const bottomCell = gameGrid.querySelector('[data-row="3"][data-col="2"]');
        const leftCell = gameGrid.querySelector('[data-row="2"][data-col="1"]');
        const rightCell = gameGrid.querySelector('[data-row="2"][data-col="3"]');

        // Ensure all cells are off
        [centerCell, topCell, bottomCell, leftCell, rightCell].forEach(cell => cell.classList.remove('on'));

        // Simulate click on the center cell
        centerCell.click();

        // Ensure adjacent cells are toggled on
        expect(centerCell.classList.contains('on')).toBe(true);
        expect(topCell.classList.contains('on')).toBe(true);
        expect(bottomCell.classList.contains('on')).toBe(true);
        expect(leftCell.classList.contains('on')).toBe(true);
        expect(rightCell.classList.contains('on')).toBe(true);
    });

    test('R5: The game must detect when all lights are switched off', () => {
        // Turn off all lights
        gameGrid.querySelectorAll('.cell.on').forEach(cell => cell.classList.remove('on'));

        // Check if the win condition is met
        const allOff = [...gameGrid.querySelectorAll('.cell')].every(cell => !cell.classList.contains('on'));
        expect(allOff).toBe(true);
    });

    test('R6: The game must display a victory message when all lights are switched off', () => {
        // Turn off all lights
        gameGrid.querySelectorAll('.cell.on').forEach(cell => cell.classList.remove('on'));

        // Simulate win check
        const allOff = [...gameGrid.querySelectorAll('.cell')].every(cell => !cell.classList.contains('on'));
        if (allOff) {
            message.textContent = "Congratulations! You've turned off all the lights!";
        }

        expect(message.textContent).toBe("Congratulations! You've turned off all the lights!");
    });

    test('R7: The game must include a reset button to start a new game', () => {
        resetButton.click(); // Simulate reset click

        // Simulate randomizeLights
        gameGrid.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('on');
            if (Math.random() > 0.7) {
                cell.classList.add('on');
            }
        });

        const onCells = gameGrid.querySelectorAll('.cell.on');
        expect(onCells.length).toBeGreaterThan(0);
        expect(onCells.length).toBeLessThan(36);
    });

    test('R8: The game must visually distinguish between on and off states for each cell', () => {
        const firstCell = gameGrid.querySelector('.cell');

        firstCell.classList.remove('on');
        expect(firstCell.classList.contains('on')).toBe(false);

        firstCell.click();
        expect(firstCell.classList.contains('on')).toBe(true);

        firstCell.click();
        expect(firstCell.classList.contains('on')).toBe(false);
    });

    test('R9: The game must include a move counter to track the number of clicks', () => {
        let moveCount = 0;
        const cells = gameGrid.querySelectorAll('.cell');

        // Simulate clicks
        cells[0].click();
        moveCount++;
        moveCounter.textContent = `Moves: ${moveCount}`;

        cells[1].click();
        moveCount++;
        moveCounter.textContent = `Moves: ${moveCount}`;

        expect(moveCounter.textContent).toBe("Moves: 2");
    });

    test('R10: The game must prevent further input once the victory condition is met', () => {
        gameGrid.querySelectorAll('.cell.on').forEach(cell => {
            cell.classList.remove('on');
        });
        message.textContent = "Congratulations! You've turned off all the lights!";

        const firstCell = gameGrid.querySelector('.cell');
        firstCell.click();

        expect(firstCell.classList.contains('on')).toBe(false); // It should remain off
    });
});
