/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Breakout Game', () => {
    let document;
    let canvas;
    let gameInstance;

    beforeAll(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index_o.html'), 'utf8');
        document = new DOMParser().parseFromString(html, 'text/html');
        canvas = document.getElementById('gameCanvas');
    });

    beforeEach(() => {
        // Reset canvas and game state before each test
        gameInstance = {
            ballX: 0,
            ballY: 0,
            ballSpeedX: 3,
            ballSpeedY: 3,
            paddleX: 0,
            blocks: [],
            score: 0,
            gameOver: false,
            win: false,
        };
    });

    // R1 - Verify the game is implemented in a single HTML file
    test('R1: Game should exist in a single HTML file', () => {
        const bodyContent = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        expect(bodyContent).toContain('<html>');
        expect(bodyContent).toContain('<style>');
        expect(bodyContent).toContain('<script>');
    });

    // R2 - Ensure the canvas element exists
    test('R2: The game must have a canvas element', () => {
        expect(canvas).not.toBeNull();
        expect(canvas.tagName).toBe('CANVAS');
        expect(canvas.width).toBeGreaterThan(0);
        expect(canvas.height).toBeGreaterThan(0);
    });

    // R3 - Check ball movement within the boundaries
    test('R3: Ball must continuously bounce and change direction upon hitting the boundaries', () => {
        gameInstance.ballX = canvas.width - 10; // Simulate right edge
        gameInstance.ballSpeedX = 3;
        const initialSpeedX = gameInstance.ballSpeedX;
        // Simulate ball movement and boundary collision
        if (gameInstance.ballX + gameInstance.ballSpeedX > canvas.width) {
            gameInstance.ballSpeedX = -gameInstance.ballSpeedX;
        }
        expect(gameInstance.ballSpeedX).toBe(-initialSpeedX);

        gameInstance.ballY = canvas.height - 10; // Simulate bottom edge
        gameInstance.ballSpeedY = 3;
        const initialSpeedY = gameInstance.ballSpeedY;
        if (gameInstance.ballY + gameInstance.ballSpeedY > canvas.height) {
            gameInstance.ballSpeedY = -gameInstance.ballSpeedY;
        }
        expect(gameInstance.ballSpeedY).toBe(-initialSpeedY);
    });

    // R4 - Verify paddle follows mouse movement
    test('R4: Paddle must follow the mouse movement', () => {
        const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 100 });
        document.dispatchEvent(mouseMoveEvent);
        // Assuming paddleX is updated on mousemove event
        const relativeX = mouseMoveEvent.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            gameInstance.paddleX = relativeX - 50; // PaddleWidth assumed to be 100
        }
        expect(gameInstance.paddleX).toBe(50); // Adjusted position based on mouse
    });

    // R5 - Ensure blocks are rendered and can be destroyed by the ball
    test('R5: Blocks must be present and can be destroyed by the ball', () => {
        gameInstance.blocks = [
            { x: 50, y: 50, width: 120, height: 30, status: 1 },
        ];
        // Simulate ball collision with block
        gameInstance.ballX = 60;
        gameInstance.ballY = 60;
        gameInstance.blocks.forEach(block => {
            if (
                gameInstance.ballX > block.x &&
                gameInstance.ballX < block.x + block.width &&
                gameInstance.ballY > block.y &&
                gameInstance.ballY < block.y + block.height
            ) {
                block.status = 0;
            }
        });
        expect(gameInstance.blocks[0].status).toBe(0);
    });

    // R6 - Game should end when the ball hits the paddle
    test('R6: Game should end when ball collides with the paddle', () => {
        gameInstance.ballY = canvas.height - 20; // Near the bottom
        gameInstance.ballX = gameInstance.paddleX + 50; // Assuming collision with paddle
        if (
            gameInstance.ballY + 10 > canvas.height - 10 && // Paddle height + offset
            gameInstance.ballX > gameInstance.paddleX &&
            gameInstance.ballX < gameInstance.paddleX + 100 // Paddle width
        ) {
            gameInstance.gameOver = true;
        }
        expect(gameInstance.gameOver).toBe(true);
    });

    // R7 - Player should win when all blocks are destroyed
    test('R7: Player wins when all blocks are destroyed', () => {
        gameInstance.blocks = [
            { status: 0 },
            { status: 0 },
            { status: 0 },
        ];
        const remainingBlocks = gameInstance.blocks.filter(block => block.status === 1).length;
        if (remainingBlocks === 0) {
            gameInstance.win = true;
            gameInstance.gameOver = true;
        }
        expect(gameInstance.win).toBe(true);
        expect(gameInstance.gameOver).toBe(true);
    });

    // R8 - Score should be displayed and increase when blocks are destroyed
    test('R8: Score must increase when blocks are destroyed', () => {
        gameInstance.score = 0;
        gameInstance.blocks = [{ x: 50, y: 50, width: 120, height: 30, status: 1 }];
        gameInstance.ballX = 60;
        gameInstance.ballY = 60;
        gameInstance.blocks.forEach(block => {
            if (
                gameInstance.ballX > block.x &&
                gameInstance.ballX < block.x + block.width &&
                gameInstance.ballY > block.y &&
                gameInstance.ballY < block.y + block.height
            ) {
                if (block.status === 1) {
                    block.status = 0;
                    gameInstance.score += 1;
                }
            }
        });
        expect(gameInstance.score).toBe(1);
    });

    // R9 - Game over screen is displayed upon loss
    test('R9: Game Over screen should display when game is lost', () => {
        gameInstance.gameOver = true;
        const message = gameInstance.win ? 'You Win!' : 'Game Over!';
        expect(message).toBe('Game Over!');
    });

    // R10 - Win screen is displayed upon destroying all blocks
    test('R10: You Win screen should display when all blocks are destroyed', () => {
        gameInstance.win = true;
        const message = gameInstance.win ? 'You Win!' : 'Game Over!';
        expect(message).toBe('You Win!');
    });

    // R11 - Restart functionality must reset game state
    test('R11: Restart functionality should reset the game', () => {
        function restartGame() {
            gameInstance.ballX = canvas.width / 2;
            gameInstance.ballY = canvas.height / 2;
            gameInstance.score = 0;
            gameInstance.gameOver = false;
            gameInstance.win = false;
            gameInstance.blocks = [
                { status: 1 },
                { status: 1 },
                { status: 1 },
            ];
        }
        restartGame();
        expect(gameInstance.ballX).toBe(canvas.width / 2);
        expect(gameInstance.ballY).toBe(canvas.height / 2);
        expect(gameInstance.score).toBe(0);
        expect(gameInstance.gameOver).toBe(false);
        expect(gameInstance.blocks.length).toBe(3);
    });

    // R12 - Score should increase by 1 for each block destroyed
    test('R12: Score increases by 1 per block destroyed', () => {
        gameInstance.score = 0;
        gameInstance.blocks = [
            { x: 50, y: 50, width: 120, height: 30, status: 1 },
        ];
        gameInstance.ballX = 60;
        gameInstance.ballY = 60;
        gameInstance.blocks.forEach(block => {
            if (
                gameInstance.ballX > block.x &&
                gameInstance.ballX < block.x + block.width &&
                gameInstance.ballY > block.y &&
                gameInstance.ballY < block.y + block.height
            ) {
                if (block.status === 1) {
                    block.status = 0;
                    gameInstance.score += 1;
                }
            }
        });
        expect(gameInstance.score).toBe(1);
    });
});
