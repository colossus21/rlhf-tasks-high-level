/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

let essayAnalyzer;

beforeEach(() => {
    // Load the HTML file from ../index_o.html
    const html = fs.readFileSync(path.resolve(__dirname, '../index_o.html'), 'utf8');
    document.documentElement.innerHTML = html;

    // Initialize the functions from your script (you need to expose them in the main script file)
    essayAnalyzer = {
        updateSummary: jest.fn(),
        handleFileUpload: jest.fn(),
        sanitizeText: jest.fn(text => text.replace(/</g, "&lt;").replace(/>/g, "&gt;")),
    };
});

// R1: Test that a textarea exists for users to input text
test('R1: Should have a <textarea> element for essay input', () => {
    const textarea = document.getElementById('essayInput');
    expect(textarea).not.toBeNull();
});

// R2: Test that a file input element exists and can handle .txt file uploads
test('R2: Should have a file input for .txt uploads and trigger file read', () => {
    const fileInput = document.getElementById('fileUpload');
    const mockFile = new File(["This is a test file."], "test.txt", { type: "text/plain" });

    // Mock file input event
    const event = new Event('change');
    fileInput.files = [mockFile];
    fileInput.dispatchEvent(event);

    // Check if file upload handler is triggered
    expect(essayAnalyzer.handleFileUpload).toHaveBeenCalled();
});

// R3: Test that there is a summary div to display the word count, char count, etc.
test('R3: Should have a summary div element below the text area', () => {
    const summary = document.getElementById('summary');
    expect(summary).not.toBeNull();
});

// R4: Test word count calculation from input text
test('R4: Should calculate the word count correctly', () => {
    const textarea = document.getElementById('essayInput');
    textarea.value = "This is a simple test.";
    essayAnalyzer.updateSummary(textarea.value);

    const wordCount = document.getElementById('wordCount').textContent;
    expect(wordCount).toContain('Word Count: 5');
});

// R5: Test character count calculation from input text
test('R5: Should calculate character count correctly', () => {
    const textarea = document.getElementById('essayInput');
    textarea.value = "Test!";
    essayAnalyzer.updateSummary(textarea.value);

    const charCount = document.getElementById('charCount').textContent;
    expect(charCount).toContain('Character Count: 5');
});

// R6: Test reading time calculation based on word count
test('R6: Should calculate reading time based on word count', () => {
    const textarea = document.getElementById('essayInput');
    textarea.value = "This is a longer test to check the reading time estimation.";
    essayAnalyzer.updateSummary(textarea.value);

    const readingTime = document.getElementById('readingTime').textContent;
    expect(readingTime).toContain('Estimated Reading Time: 1 min');
});

// R7: Test real-time updates on text modification
test('R7: Should update the summary in real-time as user types', () => {
    const textarea = document.getElementById('essayInput');
    textarea.value = "Test real-time update.";
    const inputEvent = new Event('input');
    textarea.dispatchEvent(inputEvent);

    expect(essayAnalyzer.updateSummary).toHaveBeenCalledWith(textarea.value);
});

// R8: Test excluding punctuation and spaces when checkbox is checked
test('R8: Should exclude punctuation and spaces from character count when checkbox is checked', () => {
    const textarea = document.getElementById('essayInput');
    const excludePunctuation = document.getElementById('excludePunctuation');

    textarea.value = "Hello, world!";
    excludePunctuation.checked = true;

    essayAnalyzer.updateSummary(textarea.value);

    const charCount = document.getElementById('charCount').textContent;
    expect(charCount).toContain('Character Count: 10');  // "Hello world" (without punctuation)
});

// R9: Test displaying top 10 most frequent words
test('R9: Should display the top 10 most frequent words', () => {
    const textarea = document.getElementById('essayInput');
    textarea.value = "word word word test test hello";
    essayAnalyzer.updateSummary(textarea.value);

    const topWords = document.getElementById('topWords').textContent;
    expect(topWords).toContain('word: 3');
    expect(topWords).toContain('test: 2');
});

// R10: Test handling of empty input gracefully
test('R10: Should handle empty input gracefully', () => {
    const textarea = document.getElementById('essayInput');
    textarea.value = "";
    essayAnalyzer.updateSummary(textarea.value);

    const wordCount = document.getElementById('wordCount').textContent;
    const charCount = document.getElementById('charCount').textContent;
    const readingTime = document.getElementById('readingTime').textContent;

    expect(wordCount).toContain('Word Count: 0');
    expect(charCount).toContain('Character Count: 0');
    expect(readingTime).toContain('Estimated Reading Time: 0 min');
});

// R11: Test sanitizing input to prevent XSS attacks
test('R11: Should sanitize input to prevent XSS attacks', () => {
    const unsanitizedInput = "<script>alert('XSS');</script>";
    const sanitizedText = essayAnalyzer.sanitizeText(unsanitizedInput);
    expect(sanitizedText).toBe("&lt;script&gt;alert('XSS');&lt;/script&gt;");
});

// R12: Test rounding reading time to nearest minute
test('R12: Should round reading time to nearest minute', () => {
    const textarea = document.getElementById('essayInput');
    textarea.value = "This is a test to check if reading time rounding works correctly.";
    essayAnalyzer.updateSummary(textarea.value);

    const readingTime = document.getElementById('readingTime').textContent;
    expect(readingTime).toContain('Estimated Reading Time: 1 min');  // Rounded to nearest minute
});

// R13: Test treating hyphenated words as single words in word count
test('R13: Should treat hyphenated words as single words', () => {
    const textarea = document.getElementById('essayInput');
    textarea.value = "Well-being is important.";
    essayAnalyzer.updateSummary(textarea.value);

    const wordCount = document.getElementById('wordCount').textContent;
    expect(wordCount).toContain('Word Count: 3');  // "Well-being" is a single word
});

// R14: Test ignoring stop words in top 10 most frequent words list
test('R14: Should ignore stop words in top 10 words list', () => {
    const textarea = document.getElementById('essayInput');
    textarea.value = "the a an test test testing";
    essayAnalyzer.updateSummary(textarea.value);

    const topWords = document.getElementById('topWords').textContent;
    expect(topWords).not.toContain('the');
    expect(topWords).not.toContain('a');
    expect(topWords).not.toContain('an');
});
