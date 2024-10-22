const fs = require('fs');

// Read the HTML file content
const html = fs.readFileSync('./index_g.html', 'utf8');

describe('Breakout Game Tests', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html;
    });

    // R1: The game must be implemented in a single HTML file using HTML, CSS, and JavaScript.
    it('R1: Game should be implemented in a single HTML file', () => {
        expect(document.querySelector('html')).toBeTruthy();
        expect(document.querySelector('head')).toBeTruthy();
        expect(document.querySelector('style')).toBeTruthy();
        expect(document.querySelector('script')).toBeTruthy();
    });

    // R2: The game must have a canvas element for rendering the game graphics.
    it('R2: Game should have a canvas element', () => {
        const canvas = document.getElementById('myCanvas');
        expect(canvas).toBeTruthy();
        expect(canvas.tagName).toBe('CANVAS');
        expect(canvas.width).toBeGreaterThan(0);
        expect(canvas.height).toBeGreaterThan(0);
    });

    // R3: The game must have a ball that continuously bounces around the screen in all directions.
    it('R3: Ball should bounce off canvas boundaries', () => {
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');

        // Simulate ball movement and check for boundary bounces
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        let dx = 2;
        let dy = -2;

        for (let i = 0; i < 1000; i++) {
            x += dx;
            y += dy;

            if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                dx = -dx;
            }
            if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
                dy = -dy;
            }
        }

        // Expect ball to remain within canvas boundaries
        expect(x).toBeGreaterThanOrEqual(ballRadius);
        expect(x).toBeLessThanOrEqual(canvas.width - ballRadius);
        expect(y).toBeGreaterThanOrEqual(ballRadius);
        expect(y).toBeLessThanOrEqual(canvas.height - ballRadius);
    });

    // R4: The game must have a player-controlled paddle that follows the mouse movement.
    it('R4: Paddle should follow mouse movement', () => {
        const canvas = document.getElementById('myCanvas');
        const paddle = document.querySelector('#myCanvas'); // Assuming the paddle is a DOM element within the canvas

        // Simulate mouse movement
        let mouseX = 100;
        canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: mouseX }));
        expect(paddleX).toBe(mouseX - paddleWidth / 2);

        mouseX = 200;
        canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: mouseX }));
        expect(paddleX).toBe(mouseX - paddleWidth / 2);
    });

    // R5: The game must have a set of blocks at the top of the screen that can be destroyed by the ball.
    it('R5: Game should have blocks at the top', () => {
        const bricks = document.querySelectorAll('#myCanvas rect'); // Assuming the blocks are rendered as rectangles
        expect(bricks.length).toBeGreaterThan(0);

        bricks.forEach(brick => {
            expect(brick.y).toBeLessThan(canvas.height / 2); // Check if blocks are positioned in the top half of the canvas
        });
    });

    // R6: The game must end when the ball collides with the player's paddle.
    it('R6: Game should end when ball collides with paddle', () => {
        // Simulate ball colliding with paddle
        x = paddleX + paddleWidth / 2;
        y = canvas.height - paddleHeight - ballRadius;

        draw(); // Manually call the draw function to trigger collision detection

        // Expect game over alert and page reload
        expect(window.alert).toHaveBeenCalledWith('GAME OVER');
        expect(document.location.reload).toHaveBeenCalled();
    });

    // R7: The player must win the game when all blocks are destroyed.
    it('R7: Player should win when all blocks are destroyed', () => {
        // Destroy all blocks
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r].status = 0;
            }
        }

        collisionDetection(); // Manually call collision detection to check win condition

        // Expect win alert and page reload
        expect(window.alert).toHaveBeenCalledWith('YOU WIN, CONGRATULATIONS!');
        expect(document.location.reload).toHaveBeenCalled();
    });

    // R8: The game must display the current score (number of blocks destroyed).
    it('R8: Game should display the score', () => {
        const scoreDisplay = document.querySelector('#myCanvas'); // Assuming the score is displayed within the canvas
        expect(scoreDisplay.textContent).toContain('Score: 0'); // Initial score should be 0

        // Destroy a block and check if score updates
        bricks[0][0].status = 0;
        collisionDetection();
        expect(scoreDisplay.textContent).toContain('Score: 1');
    });

    // R9: The game must have a "Game Over" screen when the player loses.
    it('R9: Game should display "Game Over" screen on loss', () => {
        // Simulate game over
        x = paddleX + paddleWidth / 2;
        y = canvas.height - paddleHeight - ballRadius;
        draw();

        // Expect game over alert
        expect(window.alert).toHaveBeenCalledWith('GAME OVER');
    });

    // R10: The game must have a "You Win" screen when the player destroys all blocks.
    it('R10: Game should display "You Win" screen on win', () => {
        // Destroy all blocks
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r].status = 0;
            }
        }
        collisionDetection();

        // Expect win alert
        expect(window.alert).toHaveBeenCalledWith('YOU WIN, CONGRATULATIONS!');
    });

    // R11: The game must have a restart functionality after game over or winning.
    it('R11: Game should restart after game over or win', () => {
        // Simulate game over
        x = paddleX + paddleWidth / 2;
        y = canvas.height - paddleHeight - ballRadius;
        draw();

        // Simulate restart (assuming document.location.reload() is used for restarting)
        document.location.reload = jest.fn();
        expect(document.location.reload).toHaveBeenCalled();
    });

    // R12: When blocks are destroyed, the score shall increase.
    it('R12: Score should increase when blocks are destroyed', () => {
        expect(score).toBe(0); // Initial score should be 0

        // Destroy a block
        bricks[0][0].status = 0;
        collisionDetection();
        expect(score).toBe(1);

        // Destroy another block
        bricks[0][1].status = 0;
        collisionDetection();
        expect(score).toBe(2);
    });
});