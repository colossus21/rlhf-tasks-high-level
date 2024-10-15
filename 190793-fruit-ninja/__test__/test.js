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
let canvas;
let ctx;

describe('Shape Slash Game Tests', () => {
    beforeEach(() => {
        dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
        document = dom.window.document;
        window = dom.window;
        canvas = window.document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');
    });

    it('R1: should include HTML, CSS, and JavaScript in a single file', () => {
        // Check that HTML structure exists
        expect(document.querySelector('html')).toBeDefined();
        expect(document.querySelector('body')).toBeDefined();
        expect(document.querySelector('canvas')).toBeDefined();

        // Check that CSS is either inline or within a <style> tag
        const styleTags = document.querySelectorAll('style');
        expect(styleTags.length).toBeGreaterThan(0);  // At least one <style> tag should exist
        expect(styleTags[0].textContent).toContain('body');  // Check for body styling

        // Check that JavaScript is included in a <script> tag
        const scriptTags = document.querySelectorAll('script');
        expect(scriptTags.length).toBeGreaterThan(0);  // At least one <script> tag should exist
        expect(scriptTags[0].textContent).toContain('const canvas');  // Check if script contains JavaScript code
    });

    // R2: Circles of different sizes at random intervals
    it('R2: should spawn circles with varying sizes', () => {
        window.spawnShape();
        window.spawnShape(); // Spawn multiple shapes
        const radius1 = window.shapes[0].radius;
        const radius2 = window.shapes[1].radius;
        expect(radius1).not.toBe(radius2); // Radii should be different with high probability
    });

    // R3: Circles appear at random positions at the top
    it('R3: should spawn circles at random x positions', () => {
        window.spawnShape();
        window.spawnShape();
        const x1 = window.shapes[0].x;
        const x2 = window.shapes[1].x;
        expect(x1).not.toBe(x2); // x-coordinates should be different with high probability
    });

    it('R3: should spawn circles near the top of the screen', () => {
        window.spawnShape();
        const shape = window.shapes[0];
        expect(shape.y).toBe(-shape.radius); // Should start above the canvas
    });

    // R4: Circles fall downwards at a constant speed
    it('R4: should update the position of circles downwards', () => {
        window.spawnShape();
        const shape = window.shapes[0];
        const initialY = shape.y;
        shape.update();
        expect(shape.y).toBeGreaterThan(initialY); // y position should increase
    });

    // R5, R6, R7: Click to slash, circle disappears, points earned
    it('R5-R7: should slash a circle on click, remove it, and increase score', () => {
        window.spawnShape();
        const shape = window.shapes[0];

        // Simulate click event
        const clickEvent = new window.MouseEvent('click', {
            clientX: shape.x + canvas.getBoundingClientRect().left,
            clientY: shape.y + canvas.getBoundingClientRect().top,
        });

        canvas.dispatchEvent(clickEvent);

        expect(window.shapes.length).toBe(0);  // Shape should be removed
        expect(window.score).toBe(1);  // Score should increase
    });

    // R8, R9, R10: Game over when circle falls, "Game Over" message, final score display
    it('R8-R10: should end the game if a circle falls off the screen and display "Game Over"', () => {
        window.spawnShape(); // spawn an initial shape
        // Forcefully move shape offscreen by changing its y
        window.shapes[0].y = canvas.height + 1; // Move the circle offscreen
        window.updateGame();
        expect(window.gameOver).toBe(true);
        expect(document.getElementById('game-over').style.display).toBe('block');
        expect(document.getElementById('final-score').innerText).toBe('0'); // Final score should be 0 at game over
    });

    // R11: Restart button
    it('R11: should restart the game when the restart button is clicked', () => {
        // Simulate a game over
        window.gameOver = true;
        window.score = 10;

        const restartButton = document.getElementById('restart-button');
        restartButton.click();

        expect(window.shapes.length).toBe(0);
        expect(window.score).toBe(0);
        expect(window.gameOver).toBe(false);
        expect(document.getElementById('game-over').style.display).toBe('none'); // Game over screen should be hidden
    });

    // R12: Visible play area with defined boundaries
    it('R12: should have a defined game area within the visible screen', () => {
        const canvas = document.getElementById('game-canvas');
        expect(canvas.width).toBeGreaterThan(0); // Check that canvas has a width
        expect(canvas.height).toBeGreaterThan(0); // Check that canvas has a height
    });

    // R13: Display current score during gameplay
    it('R13: should display the score', () => {
        window.score = 5;
        window.drawScore();  // Call drawScore function to update the displayed score
        expect(ctx.__getEvents()[0].type).toBe("fillText");
        expect(ctx.__getEvents()[0].text).toContain("Score: 5");
    });

    // R14: Circles have different colors
    it('R14: should spawn circles with different colors', () => {
        window.spawnShape();
        window.spawnShape();
        const color1 = window.shapes[0].color;
        const color2 = window.shapes[1].color;
        expect(color1).not.toBe(color2);  // Colors should be different with high probability
    });

    // R15-R16: Difficulty increases over time and visual feedback are assumed to be best tested via E2E.

    // R17: Start screen with "Start Game" button (No start screen implemented in current game structure)
});
