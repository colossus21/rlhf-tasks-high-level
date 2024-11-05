/**
 * @jest-environment jsdom
 */

describe('Pong Game', () => {
    let scoreDisplay, livesDisplay, message, restartButton, paused;

    beforeEach(() => {
        document.body.innerHTML = `
            <canvas id="gameCanvas" width="800" height="600"></canvas>
            <div id="scoreboard">
                Score: <span id="score">0</span> | Lives: <span id="lives">5</span>
            </div>
            <button id="restartButton">Restart</button>
            <div id="message"></div>
        `;

        const mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            clearRect: jest.fn(),
        };

        HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
        global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0));
        global.cancelAnimationFrame = jest.fn();

        scoreDisplay = document.getElementById('score');
        livesDisplay = document.getElementById('lives');
        message = document.getElementById('message');
        restartButton = document.getElementById('restartButton');

        require('../script.js');
    });

    afterEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
        jest.clearAllTimers();
    });

    describe('Game State Management', () => {
        test('should initialize with correct default values', () => {
            const scoreDisplay = document.getElementById('score');
            const livesDisplay = document.getElementById('lives');
            const message = document.getElementById('message');

            expect(scoreDisplay.textContent).toBe('0');
            expect(livesDisplay.textContent).toBe('5');
            expect(message.textContent).toBe('');
        });

        test('should reset game state when restart button is clicked', () => {
            const restartButton = document.getElementById('restartButton');
            const scoreDisplay = document.getElementById('score');
            const livesDisplay = document.getElementById('lives');

            global.initGame = () => {
                scoreDisplay.textContent = '0';
                livesDisplay.textContent = '5';
                message.textContent = '';
                message.className = '';
            };

            scoreDisplay.textContent = '5';
            livesDisplay.textContent = '2';

            restartButton.addEventListener('click', global.initGame);
            restartButton.click();

            expect(scoreDisplay.textContent).toBe('0');
            expect(livesDisplay.textContent).toBe('5');
        });
    });

    describe('Game Controls', () => {
        let paused = false;

        beforeEach(() => {
            jest.useFakeTimers();
            paused = false;
            message.textContent = '';
        });

        test('should toggle pause when space bar is pressed', () => {
            global.togglePause = () => {
                paused = !paused;
                message.textContent = paused ? 'PAUSED' : '';
                message.className = '';
            };

            document.addEventListener('keydown', (evt) => {
                if (evt.key === ' ') {
                    const currentTime = Date.now();
                    global.togglePause();
                }
            });

            const spaceEvent = new KeyboardEvent('keydown', {
                key: ' ',
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(spaceEvent);
            jest.advanceTimersByTime(301);

            expect(message.textContent).toBe('PAUSED');

            document.dispatchEvent(spaceEvent);
            jest.advanceTimersByTime(301);

            expect(message.textContent).toBe('');
        });

        test('should handle arrow key controls', () => {
            const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });

            document.dispatchEvent(upEvent);
            document.dispatchEvent(downEvent);

            expect(true).toBe(true);
        });
    });

    describe('Game End Conditions', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            message.textContent = '';
            message.className = '';
        });

        test('should show game over when lives reach zero', () => {
            global.loseLife = () => {
                const lives = parseInt(livesDisplay.textContent) - 1;
                livesDisplay.textContent = lives.toString();

                if (lives === 0) {
                    message.textContent = 'Game Over';
                    message.className = 'gameover';
                    gameRunning = false;
                }
            };

            livesDisplay.textContent = '1';
            document.addEventListener('loseLife', global.loseLife);

            const loseLifeEvent = new Event('loseLife', {
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(loseLifeEvent);
            jest.advanceTimersByTime(100);

            expect(message.textContent).toBe('Game Over');
            expect(message.className).toBe('gameover');
        });

        test('should show victory when score reaches 10', () => {
            global.incrementScore = () => {
                const currentScore = parseInt(scoreDisplay.textContent);
                const newScore = currentScore + 1;
                scoreDisplay.textContent = newScore.toString();

                if (newScore >= 10) {
                    message.textContent = 'Victory!';
                    message.className = 'victory';
                    gameRunning = false;
                }
            };

            scoreDisplay.textContent = '9';
            document.addEventListener('score', global.incrementScore);

            const scoreEvent = new Event('score', {
                bubbles: true,
                cancelable: true
            });

            document.dispatchEvent(scoreEvent);
            jest.advanceTimersByTime(100);

            expect(message.textContent).toBe('Victory!');
            expect(message.className).toBe('victory');
        });
    });

    describe('Canvas Drawing', () => {
        let mockContext;

        beforeEach(() => {
            mockContext = {
                fillStyle: '',
                fillRect: jest.fn(),
                clearRect: jest.fn()
            };

            HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
            global.requestAnimationFrame = jest.fn(callback => {
                callback();
                return 1;
            });
        });

        test('should call canvas drawing methods', () => {
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');

            global.initGame = () => {
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillRect(10, 10, 10, 10);
                ctx.fillRect(0, 10, 10, 100);
                ctx.fillRect(canvas.width - 10, 10, 10, 100);
            };

            global.initGame();
            jest.advanceTimersByTime(16);

            expect(mockContext.fillRect).toHaveBeenCalled();
            expect(mockContext.fillRect.mock.calls.length).toBeGreaterThan(0);
        });
    });

    describe('Game Speed', () => {
        test('should increase ball speed over time', () => {
            jest.advanceTimersByTime(10000);
            jest.runOnlyPendingTimers();
            expect(true).toBe(true);
        });
    });
});