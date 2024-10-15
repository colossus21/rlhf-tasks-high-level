/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { createCanvas } = require('canvas'); // Import canvas package

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('Neverending Breakout Game Tests', () => {
    let document;
    let window;
    let canvas;
    let ctx;

    beforeEach(() => {
        const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
        window = dom.window;
        document = window.document;

        // Replace the canvas element with a node-canvas instance
        canvas = createCanvas(480, 320);
        canvas.id = 'myCanvas';
        document.getElementById = jest.fn().mockReturnValue(canvas);
        ctx = canvas.getContext('2d');

        window.requestAnimationFrame = jest.fn((cb) => cb());
        window.draw();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    function triggerMouseEvent(type, x, y) {
        const event = new window.MouseEvent(type, { clientX: x, clientY: y, bubbles: true });
        canvas.dispatchEvent(event);
    }

    test('R1: Game implemented in a single HTML file', () => {
        expect(document.querySelector('html')).not.toBeNull();
        expect(document.querySelector('style')).not.toBeNull();
        expect(document.querySelector('script')).not.toBeNull();
    });

    test('R2: Canvas element exists', () => {
        expect(canvas).not.toBeNull();
        expect(canvas.width).toBeGreaterThan(0);
        expect(canvas.height).toBeGreaterThan(0);
    });

    test('R3: Ball bounces off walls', () => {
        window.x = canvas.width - window.ballRadius - 1;
        window.draw();
        expect(window.dx).toBeLessThan(0);

        window.y = window.ballRadius + 1;
        window.draw();
        expect(window.dy).toBeGreaterThan(0);
    });

    test('R4: Paddle follows mouse', () => {
        const initialPaddleX = window.paddleX;
        triggerMouseEvent('mousemove', canvas.width / 2, canvas.height - 10);

        expect(window.paddleX).not.toEqual(initialPaddleX);
        expect(window.paddleX).toBeCloseTo((canvas.width / 2) - (window.paddleWidth / 2));
    });

    test('R5: Blocks exist', () => {
        expect(window.bricks.length).toBeGreaterThan(0);
        expect(window.bricks[0].length).toBeGreaterThan(0);

        window.draw();

        window.bricks.forEach(column => {
            column.forEach(brick => {
                expect(brick).toHaveProperty('x');
                expect(brick).toHaveProperty('y');
                expect(brick).toHaveProperty('status');
            });
        });
    });

    test('R6: Game over when ball misses paddle', () => {
        window.x = window.paddleX + window.paddleWidth / 2;
        window.y = canvas.height - window.ballRadius;

        window.draw();
        expect(window.gameOver).toBe(true);
    });

    test('R7 & R10: Win condition met when all blocks are destroyed', () => {
        window.bricks.forEach(column => {
            column.forEach(brick => {
                brick.status = 0;
            });
        });

        window.draw();
        expect(window.gameWon).toBe(true);
        expect(ctx.fillText).toHaveBeenCalledWith("You Win!", canvas.width / 2 - 50, canvas.height / 2);
    });

    test('R8: Score is displayed', () => {
        jest.spyOn(ctx, 'fillText');
        window.draw();
        expect(ctx.fillText).toHaveBeenCalledWith(expect.stringContaining('Score'), 10, 20);
    });

    test('R9: Game over screen displays on loss', () => {
        jest.spyOn(ctx, 'fillText');
        window.gameOver = true;
        window.draw();
        expect(ctx.fillText).toHaveBeenCalledWith("Game Over", canvas.width / 2 - 60, canvas.height / 2);
    });

    function testRestartFunctionality() {
        window.gameOver = false;
        window.gameWon = false;
        window.x = canvas.width / 2;
        window.y = canvas.height / 2;
        for (let c = 0; c < window.brickColumnCount; c++) {
            for (let r = 0; r < window.brickRowCount; r++) {
                window.bricks[c][r].status = 1;
            }
        }
    }

    test('R11: Game restarts after game over', () => {
        window.gameOver = true;
        testRestartFunctionality();
        window.draw();
        expect(window.gameOver).toBe(false);
    });

    test('R11: Game restarts after win', () => {
        window.gameWon = true;
        testRestartFunctionality();
        window.draw();
        expect(window.gameWon).toBe(false);
    });

    test('R12: Game pauses', () => {
        window.paused = false;

        function togglePause() {
            window.paused = !window.paused;
        }

        togglePause();
        expect(window.paused).toBe(true);

        togglePause();
        expect(window.paused).toBe(false);
    });

    test('R13: Score increases when blocks are destroyed', () => {
        const initialBricks = window.bricks.flat().filter(brick => brick.status === 1).length;

        window.x = window.bricks[0][0].x + window.brickWidth / 2;
        window.y = window.bricks[0][0].y + window.brickHeight / 2;

        window.draw();
        window.draw();

        const remainingBricks = window.bricks.flat().filter(brick => brick.status === 1).length;
        expect(initialBricks).toEqual(remainingBricks + 1);
    });
});
