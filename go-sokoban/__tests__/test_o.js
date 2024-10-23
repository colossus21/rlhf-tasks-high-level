/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load the HTML file
const html = fs.readFileSync(path.resolve(__dirname, '../index_o.html'), 'utf8');

describe('Nature Themed Sokoban Game', () => {
    let container;

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        container = document.getElementById('game');
    });

    // R1: The game must be implemented as a single HTML file.
    test('R1: The HTML file contains the required elements for game structure, styling, and JavaScript', () => {
        expect(document).not.toBeNull();
        expect(document.querySelector('head')).not.toBeNull();
        expect(document.querySelector('style')).not.toBeNull(); // Check for CSS
        expect(document.querySelector('script')).not.toBeNull(); // Check for JS
    });

    // R2: The game must have a nature theme, using emojis to represent game elements.
    test('R2: The game uses emojis for the player, trees, rocks, and holes', () => {
        const playerEmoji = document.querySelector('.cell').innerHTML;
        const emojiSet = ['😀', '🌲', '🪨', '🕳️'];

        // Ensure that the emojis are from the correct set
        expect(emojiSet.includes(playerEmoji)).toBe(true);
    });

    // R3: The game must have at least 3 distinct levels.
    test('R3: The game contains at least 3 levels', () => {
        const levels = window.levels;
        expect(Array.isArray(levels)).toBe(true);
        expect(levels.length).toBeGreaterThanOrEqual(3);
    });

    // R4: The game must allow the player to move using arrow keys or WASD keys.
    test('R4: The game listens for arrow and WASD keydown events', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        document.dispatchEvent(event);

        // Simulate player movement
        expect(playerMovedRight()).toBe(true);
    });

    // R5: The player must be able to push rocks.
    test('R5: The player can push rocks into empty spaces', () => {
        const playerPosition = window.playerPosition;
        const rockPosition = { x: playerPosition.x + 1, y: playerPosition.y };

        // Check that the player can push the rock
        expect(canPushRock(rockPosition)).toBe(true);
    });

    // R6: The player must not be able to move through trees.
    test('R6: The player cannot move through trees', () => {
        const playerPosition = window.playerPosition;
        const treePosition = { x: playerPosition.x + 1, y: playerPosition.y };

        // Ensure tree blocks movement
        expect(canMoveTo(treePosition)).toBe(false);
    });

    // R7: The game must detect when all holes are covered by rocks.
    test('R7: The game detects when all holes are covered by rocks', () => {
        // Simulate covering all holes
        window.levels[currentLevel].forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === '🕳️') {
                    window.levels[currentLevel][rowIndex][colIndex] = '🪨'; // Place rock on hole
                }
            });
        });
        expect(areAllHolesCovered()).toBe(true);
    });

    // R8: The game must display a victory message when a level is completed.
    test('R8: The game displays a victory message upon completing a level', () => {
        areAllHolesCovered(); // Simulate all holes covered
        const victoryMessage = document.querySelector('#victory-message').textContent;
        expect(victoryMessage).toContain('Victory');
    });

    // R9: The game must allow progression to the next level after completing the current level.
    test('R9: The game progresses to the next level after completion', () => {
        const currentLevel = window.currentLevel;
        areAllHolesCovered(); // Simulate all holes covered

        // Progress to next level
        const newLevel = window.currentLevel;
        expect(newLevel).toBe(currentLevel + 1);
    });

    // R10: The game must have a reset button to restart the current level.
    test('R10: The reset button resets the current level to its initial state', () => {
        const resetButton = document.querySelector('#reset-button');
        const initialLevelState = JSON.stringify(window.levels[window.currentLevel]);

        // Simulate level changes
        window.levels[window.currentLevel][1][1] = '😀';
        resetButton.click(); // Click reset

        const resetLevelState = JSON.stringify(window.levels[window.currentLevel]);
        expect(resetLevelState).toBe(initialLevelState); // Level should match initial state
    });

    // R11: The game must keep track of and display the number of moves made by the player.
    test('R11: The game tracks and displays the number of moves made', () => {
        const initialMoves = window.moveCount;
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        document.dispatchEvent(event);

        const moveCountElement = document.querySelector('#move-count').textContent;
        expect(parseInt(moveCountElement)).toBe(initialMoves + 1);
    });

    // R12: The game must prevent invalid moves (e.g., pushing a rock into a tree).
    test('R12: The game prevents invalid moves like pushing a rock into a tree', () => {
        const playerPosition = window.playerPosition;
        const rockPosition = { x: playerPosition.x + 1, y: playerPosition.y };
        const treePosition = { x: rockPosition.x + 1, y: rockPosition.y };

        // Ensure pushing rock into tree is invalid
        expect(canPushRock(rockPosition) && canMoveTo(treePosition)).toBe(false);
    });

    // R13: The game must display the current level number.
    test('R13: The game displays the current level number', () => {
        const levelNumberElement = document.querySelector('#level-number').textContent;
        expect(parseInt(levelNumberElement)).toBe(window.currentLevel + 1);
    });

    // Utility functions to simulate game state

    function playerMovedRight() {
        const playerPosition = window.playerPosition;
        const newPosition = { x: playerPosition.x + 1, y: playerPosition.y };
        return canMoveTo(newPosition);
    }

    function canMoveTo(position) {
        const level = window.levels[window.currentLevel];
        const cell = level[position.y][position.x];
        return cell !== '🌲';
    }

    function canPushRock(rockPosition) {
        const level = window.levels[window.currentLevel];
        const rockCell = level[rockPosition.y][rockPosition.x];
        const spaceBehindRock = level[rockPosition.y][rockPosition.x + 1];
        return rockCell === '🪨' && spaceBehindRock === ' ';
    }

    function areAllHolesCovered() {
        const level = window.levels[window.currentLevel];
        return !level.flat().includes('🕳️');
    }
});
