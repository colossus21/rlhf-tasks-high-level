const fs = require('fs');
const path = require('path');

// Load the HTML file with the game code
const html = fs.readFileSync(path.resolve(__dirname, '../index_g.html'), 'utf8');

describe('Gemini Pro: Memory Game', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html;
    });

    // R1: The game must be implemented using HTML, CSS, and JavaScript.
    it('R1: should have HTML, CSS and JavaScript elements', () => {
        expect(document.querySelector('html')).toBeTruthy();
        expect(document.querySelector('style')).toBeTruthy();
        expect(document.querySelector('script')).toBeTruthy();
    });

    // R2: The game board must consist of a 4x4 grid of cells.
    it('R2: should have a 4x4 grid of cells', () => {
        const gridItems = document.querySelectorAll('.grid-item');
        expect(gridItems.length).toBe(16);
    });

    // R3: The game must have 8 pairs of colors randomly distributed across the 16 cells.
    it('R3: should have 8 pairs of colors randomly distributed', () => {
        const gridItems = document.querySelectorAll('.grid-item');
        const colors = [];
        gridItems.forEach(item => colors.push(item.dataset.color));

        // Check for 8 pairs of colors
        const colorCounts = {};
        colors.forEach(color => {
            colorCounts[color] = (colorCounts[color] || 0) + 1;
        });
        expect(Object.keys(colorCounts).length).toBe(8);
        for (const color in colorCounts) {
            expect(colorCounts[color]).toBe(2);
        }
    });

    // R4: Cells must start face-down (color hidden) and reveal their color when clicked.
    it('R4: should start face-down and reveal color when clicked', () => {
        const gridItem = document.querySelector('.grid-item');
        expect(gridItem.classList.contains('hidden')).toBe(true);
        gridItem.click();
        expect(gridItem.classList.contains('hidden')).toBe(false);
        expect(gridItem.style.backgroundColor).toBe(gridItem.dataset.color);
    });

    // R5: The game must allow the player to reveal only two cells at a time.
    it('R5: should only allow two cells to be revealed at a time', () => {
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems[0].click();
        gridItems[1].click();
        gridItems[2].click();
        expect(gridItems[0].classList.contains('hidden')).toBe(false);
        expect(gridItems[1].classList.contains('hidden')).toBe(false);
        expect(gridItems[2].classList.contains('hidden')).toBe(true);
    });

    // R6: The game must check for a match when two cells are revealed.
    // R7: Matched pairs must remain face-up for the duration of the game.
    it('R6/R7: should check for a match and keep matched pairs face-up', async () => {
        const gridItems = document.querySelectorAll('.grid-item');

        // Find two matching cells
        let firstItem, secondItem;
        for (let i = 0; i < gridItems.length - 1; i++) {
            for (let j = i + 1; j < gridItems.length; j++) {
                if (gridItems[i].dataset.color === gridItems[j].dataset.color) {
                    firstItem = gridItems[i];
                    secondItem = gridItems[j];
                    break;
                }
            }
            if (firstItem && secondItem) break;
        }

        firstItem.click();
        secondItem.click();

        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(firstItem.classList.contains('hidden')).toBe(false);
        expect(secondItem.classList.contains('hidden')).toBe(false);
        // Check if they are visually distinct (implementation dependent)
    });

    // R8: Unmatched pairs must be hidden after a short delay.
    it('R8: should hide unmatched pairs after a short delay', async () => {
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems[0].click();
        gridItems[1].click();

        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(gridItems[0].classList.contains('hidden')).toBe(true);
        expect(gridItems[1].classList.contains('hidden')).toBe(true);
    });

    // R9: The game must track and display the number of mistakes made by the player.
    it('R9: should track and display the number of mistakes', async () => {
        const gridItems = document.querySelectorAll('.grid-item');
        const mistakesDisplay = document.getElementById("mistakes");

        gridItems[0].click();
        gridItems[1].click();

        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(mistakesDisplay.textContent).toBe('1');
    });

    // R10: The game must end when the player makes 3 mistakes.
    // R11: The game must display a "Game Over" message when the player loses.
    it('R10/R11: should end the game after 3 mistakes and display "Game Over"', async () => {
        const gridItems = document.querySelectorAll('.grid-item');

        // Make 3 mistakes
        gridItems[0].click();
        gridItems[1].click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        gridItems[2].click();
        gridItems[3].click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        gridItems[4].click();
        gridItems[5].click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check for game over message (implementation dependent)
        expect(document.body.textContent).toContain('Game Over');
    });

    // R12: The game must end when all pairs are successfully matched.
    // R13: The game must display a "You Win" message when the player successfully matches all pairs.
    it('R12/R13: should end the game when all pairs are matched and display "You Win"', async () => {
        const gridItems = document.querySelectorAll('.grid-item');

        // Match all pairs (this requires knowing the color pairs beforehand)
        // ... code to programmatically match all pairs ...

        // Check for you win message (implementation dependent)
        expect(document.body.textContent).toContain('You won');
    });

    // R14: The game must include a restart button that appears after the game ends.
    it('R14: should have a restart button that appears after the game ends', async () => {
        const gridItems = document.querySelectorAll('.grid-item');
        const restartButton = document.getElementById("restart-button");

        // Make 3 mistakes to end the game
        gridItems[0].click();
        gridItems[1].click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        gridItems[2].click();
        gridItems[3].click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        gridItems[4].click();
        gridItems[5].click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(restartButton.style.display).toBe('block');

        // Click the restart button and check if the game resets
        restartButton.click();
        expect(restartButton.style.display).toBe('none');
        expect(document.getElementById("mistakes").textContent).toBe('0');
    });
});