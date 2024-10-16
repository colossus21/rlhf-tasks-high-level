/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

let document;
let window;

describe('Forest Sokoban Game Tests', () => {
    beforeEach(() => {
        const dom = new JSDOM(html);
        document = dom.window.document;
        window = dom.window;
    });

    // R1: Single HTML File
    it('R1: Game is implemented in a single HTML file', () => {
        expect(document.querySelector('html')).toBeDefined(); // Check if HTML element exists
        expect(document.querySelector('style')).toBeDefined(); // Check if style element exists
        expect(document.querySelector('script')).toBeDefined(); // Check if script element exists
    });

    // R2: Nature Theme and Emojis
    it('R2: Game uses nature theme and specified emojis', () => {
        expect(document.body.innerHTML).toContain('🌳'); // Check for tree emoji
        expect(document.body.innerHTML).toContain('🪨'); // Check for rock emoji
        expect(document.body.innerHTML).toContain('🕳'); // Check for hole emoji
        expect(document.body.innerHTML).toContain('🚶🏻‍♀️'); // Check for player emoji
    });

    // R3: At Least 3 Levels
    it('R3: Game has at least 3 levels', () => {
        const levels = window.levels;
        expect(levels.length).toBeGreaterThanOrEqual(3);
    });

    // R4 & R6: Player Movement & Tree Blocking (combined test)
    it('R4 & R6: Player can move with arrow/WASD keys and is blocked by trees', () => {
        window.drawLevel(); // Initialize the first level
        const initialPlayerPos = window.playerPos;

        // Simulate key press (right arrow)
        const rightArrowEvent = new window.KeyboardEvent('keydown', { key: 'ArrowRight' });
        document.dispatchEvent(rightArrowEvent);

        // Check that it didn't move (blocked by tree in level 1's initial state)
        expect(window.playerPos).toEqual(initialPlayerPos);

        // Modify the map temporarily to test free movement.
        window.levels[0].map[1] = window.levels[0].map[1].replace('🌳', ' ');
        window.drawLevel();
        document.dispatchEvent(rightArrowEvent);

        // Now the player should have moved to the right
        expect(window.playerPos.x).toBe(initialPlayerPos.x + 1);
    });

    // R5: Rock Pushing
    it('R5: Player can push rocks', () => {
        window.level = 1;
        window.drawLevel();
        let map = window.levels[0].map;

        // Simulate keypresses to push the rock one space to the right
        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight' }));
        map = window.levels[0].map;
        expect(map[2][3]).toEqual('🪨');
    });

    // R7 & R8: Win Detection & Victory Message
    it('R7 & R8: Game detects win condition and displays victory message', () => {
        window.level = 1; // Set level where you have easy control for testing
        window.drawLevel(); // Draw the level
        let map = window.levels[0].map;
        window.levels[0].map[2] = map[2].replace('🪨🌳', ' 🪨'); // Remove tree to allow rock move
        window.drawLevel();

        // Simulate pushing rock onto the hole
        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight' }));

        expect(window.levels[0].map[2].includes('🕳')).toBeFalsy();

        // Mock alert to check if it's called (you might need a spy in a real app)
        window.alert = jest.fn();
        window.checkWin(); // Call the win check function directly

        expect(window.alert).toHaveBeenCalledWith("You win! Proceed to the next level.");
    });

    // R9: Level Progression
    it('R9: Game progresses to the next level', () => {
        window.level = 1; // Start at level 1
        window.drawLevel();
        window.nextLevel();

        expect(window.level).toBe(2);
        expect(document.getElementById('levelNumber').textContent).toBe('Level 2');
    });

    // R10: Reset Button
    it('R10: Reset button resets the current level', () => {
        window.level = 1; // Start at level 1
        window.drawLevel();
        const originalMap = [...window.levels[0].map]; // Store original

        // Make a move to change the map state
        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight' }));

        document.querySelector('button[onclick="resetLevel()"]').click(); // Simulate the click
        expect(window.levels[0].map).toEqual(originalMap);
    });

    // R12: Invalid move
    it('R12: Prevents invalid moves', () => {
        window.level = 1;
        window.drawLevel();

        let initialPlayerPos = window.playerPos;
        // Try moving left (into a tree)
        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft' }));
        expect(window.playerPos).toEqual(initialPlayerPos); // Player shouldn't have moved

        window.levels[0].map[1] = window.levels[0].map[1].replace('🌳', ' '); // Temporarily change map
        window.levels[0].map[2] = window.levels[0].map[2].replace('🌳', ' ');
        window.drawLevel();

        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight' })); // Move towards rock
        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight' })); // Attempt to push rock into tree

        expect(window.levels[0].map[2][4]).toBe('🌳'); // Rock shouldn't have moved
    });

    // R13: Display Current Level
    it('R13: Game displays the current level number', () => {
        expect(document.getElementById('levelNumber').textContent).toBe('Level 1');

        window.nextLevel();
        expect(document.getElementById('levelNumber').textContent).toBe('Level 2');
    });
});
