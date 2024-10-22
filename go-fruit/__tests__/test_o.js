// Importing JSDOM utilities to create a virtual DOM
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Loading the index.html as a string
const html = fs.readFileSync(path.resolve(__dirname, '../index_o.html'), 'utf8');

let dom;
let document;

beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
    document = dom.window.document;
    jest.useFakeTimers(); // Use fake timers to control the random intervals
});

afterEach(() => {
    jest.clearAllTimers();
});

// R1: The game must be implemented in a single HTML file.
test('R1 - The game is implemented in a single HTML file', () => {
    expect(document.querySelector('html')).not.toBeNull();
    expect(document.querySelector('style')).not.toBeNull();
    expect(document.querySelector('script')).not.toBeNull();
});

// R2: The game must spawn circles of different sizes at random intervals.
test('R2 - Circles are spawned at random intervals with varying sizes', () => {
    const gameCanvas = document.querySelector('canvas');
    expect(gameCanvas).not.toBeNull();

    // Simulate time passage to trigger circle spawning
    jest.advanceTimersByTime(2000);
    const shapes = document.querySelectorAll('.shape'); // Assume '.shape' is the class used for circles
    expect(shapes.length).toBeGreaterThan(0);

    const sizeVariations = new Set();
    shapes.forEach(shape => {
        sizeVariations.add(shape.style.width); // Check that sizes vary
    });

    expect(sizeVariations.size).toBeGreaterThan(1); // Ensure different sizes exist
});

// R3: The circles must appear at random positions at the top of the screen.
test('R3 - Circles are generated at random x positions at the top of the screen', () => {
    const gameCanvas = document.querySelector('canvas');
    jest.advanceTimersByTime(2000);
    const shapes = document.querySelectorAll('.shape');

    shapes.forEach(shape => {
        const x = parseFloat(shape.style.left);
        const y = parseFloat(shape.style.top);
        expect(x).toBeGreaterThanOrEqual(0);  // Check that the x position is within canvas bounds
        expect(x).toBeLessThanOrEqual(gameCanvas.width);
        expect(y).toBe(0); // Shapes should appear at the top of the screen (y = 0)
    });
});

// R4: The circles must fall downwards at a constant speed.
test('R4 - Circles fall downwards at a constant speed', () => {
    jest.advanceTimersByTime(2000);
    const shapes = document.querySelectorAll('.shape');

    const initialPositions = Array.from(shapes).map(shape => parseFloat(shape.style.top));

    jest.advanceTimersByTime(1000); // Move shapes by one second

    const newPositions = Array.from(shapes).map(shape => parseFloat(shape.style.top));

    newPositions.forEach((pos, i) => {
        expect(pos).toBeGreaterThan(initialPositions[i]); // Shapes should move downwards
    });
});

// R5: The player must be able to slash circles by clicking on them.
test('R5 - Circles can be slashed by clicking', () => {
    jest.advanceTimersByTime(2000);
    const shape = document.querySelector('.shape');
    expect(shape).not.toBeNull();

    shape.click();

    expect(document.querySelector('.shape')).toBeNull(); // Shape should be removed after clicking
});

// R6: Slashed circles must disappear from the screen.
test('R6 - Slashed circles disappear from the screen', () => {
    jest.advanceTimersByTime(2000);
    const shape = document.querySelector('.shape');

    shape.click();

    expect(document.querySelectorAll('.shape').length).toBe(0); // Check if all slashed shapes are removed
});

// R7: The player must earn points for each successfully slashed circle.
test('R7 - Points are earned for slashing circles', () => {
    const scoreElement = document.getElementById('score');
    expect(scoreElement).not.toBeNull();

    jest.advanceTimersByTime(2000);
    const shape = document.querySelector('.shape');
    shape.click();

    expect(scoreElement.textContent).toContain('1'); // Score should increase after slashing a shape
});

// R8: The game must end when a circle falls below the bottom of the screen.
test('R8 - Game ends when a circle falls below the screen', () => {
    const gameCanvas = document.querySelector('canvas');
    jest.advanceTimersByTime(2000);
    const shape = document.querySelector('.shape');

    // Simulate the shape falling below the screen
    shape.style.top = `${gameCanvas.height + 10}px`;

    jest.advanceTimersByTime(1000); // Let game detect out-of-bounds shape

    const gameOverMessage = document.getElementById('game-over');
    expect(gameOverMessage).toBeDefined();
    expect(gameOverMessage.textContent).toContain('Game Over');
});

// R9: The game must display a "Game Over" message when it ends.
test('R9 - "Game Over" message is displayed when the game ends', () => {
    const gameCanvas = document.querySelector('canvas');
    jest.advanceTimersByTime(2000);
    const shape = document.querySelector('.shape');

    // Simulate shape falling out of screen
    shape.style.top = `${gameCanvas.height + 10}px`;

    jest.advanceTimersByTime(1000);

    const gameOverMessage = document.getElementById('game-over');
    expect(gameOverMessage.textContent).toBe('Game Over! Final Score: 0');
});

// R10: The final score and restart button must be displayed when the game ends.
test('R10 - Final score and restart button are displayed after game ends', () => {
    const gameCanvas = document.querySelector('canvas');
    jest.advanceTimersByTime(2000);
    const shape = document.querySelector('.shape');

    // Simulate shape falling out of screen
    shape.style.top = `${gameCanvas.height + 10}px`;

    jest.advanceTimersByTime(1000);

    const finalScore = document.getElementById('score');
    const restartBtn = document.getElementById('restart-btn');

    expect(finalScore.textContent).toContain('Final Score');
    expect(restartBtn.style.display).toBe('block'); // Restart button should be visible
});

// R11: The game must display the current score during gameplay.
test('R11 - Score is updated during gameplay', () => {
    const scoreElement = document.getElementById('score');
    expect(scoreElement).not.toBeNull();

    jest.advanceTimersByTime(2000);
    const shape = document.querySelector('.shape');
    shape.click();

    expect(scoreElement.textContent).toContain('1'); // Score updates in real-time
});

// R12: The circles must have different colors.
test('R12 - Circles have different colors', () => {
    jest.advanceTimersByTime(2000);
    const shapes = document.querySelectorAll('.shape');

    const colorSet = new Set();
    shapes.forEach(shape => {
        colorSet.add(shape.style.backgroundColor); // Collect colors of all shapes
    });

    expect(colorSet.size).toBeGreaterThan(1); // Ensure multiple colors exist
});
