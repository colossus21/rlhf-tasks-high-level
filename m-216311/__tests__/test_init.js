const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Ensure stroke style is black and global alpha is 1
ctx.strokeStyle = "black";
ctx.globalAlpha = 1;

const commands = {
    F: () => {
        x += stepSize * Math.cos(angle);
        y += stepSize * Math.sin(angle);
        ctx.lineTo(x, y);
        ctx.stroke();
    },
    f: () => {
        x += stepSize * Math.cos(angle);
        y += stepSize * Math.sin(angle);
        ctx.moveTo(x, y);
    },
    R: () => {
        angle += angleIncrement;
    },
    L: () => {
        angle -= angleIncrement;
    },
    "[": () => {
        positionStack.push({ x: x, y: y, angle: angle });
    },
    "]": () => {
        const savedState = positionStack.pop();
        x = savedState.x;
        y = savedState.y;
        angle = savedState.angle;
        ctx.moveTo(x, y);
    },
};

let x, y;
let angle;
const angleIncrement = Math.PI / 2;
const stepSize = 10;
const positionStack = [];

function draw(commandString) {
    x = canvas.width / 2;
    y = canvas.height / 2;
    angle = 0;

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let i = 0; i < commandString.length; i++) {
        const command = commandString[i];
        if (commands[command]) {
            commands[command]();
        }
    }

    ctx.stroke();
}


// Unit tests
const assert = require('assert');

describe('Turtle Graphics', function() {
    beforeEach(function() {
        // Reset canvas and context for each test
        canvas.width = 500; // Reset canvas width
        canvas.height = 500; // Reset canvas height

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "black";
        ctx.globalAlpha = 1;
    });

    it('should move forward and draw', function() {
        draw('F');
        assert(x > canvas.width / 2);
        assert(y === canvas.height / 2);
    });

    it('should move forward without drawing', function() {
        draw('f');
        assert(x > canvas.width / 2);
        assert(y === canvas.height / 2);
    });

    it('should turn right', function() {
        const initialAngle = angle;
        draw('R');
        assert(angle === initialAngle + angleIncrement);
    });

    it('should turn left', function() {
        const initialAngle = angle;
        draw('L');
        assert(angle === initialAngle - angleIncrement);
    });

    it('should save and restore position', function() {
        draw('F[F]F');
        assert(x === canvas.width / 2 + stepSize);
        assert(y === canvas.height / 2);
    });

    it('should handle invalid commands', function() {
        draw('X'); // Invalid command - should be ignored
        assert(x === canvas.width / 2);
        assert(y === canvas.height / 2);
    });

    it('should handle edge cases with empty stack', function() {
        draw(']'); // Empty stack, should not cause errors
        assert(x === canvas.width / 2);
        assert(y === canvas.height / 2);
    });

    it('should handle a complex command string', function() {
        draw('FF[LF]F[RF]F');
        assert(x !== canvas.width / 2); // Check for a change
        assert(y !== canvas.height / 2); // Check for a change
    });
});