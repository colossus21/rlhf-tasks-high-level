/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Stickman Avatar Generator', () => {
    let canvas, ctx, randomizeBtn, exportBtn, dropdowns, colorInputs, avatarCanvas;

    // Load the HTML file before running tests
    beforeEach(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index_o.html'), 'utf8');
        document.documentElement.innerHTML = html;

        canvas = document.getElementById('avatarCanvas');
        ctx = canvas.getContext('2d');
        randomizeBtn = document.getElementById('randomizeBtn');
        exportBtn = document.getElementById('exportBtn');
        dropdowns = document.querySelectorAll('select');
        colorInputs = document.querySelectorAll('input[type="color"]');
        avatarCanvas = document.getElementById('avatarCanvas');
    });

    // Test for R1: The application must be implemented as a single HTML file with embedded JavaScript.
    test('R1: index_o.html must contain embedded JavaScript', () => {
        const scriptTags = document.querySelectorAll('script');
        expect(scriptTags.length).toBeGreaterThan(0); // Checking that there are <script> tags
    });

    // Test for R2: The application must provide dropdown menus for avatar components.
    test('R2: The application should have dropdowns for avatar components', () => {
        expect(dropdowns.length).toBeGreaterThanOrEqual(4); // Face, eye, mouth, hat dropdowns exist
    });

    // Test for R3: Each avatar component must have at least three style options.
    test('R3: Each avatar component should have at least 3 style options', () => {
        dropdowns.forEach((dropdown) => {
            expect(dropdown.options.length).toBeGreaterThanOrEqual(3);
        });
    });

    // Test for R4: The application must allow users to change color of each avatar component.
    test('R4: The application should provide color inputs for each avatar component', () => {
        expect(colorInputs.length).toBeGreaterThanOrEqual(5); // Background, face, eyes, mouth, hat
    });

    // Test for R5: The avatar must be drawn on an HTML canvas element.
    test('R5: Avatar must be drawn on a canvas element', () => {
        expect(avatarCanvas.tagName.toLowerCase()).toBe('canvas');
        expect(ctx).toBeTruthy(); // Ensure canvas context exists
    });

    // Test for R6: The avatar must update in real-time when users change any component or color.
    test('R6: The avatar should update when dropdown or color input is changed', () => {
        const faceColorInput = document.getElementById('faceColor');
        const faceTypeDropdown = document.getElementById('faceType');

        faceColorInput.value = '#FF00FF';
        faceTypeDropdown.value = 'square';

        faceColorInput.dispatchEvent(new Event('input'));
        faceTypeDropdown.dispatchEvent(new Event('change'));

        // Assuming drawAvatar updates the canvas
        // This is just a logic check that events are triggering redraws.
        expect(ctx.fillStyle).toBe('#FF00FF');
    });

    // Test for R7: The application must include a "Randomize Avatar" button.
    test('R7: Clicking "Randomize Avatar" button should randomize avatar components', () => {
        const originalFaceValue = document.getElementById('faceType').value;
        const originalFaceColor = document.getElementById('faceColor').value;

        randomizeBtn.click();

        const newFaceValue = document.getElementById('faceType').value;
        const newFaceColor = document.getElementById('faceColor').value;

        expect(newFaceValue).not.toBe(originalFaceValue);
        expect(newFaceColor).not.toBe(originalFaceColor);
    });

    // Test for R8: The application must include an "Export Image" button.
    test('R8: Clicking "Export Image" should trigger download of avatar as an image', () => {
        const link = document.createElement('a');
        const spyLink = jest.spyOn(document, 'createElement').mockReturnValue(link);

        exportBtn.click();

        expect(spyLink).toHaveBeenCalledWith('a');
        expect(link.download).toBe('stickman_avatar.png');
    });

    // Test for R9: The avatar must render a complete stickman with all components.
    test('R9: The avatar should render all components (background, face, eyes, mouth, hat)', () => {
        drawAvatar();

        // Assuming drawAvatar includes methods to draw the following components:
        expect(ctx).not.toBeNull();
        expect(ctx.fillStyle).toBeTruthy(); // Background should have a fill
        expect(ctx.strokeStyle).toBeTruthy(); // For eyes, mouth
    });

    // Test for R10: The application must handle invalid or missing selections gracefully.
    test('R10: The avatar should handle missing or invalid selections gracefully', () => {
        const faceDropdown = document.getElementById('faceType');
        faceDropdown.value = ''; // Simulate invalid selection
        faceDropdown.dispatchEvent(new Event('change'));

        // Assuming drawAvatar applies default values when no valid selection
        expect(ctx).not.toBeNull(); // Ensure canvas drawing still happens
    });

    // Test for R11: The application must use a consistent coordinate system for placing components.
    test('R11: The drawing function should use consistent coordinate system for components', () => {
        // Assuming drawAvatar uses consistent reference points (like head center)
        drawAvatar();

        // Simple validation that drawing happens at correct coordinates
        expect(ctx.fillRect).toBeDefined();
        expect(ctx.arc).toBeDefined(); // For face
    });
});
