/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index_g.html'), 'utf8');

jest.dontMock('fs');

describe('Gemini Pro - Sound Recorder Tests', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    // R1: The application must be implemented using a single HTML file containing HTML, CSS, and JavaScript.
    it('R1: Should have all code in a single HTML file', () => {
        expect(document.querySelector('html')).toBeTruthy();
        expect(document.querySelector('head style')).toBeTruthy();
        expect(document.querySelector('body script')).toBeTruthy();
    });

    // R2: The application must have a centered record button.
    it('R2: Should have a centered record button', () => {
        const button = document.getElementById('recordButton');
        expect(button).toBeTruthy();
        // Example assertions for flexbox centering (adjust if using different CSS)
        expect(window.getComputedStyle(document.body).display).toBe('flex');
        expect(window.getComputedStyle(document.body).flexDirection).toBe('column');
        expect(window.getComputedStyle(document.body).alignItems).toBe('center');
    });

    // R3: The application must display an error message if microphone permission is denied.
    it('R3: Should display an error message if microphone permission is denied', async () => {
        const errorMsg = document.getElementById('errorMsg');
        expect(errorMsg).toBeTruthy();

        const mockGetUserMedia = jest.fn().mockRejectedValue(new Error('NotAllowedError'));
        Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
            value: mockGetUserMedia,
        });

        const recordButton = document.getElementById('recordButton');
        await recordButton.click();

        expect(errorMsg.style.display).toBe('block');
        expect(errorMsg.textContent).toContain('Microphone permission denied');
    });

    // R4: The error message must have a red border.
    it('R4: Error message should have a red border', async () => {
        const errorMsg = document.getElementById('errorMsg');

        const mockGetUserMedia = jest.fn().mockRejectedValue(new Error('NotAllowedError'));
        Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
            value: mockGetUserMedia,
        });

        const recordButton = document.getElementById('recordButton');
        await recordButton.click();

        const computedStyle = window.getComputedStyle(errorMsg);
        expect(computedStyle.border).toContain('2px solid red');
    });

    // R5: The application must display a list of recorded audio clips beneath the record button.
    it('R5: Should display a list of recorded audio clips', async () => {
        const audioContainer = document.querySelector('.audio-container');
        expect(audioContainer).toBeTruthy();

        const mockMediaRecorder = jest.fn(() => ({
            start: jest.fn(),
            stop: jest.fn(),
            ondataavailable: jest.fn(),
            onstop: jest.fn(),
        }));
        window.MediaRecorder = mockMediaRecorder;

        const recordButton = document.getElementById('recordButton');
        await recordButton.click();
        const mockStopEvent = { data: new Blob(['mock audio data'], { type: 'audio/webm' }) };
        mediaRecorder.onstop(mockStopEvent);

        expect(audioContainer.children.length).toBeGreaterThan(0);
    });

    // R6: Each recorded audio clip must be playable within the browser.
    it('R6: Each recording should have a playable audio element', async () => {
        const mockMediaRecorder = jest.fn(() => ({
            start: jest.fn(),
            stop: jest.fn(),
            ondataavailable: jest.fn(),
            onstop: jest.fn((e) => {
                const audioBlob = new Blob(['mock audio data'], { type: 'audio/webm' });
                e.data = audioBlob;
            }),
        }));
        window.MediaRecorder = mockMediaRecorder;

        const recordButton = document.getElementById('recordButton');
        await recordButton.click();
        mediaRecorder.onstop({ data: new Blob() }); // Trigger onstop with mock data

        const audioElement = document.querySelector('.audio-container audio');
        expect(audioElement).toBeTruthy();
        expect(audioElement.controls).toBe(true);
    });

    // R7: Each recorded audio clip must be downloadable in .webm format.
    it('R7: Each recording should have a download link in .webm format', async () => {
        const mockMediaRecorder = jest.fn(() => ({
            start: jest.fn(),
            stop: jest.fn(),
            ondataavailable: jest.fn(),
            onstop: jest.fn((e) => {
                const audioBlob = new Blob(['mock audio data'], { type: 'audio/webm' });
                e.data = audioBlob;
            }),
        }));
        window.MediaRecorder = mockMediaRecorder;

        const recordButton = document.getElementById('recordButton');
        await recordButton.click();
        mediaRecorder.onstop({ data: new Blob() });

        const downloadLink = document.querySelector('.audio-container a');
        expect(downloadLink).toBeTruthy();
        expect(downloadLink.download).toMatch(/\.webm$/); // Check if download attribute ends with .webm
        expect(downloadLink.href).toBeTruthy(); // Check if href is set
    });

    // R8: The record button must visually indicate when recording is in progress.
    it('R8: Record button should change appearance during recording', async () => {
        const recordButton = document.getElementById('recordButton');
        const initialBackgroundColor = window.getComputedStyle(recordButton).backgroundColor;

        // Mock MediaRecorder to simulate recording state
        const mockMediaRecorder = jest.fn(() => ({
            start: jest.fn(),
            stop: jest.fn(),
            ondataavailable: jest.fn(),
            onstop: jest.fn(),
        }));
        window.MediaRecorder = mockMediaRecorder;

        await recordButton.click(); // Start "recording"

        // Check if background color has changed (or any other visual indicator you're using)
        expect(window.getComputedStyle(recordButton).backgroundColor).not.toBe(initialBackgroundColor);

        mediaRecorder.onstop({ data: new Blob() }); // Trigger stop event

        // Check if the button returns to its initial state
        expect(window.getComputedStyle(recordButton).backgroundColor).toBe(initialBackgroundColor);
    });

    // R9: The application must provide visual feedback when a recording is successfully created.
    it('R9: Should provide visual feedback after recording', async () => {
        const mockMediaRecorder = jest.fn(() => ({
            start: jest.fn(),
            stop: jest.fn(),
            ondataavailable: jest.fn(),
            onstop: jest.fn(),
        }));
        window.MediaRecorder = mockMediaRecorder;

        const recordButton = document.getElementById('recordButton');
        await recordButton.click();
        mediaRecorder.onstop({ data: new Blob() });

        // Check for visual feedback (e.g., a new element, a message, etc.)
        // This will depend on your specific implementation
        // Example: expect(document.getElementById('feedbackMessage')).toBeTruthy();
    });

    // R10: The application must not allow multiple recordings to occur simultaneously.
    it('R10: Should not allow multiple recordings simultaneously', async () => {
        const mockMediaRecorder = jest.fn(() => ({
            start: jest.fn(),
            stop: jest.fn(),
            ondataavailable: jest.fn(),
            onstop: jest.fn(),
        }));
        window.MediaRecorder = mockMediaRecorder;

        const recordButton = document.getElementById('recordButton');
        await recordButton.click();
        await recordButton.click(); // Try to start another recording

        // Assert that MediaRecorder.start() was only called once
        expect(mediaRecorder.start).toHaveBeenCalledTimes(1);
    });

    // R11: The application must display the duration of each recorded audio clip.
    it('R11: Should display the duration of each recording', async () => {
        const mockMediaRecorder = jest.fn(() => ({
            start: jest.fn(),
            stop: jest.fn(),
            ondataavailable: jest.fn(),
            onstop: jest.fn((e) => {
                const audioBlob = new Blob(['mock audio data'], { type: 'audio/webm' });
                e.data = audioBlob;
            }),
        }));
        window.MediaRecorder = mockMediaRecorder;

        const recordButton = document.getElementById('recordButton')
        await recordButton.click();
        mediaRecorder.onstop({ data: new Blob() });

        const durationElement = document.querySelector('.audio-container .duration');
        expect(durationElement).toBeTruthy();
        // You might want to add more specific assertions about the duration format here
    });

    // R12: The application must allow users to delete individual recordings.
    it('R12: Should allow users to delete recordings', async () => {
        const mockMediaRecorder = jest.fn(() => ({
            start: jest.fn(),
            stop: jest.fn(),
            ondataavailable: jest.fn(),
            onstop: jest.fn((e) => {
                const audioBlob = new Blob(['mock audio data'], { type: 'audio/webm' });
                e.data = audioBlob;
            }),
        }));
        window.MediaRecorder = mockMediaRecorder;

        const recordButton = document.getElementById('recordButton');
        await recordButton.click();
        mediaRecorder.onstop({ data: new Blob() });

        let audioItems = document.querySelectorAll('.audio-item');
        expect(audioItems.length).toBe(1);

        // Simulate clicking the delete button (adjust selector if needed)
        const deleteButton = document.querySelector('.delete-button');
        // Mock confirm() to return true (confirm deletion)
        window.confirm = jest.fn(() => true);
        deleteButton.click();

        audioItems = document.querySelectorAll('.audio-item');
        expect(audioItems.length).toBe(0);
    });

});