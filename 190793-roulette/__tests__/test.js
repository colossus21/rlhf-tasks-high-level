/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('Roulette Wheel Tests', () => {
    let document;
    let wheel;
    let itemsTextArea;
    let spinButton;
    let resultDiv;

    beforeEach(() => {
        document = new DOMParser().parseFromString(html, 'text/html'); // Use your actual HTML here
        wheel = document.getElementById('wheel');
        itemsTextArea = document.getElementById('items');
        spinButton = document.getElementById('spin');
        resultDiv = document.getElementById('result');

        // Append the parsed HTML to the jsdom document's body
        document.body.innerHTML = html;

    });



    // R1: Textarea exists
    test('R1: Textarea element exists', () => {
        expect(itemsTextArea).not.toBeNull();
    });

    // R2: Spin button exists
    test('R2: Spin button exists', () => {
        expect(spinButton).not.toBeNull();
    });

    // R3: Result div exists
    test('R3: Result div exists', () => {
        expect(resultDiv).not.toBeNull();
    });

    // R4: Wheel div exists
    test('R4: Wheel div exists', () => {
        expect(wheel).not.toBeNull();
    });

    // R5, R9, R10: Input splitting and slice creation
    test('R5, R9, R10: Correct number of slices created with item text', () => {
        itemsTextArea.value = "Item 1\nItem 2\nItem 3";
        spinButton.click(); // Trigger wheel creation
        const slices = wheel.querySelectorAll('.slice');
        expect(slices.length).toBe(3);

        const sliceTexts = wheel.querySelectorAll('.slice-text');
        expect(sliceTexts[0].textContent).toBe("Item 1");
        expect(sliceTexts[1].textContent).toBe("Item 2");
        expect(sliceTexts[2].textContent).toBe("Item 3");


    });

    // R6: Random background color
    test('R6: Slices have background colors', () => {
        itemsTextArea.value = "Item 1";
        spinButton.click();
        const slice = wheel.querySelector('.slice');
        expect(slice.style.backgroundColor).not.toBe(''); // Check if any background color is applied
    });


    // R7: Wheel rotation
    test('R7: Wheel rotates on click', () => {
        itemsTextArea.value = "Item 1"; // Need at least one item for rotation to be visible
        spinButton.click();
        // No direct way to assert rotation, but check if the transition is applied
        expect(wheel.style.transition).toBe('transform 2s ease-out');

    });



    // R8: Error message on empty input
    test('R8: Error message displayed for empty input', () => {
        itemsTextArea.value = "";
        spinButton.click();
        expect(resultDiv.textContent).toBe("Please enter at least one item");
    });



    // R11: Wheel stops spinning (check for transition: none)
    test('R11: Wheel stops spinning after timeout', (done) => { // Use done for async tests
        itemsTextArea.value = "Item 1";
        spinButton.click();
        setTimeout(() => {
            expect(wheel.style.transition).toBe('none');
            done();
        }, 2100); // Wait slightly longer than transition duration (2000ms + some buffer)

    });



    // R12, R13: Random result display
    test('R12, R13: Result displayed after spin', (done) => {
        itemsTextArea.value = "Item 1\nItem 2";
        spinButton.click();
        setTimeout(() => {
            expect(resultDiv.textContent).toMatch(/Result: Item [12]/); // Check for "Result: Item 1" or "Result: Item 2"
            done();
        }, 2100);
    });



    // R14: Wheel recreation
    test('R14: Wheel is recreated with new items', () => {
        itemsTextArea.value = "Item 1";
        spinButton.click();
        let slices = wheel.querySelectorAll('.slice');
        expect(slices.length).toBe(1);

        itemsTextArea.value = "Item 1\nItem 2";
        spinButton.click();
        slices = wheel.querySelectorAll('.slice');
        expect(slices.length).toBe(2);

    });

    // R15: Circular appearance
    test('R15: Wheel has circular appearance', () => {
        expect(wheel.style.borderRadius).toBe('50%');
    });



});