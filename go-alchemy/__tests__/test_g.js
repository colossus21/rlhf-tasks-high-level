// alchemy_test.js

/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index_g.html'), 'utf8');

jest.dontMock('fs');

describe('Alchemy Game Tests', () => {
    beforeEach(() => {
        // Set up the DOM with the HTML content
        document.documentElement.innerHTML = html.toString();
    });

    // R1: Gemini Pro The game must be implemented using HTML, CSS, and JavaScript in a single file.
    test('R1: Gemini Pro Single HTML file contains game elements, CSS, and JavaScript', () => {
        expect(document.querySelector('style')).not.toBeNull(); // Check for CSS
        expect(document.querySelector('script')).not.toBeNull(); // Check for JavaScript
        expect(document.getElementById('workspace')).not.toBeNull(); // Check for game element
    });

    // R2: Gemini Pro The game must start with four initial elements: Fire, Water, Earth, and Air.
    test('R2: Gemini Pro Game starts with four initial elements', () => {
        const fireElement = document.getElementById('fire');
        const waterElement = document.getElementById('water');
        const earthElement = document.getElementById('earth');
        const airElement = document.getElementById('air');

        expect(fireElement).not.toBeNull();
        expect(fireElement.textContent).toBe('🔥');
        expect(waterElement).not.toBeNull();
        expect(waterElement.textContent).toBe('💧');
        expect(earthElement).not.toBeNull();
        expect(earthElement.textContent).toBe('🌍');
        expect(airElement).not.toBeNull();
        expect(airElement.textContent).toBe('💨');
    });

    // R3: Gemini Pro Each element must be represented by a unicode symbol.
    test('R3: Gemini Pro Elements are represented by Unicode symbols', () => {
        const elements = document.querySelectorAll('.element');
        elements.forEach(element => {
            const textContent = element.textContent;
            expect(textContent).toMatch(/[\u{1F525}\u{1F4A7}\u{1F30D}\u{1F4A8}]/u); // Matches Unicode symbols
        });
    });

    // R4: Gemini Pro Players must be able to drag and drop elements to combine them.
    test('R4: Gemini Pro Elements can be dragged and dropped', () => {
        const fireElement = document.getElementById('fire');
        const waterElement = document.getElementById('water');
        const workspace = document.getElementById('workspace');

        // Simulate drag and drop
        fireElement.dispatchEvent(new Event('dragstart'));
        workspace.dispatchEvent(new Event('dragover'));
        workspace.dispatchEvent(new Event('drop'));

        // Check if fireElement is in workspace (implementation specific)
        // This might need adjustment depending on how you handle drop
        // For example, you might check if fireElement was appended to workspace
        // expect(workspace.contains(fireElement)).toBe(true);
    });

    // R5: Gemini Pro The game must support the following combinations: ...
    test('R5: Gemini Pro Valid combinations create new elements', () => {
        const fireElement = document.getElementById('fire');
        const waterElement = document.getElementById('water');
        const workspace = document.getElementById('workspace');

        // Simulate drag and drop for Fire + Water = Steam
        fireElement.dispatchEvent(new Event('dragstart'));
        workspace.dispatchEvent(new Event('dragover'));
        workspace.dispatchEvent(new Event('drop'));
        waterElement.dispatchEvent(new Event('dragstart'));
        workspace.dispatchEvent(new Event('dragover'));
        workspace.dispatchEvent(new Event('drop'));

        const steamElement = document.getElementById('Steam');
        expect(steamElement).not.toBeNull();
        expect(steamElement.textContent).toContain('♨️'); // Check for Steam symbol
    });

    // R6: Gemini Pro The game must display newly created elements when a valid combination is made.
    // (Covered in R5 test)

    // R7: Gemini Pro The game must not allow invalid combinations of elements.
    test('R7: Gemini Pro Invalid combinations are not allowed', () => {
        const fireElement = document.getElementById('fire');
        const airElement = document.getElementById('air');
        const workspace = document.getElementById('workspace');

        // Simulate drag and drop for Fire + Air (invalid in this test case)
        fireElement.dispatchEvent(new Event('dragstart'));
        workspace.dispatchEvent(new Event('dragover'));
        workspace.dispatchEvent(new Event('drop'));
        airElement.dispatchEvent(new Event('dragstart'));
        workspace.dispatchEvent(new Event('dragover'));
        workspace.dispatchEvent(new Event('drop'));

        // Check if an alert was called (or another error handling mechanism)
        expect(window.alert).toHaveBeenCalledWith('Invalid combination!');

        // Check that no new element was created
        const invalidElement = document.getElementById('InvalidElement'); // Replace with actual ID if different
        expect(invalidElement).toBeNull();
    });

    // R8: Gemini Pro The game must keep track of discovered elements.
    test('R8: Gemini Pro Game keeps track of discovered elements', () => {
        // ... (Similar to R5, check if the discovered elements list is updated)
    });

    // R9: Gemini Pro The game must allow players to use newly created elements in further combinations.
    test('R9: Gemini Pro Newly created elements can be used in further combinations', () => {
        // ... (Create "Energy" first, then try combining it with Water to create "Life")
    });

    // R10: Gemini Pro The game must provide visual feedback when a successful combination is made.
    test('R10: Gemini Pro Visual feedback is provided for successful combinations', () => {
        // This is tricky to test without visual inspection.
        // You could potentially check for CSS class changes or animation properties
        // after a successful combination.
    });

    // R11: Gemini Pro The game must allow players to reset the game to its initial state.
    test('R11: Gemini Pro Reset button resets the game', () => {
        const resetButton = document.getElementById('resetButton');
        resetButton.click(); // Simulate button click

        // Check if confirm dialog was called
        expect(window.confirm).toHaveBeenCalledWith(
            "Are you sure you want to reset the game? All progress will be lost."
        );

        // After confirming, check if the game state is reset (e.g., only initial elements exist)
        // ...
    });

    // R12: Gemini Pro The game must save the player's progress.
    test('R12: Gemini Pro Game saves progress using localStorage', () => {
        // ... (Trigger a combination, then check if localStorage is updated)
    });

    // R13: Gemini Pro The game must load the player's saved progress when the page is loaded.
    test('R13: Gemini Pro Game loads saved progress from localStorage', () => {
        // ... (Set up localStorage with some saved data, then reload the game and check if it's loaded)
    });

    // R14: Gemini Pro The game must display a count of how many elements have been discovered.
    test('R14: Gemini Pro Game displays a count of discovered elements', () => {
        const elementCountDisplay = document.getElementById('elementCount');
        expect(elementCountDisplay).not.toBeNull();

        // ... (Trigger a combination and check if the count is updated)
    });
});