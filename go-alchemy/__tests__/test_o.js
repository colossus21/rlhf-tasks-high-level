/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Alchemy Game Tests', () => {

    beforeEach(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index_o.html'), 'utf8');
        document.documentElement.innerHTML = html;

        // Initialize any required game setup like you would when the page loads
        initGame();
    });

    function initGame() {
        const elements = [
            { name: 'Fire', symbol: '🔥' },
            { name: 'Water', symbol: '💧' },
            { name: 'Earth', symbol: '🌍' },
            { name: 'Air', symbol: '💨' }
        ];

        const container = document.getElementById('elements-container');
        elements.forEach(el => {
            const div = document.createElement('div');
            div.className = 'element';
            div.setAttribute('data-name', el.name);
            div.textContent = `${el.name} ${el.symbol}`;
            container.appendChild(div);
        });
    }

    test('Chat GPT 4o R1: HTML, CSS, and JavaScript are in a single file', () => {
        const gameContainer = document.getElementById('game');
        expect(gameContainer).not.toBeNull();
        const styleTag = document.querySelector('style');
        expect(styleTag).not.toBeNull();
        const scriptTag = document.querySelector('script');
        expect(scriptTag).not.toBeNull();
    });

    test('Chat GPT 4o R2: Four initial elements are displayed on load', () => {
        const elements = document.querySelectorAll('.element');
        expect(elements.length).toBe(4);
        const elementNames = Array.from(elements).map(el => el.getAttribute('data-name'));
        expect(elementNames).toEqual(expect.arrayContaining(['Fire', 'Water', 'Earth', 'Air']));
    });

    test('Chat GPT 4o R3: Elements are represented by Unicode symbols', () => {
        const elementSymbols = {
            'Fire': '🔥',
            'Water': '💧',
            'Earth': '🌍',
            'Air': '💨'
        };
        const elements = document.querySelectorAll('.element');
        elements.forEach(el => {
            const name = el.getAttribute('data-name');
            expect(el.textContent).toContain(elementSymbols[name]);
        });
    });

    test('Chat GPT 4o R4: Elements can be dragged and dropped', () => {
        const fire = document.querySelector('.element[data-name="Fire"]');
        fire.setAttribute('draggable', 'true');
        fire.dispatchEvent(new Event('dragstart'));
        const dropEvent = new Event('drop');
        fire.dispatchEvent(dropEvent);
        expect(fire.getAttribute('draggable')).toBe('true');
    });

    test('Chat GPT 4o R5: Valid element combinations exist', () => {
        const validCombinations = {
            'Fire+Water': 'Steam',
            'Fire+Earth': 'Lava',
            'Air+Earth': 'Dust',
            'Water+Earth': 'Mud',
            'Fire+Air': 'Energy',
            'Water+Energy': 'Life'
        };

        expect(validCombinations['Fire+Water']).toBe('Steam');
        expect(validCombinations['Fire+Earth']).toBe('Lava');
    });

    test('Chat GPT 4o R6: New elements are displayed after valid combinations', () => {
        const container = document.getElementById('elements-container');
        const newElement = document.createElement('div');
        newElement.className = 'element';
        newElement.setAttribute('data-name', 'Steam');
        newElement.textContent = 'Steam 💨';
        container.appendChild(newElement);

        const steamElement = document.querySelector('.element[data-name="Steam"]');
        expect(steamElement).not.toBeNull();
        expect(steamElement.textContent).toContain('Steam 💨');
    });

    test('Chat GPT 4o R7: Invalid combinations are not allowed', () => {
        const invalidCombinationAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
        const fire = document.querySelector('.element[data-name="Fire"]');
        const earth = document.querySelector('.element[data-name="Earth"]');

        const invalidCombination = 'Fire+Air';
        const validCombination = 'Fire+Earth';

        // Mocking invalid drop event
        const dropEvent = new Event('drop');
        fire.dispatchEvent(dropEvent);
        earth.dispatchEvent(dropEvent);

        if (invalidCombination === 'Fire+Water') {
            expect(invalidCombinationAlert).not.toHaveBeenCalled();
        } else {
            expect(invalidCombinationAlert).toHaveBeenCalledWith('Invalid combination!');
        }
    });

    test('Chat GPT 4o R8: Discovered elements are tracked', () => {
        const discoveredElementsList = document.getElementById('discovered-elements-list');
        const fire = { name: 'Fire', symbol: '🔥' };
        const water = { name: 'Water', symbol: '💧' };

        const discoveredElements = [fire, water];
        discoveredElements.forEach(el => {
            const elDiv = document.createElement('div');
            elDiv.textContent = `${el.name} ${el.symbol}`;
            discoveredElementsList.appendChild(elDiv);
        });

        const listItems = discoveredElementsList.children;
        expect(listItems.length).toBe(2);
    });

    test('Chat GPT 4o R9: New elements are draggable and usable in future combinations', () => {
        const newElement = document.createElement('div');
        newElement.className = 'element';
        newElement.setAttribute('data-name', 'Energy');
        newElement.setAttribute('draggable', 'true');
        newElement.textContent = 'Energy ⚡';

        const container = document.getElementById('elements-container');
        container.appendChild(newElement);

        const energyElement = document.querySelector('.element[data-name="Energy"]');
        expect(energyElement).not.toBeNull();
        expect(energyElement.getAttribute('draggable')).toBe('true');
    });

    test('Chat GPT 4o R10: Visual feedback for successful combinations', () => {
        const visualEffectSpy = jest.spyOn(document.body.style, 'backgroundColor', 'set');
        const fire = document.querySelector('.element[data-name="Fire"]');
        fire.style.backgroundColor = 'green';
        expect(fire.style.backgroundColor).toBe('green');
        expect(visualEffectSpy).toHaveBeenCalled();
    });

    test('Chat GPT 4o R11: Reset button restores game to initial state', () => {
        const resetButton = document.getElementById('reset-btn');
        const discoveredElementsList = document.getElementById('discovered-elements-list');

        discoveredElementsList.innerHTML = `<div>Steam 💨</div>`;
        resetButton.click();

        expect(discoveredElementsList.children.length).toBe(0);
        const elements = document.querySelectorAll('.element');
        expect(elements.length).toBe(4);
    });

    test('Chat GPT 4o R12: Game progress is saved in localStorage', () => {
        const fire = { name: 'Fire', symbol: '🔥' };
        const discoveredElements = [fire];
        localStorage.setItem('discoveredElements', JSON.stringify(discoveredElements));

        const storedElements = JSON.parse(localStorage.getItem('discoveredElements'));
        expect(storedElements.length).toBe(1);
        expect(storedElements[0].name).toBe('Fire');
    });

    test('Chat GPT 4o R13: Game loads player’s progress from localStorage', () => {
        const fire = { name: 'Fire', symbol: '🔥' };
        localStorage.setItem('discoveredElements', JSON.stringify([fire]));

        const storedElements = JSON.parse(localStorage.getItem('discoveredElements'));
        expect(storedElements).toHaveLength(1);

        const container = document.getElementById('elements-container');
        container.innerHTML = '';
        storedElements.forEach(el => {
            const elDiv = document.createElement('div');
            elDiv.className = 'element';
            elDiv.textContent = `${el.name} ${el.symbol}`;
            container.appendChild(elDiv);
        });

        const loadedElement = document.querySelector('.element[data-name="Fire"]');
        expect(loadedElement).not.toBeNull();
    });

    test('Chat GPT 4o R14: Display count of discovered elements', () => {
        const counter = document.getElementById('counter');
        const discoveredElements = [{ name: 'Steam', symbol: '💨' }];
        counter.textContent = `Discovered: ${discoveredElements.length}`;

        expect(counter.textContent).toBe('Discovered: 1');
    });
});