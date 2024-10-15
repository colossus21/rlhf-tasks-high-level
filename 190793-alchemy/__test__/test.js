/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Load the HTML file
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

let dom;
let document;
let window;

describe('Alchemy Game Tests', () => {
    beforeEach(() => {
        dom = new JSDOM(html, {
            runScripts: "dangerously",
            resources: "usable"
        });
        window = dom.window;
        document = window.document;
        window.displayElements() // Ensure elements are displayed before each test
        window.localStorage.clear() //Clear local storage before each test
    });

    // Helper functions to simulate drag and drop
    function dragStart(element) {
        let event = new window.DragEvent('dragstart');
        event.dataTransfer = new window.DataTransfer();
        event.dataTransfer.setData('text/plain', element.textContent);
        element.dispatchEvent(event);
    }

    function dropOn(target, data) {
        let event = new window.DragEvent('drop');
        event.dataTransfer = new window.DataTransfer();
        event.dataTransfer.setData('text/plain', data);
        target.dispatchEvent(event);
    }

    // R1, R2 & R3: Initial elements and Unicode
    it('R1, R2, R3: should have four initial elements with correct Unicode', () => {
        expect(document.querySelectorAll('.element').length).toBe(4);
        const symbols = Array.from(document.querySelectorAll('.element')).map(el => el.textContent);
        expect(symbols).toContain('🔥');
        expect(symbols).toContain('💧');
        expect(symbols).toContain('🌎');
        expect(symbols).toContain('💨');
    });

    // R4: Drag and drop (implicitly tested in combination tests)

    // R5, R6, R7, R8, R9: Combinations and New Element Display
    const combinations = [
        { elements: ['🔥', '💧'], result: 'Steam ♨️', count: 3 },
        { elements: ['🔥', '🌎'], result: 'Lava 🌋', count: 3 },
        { elements: ['💨', '🌎'], result: 'Dust 🌫️', count: 3 },
        { elements: ['💧', '🌎'], result: 'Mud 🫙', count: 3 },
        { elements: ['🔥', '💨'], result: 'Energy ⚡', count: 3 },
        { elements: ['💧', '⚡'], result: 'Life 🌱', count: 3 },
    ]

    combinations.forEach(({elements, result, count}) => {

        it(`R5, R6, R8, R9, R10: should combine ${elements[0]} and ${elements[1]} into ${result.slice(0,-3)}`, () => {

            const element1 = Array.from(document.querySelectorAll('.element')).find(el => el.textContent === elements[0]);
            const element2 = Array.from(document.querySelectorAll('.element')).find(el => el.textContent === elements[1]);



            dragStart(element1);
            dropOn(element2, elements[0]);

            expect(document.getElementById('combinations').innerHTML).toContain(`${elements[0]} + ${elements[1]} = ${result}`);
            expect(document.querySelectorAll('.element').length).toBe(count); // Check element count after combination
            const newElement = Array.from(document.querySelectorAll('.element')).find(el => el.textContent === result.slice(-2));
            // Check if the new element exists and is draggable:
            expect(newElement).toBeTruthy();
            expect(newElement.draggable).toBe(true);


            //R10 Visual feedback check - combination display
            expect(document.getElementById('combinations').innerHTML).toContain(`${elements[0]} + ${elements[1]} = ${result}`);

        });
    })


    it('R7: Should not combine invalid elements', () => {
        const fire = document.querySelector('.element:nth-child(1)');
        const fire2 = document.querySelector('.element:nth-child(1)');
        const originalCombinations = document.querySelectorAll('#combinations p');

        dragStart(fire);
        dropOn(fire2, '🔥');
        expect(document.getElementById('combinations').innerHTML).not.toContain('🔥 + 🔥 = ');
        expect(document.querySelectorAll('#combinations p').length).toBe(originalCombinations.length)
    })




    // R11: Reset game
    it('R11: should reset the game to its initial state', () => {

        const fire = document.querySelector('.element:nth-child(1)'); // Adjust if element order changes
        const water = document.querySelector('.element:nth-child(2)'); // Adjust if element order changes

        dragStart(fire);
        dropOn(water, '🔥');

        window.resetGame()
        expect(document.querySelectorAll('.element').length).toBe(4);
        const symbols = Array.from(document.querySelectorAll('.element')).map(el => el.textContent);
        expect(symbols).toContain('🔥');
        expect(symbols).toContain('💧');
        expect(symbols).toContain('🌎');
        expect(symbols).toContain('💨');
        expect(document.getElementById('combinations').innerHTML).toBe('');



    });

    // R12, R13: Local storage
    it('R12: should save discovered elements to local storage', () => {
        const fire = document.querySelector('.element:nth-child(1)'); // Adjust if element order changes
        const water = document.querySelector('.element:nth-child(2)'); // Adjust if element order changes

        dragStart(fire);
        dropOn(water, '🔥');

        const savedData = JSON.parse(window.localStorage.getItem('discoveredElements'))


        expect(Object.keys(savedData).length).toBe(5); //Initial 4 + Steam = 5
        expect(savedData['♨️']).toBeDefined(); // Check a specific element



    });

    it('R13: should load discovered elements from local storage', () => {
        window.localStorage.setItem('discoveredElements', JSON.stringify({"🔥":{},"💧":{},"🌎":{},"💨":{},"♨️":{}}))
        window.loadGame()

        expect(document.querySelectorAll('.element').length).toBe(5);
        expect(Array.from(document.querySelectorAll('.element')).map(x => x.textContent)).toContain('♨️')
    });


    // R14, R15: Display Count and Discovered Elements
    it('R14: should display a count of discovered elements', () => {

        const countDisplay = document.getElementById('elementCount')
        expect(countDisplay).toBeTruthy()
        expect(countDisplay.textContent).toBe('4');


        const fire = document.querySelector('.element:nth-child(1)'); // Adjust if element order changes
        const water = document.querySelector('.element:nth-child(2)'); // Adjust if element order changes

        dragStart(fire);
        dropOn(water, '🔥');
        expect(countDisplay.textContent).toBe('5');

    });
});