/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe("ChatGPT 4o Floor Guessing Game", () => {
    beforeEach(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index_o.html'), 'utf8');
        document.documentElement.innerHTML = html;

        // Ensure script runs if present in HTML
        const scriptTags = document.querySelectorAll('script');
        scriptTags.forEach(scriptTag => {
            eval(scriptTag.innerHTML);
        });
    });

    // R1 - Ensure the game is implemented in a single HTML file
    test('R1: Game structure exists in a single HTML file', () => {
        expect(document.querySelector('div.hotel')).not.toBeNull();
        expect(document.querySelector('style')).not.toBeNull();
        expect(document.querySelector('script')).not.toBeNull();
    });

    // R2 - The game must display 25 boxes representing floors of a hotel
    test('R2: 25 floor boxes are generated', () => {
        const floors = document.querySelectorAll('.floor');
        expect(floors.length).toBe(25);
    });

    // R3 - The game must randomly select a floor number between 1 and 25
    test('R3: Random floor is selected between 1 and 25 for murderer', () => {
        window.selectMurdererFloor();
        const murdererFloor = window.murdererFloor;
        expect(murdererFloor).toBeGreaterThanOrEqual(1);
        expect(murdererFloor).toBeLessThanOrEqual(25);
    });

    // R4 - Players must be able to click the boxes to guess the murderer's location
    test('R4: Player can click on the floor box and make guesses', () => {
        const floor = document.querySelector('.floor');
        expect(floor).not.toBeNull();
        floor.click();
        const gameStatus = document.getElementById('gameStatus').textContent;
        expect(gameStatus).not.toBe('Find the murderer!');
    });

    // R5 - The game must provide feedback after each guess
    test('R5: Feedback provided after each guess', () => {
        const floor = document.querySelector('.floor');
        floor.click();
        const gameStatus = document.getElementById('gameStatus').textContent;
        expect(gameStatus).not.toBe('Find the murderer!');
    });

    // R6 - Correct guesses must turn the box background to dark red
    test('R6: Correct guess turns the background dark red', () => {
        const correctFloor = window.murdererFloor;
        const floorDiv = document.querySelectorAll('.floor')[correctFloor - 1];
        floorDiv.click();
        expect(floorDiv.style.backgroundColor).toBe('darkred');
    });

    // R7 - Incorrect guesses must turn the box background to yellow with white text
    test('R7: Incorrect guess turns the background yellow with white text', () => {
        const wrongFloor = window.murdererFloor === 1 ? 2 : 1;
        const floorDiv = document.querySelectorAll('.floor')[wrongFloor - 1];
        floorDiv.click();
        expect(floorDiv.style.backgroundColor).toBe('yellow');
        expect(floorDiv.style.color).toBe('white');
    });

    // R8 - The game must display a "higher" or "lower" hint for incorrect guesses
    test('R8: Higher or lower hint is displayed for incorrect guesses', () => {
        const wrongFloor = window.murdererFloor === 1 ? 2 : 1;
        const floorDiv = document.querySelectorAll('.floor')[wrongFloor - 1];
        floorDiv.click();
        const gameStatus = document.getElementById('gameStatus').textContent;
        if (wrongFloor < window.murdererFloor) {
            expect(gameStatus).toBe('The murderer lives on a higher floor!');
        } else {
            expect(gameStatus).toBe('The murderer lives on a lower floor!');
        }
    });

    // R9 - The game must keep track of the number of turns taken by the player
    test('R9: Track the number of turns taken', () => {
        document.querySelectorAll('.floor')[0].click();
        document.querySelectorAll('.floor')[1].click();
        expect(window.guessCount).toBe(2);
    });

    // R10 - The game must display a win message with the number of turns
    test('R10: Win message with turn count is displayed', () => {
        const correctFloor = window.murdererFloor;
        document.querySelectorAll('.floor')[correctFloor - 1].click();
        const gameStatus = document.getElementById('gameStatus').textContent;
        expect(gameStatus).toMatch(/You have found the murderer in \d+ turns!/);
    });

    // R11 - The game must prevent further guesses after the correct floor is found
    test('R11: Further guesses are prevented after the correct guess', () => {
        const correctFloor = window.murdererFloor;
        document.querySelectorAll('.floor')[correctFloor - 1].click();
        document.querySelectorAll('.floor')[correctFloor === 1 ? 2 : 1].click();
        const gameStatus = document.getElementById('gameStatus').textContent;
        expect(gameStatus).toMatch(/You have found the murderer in \d+ turns!/);
    });

    // R12 - The game must have a way to start a new game after completion
    test('R12: New Game button resets the game', () => {
        document.getElementById('newGame').click();
        expect(document.getElementById('gameStatus').textContent).toBe('Find the murderer!');
        expect(window.guessCount).toBe(0);
    });

    // R13 - The game must display the range of possible floor numbers (1-25)
    test('R13: Display the range of possible floors', () => {
        const floors = document.querySelectorAll('.floor');
        const floorNumbers = Array.from(floors).map(floor => parseInt(floor.textContent));
        expect(floorNumbers).toEqual([...Array(25).keys()].map(i => i + 1));
    });

    // R14 - The game must ensure each floor number is unique and appears only once
    test('R14: Ensure each floor number is unique', () => {
        const floors = document.querySelectorAll('.floor');
        const floorNumbers = Array.from(floors).map(floor => floor.textContent);
        const uniqueNumbers = new Set(floorNumbers);
        expect(uniqueNumbers.size).toBe(25);
    });
});
