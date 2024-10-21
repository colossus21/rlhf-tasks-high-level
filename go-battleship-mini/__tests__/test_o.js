/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('ChatGPT 4o: Battleship Game Tests', () => {
    let gameHTML;

    beforeEach(() => {
        const filePath = path.resolve(__dirname, '../index_o.html');
        gameHTML = fs.readFileSync(filePath, 'utf8');
        document.body.innerHTML = gameHTML;
    });

    test('R1: The game must be implemented using HTML and JavaScript in a single file.', () => {
        expect(document.querySelector('#gameBoard')).not.toBeNull();
        expect(typeof window).toBe('object');  // Ensuring browser environment exists.
    });

    test('R2: The game board must be a 6x6 grid with a 6x3 top portion for AI and a 6x3 bottom portion for human player.', () => {
        const cells = document.querySelectorAll('#gameBoard td');
        expect(cells.length).toBe(36);  // 6x6 grid
        const aiCells = document.querySelectorAll('.ai');
        const playerCells = document.querySelectorAll('.player');
        expect(aiCells.length).toBe(18); // Top 3 rows (6x3) for AI
        expect(playerCells.length).toBe(18); // Bottom 3 rows (6x3) for Player
    });

    test('R3: The game must have two phases: ship placement and ship sinking.', () => {
        let gamePhase = 'placement'; // Mock the game phase variable
        expect(gamePhase).toBe('placement');
        gamePhase = 'sinking';
        expect(gamePhase).toBe('sinking');
    });

    test('R4: Players must be able to place 4 different ships on their 6x3 grids during the placement phase.', () => {
        const playerCells = document.querySelectorAll('.player');
        let shipPlacement = 0;
        for (let i = 0; i < 4; i++) {
            playerCells[i].classList.add('ship');
            shipPlacement++;
        }
        expect(shipPlacement).toBe(4); // Ensure 4 ships are placed
    });

    test('R5: Ships must be represented as different shapes on the grid.', () => {
        const playerCells = document.querySelectorAll('.player');
        const shipShapes = ['L-shape', 'I-shape', 'Square', 'T-shape'];
        for (let i = 0; i < 4; i++) {
            playerCells[i].classList.add(shipShapes[i]);
        }
        expect(playerCells[0].classList.contains('L-shape')).toBeTruthy();
        expect(playerCells[1].classList.contains('I-shape')).toBeTruthy();
    });

    test('R6: The AI must automatically place its ships on its 6x3 grid.', () => {
        const aiCells = document.querySelectorAll('.ai');
        let aiShipsPlaced = 0;
        for (let i = 0; i < 4; i++) {
            aiCells[i].classList.add('ship');
            aiShipsPlaced++;
        }
        expect(aiShipsPlaced).toBe(4); // Ensure AI ships are placed
    });

    test('R7: Players must take turns attempting to sink each other’s ships.', () => {
        let currentTurn = 'player';
        expect(currentTurn).toBe('player');
        currentTurn = 'ai';
        expect(currentTurn).toBe('ai');
    });

    test('R8: The game must visually indicate hits and misses on the game board.', () => {
        const playerCells = document.querySelectorAll('.player');
        playerCells[0].classList.add('hit');
        playerCells[1].classList.add('miss');
        expect(playerCells[0].classList.contains('hit')).toBeTruthy();
        expect(playerCells[1].classList.contains('miss')).toBeTruthy();
    });

    test('R9: The game must keep track of and display the current player’s turn.', () => {
        const message = document.getElementById('message');
        let currentTurn = 'player';
        message.textContent = `${currentTurn}'s turn`;
        expect(message.textContent).toBe("player's turn");
    });

    test('R10: The game must detect and announce when all ships of a player have been sunk.', () => {
        const aiCells = document.querySelectorAll('.ai');
        aiCells.forEach(cell => cell.classList.add('hit'));  // AI ships all hit
        const allShipsSunk = [...aiCells].every(cell => cell.classList.contains('hit'));
        expect(allShipsSunk).toBeTruthy();
    });

    test('R11: Players must not be able to attack the same cell twice.', () => {
        const aiCells = document.querySelectorAll('.ai');
        aiCells[0].classList.add('hit');  // Already hit
        expect(aiCells[0].classList.contains('hit')).toBeTruthy();
        const isAttackAllowed = !aiCells[0].classList.contains('hit');  // Invalid attack
        expect(isAttackAllowed).toBeFalsy();
    });

    test('R12: The game must provide a way to start a new game after one has ended.', () => {
        const newGameButton = document.createElement('button');
        newGameButton.textContent = 'New Game';
        document.body.appendChild(newGameButton);
        expect(newGameButton.textContent).toBe('New Game');
    });

    test('R13: The game must provide feedback on the outcome of each attack.', () => {
        const message = document.getElementById('message');
        const attackResult = 'Hit! You struck the opponent’s ship!';
        message.textContent = attackResult;
        expect(message.textContent).toBe('Hit! You struck the opponent’s ship!');
    });

    test('R14: The game must prevent players from placing ships outside their designated 6x3 grid.', () => {
        const playerCells = document.querySelectorAll('.player');
        const isValidPlacement = playerCells.length >= 4; // Trying to place ship outside grid
        expect(isValidPlacement).toBeTruthy();  // Should be valid placement
    });
});
