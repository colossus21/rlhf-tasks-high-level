const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Turtle graphics parameters
let x = canvas.width / 2;
let y = canvas.height / 2;
let angle = 0;
let step = 10;
let stack = [];

function drawLine() {
    ctx.beginPath();
    ctx.moveTo(x, y);
    x += step * Math.cos(angle);
    y += step * Math.sin(angle);
    ctx.lineTo(x, y);
    ctx.stroke();
}

function moveForward() {
    x += step * Math.cos(angle);
    y += step * Math.sin(angle);
}

function turnRight() {
    angle -= Math.PI / 2;
}

function turnLeft() {
    angle += Math.PI / 2;
}

function savePosition() {
    stack.push({ x: x, y: y, angle: angle });
}

function loadPosition() {
    if (stack.length > 0) {
        const savedState = stack.pop();
        x = savedState.x;
        y = savedState.y;
        angle = savedState.angle;
    }
}

function interpret(commands) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    x = canvas.width / 2;
    y = canvas.height / 2;
    angle = 0;
    stack = [];

    for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        switch (command) {
            case 'F':
                drawLine();
                break;
            case 'f':
                moveForward();
                break;
            case 'R':
                turnRight();
                break;
            case 'L':
                turnLeft();
                break;
            case '[':
                savePosition();
                break;
            case ']':
                loadPosition();
                break;
        }
    }
}

// Example usage
const inputField = document.getElementById('input');
const drawButton = document.getElementById('draw');

drawButton.addEventListener('click', () => {
    const commands = inputField.value;
    interpret(commands);
});