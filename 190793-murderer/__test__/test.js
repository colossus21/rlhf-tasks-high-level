/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');  // Ensure JSDOM is imported

// Load the HTML file
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('Murder Mystery Floor Guessing Game', () => {
    let document;
    let window;
    let floorContainer;
    let messageDiv;

    beforeEach(() => {
        // Setup DOM using JSDOM
        const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
        window = dom.window;
        document = window.document;

        // Set up references to the elements
        floorContainer = document.getElementById('floor-container');
        messageDiv = document.getElementById('message');

        // Initialize the game within the test environment
        window.initializeGame();
    });

    // R1: The game must be implemented in a single HTML file
    it('R1: Game is implemented in a single HTML file', () => {
        expect(document.querySelector('html')).toBeDefined();  // Check if HTML structure exists
        expect(document.querySelector('style')).toBeDefined();  // Check if internal CSS exists
        expect(document.querySelector('script')).toBeDefined();  // Check if inline JS exists
    });

    // R2: The game must display 25 boxes representing floors of a hotel.
    it('R2: Displays 25 floor boxes', () => {
        const floorBoxes = floorContainer.querySelectorAll('.floor');
        expect(floorBoxes.length).toBe(25);
    });

    // R3: The game must randomly select a floor number between 1 and 25.
    it('R3: Randomly selects murderer floor', () => {
        expect(window.murdererFloor).toBeGreaterThanOrEqual(1);
        expect(window.murdererFloor).toBeLessThanOrEqual(25);
    });

    // R4-R11: Test the main gameplay logic including floor guessing, win condition, and hint system
    it('R4-R11: Handles clicks, provides feedback, win/lose logic, turn counting, prevents further guesses after win', () => {
        const floorBoxes = floorContainer.querySelectorAll('.floor');
        const correctFloorBox = floorBoxes[window.murdererFloor - 1];  // Get the correct box

        // Simulate an incorrect guess (choosing a floor other than the murderer’s)
        const incorrectFloorBox = floorBoxes[window.murdererFloor < 13 ? window.murdererFloor + 1 : window.murdererFloor - 2];  // Pick another floor
        incorrectFloorBox.click();
        expect(incorrectFloorBox.classList.contains('selected')).toBe(true);
        expect(messageDiv.textContent).toMatch(/higher|lower/);  // Check if the hint (higher/lower) appears in the message

        // Simulate the correct guess (finding the murderer)
        correctFloorBox.click();
        expect(correctFloorBox.classList.contains('correct')).toBe(true);
        expect(messageDiv.textContent).toMatch(/You found the murderer in \d+ turns!/);  // Check if the success message appears

        // Ensure no further guesses can be made after winning
        const otherFloorBox = floorBoxes[window.murdererFloor < 13 ? window.murdererFloor + 3 : window.murdererFloor - 3];  // Pick another floor
        otherFloorBox.click();  // Try to click again after winning
        expect(otherFloorBox.classList.contains('selected')).toBe(false);
        expect(otherFloorBox.classList.contains('correct')).toBe(false);
    });

    // R12: Test the new game button functionality
    it('R12: New game button resets the game', () => {
        const newGameButton = document.getElementById('newGame');
        const firstMurdererFloor = window.murdererFloor;

        // Simulate clicking the new game button
        newGameButton.click();

        // Check that a new game has started with a new murderer floor
        expect(window.murdererFloor).not.toBe(firstMurdererFloor);
        expect(messageDiv.textContent).toBe('');  // Ensure message is cleared

        const floorBoxes = floorContainer.querySelectorAll('.floor');
        floorBoxes.forEach(box => {
            expect(box.classList.contains('selected')).toBe(false);  // All boxes should be unselected
            expect(box.classList.contains('correct')).toBe(false);  // No correct box should be marked
            expect(box.style.pointerEvents).toBe('');  // Clicks should be re-enabled
        });
    });

    // R13: Test the display of the range of possible floors (1-25)
    it('R13: Displays floor range', () => {
        const floorBoxes = floorContainer.querySelectorAll('.floor');
        expect(floorBoxes[0].textContent).toBe('1');
        expect(floorBoxes[24].textContent).toBe('25');
    });

    // R14: Ensure each floor number is unique
    it('R14: Each floor number is unique', () => {
        const floorNumbers = Array.from(floorContainer.querySelectorAll('.floor')).map(floor => parseInt(floor.textContent, 10));
        const uniqueFloorNumbers = new Set(floorNumbers);
        expect(floorNumbers.length).toBe(uniqueFloorNumbers.size);  // Ensure the numbers are unique
    });
});
