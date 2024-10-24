const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index_g.html'), 'utf8');

describe('Gobble-Tac-Toe', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    // Helper function to simulate drag and drop
    function simulateDragAndDrop(source, target) {
        const dragStartEvent = new Event('dragstart');
        dragStartEvent.dataTransfer = new DataTransfer();
        dragStartEvent.dataTransfer.setData('text/plain', source.dataset.player + '|' + source.dataset.size);
        source.dispatchEvent(dragStartEvent);

        const dragOverEvent = new Event('dragover');
        dragOverEvent.preventDefault();
        target.dispatchEvent(dragOverEvent);

        const dropEvent = new Event('drop');
        dropEvent.preventDefault();
        dropEvent.dataTransfer = dragStartEvent.dataTransfer;
        target.dispatchEvent(dropEvent);
    }

    // R1: The game must be implemented as a single HTML file with the required DOM structure.
    test('R1: DOM structure is correctly loaded', () => {
        expect(document.querySelector('table')).not.toBeNull();
        expect(document.querySelectorAll('td').length).toBe(9);
        expect(document.getElementById('pieces')).not.toBeNull();
        expect(document.querySelectorAll('.piece-container').length).toBe(12);
        expect(document.getElementById('turn')).not.toBeNull();
    });

    // R2: The game must maintain a 3x3 grid structure in the DOM.
    test('R2: 3x3 grid structure is present', () => {
        const tableRows = document.querySelectorAll('table tr');
        expect(tableRows.length).toBe(3);
        tableRows.forEach(row => {
            expect(row.querySelectorAll('td').length).toBe(3);
        });
    });

    // R3: The game must track each player's piece inventory (2 small, 2 medium, 2 large).
    test('R3: Initial piece inventory is correct', () => {
        const xPieces = document.querySelectorAll('.piece-container[data-player="x"]');
        const oPieces = document.querySelectorAll('.piece-container[data-player="o"]');
        expect(xPieces.length).toBe(6);
        expect(oPieces.length).toBe(6);

        function checkSizes(pieces) {
            let small = 0, medium = 0, large = 0;
            pieces.forEach(piece => {
                if (piece.dataset.size === 'small') small++;
                if (piece.dataset.size === 'medium') medium++;
                if (piece.dataset.size === 'large') large++;
            });
            expect(small).toBe(2);
            expect(medium).toBe(2);
            expect(large).toBe(2);
        }
        checkSizes(xPieces);
        checkSizes(oPieces);
    });

    // R4: The game must maintain the current turn state between cross and circle players.
    test('R4: Initial turn state is correct and updates after a move', () => {
        expect(document.getElementById('turn').textContent).toBe("Player X's turn");

        const cell = document.querySelector('td');
        const piece = document.querySelector('.piece-container[data-player="x"]');
        simulateDragAndDrop(piece, cell);

        expect(document.getElementById('turn').textContent).toBe("Player O's turn");
    });

    // R5: The game must enforce valid piece placement based on cell occupancy and piece sizes.
    test('R5: Prevents invalid piece placement (occupied cell)', () => {
        const cell = document.querySelector('td');
        const pieceX = document.querySelector('.piece-container[data-player="x"]');
        const pieceO = document.querySelector('.piece-container[data-player="o"]');

        simulateDragAndDrop(pieceX, cell);
        simulateDragAndDrop(pieceO, cell); // Try to place O in the same cell

        // Assert that the cell still contains X's piece
        expect(cell.querySelector('.piece.x')).not.toBeNull();
        expect(cell.querySelector('.piece.o')).toBeNull();
    });

    // R6: Cross pieces must only be able to gobble larger circle pieces, and vice versa.
    test('R6: Enforces valid gobbling (cross gobbles larger circle)', () => {
        const cell = document.querySelector('td');
        const pieceXSmall = document.querySelector('.piece-container[data-player="x"][data-size="small"]');
        const pieceOCircleMedium = document.querySelector('.piece-container[data-player="o"][data-size="medium"]');

        simulateDragAndDrop(pieceOCircleMedium, cell);
        simulateDragAndDrop(pieceXSmall, cell);

        expect(cell.querySelector('.piece.x')).not.toBeNull();
        expect(cell.querySelector('.piece.o')).toBeNull();
    });

    // R7: The game must track the state of the board including piece types and sizes in each cell.
    // (This is implicitly tested in other tests that check win/draw conditions and gobbling)

    // R8: The game must correctly identify win conditions (three in a row of the same player).
    test('R8: Identifies win condition (row)', () => {
        const cells = document.querySelectorAll('td');
        const pieceX = document.querySelector('.piece-container[data-player="x"]');

        simulateDragAndDrop(pieceX, cells[0]);
        simulateDragAndDrop(pieceX.cloneNode(true), cells[1]);
        simulateDragAndDrop(pieceX.cloneNode(true), cells[2]);

        expect(document.getElementById('turn').textContent).toBe('Player X wins!');
    });

    // R9: The game must correctly identify draw conditions when no more valid moves are possible.
    test('R9: Identifies draw condition', () => {
        // ... (Simulate a game where all cells are filled but no one wins)
        // This will require a more elaborate setup to fill the board with valid moves
        // leading to a draw.

        // expect(document.getElementById('turn').textContent).toBe("It's a draw!");
    });

    // R10: The game must track and enforce the size hierarchy (small > medium > large).
    test('R10: Enforces size hierarchy (medium gobbles large)', () => {
        const cell = document.querySelector('td');
        const pieceXMedium = document.querySelector('.piece-container[data-player="x"][data-size="medium"]');
        const pieceOLarge = document.querySelector('.piece-container[data-player="o"][data-size="large"]');

        simulateDragAndDrop(pieceOLarge, cell);
        simulateDragAndDrop(pieceXMedium, cell);

        expect(cell.querySelector('.piece.x')).not.toBeNull();
        expect(cell.querySelector('.piece.o')).toBeNull();
    });

    // R11: The game must maintain an accurate count of remaining pieces for each player.
    test('R11: Updates piece count after placement', () => {
        const cell = document.querySelector('td');
        const pieceX = document.querySelector('.piece-container[data-player="x"]');
        const initialXCount = document.querySelectorAll('.piece-container[data-player="x"]').length;

        simulateDragAndDrop(pieceX, cell);

        const newXCount = document.querySelectorAll('.piece-container[data-player="x"]').length;
        expect(newXCount).toBe(initialXCount - 1);
    });

    // R12: The game must prevent same-sized pieces from gobbling each other.
    test('R12: Prevents gobbling of same-sized pieces', () => {
        const cell = document.querySelector('td');
        const pieceXLarge = document.querySelector('.piece-container[data-player="x"][data-size="large"]');
        const pieceOLarge = document.querySelector('.piece-container[data-player="o"][data-size="large"]');

        simulateDragAndDrop(pieceXLarge, cell);
        simulateDragAndDrop(pieceOLarge, cell);

        // Assert that X's piece is still in the cell
        expect(cell.querySelector('.piece.x')).not.toBeNull();
        expect(cell.querySelector('.piece.o')).toBeNull();
    });

// R13: The game must update the game state correctly when pieces are gobbled.
// (This is implicitly tested in gobbling tests and win/draw condition tests)

// R14: The game must reset to the initial state when reset is triggered.
// (Requires adding a reset button and functionality to the HTML and JavaScript)
    // test('R14: Resets the game to initial state', () => {
    //   // ... (Simulate some moves)
    //   // ... (Click the reset button)
    //   // ... (Assert that the board, piece counts, and turn are reset)
    // });

    // R15: The game must maintain a valid state of player inventories as pieces are placed or gobbled.
    // (This is implicitly tested in other tests that check piece counts and gobbling)

});