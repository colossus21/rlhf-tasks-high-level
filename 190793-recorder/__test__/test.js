/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const htmlFile = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
let dom;
let document;
let window;

describe('Sound Recorder Tests', () => {
    beforeEach(() => {
        dom = new JSDOM(htmlFile, {
            resources: 'usable',
            runScripts: 'dangerously',
            url: "http://localhost"
        });
        window = dom.window;
        document = window.document;

        window.MediaRecorder = class {
            constructor(stream) {
                this.stream = stream;
                this.ondataavailable = null;
                this.onstop = null;
                this.state = 'inactive';
            }
            start() {
                this.state = 'recording';
                this.ondataavailable({ data: new Blob(['mockData'], { type: 'audio/webm' }) });
            }
            stop() {
                this.state = 'inactive';
                this.onstop();
            }
        };
        window.navigator.mediaDevices.getUserMedia = async () => ({
            getTracks: () => ([{ stop: jest.fn() }]),
        });
    });

    // R1: Single HTML file
    test('R1: HTML file structure', () => {
        // Ensure that the essential elements are present in the HTML
        const body = document.querySelector('body');
        const recordButton = document.getElementById('record');
        const audioContainer = document.querySelector('.audio-container');
        const errorMsg = document.getElementById('errorMsg');

        expect(body).toBeTruthy();   // Ensure <body> exists
        expect(recordButton).toBeTruthy();   // Ensure the record button exists
        expect(audioContainer).toBeTruthy();  // Ensure the audio container is present
        expect(errorMsg).toBeTruthy(); // Ensure the error message container is present
    });

    // R2: Centered record button
    test('R2: Record button is centered', () => {
        const recordButton = document.getElementById('record');
        const bodyStyle = window.getComputedStyle(document.body);

        // Check if body is using flex to center content
        expect(bodyStyle.display).toBe('flex');
        expect(bodyStyle.flexDirection).toBe('column');
        expect(bodyStyle.alignItems).toBe('center');

        // Additional check: record button exists and is styled properly
        const recordStyle = window.getComputedStyle(recordButton);
        expect(recordStyle.marginTop).toBe('20px');
    });

    // R3: Error message on permission denied
    test('R3: Error message is shown on permission denied', async () => {
        const errorMsg = document.getElementById('errorMsg');
        window.navigator.mediaDevices.getUserMedia = async () => { throw new Error('Permission denied'); };
        const recordButton = document.getElementById('record');
        recordButton.click();

        await new Promise(process.nextTick);

        expect(errorMsg.style.display).toBe('block');
        expect(errorMsg.textContent).toBe('Permission denied');
    });

    // R4: Error message has a red border
    test('R4: Error message has a red border', async () => {
        const errorMsg = document.getElementById('errorMsg');
        expect(errorMsg.style.border).toContain('red');
    });

    // R5: Recorded audio list is displayed
    test('R5: Recorded audio list is displayed', async () => {
        const recordButton = document.getElementById('record');
        const audioContainer = document.querySelector('.audio-container');

        recordButton.click();
        await new Promise(process.nextTick);
        recordButton.click();
        await new Promise(process.nextTick);

        expect(audioContainer.children.length).toBeGreaterThanOrEqual(1);
    });

    // R6: Each recorded audio clip is playable
    test('R6: Recorded audio is playable', async () => {
        const recordButton = document.getElementById('record');
        const audioContainer = document.querySelector('.audio-container');

        recordButton.click();
        await new Promise(process.nextTick);
        recordButton.click();
        await new Promise(process.nextTick);

        const audioElement = audioContainer.querySelector('audio');
        expect(audioElement).toBeTruthy();
        expect(audioElement.controls).toBeTruthy();
    });

    // R7: Each recorded audio clip is downloadable in .webm format
    test('R7: Recorded audio is downloadable in .webm format', async () => {
        const recordButton = document.getElementById('record');
        const audioContainer = document.querySelector('.audio-container');

        recordButton.click();
        await new Promise(process.nextTick);
        recordButton.click();
        await new Promise(process.nextTick);

        const downloadLink = audioContainer.querySelector('a');
        expect(downloadLink).toBeTruthy();
        expect(downloadLink.download).toBe('recording.webm');
        expect(downloadLink.href).toBeTruthy();
    });

    // R8: Record button visual indication during recording
    test('R8: Record button visual indication during recording', async () => {
        const recordButton = document.getElementById('record');
        recordButton.click();

        await new Promise(process.nextTick);
        expect(recordButton.textContent).toBe('Stop');
        expect(recordButton.style.backgroundColor).toBe('rgb(0, 255, 0)');
    });

    // R9: Visual feedback after recording is created
    test('R9: Visual feedback is provided after recording', async () => {
        const recordButton = document.getElementById('record');
        const audioContainer = document.querySelector('.audio-container');

        recordButton.click();
        await new Promise(process.nextTick);
        recordButton.click();
        await new Promise(process.nextTick);

        expect(audioContainer.children.length).toBeGreaterThan(0);
    });

    // R10: No simultaneous recordings allowed
    test('R10: No simultaneous recordings allowed', async () => {
        const recordButton = document.getElementById('record');

        recordButton.click();
        await new Promise(process.nextTick);

        let recorderState;
        recordButton.click();

        await new Promise(process.nextTick).then(() => {
            recorderState = window.MediaRecorder.state;
        });

        expect(recorderState).toBe('inactive');
    });

    // R11: Display the duration of each recorded clip
    test('R11: Recorded audio displays duration', async () => {
        const recordButton = document.getElementById('record');
        const audioContainer = document.querySelector('.audio-container');

        recordButton.click();
        await new Promise(process.nextTick);
        recordButton.click();
        await new Promise(process.nextTick);

        const audioElement = audioContainer.querySelector('audio');
        expect(audioElement).toBeTruthy();
        expect(audioElement.duration).toBeGreaterThan(0);
    });

    // R12: Each recording can be deleted
    test('R12: Each recording can be deleted', async () => {
        const recordButton = document.getElementById('record');
        const audioContainer = document.querySelector('.audio-container');

        recordButton.click();
        await new Promise(process.nextTick);
        recordButton.click();
        await new Promise(process.nextTick);

        const deleteButton = audioContainer.querySelector('button');
        expect(deleteButton).toBeTruthy();
        deleteButton.click();

        expect(audioContainer.children.length).toBe(0);
    });
});
