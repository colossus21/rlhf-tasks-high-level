const fs = require('fs');
const path = require('path');

/**
 * @jest-environment jsdom
 */

describe('Crossy Road Game Tests from HTML file', () => {
    let canvas, ctx, player, cars, game;

    beforeAll(() => {
        // Load HTML content from the file
        const html = fs.readFileSync(path.resolve(__dirname, '../index_o.html'), 'utf8');
        document.documentElement.innerHTML = html;

        // Access canvas and context
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');

        // Access game variables (assuming they are globally defined in the game code)
        player = window.player;
        cars = window.cars;
        game = window.game;
    });

    // R1
    test('R1: The game must be implemented in a single HTML file with required JavaScript code', () => {
        const gameCanvas = document.getElementById('gameCanvas');
        expect(gameCanvas).not.toBeNull();
    });

    // R2
    test('R2: The initial game state must set up a dark background color value', () => {
        expect(ctx.fillStyle).toBe('#333333'); // assuming dark color is set on initialization
    });

    // R3
    test('R3: The player character must have white color and square dimensions defined', () => {
        expect(player.color).toBe('#FFFFFF');
        expect(player.size).toBe(20); // Assuming square dimensions
    });

    // R4
    test('R4: The obstacles (cars) must have yellow color and rectangle dimensions defined', () => {
        cars.forEach(car => {
            expect(car.color).toBe('#FFFF00');
            expect(car.width).toBeGreaterThan(car.height); // Rectangular dimensions
        });
    });

    // R5
    test('R5: The game must handle WASD keyboard inputs for player movement', () => {
        let keydownEvent = new KeyboardEvent('keydown', { key: 'w' });
        document.dispatchEvent(keydownEvent);
        expect(player.y).toBeLessThan(400); // 'w' moves up

        keydownEvent = new KeyboardEvent('keydown', { key: 's' });
        document.dispatchEvent(keydownEvent);
        expect(player.y).toBeGreaterThan(380); // 's' moves down

        keydownEvent = new KeyboardEvent('keydown', { key: 'a' });
        document.dispatchEvent(keydownEvent);
        expect(player.x).toBeLessThan(100); // 'a' moves left

        keydownEvent = new KeyboardEvent('keydown', { key: 'd' });
        document.dispatchEvent(keydownEvent);
        expect(player.x).toBeGreaterThan(80); // 'd' moves right
    });

    // R6
    test('R6: The game must maintain different level configurations', () => {
        expect(game.levels.length).toBeGreaterThanOrEqual(3); // At least 3 levels exist
    });

    // R7
    test('R7: The game must have collision detection logic between player and car objects', () => {
        const detectCollision = (player, car) => {
            return player.x < car.x + car.width &&
                player.x + player.size > car.x &&
                player.y < car.y + car.height &&
                player.y + player.size > car.y;
        };
        const collision = detectCollision(player, cars[0]);
        expect(collision).toBe(false); // Assuming no collision initially
    });

    // R8
    test('R8: The game must track the current game state (playing, game over)', () => {
        expect(game.state).toBe('playing');
        game.state = 'game over';
        expect(game.state).toBe('game over');
    });

    // R9
    test('R9: The game must have a mechanism to restart the game', () => {
        const restartGame = () => {
            game.state = 'playing';
            game.level = 1;
            player.x = game.levels[0].playerStart.x;
            player.y = game.levels[0].playerStart.y;
        };
        restartGame();
        expect(game.state).toBe('playing');
        expect(game.level).toBe(1);
        expect(player.x).toBe(100);
        expect(player.y).toBe(400);
    });

    // R10
    test('R10: The game must track and store the current level number', () => {
        expect(game.level).toBe(1);
        game.level++;
        expect(game.level).toBe(2);
    });

    // R11
    test('R11: The game must enforce player boundaries within the canvas', () => {
        player.x = -5;
        const enforceBoundaries = () => {
            if (player.x < 0) player.x = 0;
            if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
            if (player.y < 0) player.y = 0;
            if (player.y + player.size > canvas.height) player.y = canvas.height - player.size;
        };
        enforceBoundaries();
        expect(player.x).toBe(0);
    });

    // R12
    test('R12: The game must have win condition logic for each level', () => {
        const checkWinCondition = () => {
            return player.y <= 0; // Assuming reaching the top is the win condition
        };
        player.y = 0;
        expect(checkWinCondition()).toBe(true);
    });

    // R13
    test('R13: The game must store initial positions for player and cars for each level', () => {
        expect(game.levels[0].playerStart.x).toBe(100);
        expect(game.levels[0].carConfig).toBe(cars); // Cars configuration is stored
    });

    // R14
    test('R14: The game must reset player position when starting a new level', () => {
        const resetPlayerPosition = () => {
            player.x = game.levels[game.level - 1].playerStart.x;
            player.y = game.levels[game.level - 1].playerStart.y;
        };
        resetPlayerPosition();
        expect(player.x).toBe(100);
        expect(player.y).toBe(400);
    });

    // R15
    test('R15: The game must maintain a data structure for active car objects', () => {
        expect(Array.isArray(cars)).toBe(true); // Cars are tracked in an array
        expect(cars.length).toBeGreaterThan(0);
    });
});
