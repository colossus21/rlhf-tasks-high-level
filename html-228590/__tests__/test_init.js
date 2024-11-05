/**
 * @jest-environment jsdom
 */

const fs = require('fs')
const path = require('path')

describe('Pong Game Tests', () => {
    let htmlContent;

    beforeAll(() => {
        const htmlPath = path.join(__dirname, '../i5.html');
        htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    });

    beforeEach(() => {
        document.documentElement.innerHTML = htmlContent;
    });

    it('initializes the game correctly', () => {
        expect(gameRunning).toBe(true);
        expect(paused).toBe(false);
        expect(playerScore).toBe(0);
        expect(lives).toBe(5);
    });

    it('updates scoreboard correctly', () => {
        playerScore = 10;
        lives = 3;
        updateScoreboard();
        expect(document.getElementById("score").textContent).toBe("10");
        expect(document.getElementById("lives").textContent).toBe("3");
    });

    it('ends game with "Game Over" when lives are 0', () => {
        lives = 0;
        loseLife();
        expect(gameRunning).toBe(false);
        expect(document.getElementById("message").textContent).toBe("Game Over");
    });

    it('ends game with victory if player reaches 10 points', () => {
        playerScore = 9;
        increaseBallSpeed = jest.fn();
        resetBall = jest.fn();
        moveEverything();
        expect(gameRunning).toBe(false);
        expect(document.getElementById("message").textContent).toBe("Victory");
        expect(increaseBallSpeed).toHaveBeenCalled();
        expect(resetBall).toHaveBeenCalled();
    });

    it('restarts the game when restart button is clicked', () => {
        const restartButton = document.getElementById("restartButton");
        restartButton.click();
        expect(gameRunning).toBe(true);
        expect(playerScore).toBe(0);
        expect(lives).toBe(5);
    });

    it('pauses and resumes the game with spacebar', () => {
        const event = new KeyboardEvent("keydown", { key: " " });
        document.dispatchEvent(event);
        expect(paused).toBe(true);
        document.dispatchEvent(event);
        expect(paused).toBe(false);
    });

    it('moves paddle up and down with arrow keys', () => {
        let initialPaddle1Y = paddle1Y;
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
        expect(paddle1Y).toBeLessThan(initialPaddle1Y);

        initialPaddle1Y = paddle1Y;
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
        expect(paddle1Y).toBeGreaterThan(initialPaddle1Y);
    });

    it('handles ball collision with the walls correctly', () => {
        ballY = 0;
        moveEverything();
        expect(ballSpeedY).toBeGreaterThan(0);

        ballY = canvas.height - BALL_SIZE;
        moveEverything();
        expect(ballSpeedY).toBeLessThan(0);
    });
});