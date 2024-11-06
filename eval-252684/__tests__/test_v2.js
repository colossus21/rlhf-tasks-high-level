// response2.test.js
const { test, expect } = require('@testing-library/dom');
const fs = require('fs');
const path = require('path');

describe('Font Face Implementation Tests - Response 2', () => {
    beforeEach(() => {
        document.head.innerHTML = `
            <style>
                @font-face {
                    font-family: "Nunito Sans";
                    src: url("#{$sw-asset-public-url}/bundles/bypamyeiertheme/fonts/NunitoSans-Regular.ttf") format("truetype");
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                }

                @font-face {
                    font-family: "Nunito Sans";
                    src: url("#{$sw-asset-public-url}/bundles/bypamyeiertheme/fonts/NunitoSans-Light.ttf") format("truetype");
                    font-style: normal;
                    font-weight: 300;
                    font-display: swap;
                }

                body {
                    font-family: "Nunito Sans", sans-serif;
                    font-weight: 400;
                }

                h1 {
                    font-family: "Nunito Sans", sans-serif;
                    font-weight: 300;
                }
            </style>
        `;
        document.body.innerHTML = `
            <h1>Light Weight Heading</h1>
            <p>Regular Weight Paragraph</p>
        `;
    });

    test('Test Case 1: Verify @font-face rules are properly defined for light and regular variants', () => {
        const styleSheets = Array.from(document.styleSheets);
        const fontFaceRules = styleSheets
            .flatMap(sheet => Array.from(sheet.cssRules))
            .filter(rule => rule instanceof CSSFontFaceRule);

        // Verify we have exactly 2 @font-face rules
        expect(fontFaceRules).toHaveLength(2);

        // Verify font family names
        fontFaceRules.forEach(rule => {
            expect(rule.style.fontFamily.toLowerCase()).toBe('"nunito sans"');
        });

        // Check if both font files are referenced
        const fontSources = fontFaceRules.map(rule => rule.style.src);
        expect(fontSources).toEqual(
            expect.arrayContaining([
                expect.stringContaining('NunitoSans-Light.ttf'),
                expect.stringContaining('NunitoSans-Regular.ttf')
            ])
        );
    });

    test('Test Case 2: Verify Light variant is set to weight 300', () => {
        const styleSheets = Array.from(document.styleSheets);
        const lightFontRule = styleSheets
            .flatMap(sheet => Array.from(sheet.cssRules))
            .filter(rule => rule instanceof CSSFontFaceRule)
            .find(rule => rule.style.src.includes('Light.ttf'));

        expect(lightFontRule.style.fontWeight).toBe('300');

        // Verify h1 element implementation
        const h1Rule = Array.from(document.styleSheets)
            .flatMap(sheet => Array.from(sheet.cssRules))
            .find(rule => rule.selectorText === 'h1');

        expect(h1Rule.style.fontWeight).toBe('300');
    });

    test('Test Case 3: Verify Regular variant is set to weight 400', () => {
        const styleSheets = Array.from(document.styleSheets);
        const regularFontRule = styleSheets
            .flatMap(sheet => Array.from(sheet.cssRules))
            .filter(rule => rule instanceof CSSFontFaceRule)
            .find(rule => rule.style.src.includes('Regular.ttf'));

        expect(regularFontRule.style.fontWeight).toBe('400');

        // Verify body element implementation
        const bodyRule = Array.from(document.styleSheets)
            .flatMap(sheet => Array.from(sheet.cssRules))
            .find(rule => rule.selectorText === 'body');

        expect(bodyRule.style.fontWeight).toBe('400');
    });
});