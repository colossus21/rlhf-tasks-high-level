/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Load the HTML and JavaScript files
const html = fs.readFileSync(path.resolve(__dirname, '../i.html'), 'utf8');
const js = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');

// Create a JSDOM instance
let dom;
let document;
let window;

describe('Color Sequence Memory Game', () => {
    beforeEach(() => {
        dom = new JSDOM(html, { runScripts: 'dangerously' });
        document = dom.window.document;
        window = dom.window;

        // Execute the JavaScript code
        dom.window.eval(js);
    });

    it('should create the game board correctly', () => {
        window.createBoard();
        const gameBoard = document.getElementById('game-board');
        expect(gameBoard.children.length).toBe(8);
        for (let i = 0; i < 8; i++) {
            const tile = gameBoard.children[i];
            expect(tile.classList.contains('color-tile')).toBe(true);
            expect(tile.classList.contains(window.colors[i])).toBe(true);
            expect(tile.dataset.color).toBe(window.colors[i]);
        }
    });

    it('should generate a random sequence', () => {
        window.generateSequence();
        expect(window.sequence.length).toBe(1);
        expect(window.colors.includes(window.sequence[0])).toBe(true);
    });

    it('should display the sequence correctly', () => {
        jest.useFakeTimers();
        window.sequence = ['red', 'blue'];
        window.displaySequence();
        expect(window.message.textContent).toBe('Watch the sequence!');

        jest.advanceTimersByTime(1000);
        const redTile = document.querySelector('.color-tile.red');
        expect(redTile.classList.contains('active')).toBe(true);

        jest.advanceTimersByTime(500);
        expect(redTile.classList.contains('active')).toBe(false);

        jest.advanceTimersByTime(1000);
        const blueTile = document.querySelector('.color-tile.blue');
        expect(blueTile.classList.contains('active')).toBe(true);

        jest.advanceTimersByTime(500);
        expect(blueTile.classList.contains('active')).toBe(false);
        expect(window.message.textContent).toBe('Your turn!');

        jest.useRealTimers();
    });

    it('should handle correct user input', () => {
        window.sequence = ['red', 'blue'];
        window.displaySequence = jest.fn(); // Mock displaySequence to prevent execution

        const redTile = document.querySelector('.color-tile.red');
        redTile.click();
        expect(window.userSequence).toEqual(['red']);

        const blueTile = document.querySelector('.color-tile.blue');
        blueTile.click();
        expect(window.userSequence).toEqual([]);
        expect(window.currentLevel).toBe(1);
        expect(window.message.textContent).toBe('Great job! Get ready for level 2');
        // Add assertion for setTimeout call with generateSequence and displaySequence
    });

    it('should handle incorrect user input', () => {
        window.sequence = ['red', 'blue'];
        window.displaySequence = jest.fn();

        const greenTile = document.querySelector('.color-tile.green');
        greenTile.click();
        expect(window.message.textContent).toBe(
            'Game Over! Click "Start Game" to try again.'
        );
    });

    it('should start and reset the game correctly', () => {
        window.createBoard = jest.fn();
        window.generateSequence = jest.fn();
        window.displaySequence = jest.fn();
        window.startGame();
        expect(window.sequence).toEqual([]);
        expect(window.userSequence).toEqual([]);
        expect(window.currentLevel).toBe(0);
        expect(window.message.textContent).toBe('');
        expect(window.createBoard).toHaveBeenCalled();
        expect(window.generateSequence).toHaveBeenCalled();
        // Add assertion for setTimeout with displaySequence

        window.resetGame();
        expect(window.sequence).toEqual([]);
        expect(window.userSequence).toEqual([]);
        expect(window.currentLevel).toBe(0);
        expect(window.message.textContent).toBe('');
    });
});