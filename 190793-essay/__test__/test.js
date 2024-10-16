/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('Essay Analyzer', () => {
    let document;

    beforeEach(() => {
        document = new JSDOM(html).window.document;
    });

    // R1: Text input area
    test('R1: Text input area exists', () => {
        expect(document.getElementById('textInput')).not.toBeNull();
    });

    // R2: File upload
    test('R2: File upload input exists and triggers text area update', () => {
        const fileInput = document.getElementById('fileInput');
        const textInput = document.getElementById('textInput');
        expect(fileInput).not.toBeNull();

        const mockFile = new Blob(['Test file content'], { type: 'text/plain' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(mockFile);
        fileInput.files = dataTransfer.files;

        fileInput.dispatchEvent(new Event('change'));

        setTimeout(() => {
            expect(textInput.value).toBe('Test file content');
        }, 0);
    });

    // R3: Summary section
    test('R3: Summary div exists', () => {
        expect(document.getElementById('analysis')).not.toBeNull();
    });

    async function updateAndAnalyze(text) {
        document.getElementById('textInput').value = text;
        document.getElementById('textInput').dispatchEvent(new Event('input'));
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    // R4, R5, R6, R7, R8, R9, R10, R12, R13 (combined tests for efficiency)
    test('R4-R10, R12-R13: Analysis updates correctly with various inputs', async () => {
        const essayText = "This is a test essay. It has multiple sentences.  Well-known fact.";
        await updateAndAnalyze(essayText)
        let wordCount = 7;
        let charCount = 54;
        let readingTime = 1;

        expect(document.querySelector('#analysis > p:nth-child(1)').textContent).toBe(`Word Count: ${wordCount}`);
        expect(document.querySelector('#analysis > p:nth-child(2)').textContent).toBe(`Character Count: ${charCount}`);
        expect(document.querySelector('#analysis > p:nth-child(3)').textContent).toBe(`Reading Time: ${readingTime} minute`);

        document.getElementById('excludePunctuation').checked = true;
        document.getElementById('excludePunctuation').dispatchEvent(new Event('change'));
        await updateAndAnalyze(essayText);

        charCount = 43;
        expect(document.querySelector('#analysis > p:nth-child(2)').textContent).toBe(`Character Count: ${charCount}`);
        document.getElementById('excludePunctuation').checked = false;

        await updateAndAnalyze("");

        wordCount = 0;
        charCount = 0;
        readingTime = 0;
        expect(document.querySelector('#analysis > p:nth-child(1)').textContent).toBe(`Word Count: ${wordCount}`);
        expect(document.querySelector('#analysis > p:nth-child(2)').textContent).toBe(`Character Count: ${charCount}`);
        expect(document.querySelector('#analysis > p:nth-child(3)').textContent).toBe(`Reading Time: ${readingTime} minute`);

        const essayText2 = "test test test word1 word2 word2 word3 word3 word3";
        await updateAndAnalyze(essayText2);
        expect(document.querySelector('#analysis ul').textContent).toContain("test: 3");
        expect(document.querySelector('#analysis ul').textContent).toContain("word3: 3");
    });

    // R11: XSS prevention (partial, requires more sophisticated DOM manipulation for full test)
    test('R11: Summary uses textContent for updates', () => {
        const analysisDiv = document.getElementById('analysis');
        const textInput = document.getElementById('textInput');
        textInput.value = "<script>alert('XSS')</script>";
        textInput.dispatchEvent(new Event('input'));

        setTimeout(() => {
            expect(analysisDiv.textContent).not.toContain("<script>");
        }, 0);
    });

    // R14: Stop words (Modify the HTML file to include stop words logic first)
    test('R14: Stop words are excluded from top words', async () => {
        const essayTextWithStopWords = "the a an this is a test essay with stop words the the the";
        await updateAndAnalyze(essayTextWithStopWords);

        expect(document.querySelector('#analysis ul').textContent).not.toContain("the:");
        expect(document.querySelector('#analysis ul').textContent).not.toContain("a:");
        expect(document.querySelector('#analysis ul').textContent).not.toContain("an:");
        expect(document.querySelector('#analysis ul').textContent).toContain("test:");
        expect(document.querySelector('#analysis ul').textContent).toContain("is:");
    });
});
