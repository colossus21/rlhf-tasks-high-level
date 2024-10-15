/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('Memory Game Tests', () => {
    let document;
    let gameBoard;
    let cards;
    let mistakesElement;
    let restartButton;

    beforeEach(() => {
        document = new DOMParser().parseFromString(html, 'text/html');
        // Run startGame to initialize the game and render the DOM
        document.documentElement.querySelector('script').textContent // Get script content from the HTML file.
            .replace('startGame();', ''); // Ensure startGame() isn't called automatically in HTML setup
        eval(document.documentElement.querySelector('script').textContent) // Execute script within JSDom context.
        global.startGame = startGame; // attach startGame() to the global context so it can be used in tests.
        startGame(); // Call startGame() to set up the game.

        // Now that the game is initialized, get the elements
        gameBoard = document.getElementById('game');
        mistakesElement = document.getElementById('mistakes');
        restartButton = document.getElementById('restart');
        cards = Array.from(gameBoard.querySelectorAll('.card'));
    });


    it('Requirement 1 & 2: Game board structure', () => {
        expect(gameBoard).toBeTruthy();
        expect(cards.length).toBe(16); // Check for 4x4 grid
    });

    it('Requirement 3: Unique color pairs', () => {
        const colors = cards.map(card => card.dataset.color);
        const colorCounts = {};
        colors.forEach(color => colorCounts[color] = (colorCounts[color] || 0) + 1);
        for (const color in colorCounts) {
            expect(colorCounts[color]).toBe(2);
        }
    });


    it('Requirement 4: Cards flip on click', () => {
        const card = cards[0];
        card.click();
        expect(card.classList.contains('flipped')).toBe(true);
        expect(card.style.backgroundColor).not.toBe('#ccc'); // or your default color
    });

    it('Requirement 5, 6, 8: Two card flip and match/mismatch logic', () => {
        const card1 = cards[0];
        const card2 = cards[1]; // Assuming these might not match initially

        card1.click();
        card2.click();

        expect(document.querySelectorAll('.flipped').length).toBe(2);

        //Simulate timeout for match check:
        jest.runAllTimers();

        if(card1.dataset.color === card2.dataset.color) {
            expect(card1.classList.contains('flipped')).toBe(true);
            expect(card2.classList.contains('flipped')).toBe(true);
        } else {
            expect(card1.classList.contains('flipped')).toBe(false);
            expect(card2.classList.contains('flipped')).toBe(false);
            expect(card1.style.backgroundColor).toBe('rgb(204, 204, 204)'); // check if the color is reset
            expect(card2.style.backgroundColor).toBe('rgb(204, 204, 204)');
        }
    });


    it('Requirement 7: Matched cards stay flipped', () => {
        const card1 = cards[0];
        const card2 = cards.find(c => c !== card1 && c.dataset.color === card1.dataset.color);

        card1.click();
        card2.click();
        jest.runAllTimers();// Wait for the match check


        expect(card1.classList.contains('flipped')).toBe(true);
        expect(card2.classList.contains('flipped')).toBe(true);

        card1.click(); // Try clicking matched cards again
        card2.click();
        expect(card1.classList.contains('flipped')).toBe(true);
        expect(card2.classList.contains('flipped')).toBe(true);
    });

    it('Requirement 9, 10: Mistake tracking and game over', () => {
        //Force mismatches
        cards.slice(0, 6).forEach(card => card.click());  // Click first 6 cards which must contain some mismatches
        jest.runAllTimers();  // Ensure all timeouts complete

        expect(parseInt(mistakesElement.textContent, 10)).toBeGreaterThanOrEqual(1);

        //Force enough mistakes to trigger game over
        cards.forEach(card => card.click());
        jest.runAllTimers();
        if(parseInt(mistakesElement.textContent, 10) >= 3) {
            expect(restartButton.style.display).toBe('block');
        }
    });

    it('Requirement 11: "Game Over" message (indirect test - assumption test)', () => {
        //Simulate losing scenario
        mistakesElement.textContent = "3";
        jest.runAllTimers(); // Check if the game over logic is called after a small delay
        expect(restartButton.style.display).toBe('block');
    });

    it('Requirement 12, 13: Win condition', () => {
        //Simulate a win by manually matching all cards
        const colors = cards.map(c => c.dataset.color);
        for(let i = 0; i < cards.length; i+=2){
            cards[i].dataset.color = colors[0];
            cards[i+1].dataset.color = colors[0];
            cards[i].click();
            cards[i+1].click();
            jest.runAllTimers(); // Wait for the checkForMatch function
        }

        expect(restartButton.style.display).toBe('block'); // Check if restart is displayed

    });



    it('Requirement 14, 15: Restart button functionality', () => {
        //Simulate game over to show button
        mistakesElement.textContent = "3";
        jest.runAllTimers();


        restartButton.click();

        expect(mistakesElement.textContent).toBe('0');
        expect(restartButton.style.display).toBe('none'); // Should be hidden after restart
        expect(document.querySelectorAll('.flipped').length).toBe(0); // All cards should be flipped back
    });

});