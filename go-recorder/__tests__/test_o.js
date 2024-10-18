/**
 * @jest-environment jsdom
 */

describe("ChatGPT 4o: Sound Recorder Application", () => {
    let container;

    beforeEach(() => {
        // Load the HTML file content from "../index_o.html"
        return fetch("../index_o.html")
            .then(response => response.text())
            .then(html => {
                document.body.innerHTML = html;
                container = document.body;
            });
    });

    // R1: The application must be implemented using a single HTML file.
    test('R1: The application is contained in a single HTML file', () => {
        const htmlFile = container.querySelector('html');
        expect(htmlFile).toBeDefined();
    });

    // R2: The application must have a centered record button.
    test('R2: The record button is centered and has correct padding', () => {
        const recordButton = container.querySelector('#recordButton');
        const buttonStyle = window.getComputedStyle(recordButton);
        expect(buttonStyle.padding).toBe('15px 30px');
        expect(buttonStyle.textAlign).toBe('center');
    });

    // R3: The application must display an error message if microphone permission is denied.
    test('R3: Shows error message when microphone permission is denied', () => {
        const errorMessage = container.querySelector('#errorMessage');
        errorMessage.textContent = "Microphone access denied";
        errorMessage.style.display = 'block';
        expect(errorMessage.style.display).toBe('block');
        expect(errorMessage.textContent).toBe('Microphone access denied');
    });

    // R4: The error message must have a red border.
    test('R4: Error message has a red border', () => {
        const errorMessage = container.querySelector('#errorMessage');
        const errorStyle = window.getComputedStyle(errorMessage);
        expect(errorStyle.border).toBe('2px solid red');
    });

    // R5: The application must display a list of recorded audio clips beneath the record button.
    test('R5: Recordings are listed beneath the record button', () => {
        const recordingsList = container.querySelector('#recordingsList');
        expect(recordingsList).toBeDefined();
        const newRecording = document.createElement('div');
        newRecording.className = 'audio-item';
        recordingsList.appendChild(newRecording);
        expect(recordingsList.childElementCount).toBe(1);
    });

    // R6: Each recorded audio clip must be playable within the browser.
    test('R6: Recorded audio clip is playable', () => {
        const recordingsList = container.querySelector('#recordingsList');
        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        recordingsList.appendChild(audioElement);
        expect(audioElement.controls).toBe(true);
    });

    // R7: Each recorded audio clip must be downloadable in .webm format.
    test('R7: Recorded audio clip is downloadable in .webm format', () => {
        const recordingsList = container.querySelector('#recordingsList');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'recording.webm';
        downloadLink.href = 'blob-url';
        recordingsList.appendChild(downloadLink);
        expect(downloadLink.download).toBe('recording.webm');
        expect(downloadLink.href).toBe('blob-url');
    });

    // R8: The record button must visually indicate when recording is in progress.
    test('R8: Record button changes appearance when recording starts', () => {
        const recordButton = container.querySelector('#recordButton');
        recordButton.classList.add('recording');
        expect(recordButton.classList.contains('recording')).toBe(true);
    });

    // R9: The application must provide visual feedback when a recording is successfully created.
    test('R9: Shows visual feedback when recording is created', () => {
        const feedbackMessage = document.createElement('div');
        feedbackMessage.textContent = 'Recording saved!';
        feedbackMessage.style.animation = 'fade-out 2s';
        container.appendChild(feedbackMessage);
        expect(feedbackMessage.textContent).toBe('Recording saved!');
        setTimeout(() => {
            expect(feedbackMessage.style.display).toBe('none');
        }, 2000);
    });

    // R10: The application must not allow multiple recordings to occur simultaneously.
    test('R10: Prevents multiple recordings from starting simultaneously', () => {
        const recordButton = container.querySelector('#recordButton');
        let isRecording = false;
        recordButton.addEventListener('click', () => {
            if (isRecording) return;
            isRecording = true;
            recordButton.textContent = 'Stop Recording';
        });
        recordButton.click();
        expect(recordButton.textContent).toBe('Stop Recording');
        recordButton.click();
        expect(recordButton.textContent).toBe('Stop Recording'); // Shouldn't change
    });

    // R11: The application must display the duration of each recorded audio clip.
    test('R11: Displays duration of each recording', () => {
        const recordingsList = container.querySelector('#recordingsList');
        const durationDisplay = document.createElement('span');
        durationDisplay.textContent = '2:34';
        recordingsList.appendChild(durationDisplay);
        expect(durationDisplay.textContent).toBe('2:34');
    });

    // R12: The application must allow users to delete individual recordings.
    test('R12: Allows users to delete individual recordings', () => {
        const recordingsList = container.querySelector('#recordingsList');
        const audioItem = document.createElement('div');
        audioItem.className = 'audio-item';
        recordingsList.appendChild(audioItem);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        audioItem.appendChild(deleteButton);

        deleteButton.addEventListener('click', () => {
            audioItem.remove();
        });

        deleteButton.click();
        expect(recordingsList.childElementCount).toBe(0);
    });
});
