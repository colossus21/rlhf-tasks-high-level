/**
 * @jest-environment jsdom
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync(path.resolve(__dirname, '../i.html'), 'utf8');

let dom;
let document;
let window;

describe('Color Sequence Memory Game (inline JS)', () => {
    beforeEach(() => {
        dom = new JSDOM(html, { runScripts: 'dangerously' });
        document = dom.window.document;
        window = dom.window;

        const startButton = document.getElementById('start-button');
        startButton.click();
    });

    it('should create the game board correctly', () => {
        const gameBoard = document.getElementById('game-board');
        const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown'];
        expect(gameBoard.children.length).toBe(8);
        for (let i = 0; i < 8; i++) {
            const square = gameBoard.children[i];
            expect(square.classList.contains('square')).toBe(true);
            expect(square.classList.contains(colors[i])).toBe(true);
        }
    });

    it('should generate a random sequence', () => {
        const generatedSequence = dom.window.eval('sequence');
        expect(generatedSequence.length).toBe(5);
        generatedSequence.forEach(index => {
            expect(index).toBeGreaterThanOrEqual(0);
            expect(index).toBeLessThan(8);
        });
    });

    it('should display the sequence correctly', () => {
        jest.useFakeTimers();
        dom.window.eval('sequence = [0, 1]');
        dom.window.eval('showSequence()');
        const squares = Array.from(document.getElementsByClassName('square'));

        jest.advanceTimersByTime(1000);
        expect(squares[0].classList.contains('highlight')).toBe(true);

        jest.advanceTimersByTime(1000);
        expect(squares[0].classList.contains('highlight')).toBe(false);
        expect(squares[1].classList.contains('highlight')).toBe(true);

        jest.advanceTimersByTime(1000);
        expect(squares[1].classList.contains('highlight')).toBe(false);
        expect(dom.window.eval('showingSequence')).toBe(false);

        jest.useRealTimers();
    });

    it('should handle correct user input', () => {
        dom.window.eval('sequence = [0, 1]; currentSequenceIndex = 0;');
        dom.window.eval('alert = function() {}');
        const squares = Array.from(document.getElementsByClassName('square'));

        squares[0].click();
        expect(dom.window.eval('currentSequenceIndex')).toBe(1);

        squares[1].click();
        expect(dom.window.eval('currentSequenceIndex')).toBe(0);
        expect(dom.window.eval('sequence.length')).toBe(3);
    });

    it('should handle incorrect user input', () => {
        dom.window.eval('sequence = [0, 1]; currentSequenceIndex = 0;');
        dom.window.eval('alert = function() {}');
        const squares = Array.from(document.getElementsByClassName('square'));

        squares[2].click();
        expect(dom.window.eval('currentSequenceIndex')).toBe(0);
        expect(dom.window.eval('sequence.length')).toBe(5);
    });

    it('should start the game correctly', () => {
        const startButton = document.getElementById('start-button');
        const gameBoard = document.getElementById('game-board');
        const sequence = dom.window.eval('sequence');

        expect(gameBoard.children.length).toBe(8);
        expect(sequence.length).toBe(5);
        expect(startButton.disabled).toBe(true);
    });
});