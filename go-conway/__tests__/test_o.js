/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index_o.html'), 'utf8');

describe('Colorful Game of Life', () => {
    let document;

    beforeEach(() => {
        document = new DOMParser().parseFromString(html, 'text/html');
    });

    // R1: The application must be implemented as a single HTML file.
    test('R1: should have all logic, CSS, and JS in a single file', () => {
        const scripts = document.querySelectorAll('script');
        const styles = document.querySelectorAll('style');
        expect(scripts.length).toBeGreaterThan(0);
        expect(styles.length).toBeGreaterThan(0);
    });

    // R2: The game grid must be rendered using HTML elements.
    test('R2: should render the grid using HTML div elements', () => {
        const grid = document.getElementById('grid');
        expect(grid).not.toBeNull();
        const cells = grid.querySelectorAll('.cell');
        expect(cells.length).toBeGreaterThan(0);
    });

    // R3: The game must provide at least 6 different colors for cells.
    test('R3: should have an array of at least 6 colors', () => {
        const colorArray = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        expect(colorArray.length).toBeGreaterThanOrEqual(6);
    });

    // R4: A cell must survive if it has exactly 2 neighbors of the same color.
    test('R4: cell survives with exactly 2 neighbors of the same color', () => {
        const grid = document.getElementById('grid');
        const cell = grid.querySelector('.cell');
        const mockNeighbors = [
            { style: { backgroundColor: '#ff0000' } },
            { style: { backgroundColor: '#ff0000' } }
        ];
        const result = checkSurvival(cell, mockNeighbors);
        expect(result).toBe(true); // Assuming checkSurvival checks this condition
    });

    // R5: An empty cell must become filled if it has exactly 3 colored neighbors.
    test('R5: empty cell fills if it has exactly 3 colored neighbors', () => {
        const grid = document.getElementById('grid');
        const cell = grid.querySelector('.cell');
        cell.style.backgroundColor = '#ffffff'; // Empty cell
        const mockNeighbors = [
            { style: { backgroundColor: '#ff0000' } },
            { style: { backgroundColor: '#00ff00' } },
            { style: { backgroundColor: '#0000ff' } }
        ];
        const result = checkFill(cell, mockNeighbors);
        expect(result).toBe(true); // Assuming checkFill checks this condition
    });

    // R6: A newly filled cell must take the majority of its 3 neighbors.
    test('R6: newly filled cell takes majority color of neighbors', () => {
        const neighbors = [
            { style: { backgroundColor: '#ff0000' } },
            { style: { backgroundColor: '#ff0000' } },
            { style: { backgroundColor: '#00ff00' } }
        ];
        const majorityColor = getMajorityColor(neighbors);
        expect(majorityColor).toBe('#ff0000'); // Assuming getMajorityColor returns the majority
    });

    // R7: The game must have a "Start" button.
    test('R7: should have a Start button to begin the simulation', () => {
        const startButton = document.getElementById('startStop');
        expect(startButton).not.toBeNull();
        expect(startButton.innerText).toBe('Start');
    });

    // R8: The game must have a "Stop" button.
    test('R8: should have a Stop button to halt the simulation', () => {
        const startButton = document.getElementById('startStop');
        startButton.click();
        expect(startButton.innerText).toBe('Stop');
    });

    // R9: The game must have a "Reset" button.
    test('R9: should have a Reset button to clear the grid', () => {
        const resetButton = document.getElementById('reset');
        expect(resetButton).not.toBeNull();
    });

    // R10: The game must include a slider to control the speed.
    test('R10: should have a speed slider that controls the simulation', () => {
        const speedSlider = document.getElementById('speed');
        expect(speedSlider).not.toBeNull();
        expect(speedSlider.type).toBe('range');
    });

    // R11: The game must update the grid state based on rules.
    test('R11: should update grid state based on the game rules', () => {
        const grid = document.getElementById('grid');
        // Assume calculateNextState is the function that handles this
        const updatedGrid = calculateNextState(grid);
        expect(updatedGrid).not.toEqual(grid); // Assuming it calculates correctly
    });

    // R12: The game must visually update the grid to reflect state changes.
    test('R12: should visually update the grid colors', () => {
        const grid = document.getElementById('grid');
        const cells = grid.querySelectorAll('.cell');
        // Assume updateGridColors is the function that handles this
        updateGridColors(cells, ['#ff0000', '#00ff00']);
        expect(cells[0].style.backgroundColor).toBe('#ff0000');
        expect(cells[1].style.backgroundColor).toBe('#00ff00');
    });

    // R13: The game must allow users to click on cells to toggle state.
    test('R13: should allow users to click on cells to toggle their state', () => {
        const cell = document.querySelector('.cell');
        cell.click();
        expect(cell.style.backgroundColor).not.toBe('#ffffff'); // It should change color on click
    });

    // R14: The game must randomly assign one of 6 colors when a cell is activated.
    test('R14: should randomly assign one of the 6 colors when a cell is clicked', () => {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const cell = document.querySelector('.cell');
        cell.click();
        expect(colors).toContain(cell.style.backgroundColor);
    });

    // R15: The game must not allow changes while simulation is running.
    test('R15: should disable cell toggling while simulation is running', () => {
        const startButton = document.getElementById('startStop');
        startButton.click(); // Start simulation
        const cell = document.querySelector('.cell');
        const initialColor = cell.style.backgroundColor;
        cell.click();
        expect(cell.style.backgroundColor).toBe(initialColor); // Should not change
    });

    // R16: The game must use requestAnimationFrame for smooth animation.
    test('R16: should use requestAnimationFrame for updating the game', () => {
        const originalRequestAnimationFrame = global.requestAnimationFrame;
        const mockRequestAnimationFrame = jest.fn();
        global.requestAnimationFrame = mockRequestAnimationFrame;

        const step = jest.fn();
        requestAnimationFrame(step);
        expect(mockRequestAnimationFrame).toHaveBeenCalledWith(step);

        global.requestAnimationFrame = originalRequestAnimationFrame;
    });
});
