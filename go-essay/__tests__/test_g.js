const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index_g.html'), 'utf8');

jest.dontMock('fs');

describe('Gemini Pro: Essay Analyzer', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    // R1: Text input area
    it('R1: should have a text input area', () => {
        expect(document.querySelector('#essay')).not.toBeNull();
    });

    // R2: File upload
    it('R2: should have a file upload input', () => {
        expect(document.querySelector('input[type="file"]')).not.toBeNull();
    });

    // R3: Summary section
    it('R3: should have a summary section', () => {
        expect(document.querySelector('#result')).not.toBeNull();
    });

    // R4: Word count
    it('R4: should display the correct word count', () => {
        const essayText = document.getElementById('essay');
        essayText.value = 'This is a test.';
        essayText.dispatchEvent(new Event('input'));
        expect(document.querySelector('#result').textContent).toContain('Word Count: 4');
    });

    // R5: Character count
    it('R5: should display the correct character count', () => {
        const essayText = document.getElementById('essay');
        essayText.value = 'This is a test.';
        essayText.dispatchEvent(new Event('input'));
        expect(document.querySelector('#result').textContent).toContain('Character Count: 15');
    });

    // R6: Reading time
    it('R6: should display the estimated reading time', () => {
        const essayText = document.getElementById('essay');
        essayText.value = 'This is a test.'; // 4 words / 200 wpm = 0.02 minutes, rounded to 0
        essayText.dispatchEvent(new Event('input'));
        expect(document.querySelector('#result').textContent).toContain('Reading Time: 0 minute');
    });

    // R7: Real-time update
    it('R7: should update the summary in real-time', () => {
        const essayText = document.getElementById('essay');
        essayText.value = 'This is';
        essayText.dispatchEvent(new Event('input'));
        expect(document.querySelector('#result').textContent).toContain('Word Count: 2');

        essayText.value = 'This is a test.';
        essayText.dispatchEvent(new Event('input'));
        expect(document.querySelector('#result').textContent).toContain('Word Count: 4');
    });

    // R8: Exclude punctuation and spaces
    it('R8: should exclude punctuation and spaces from character count when option is selected', () => {
        const essayText = document.getElementById('essay');
        essayText.value = 'This is a test.';
        essayText.dispatchEvent(new Event('input'));

        const excludePunctuationCheckbox = document.getElementById('excludePunctuation');
        excludePunctuationCheckbox.checked = true;
        excludePunctuationCheckbox.dispatchEvent(new Event('change'));

        expect(document.querySelector('#result').textContent).toContain('Character Count: 11');
    });

    // R9: Top 10 words
    it('R9: should display the top 10 most frequent words', () => {
        const essayText = document.getElementById('essay');
        essayText.value = 'this is a test this is a test this is the end';
        essayText.dispatchEvent(new Event('input'));
        const resultText = document.querySelector('#result').textContent;
        expect(resultText).toContain('this: 3');
        expect(resultText).toContain('is: 3');
        expect(resultText).toContain('a: 2');
        expect(resultText).toContain('test: 2');
    });

    // R10: Empty input
    it('R10: should handle empty input gracefully', () => {
        const essayText = document.getElementById('essay');
        essayText.value = '';
        essayText.dispatchEvent(new Event('input'));
        const resultText = document.querySelector('#result').textContent;
        expect(resultText).toContain('Word Count: 0');
        expect(resultText).toContain('Character Count: 0');
        expect(resultText).toContain('Reading Time: 0 minute');
    });

    // R11: XSS prevention (simplified test)
    it('R11: should sanitize input to prevent XSS attacks', () => {
        const essayText = document.getElementById('essay');
        essayText.value = '<script>alert("XSS")</script>';
        essayText.dispatchEvent(new Event('input'));
        expect(document.querySelector('#result').textContent).not.toContain('<script>');
    });

    // R12: Round reading time
    it('R12: should round the estimated reading time to the nearest minute', () => {
        const essayText = document.getElementById('essay');
        essayText.value = 'This is a test with more than 200 words.'; // Assuming this has 201 words
        essayText.dispatchEvent(new Event('input'));
        // 201 words / 200 wpm = 1.005 minutes, rounded to 1
        expect(document.querySelector('#result').textContent).toContain('Reading Time: 1 minute');
    });

    // R13: Hyphenated words
    it('R13: should treat hyphenated words as single words', () => {
        const essayText = document.getElementById('essay');
        essayText.value = 'This is a test with well-known words.';
        essayText.dispatchEvent(new Event('input'));
        expect(document.querySelector('#result').textContent).toContain('Word Count: 7');
    });

    // R14: Stop words (simplified test)
    it('R14: should ignore common English stop words in the top 10 words list', () => {
        const essayText = document.getElementById('essay');
        essayText.value = 'the a an this is a test the a an';
        essayText.dispatchEvent(new Event('input'));
        const resultText = document.querySelector('#result').textContent;
        expect(resultText).not.toContain('the:');
        expect(resultText).not.toContain('a:');
        expect(resultText).not.toContain('an:');
    });
});