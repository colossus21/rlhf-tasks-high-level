/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load the HTML file content into the JSDOM environment
const html = fs.readFileSync(path.resolve(__dirname, '../index_o.html'), 'utf8');
document.body.innerHTML = html;

describe('ChatGPT 4o: Memory Game Tests', () => {
    // Load the necessary DOM elements
    const gameBoard = document.getElementById('gameBoard');
    const restartButton = document.getElementById('restartButton');
    const mistakesDisplay = document.getElementById('mistakes');
    const resultMessage = document.getElementById('resultMessage');

    // Utility function to simulate a cell click
    const clickCell = (cell) => {
        cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    };

    // R1: The game must be implemented using HTML, CSS, and JavaScript.
    test('R1: Game implemented in a single HTML file with CSS and JS embedded', () => {
        expect(gameBoard).not.toBeNull();
        expect(gameBoard.children.length).toBe(16);
        expect(restartButton).not.toBeNull();
    });

    // R2: The game board must consist of a 4x4 grid of cells.
    test('R2: Game board is a 4x4 grid of cells', () => {
        expect(gameBoard).toBeInTheDocument();
        expect(gameBoard.children.length).toBe(16); // 16 cells in total
        expect(gameBoard.style.display).toBe('grid');
        expect(gameBoard.style.gridTemplateColumns).toBe('repeat(4, 100px)');
        expect(gameBoard.style.gridTemplateRows).toBe('repeat(4, 100px)');
    });

    // R3: The game must have 8 pairs of colors randomly distributed across the 16 cells.
    test('R3: 8 pairs of colors are randomly distributed across 16 cells', () => {
        const cells = Array.from(gameBoard.children);
        const colors = cells.map(cell => cell.dataset.color);
        const uniqueColors = [...new Set(colors)];

        expect(uniqueColors.length).toBe(8); // 8 unique color pairs
        expect(colors.length).toBe(16); // 16 cells in total
    });

    // R4: Cells must start face-down (color hidden) and reveal their color when clicked.
    test('R4: Cells start hidden and reveal their color when clicked', () => {
        const cell = gameBoard.children[0];
        expect(cell.style.backgroundColor).toBe(''); // Hidden initially
        clickCell(cell);
        expect(cell.style.backgroundColor).toBe(cell.dataset.color); // Revealed after click
    });

    // R5: The game must allow the player to reveal only two cells at a time.
    test('R5: Only two cells can be revealed at a time', () => {
        const [cell1, cell2, cell3] = Array.from(gameBoard.children).slice(0, 3);

        clickCell(cell1);
        clickCell(cell2);
        clickCell(cell3); // Should not reveal the third cell

        expect(cell1.style.backgroundColor).toBe(cell1.dataset.color);
        expect(cell2.style.backgroundColor).toBe(cell2.dataset.color);
        expect(cell3.style.backgroundColor).toBe(''); // Should remain hidden
    });

    // R6: The game must check for a match when two cells are revealed.
    test('R6: Game checks for a match when two cells are revealed', () => {
        const [cell1, cell2] = Array.from(gameBoard.children).slice(0, 2);
        cell1.dataset.color = 'red';
        cell2.dataset.color = 'red';

        clickCell(cell1);
        clickCell(cell2);

        expect(cell1.classList.contains('matched')).toBe(true);
        expect(cell2.classList.contains('matched')).toBe(true);
    });

    // R7: Matched pairs must remain face-up for the duration of the game.
    test('R7: Matched pairs remain face-up', () => {
        const [cell1, cell2] = Array.from(gameBoard.children).slice(0, 2);
        cell1.dataset.color = 'red';
        cell2.dataset.color = 'red';

        clickCell(cell1);
        clickCell(cell2);

        expect(cell1.classList.contains('matched')).toBe(true);
        expect(cell2.classList.contains('matched')).toBe(true);
        expect(cell1.style.pointerEvents).toBe('none'); // Click event disabled
        expect(cell2.style.pointerEvents).toBe('none');
    });

    // R8: Unmatched pairs must be hidden after a short delay.
    test('R8: Unmatched pairs are hidden after a short delay', () => {
        jest.useFakeTimers();
        const [cell1, cell2] = Array.from(gameBoard.children).slice(0, 2);
        cell1.dataset.color = 'red';
        cell2.dataset.color = 'blue';

        clickCell(cell1);
        clickCell(cell2);

        jest.advanceTimersByTime(1000);

        expect(cell1.style.backgroundColor).toBe('');
        expect(cell2.style.backgroundColor).toBe('');
    });

    // R9: The game must track and display the number of mistakes made by the player.
    test('R9: Mistakes are tracked and displayed', () => {
        const [cell1, cell2] = Array.from(gameBoard.children).slice(0, 2);
        cell1.dataset.color = 'red';
        cell2.dataset.color = 'blue';

        clickCell(cell1);
        clickCell(cell2);

        expect(mistakesDisplay.textContent).toBe('1');
    });

    // R10: The game must end when the player makes 3 mistakes.
    test('R10: Game ends when 3 mistakes are made', () => {
        const cells = Array.from(gameBoard.children);
        cells.forEach((cell, index) => {
            cell.dataset.color = index % 2 === 0 ? 'red' : 'blue'; // Force mistakes
        });

        for (let i = 0; i < 6; i += 2) {
            clickCell(cells[i]);
            clickCell(cells[i + 1]);
        }

        expect(resultMessage.textContent).toBe('Game Over');
    });

    // R11: The game must display a "Game Over" message when the player loses.
    test('R11: Game Over message is displayed when player loses', () => {
        const cells = Array.from(gameBoard.children);
        cells.forEach((cell, index) => {
            cell.dataset.color = index % 2 === 0 ? 'red' : 'blue'; // Force mistakes
        });

        for (let i = 0; i < 6; i += 2) {
            clickCell(cells[i]);
            clickCell(cells[i + 1]);
        }

        expect(resultMessage.textContent).toBe('Game Over');
    });

    // R12: The game must end when all pairs are successfully matched.
    test('R12: Game ends when all pairs are matched', () => {
        const cells = Array.from(gameBoard.children);
        cells.forEach((cell, index) => {
            cell.dataset.color = 'red'; // Force all matches
        });

        for (let i = 0; i < 16; i += 2) {
            clickCell(cells[i]);
            clickCell(cells[i + 1]);
        }

        expect(resultMessage.textContent).toBe('You Win!');
    });

    // R13: The game must display a "You Win" message when the player successfully matches all pairs.
    test('R13: You Win message is displayed when all pairs are matched', () => {
        const cells = Array.from(gameBoard.children);
        cells.forEach((cell, index) => {
            cell.dataset.color = 'red'; // Force all matches
        });

        for (let i = 0; i < 16; i += 2) {
            clickCell(cells[i]);
            clickCell(cells[i + 1]);
        }

        expect(resultMessage.textContent).toBe('You Win!');
    });

    // R14: The game must include a restart button that appears after the game ends.
    test('R14: Restart button appears after the game ends', () => {
        const cells = Array.from(gameBoard.children);
        cells.forEach((cell, index) => {
            cell.dataset.color = 'red'; // Force all matches
        });

        for (let i = 0; i < 16; i += 2) {
            clickCell(cells[i]);
            clickCell(cells[i + 1]);
        }

        expect(restartButton.style.display).toBe('block');
    });
});
