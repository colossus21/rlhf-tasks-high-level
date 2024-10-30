const path = require('path');

class MockConsole {
    constructor() {
        this.output = [];
        this.promptResponses = [];
        this.alertMessages = [];
    }

    clear() {
        this.output = [];
        this.promptResponses = [];
        this.alertMessages = [];
    }

    log(message) {
        this.output.push(message);
    }

    prompt(message) {
        this.output.push(message);
        return this.promptResponses.shift() || 'a';
    }

    alert(message) {
        this.alertMessages.push(message);
    }

    setResponses(responses) {
        this.promptResponses = [...responses];
    }
}

describe('Quiz Application', () => {
    let mockConsole;
    let startTime;

    beforeEach(() => {
        jest.resetModules();
        mockConsole = new MockConsole();
        startTime = 1635600000000;

        global.console = {
            log: jest.fn((...args) => mockConsole.log(...args))
        };

        global.prompt = jest.fn((message) => mockConsole.prompt(message));
        global.alert = jest.fn((message) => mockConsole.alert(message));

        jest.spyOn(Date, 'now').mockImplementation(() => startTime);
        jest.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
        jest.restoreAllMocks();
        mockConsole.clear();
    });

    test('should handle correct answer', () => {
        mockConsole.setResponses(['a']);
        const quiz = require('../i.js');
        quiz.startQuiz();
        expect(mockConsole.output).toContain('Correct!');
    });

    test('should handle incorrect answer', () => {
        mockConsole.setResponses(['b', 'b', 'a']);
        const quiz = require('../i.js');
        quiz.startQuiz();
        expect(mockConsole.output).toContain('Incorrect. You have 1 more attempts left.');
    });

    test('should show question', () => {
        mockConsole.setResponses(['a']);
        const quiz = require('../i.js');
        quiz.startQuiz();
        expect(mockConsole.output[0]).toContain('What is the capital of France?');
    });

    test('should handle multiple questions', () => {
        mockConsole.setResponses(['a', 'c', 'b']);
        const quiz = require('../i.js');
        quiz.startQuiz();
        expect(mockConsole.alertMessages[0]).toContain('Quiz finished!');
    });

    test('should handle time limit', () => {
        startTime = Date.now();
        const quiz = require('../i.js');

        mockConsole.setResponses(['a']);

        let callCount = 0;
        jest.spyOn(Date, 'now').mockImplementation(() => {
            callCount++;
            return callCount === 1 ? startTime : startTime + (11 * 60 * 1000);
        });

        quiz.startQuiz();
        expect(mockConsole.output).toContain("Time's up!");
    });

    test('should show final score', () => {
        mockConsole.setResponses(['a', 'c', 'b']);
        const quiz = require('../i.js');
        quiz.startQuiz();
        expect(mockConsole.alertMessages[0]).toMatch(/score/);
    });

    test('should validate answers', () => {
        mockConsole.setResponses(['x', 'y', 'a']);
        const quiz = require('../i.js');
        quiz.startQuiz();
        expect(mockConsole.output).toContain('Invalid answer! Please choose from the available options.');
    });

    test('should handle case-insensitive answers', () => {
        mockConsole.setResponses(['A', 'C', 'B']);
        const quiz = require('../i.js');
        quiz.startQuiz();
        expect(mockConsole.output).toContain('Correct!');
    });

    test('should format questions', () => {
        mockConsole.setResponses(['a']);
        const quiz = require('../i.js');
        quiz.startQuiz();
        const question = mockConsole.output[0];
        expect(question).toMatch(/Question 1:/);
        expect(question).toContain('a)');
        expect(question).toContain('b)');
        expect(question).toContain('c)');
        expect(question).toContain('d)');
    });
});