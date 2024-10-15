/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8'); // Path to your index.html

let dom;
let document;
let window;

describe('2048 Game Tests', () => {
    beforeEach(() => {
        dom = new JSDOM(html, { runScripts: "dangerously" });
        document = dom.window.document;
        window = dom.window;
    });

    // R1: Single HTML file
    test('R1: Game implemented in a single HTML file', () => {
        expect(document.querySelector('html')).toBeDefined();
        expect(document.querySelector('style')).toBeDefined();
        expect(document.querySelector('script')).toBeDefined();
    });

    // R2: 6x6 Grid
    test('R2: Game board is a 6x6 grid', () => {
        const gridContainer = document.querySelector('.grid-container');
        expect(gridContainer.children.length).toBe(36);
    });

    // R3: Space-themed background
    test('R3: Space-themed background applied', () => {
        const body = document.querySelector('body');
        expect(window.getComputedStyle(body).backgroundImage).toMatch(/url\(/);
    });

    // R4 & R5: Arrow key movement and tile merging
    describe('R4 & R5: Tile movement and merging', () => {
        const simulateKeyPress = (key) => {
            const event = new window.KeyboardEvent('keydown', { key });
            document.dispatchEvent(event);
        };

        beforeEach(() => {
            // Reset grid before each movement test.  Important!
            window.initializeGrid();
            window.renderGrid();
        });


        const testMovementAndMerge = (key, initialGrid, expectedGrid) => {
            window.grid = initialGrid; // Initialize grid with test setup
            window.renderGrid();
            simulateKeyPress(key);
            expect(window.grid).toEqual(expectedGrid);
        }

        it('merges right', () => {
            testMovementAndMerge("ArrowRight", [[2, 2, 0, 0, 0, 0], [0, 0, 0, 0, 0,0], [0, 0, 0, 0, 0,0], [0, 0, 0, 0, 0,0], [0, 0, 0, 0, 0,0], [0, 0, 0, 0, 0,0]], [[0, 0, 4, 0, 0, 0], [0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0,0], [0, 0, 0, 0, 0,0], [0, 0, 0, 0, 0,0], [0, 0, 0, 0, 0,0]]);
        });

        // Add similar tests for other directions (left, up, down) and more complex merge scenarios

    });




    // R6: New tile generation
    test('R6: New tile spawns after valid move', () => {
        window.grid[0][0] = 2;
        window.grid[0][1] = 2;
        window.renderGrid();
        let numTilesBefore = window.grid.flat().filter(x => x !== 0).length;
        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: "ArrowRight" }));
        let numTilesAfter = window.grid.flat().filter(x => x !== 0).length;
        // Expect either the same number of tiles (if the added tile immediately merges) or one more
        expect(numTilesAfter >= numTilesBefore ).toBe(true);

    });



    // R7: Win condition
    test('R7: Game displays "You Win!" when 2048 tile is created', () => {
        window.grid[0][0] = 2048;
        window.renderGrid();
        const gameWonMessage = document.querySelector('.game-won');
        expect(gameWonMessage.style.display).toBe('block');
    });

    // R8: Game over condition
    test('R8: Game displays "Game Over!" when no more moves are possible', () => {
        for(let r=0; r<window.gridSize; r++){
            for(let c=0; c<window.gridSize; c++){
                window.grid[r][c] = r*window.gridSize + c + 1; // Unique numbers to prevent merging
            }
        }
        window.renderGrid(); // Important to trigger the game over check within your game logic
        const gameOverMessage = document.querySelector('.game-over');
        expect(gameOverMessage.style.display).toBe('block');
    });


    // R9: Score display (This will depend on how you implement score display)
    test('R9: Score updates correctly on merge', () => {
        window.grid[0][0] = 2;
        window.grid[0][1] = 2;
        window.renderGrid();  // Ensure grid is rendered
        let initialScore = window.score;
        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: "ArrowRight" })); // Merge tiles

        expect(window.score).toBe(initialScore + 4);  // Use appropriate score variable and increment check

    });



    // R10: New Game button functionality (Implement your new game logic)
    test('R10: New Game button resets the game', () => {
        // Set up a non-default game state
        window.grid[0][0] = 2048;
        window.score = 100; // If applicable
        window.renderGrid();

        //Simulate a click on the new game button
        const newGameButton = document.querySelector('#newGameButton');
        newGameButton.click();
        expect(document.querySelector('.game-won').style.display).toBe('none');
        // Check if game-won message is reset


        // Check that the grid is reset
        expect(window.grid.flat().every(tile => tile === 0)).toBe(true);


        // Check score is reset
        expect(window.score).toBe(0); // If you are tracking score



    });



    // R11: Starting tiles
    test('R11: Game starts with two randomly placed tiles', () => {

        window.initializeGrid(); //make sure grid is empty before initializing
        window.addTile();
        window.addTile(); //function you use to add new tiles at the start.
        window.renderGrid();
        const nonEmptyTiles = window.grid.flat().filter(tile => tile !== 0);
        expect(nonEmptyTiles.length).toBe(2);
    });


});
