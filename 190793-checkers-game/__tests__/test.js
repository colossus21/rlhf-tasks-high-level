/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Load the HTML file
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

let dom;
let document;
let window;

describe('Checkers Game Tests', () => {
    beforeEach(() => {
        dom = new JSDOM(html, { runScripts: 'dangerously' });
        document = dom.window.document;
        window = dom.window;
    });


    it('R1: The game board must be 6x6 squares in size', () => {
        const board = document.getElementById('board');
        expect(board.children.length).toBe(36); // 6x6 = 36 squares
    });

    it('R2: The game should start with 6 checker pieces for each player', () => {
        let redPieces = 0;
        let bluePieces = 0;
        const pieces = document.querySelectorAll('.piece');
        pieces.forEach(piece => {
            if (piece.classList.contains('red')) {
                redPieces++;
            } else if (piece.classList.contains('blue')) {
                bluePieces++;
            }
        });

        expect(redPieces).toBe(6);
        expect(bluePieces).toBe(6);

    });

    //Helper functions to simulate user interaction (assuming functions exist in index.html)
    function simulateClick(element) {
        element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    }


    // Requirement 3 and others require significantly more complex testing involving simulating user interaction
    // and checking the game state. Further development of the game logic in the index.html file would be necessary
    // to implement these tests.   I've given an example of how this could be started for the move, but as the game logic
    // isn't there yet, it won't pass.  Develop the game logic first, then refine the tests.
    it('R3: Players must be able to move their pieces diagonally forward', () => {
        const startingCell = document.getElementById('2-1'); // Example starting position (Adjust as needed)
        const targetCell = document.getElementById('3-0');  // Example target position
        simulateClick(startingCell);
        simulateClick(targetCell);
        expect(targetCell.firstChild).toBeTruthy(); //Check if piece has moved into target cell - adjust for actual game logic
        expect(startingCell.firstChild).toBeFalsy();
    });



    // The following test cases will require further game logic to be implemented
    // and more sophisticated interaction simulation.  I have provided skeletons
    // as placeholders. You will need to refine these once game logic is more developed.



    it('R4: The game must support capturing opponent pieces by jumping over them', () => {
        // Arrange pieces to allow for a capture move.
        // Simulate the jump move.
        // Assert that the captured piece is removed and the jumping piece is in the correct position.
        pending("Requires further game logic implementation")
    });

    it('R5: The game must implement "kinging"', () => {
        // Move a piece to the opposite end of the board.
        // Assert that the piece is visually kinged.
        // Test that the kinged piece can move backward.
        pending("Requires further game logic implementation")
    });

    it('R6: The game must alternate turns between players', () => {
        //Make a valid move for player 1
        //Check it is player 2s turn (however you've implemented that logic)
        //Make a valid move for player 2
        //Check it is player 1s turn
        pending("Requires further game logic implementation")
    });


    it('R7: The game must detect and declare a winner', () => {
        // Capture all of one player's pieces.
        // Assert that the correct player is declared the winner.
        pending("Requires further game logic implementation")

    });

    it('R8: The game must provide a reset or new game option', () => {
        // Simulate clicking the reset button (if you implement one, adjust the selector accordingly).
        // const resetButton = document.querySelector('#resetButton');
        // if (resetButton) {  //Safeguard in case not present yet
        //     simulateClick(resetButton);
        // }

        // Assert that the board is reset to its initial state.
        pending("Requires further game logic implementation")
    });


    it('R9: The game must be playable using mouse clicks', () => {
        // Already implicitly covered by interaction tests in other cases.
        // This would become important if you implemented drag-and-drop or other specific click/interaction logic
        pending("Implicitly tested in other cases - further explicit tests may be added as game develops")

    });



    it('R10: The game must be implemented using HTML and JavaScript in a single file', () => {
        // Check for the absence of external script tags (except for allowed CDNs, if any).
        const scriptTags = document.querySelectorAll('script');
        let externalScripts = 0;
        scriptTags.forEach(script => {
            if (script.src && !script.src.startsWith('data:')) { //Allow inline and data-uri but not other external scripts
                externalScripts++;
            }
        });
        expect(externalScripts).toBe(0);  //Or the number of CDNs used if appropriate

    });

});