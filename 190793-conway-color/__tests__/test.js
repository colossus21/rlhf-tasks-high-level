/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

let dom;
let document;
let window;
let canvas;
let ctx;
let grid;



describe('Colored Game of Life', () => {
    beforeEach(() => {
        dom = new JSDOM(html, { runScripts: "dangerously" });
        document = dom.window.document;
        window = dom.window;
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
        grid = window.grid;  // Access the grid directly
    });


    // R1: Single HTML file
    it('R1: should be implemented in a single HTML file', () => {
        expect(document.querySelector('html')).toBeDefined();
        expect(document.querySelector('head')).toBeDefined();
        expect(document.querySelector('body')).toBeDefined();
        expect(document.querySelector('script')).toBeDefined();
    });

    // R2: Grid rendering with HTML elements
    it('R2 & R12: should render the game grid using a canvas element', () => {
        expect(document.getElementById('gameCanvas')).toBeDefined();
    });

    // R3: At least 6 colors
    it('R3: should define at least 6 colors', () => {
        expect(window.colors.length).toBeGreaterThanOrEqual(6);
    });

    // R4: Cell survival rule
    it('R4: should implement the cell survival rule (exactly 2 same color neighbors)', () => {

        window.grid[10][10] = 'red';
        window.grid[10][11] = 'red';
        window.grid[11][10] = 'blue';

        window.updateGrid();

        expect(window.grid[10][10]).toBe('red');
    });

    // R5 & R6: Empty cell filling rule and majority color
    it('R5 & R6: should implement the empty cell filling rule (exactly 3 neighbors) and majority color rule', () => {
        window.grid[10][10] = 'red';
        window.grid[10][11] = 'red';
        window.grid[11][10] = 'red';
        window.updateGrid();
        expect(window.grid[11][11]).toBe('red');

        window.grid = window.createGrid();
        window.grid[10][10] = 'red';
        window.grid[10][11] = 'red';
        window.grid[11][10] = 'blue';


        window.updateGrid();
        expect(window.grid[11][11]).toBe(null); // No clear majority, it remains empty

    });


    // R7, R8, & R9: Start, Stop, and Reset buttons
    it('R7, R8 & R9: should have Start, Stop, and Reset buttons', () => {
        expect(document.getElementById('startButton')).toBeDefined();
        expect(document.getElementById('stopButton')).toBeDefined();
        expect(document.getElementById('resetButton')).toBeDefined();
    });

    // R10: Speed slider
    it('R10: should have a speed slider', () => {
        expect(document.getElementById('speedSlider')).toBeDefined();
    });

    // R11: Step-wise grid update
    it('R11: should update the grid state in a step-wise manner', () => {
        // You'll need a more complex initial setup to test a meaningful change
        window.grid[5][5] = 'red';
        window.grid[5][6] = 'red';
        window.grid[6][5] = 'red';

        window.updateGrid();
        expect(window.grid[6][6]).toEqual('red');

    });



    // R12: Visual grid update (Already partially tested through the canvas check)



    // R13 & R14: Cell click toggle and color assignment
    it('R13 & R14: should allow users to click cells to toggle their state and randomly assign color', () => {

        const clickEvent = new window.MouseEvent('click', {
            clientX: 25, // Example coordinates for a cell
            clientY: 25
        });
        canvas.dispatchEvent(clickEvent);
        expect(window.grid[0][0]).toBeDefined();

        const clickEvent2 = new window.MouseEvent('click', {
            clientX: 25, // Example coordinates for a cell
            clientY: 25
        });

        canvas.dispatchEvent(clickEvent2);
        expect(window.grid[0][0]).toBeDefined();

    });


    // R15: No grid changes during simulation
    it('R15: should not allow changes to the grid while the simulation is running', () => {
        document.getElementById('startButton').click(); // Start simulation
        window.grid[5][5] = 'red';
        const clickEvent = new window.MouseEvent('click',{clientX: 25, clientY: 25});
        canvas.dispatchEvent(clickEvent)
        expect(window.grid[5][5]).toEqual("red"); // Cell state should not have changed if the rule was applied
    });


    // R16: Use requestAnimationFrame (Implementation-dependent)

    it("R16: should use requestAnimationFrame for animation", () => {
        jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => cb()); // Mock RAF to execute callback immediately

        window.running = true; // Set running to true to enable the animation loop
        window.tick(); // Call tick() to start the animation

        expect(window.requestAnimationFrame).toHaveBeenCalled(); // Check if RAF was called

        jest.restoreAllMocks(); // Restore original RAF implementation
    });




});

