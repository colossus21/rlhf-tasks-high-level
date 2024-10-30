const gameBoard = document.getElementById('game-board');
const sequenceDisplay = document.getElementById('sequence-display');
const startButton = document.getElementById('start-button');

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown']; // Add more colors as needed
let sequence = [];
let currentSequenceIndex = 0;
let showingSequence = false;

function createGameBoard() {
    for (let i = 0; i < 8; i++) { // 8 squares for 2x4 grid
        const square = document.createElement('div');
        square.classList.add('square');
        square.classList.add(colors[i % colors.length]); // Cycle through colors
        square.addEventListener('click', handleSquareClick);
        gameBoard.appendChild(square);
    }
}

function generateSequence() {
    sequence = [];
    for (let i = 0; i < 5; i++) { // Initial sequence length of 5
        sequence.push(Math.floor(Math.random() * 8)); // Random square index (0-7)
    }
}

function showSequence() {
    showingSequence = true;
    let index = 0;
    const squares = Array.from(gameBoard.children);

    const interval = setInterval(() => {
        if (index > 0) {
            squares[sequence[index - 1]].classList.remove('highlight');
        }
        if (index === sequence.length) {
            clearInterval(interval);
            showingSequence = false;
            sequenceDisplay.textContent = "Your turn!";
            return;
        }
        squares[sequence[index]].classList.add('highlight');
        index++;
    }, 1000); // 1 second delay for each color in the sequence
}

function handleSquareClick(event) {
    const clickedSquareIndex = Array.from(gameBoard.children).indexOf(event.target);

    if (clickedSquareIndex === sequence[currentSequenceIndex]) {
        currentSequenceIndex++;
        if (currentSequenceIndex === sequence.length) {
            alert('You won this round! Generating a longer sequence...');
            sequence.push(Math.floor(Math.random() * 8)); // Increase sequence length
            currentSequenceIndex = 0;
            setTimeout(() => {
                showSequence();
            }, 500); // Brief delay before showing the new sequence
        }
    } else {
        alert('Game Over! Incorrect sequence.');
        currentSequenceIndex = 0;
        generateSequence();
        setTimeout(() => {
            showSequence();
        }, 500); // Restart sequence
    }
}

startButton.addEventListener('click', () => {
    createGameBoard();
    generateSequence();
    setTimeout(() => {
        showSequence();
    }, 500); // Small delay before showing the sequence
    startButton.disabled = true;
});