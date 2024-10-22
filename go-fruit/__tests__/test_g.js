const fs = require('fs');
const path = require('path');

// Load the HTML file
const html = fs.readFileSync(path.resolve(__dirname, '../index_g.html'), 'utf8');

describe('Gemini Pro: Shape Ninja Game', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html;
    });

    // R1: The game must be implemented in a single HTML file using HTML, CSS, and JavaScript.
    it('R1: Game should be implemented in a single HTML file', () => {
        expect(document.querySelector('html')).toBeTruthy();
        expect(document.querySelector('head')).toBeTruthy();
        expect(document.querySelector('body')).toBeTruthy();
        expect(document.querySelector('script')).toBeTruthy();
    });

    // R2: The game must spawn circles of different sizes at random intervals.
    it('R2: Circles of different sizes should spawn at random intervals', (done) => {
        setTimeout(() => {
            const circles = document.querySelectorAll('.shape');
            expect(circles.length).toBeGreaterThan(0);
            let differentSizes = false;
            let prevSize = null;
            circles.forEach(circle => {
                const size = circle.offsetWidth;
                if (prevSize !== null && size !== prevSize) {
                    differentSizes = true;
                }
                prevSize = size;
            });
            expect(differentSizes).toBe(true);
            done();
        }, 2500); // Wait for a few circles to spawn
    });

    // R3: The circles must appear at random positions at the top of the screen.
    it('R3: Circles should appear at random positions at the top', (done) => {
        setTimeout(() => {
            const circles = document.querySelectorAll('.shape');
            expect(circles.length).toBeGreaterThan(0);
            let randomPositions = false;
            let prevX = null;
            circles.forEach(circle => {
                const x = circle.offsetLeft;
                if (prevX !== null && x !== prevX) {
                    randomPositions = true;
                }
                prevX = x;
            });
            expect(randomPositions).toBe(true);
            done();
        }, 2500);
    });

    // R4: The circles must fall downwards at a constant speed.
    it('R4: Circles should fall downwards', (done) => {
        setTimeout(() => {
            const circle = document.querySelector('.shape');
            const initialY = circle.offsetTop;
            setTimeout(() => {
                expect(circle.offsetTop).toBeGreaterThan(initialY);
                done();
            }, 100); // Check after a short delay
        }, 1000); // Wait for a circle to spawn
    });

    // R5, R6, R7: Player interaction and scoring
    it('R5, R6, R7: Clicking circles should remove them and increase the score', () => {
        const circle = document.createElement('div');
        circle.classList.add('shape');
        document.getElementById('game-container').appendChild(circle);
        const initialScore = parseInt(document.getElementById('score').textContent.split(': ')[1]);
        circle.click();
        expect(document.querySelector('.shape')).toBeNull(); // Circle should be removed
        const newScore = parseInt(document.getElementById('score').textContent.split(': ')[1]);
        expect(newScore).toBe(initialScore + 1);
    });

    // R8, R9, R10: Game over condition and display
    it('R8, R9, R10: Game should end when a circle falls, display "Game Over", score, and restart button', (done) => {
        const gameContainer = document.getElementById('game-container');
        const circle = document.createElement('div');
        circle.classList.add('shape');
        gameContainer.appendChild(circle);
        circle.style.top = `${gameContainer.offsetHeight + 100}px`; // Move circle below the bottom

        setTimeout(() => {
            expect(document.getElementById('game-over').style.display).toBe('block');
            expect(document.getElementById('restart').style.display).toBe('block');
            expect(document.getElementById('score').textContent).toMatch(/Score: \d+/);
            done();
        }, 100);
    });

    // R11: Score display during gameplay
    it('R11: Score should be displayed during gameplay', () => {
        const scoreDisplay = document.getElementById('score');
        expect(scoreDisplay).toBeTruthy();
        expect(scoreDisplay.textContent).toBe('Score: 0');
    });

    // R12: Circles should have different colors
    it('R12: Circles should have different colors', (done) => {
        setTimeout(() => {
            const circles = document.querySelectorAll('.shape');
            expect(circles.length).toBeGreaterThan(0);
            let differentColors = false;
            let prevColor = null;
            circles.forEach(circle => {
                const color = circle.style.backgroundColor;
                if (prevColor !== null && color !== prevColor) {
                    differentColors = true;
                }
                prevColor = color;
            });
            expect(differentColors).toBe(true);
            done();
        }, 2500);
    });
});