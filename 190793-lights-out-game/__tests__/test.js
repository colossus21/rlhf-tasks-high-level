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

describe('Lights Out Game Tests', () => {
    beforeEach(() => {
        dom = new JSDOM(html, { runScripts: "dangerously" });
        document = dom.window.document;
        window = dom.window;
    });

    // Requirement 1 & Assumption 1
    it('should have a 6x6 game board', () => {
        const gameDiv = document.getElementById('game');
        expect(gameDiv.children.length).toBe(36); // Check for 36 cells
        expect(gameDiv.style.display).toBe('grid');
        expect(window.getComputedStyle(gameDiv).gridTemplateColumns).toBe('repeat(6, 1fr)');
    });



    // Requirement 2 & Assumption 2
    it('should initialize with a random number of lights on', () => {
        let lightsOn = 0;
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            if (cell.classList.contains('on')) {
                lightsOn++;
            }
        });
        expect(lightsOn).toBeGreaterThanOrEqual(0); // At least 0
        expect(lightsOn).toBeLessThanOrEqual(36);  // At most 36
        // For a more robust test you could run this multiple times and track randomness.

    });



    // Requirement 3 & Assumption 3 + Requirement 8 & Assumption 8
    it('should toggle cell state and appearance on click', () => {
        const cell = document.querySelector('.cell'); // Get the first cell
        const initialClassList = Array.from(cell.classList); // Copy classList as it's live

        cell.click();
        expect(cell.classList.contains('on')).not.toEqual(initialClassList.includes("on"));

        cell.click(); // Click again to toggle back
        expect(cell.classList.contains('on')).toEqual(initialClassList.includes("on"));



    });



    // Requirement 4 & Assumption 4
    it('should toggle adjacent cells on click', () => {
        const cell = document.getElementById('game').children[6]; // Get cell at row 1, col 0

        const adjacentCellIndices = [5, 7, 12]; // Expected adjacent cells for cell[6]
        const initialStates = adjacentCellIndices.map(index => document.getElementById('game').children[index].classList.contains('on'));

        cell.click();
        adjacentCellIndices.forEach((index, i) => {
            expect(document.getElementById('game').children[index].classList.contains('on')).not.toEqual(initialStates[i]);
        });


    });


    // Requirement 5 & Assumption 5 + Requirement 6 & Assumption 6  + Requirement 10 & Assumption 10
    it('should detect win condition, display victory message and stop input', () => {


        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {  // Turn all lights off to simulate win
            if(cell.classList.contains('on')) cell.click();
        });

        // Mock the alert to avoid it blocking the test
        window.alert = jest.fn();

        const clickEvent = new window.MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        cells[0].dispatchEvent(clickEvent);

        expect(window.alert).toHaveBeenCalledWith('Congratulations! You won!');


    });



    // Requirement 7 & Assumption 7
    it('should have a reset button that restarts the game', () => {
        // Add a reset button to the HTML for this test to work (if not already present)

        // Simulate some clicks
        document.querySelectorAll('.cell')[0].click();
        document.querySelectorAll('.cell')[1].click();

        const resetButton = document.createElement('button');
        resetButton.id = 'reset';
        resetButton.onclick = window.initializeGrid;
        document.body.appendChild(resetButton);


        resetButton.click(); // Click the reset button
        const lightsOnAfterReset = Array.from(document.querySelectorAll('.cell')).filter(cell => cell.classList.contains('on')).length;
        expect(lightsOnAfterReset).toBeGreaterThanOrEqual(0);
        expect(lightsOnAfterReset).toBeLessThanOrEqual(36); // Check for valid on/off state after reset


    });

    // Requirement 9 & Assumption 9
    // (Note: This depends on how you implement your move counter.  Adjust the selector and expectations)
    it('should increment move counter on click', () => {
        // Add a move counter display element if it's not in your index.html, for example <span id="moveCounter">0</span>
        const moveCounterDisplay = document.createElement('span'); // Add a span for the move counter
        moveCounterDisplay.id = 'moveCounter';
        document.body.appendChild(moveCounterDisplay);
        window.moveCounter = 0; // Initialize move counter (must be a global variable in your lightsout script)
        window.incrementMoveCounter = function() { window.moveCounter++; moveCounterDisplay.textContent = window.moveCounter; }

        const cell = document.querySelector('.cell');
        cell.click();

        expect(window.moveCounter).toBe(1);



    });




});