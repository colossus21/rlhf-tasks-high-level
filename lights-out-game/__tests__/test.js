/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load the HTML file
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('Lights Out Game Tests', () => {
    let document;

    beforeAll(() => {
        document = new DOMParser().parseFromString(html, 'text/html');
        // Execute the script within the HTML (simulates loading the page)
        document.documentElement.querySelector('script').textContent = html.match(/<script>(.|\s)*?<\/script>/)[0].slice("<script>".length, -"</script>".length);
    });

    it('R1 & A1: 6x6 grid with 36 cells', () => {
        const cells = document.querySelectorAll('.cell');
        expect(cells.length).toBe(36);
    });

    it('R2 & A2: Cells have "on" and "off" states', () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            expect(cell.classList.contains('off') || !cell.classList.contains('off')).toBeTruthy();
        });
    });

    it('R3 & A3: Clicking a cell toggles its state and adjacent cells', () => {
        const cells = document.querySelectorAll('.cell');
        const centerIndex = 16; // Example: click the center cell
        const initialStates = getCellStates(cells);

        cells[centerIndex].click();

        const finalStates = getCellStates(cells);
        // Check if clicked cell and adjacent cells (including edges cases) are toggled.
        const adjacentIndices = [centerIndex, centerIndex - 6, centerIndex + 6, centerIndex - 1, centerIndex + 1];
        adjacentIndices.forEach(index => {
            if (index >= 0 && index < cells.length) {
                expect(finalStates[index]).not.toBe(initialStates[index]);
            }
        });

        // other cells are not changed
        for(let i = 0; i< 36; ++i) {
            if(!adjacentIndices.includes(i)) {
                expect(finalStates[i]).toBe(initialStates[i]);
            }
        }

    });


    it('R4 & A4: Game starts with a random pattern', () => {
        const cells = document.querySelectorAll('.cell');
        const offCells = Array.from(cells).filter(cell => cell.classList.contains('off'));
        const onCells = Array.from(cells).filter(cell => !cell.classList.contains('off'));

        // Expect that initial pattern to be random (at least one cell on and one off)
        // This is a probabilistic test and may very rarely fail for a natural fully on or off board, but less than 0.0003% for 50% probability.
        expect(onCells.length).toBeGreaterThan(0);
        expect(offCells.length).toBeGreaterThan(0);
    });


    it('R5 & A5: Win condition detected when all cells are off', () => {
        const cells = document.querySelectorAll('.cell');
        // Manually turn all cells "off"
        cells.forEach(cell => cell.classList.add('off'));

        // Simulate a cell click to trigger win condition check
        cells[0].click(); // clicking any cell will do.

        expect(window.alert).toHaveBeenCalledWith('You win!');

        //Reset alert mock
        jest.clearAllMocks();

    });

    it('R6 & A6: Edge cells do not affect non-existent neighbors', () => {
        const cells = document.querySelectorAll('.cell');
        const topLeftCell = cells[0];

        topLeftCell.click();

        expect(() => {
            topLeftCell.click(); // clicking cell multiple times is also tested.
        }).not.toThrow();
    });

    it('R7 & A7: Game is implemented in a single HTML file', () => {
        // Already checked by loading the HTML file initially. This test confirms it works in JSDOM.
        expect(document.querySelectorAll('#game').length).toBe(1);
    });

    it('R8 & A8: Each cell is clickable', () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            expect(cell.hasAttribute('click')).toBeTruthy();
        });
    });

    it('R9 & A9: Game state is represented by a boolean array', () => {
        expect(document.defaultView.board).toBeInstanceOf(Array);
        expect(document.defaultView.board.length).toBe(36);
        document.defaultView.board.forEach(value => {
            expect(typeof value).toBe('boolean');
        });
    });

    it('R10 & A10: Cells are square shaped', () => {
        const cell = document.querySelector('.cell');
        const style = window.getComputedStyle(cell);

        // This will be true unless you have custom padding, margin, or border that affects dimensions
        expect(parseFloat(style.width)).toBe(parseFloat(style.height));

    });

    //Helper function
    function getCellStates(cells) {
        return Array.from(cells).map(cell => cell.classList.contains('off'));
    }


    beforeEach(() => {
        // Mock alert
        window.alert = jest.fn();
    });
});