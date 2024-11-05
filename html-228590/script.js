// Make game variables accessible for testing
window.gameState = {
    paused: false,
    score: 0,
    lives: 5,
    gameRunning: true
};

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const restartButton = document.getElementById("restartButton");
const message = document.getElementById("message");

// Game variables
let ballX, ballY, ballSpeedX, ballSpeedY;
let paddle1Y, paddle2Y;
let gameStartTime;
let baseSpeed;
let animationId;
let lastPauseTime = 0;

// Constants remain the same
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const PADDLE_SPEED = 8;
const BALL_SIZE = 10;
const INITIAL_BALL_SPEED = 5;
const SPEED_INCREASE_INTERVAL = 10000;
const AUTO_SPEED_INCREMENT = 0.2;

// Initialize game
function initGame() {
    cancelAnimationFrame(animationId);
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    baseSpeed = INITIAL_BALL_SPEED;
    ballSpeedX = baseSpeed;
    ballSpeedY = baseSpeed;
    paddle1Y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    paddle2Y = canvas.height / 2 - PADDLE_HEIGHT / 2;

    // Update game state
    gameState.score = 0;
    gameState.lives = 5;
    gameState.gameRunning = true;
    gameState.paused = false;

    message.textContent = "";
    message.className = "";
    gameStartTime = Date.now();
    updateScoreboard();
    gameLoop();
}

function gameLoop() {
    if (!gameState.gameRunning) return;
    if (gameState.paused) {
        animationId = requestAnimationFrame(gameLoop);
        return;
    }

    const currentTime = Date.now();
    const elapsedTime = currentTime - gameStartTime;
    const speedIncrements = Math.floor(elapsedTime / SPEED_INCREASE_INTERVAL);
    baseSpeed = INITIAL_BALL_SPEED + (speedIncrements * AUTO_SPEED_INCREMENT);

    moveEverything();
    drawEverything();

    animationId = requestAnimationFrame(gameLoop);
}

function moveEverything() {
    // Ball movement logic remains the same
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >= canvas.height - BALL_SIZE) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX <= PADDLE_WIDTH) {
        if (ballY + BALL_SIZE > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = Math.abs(baseSpeed);
            const relativeIntersectY = (paddle1Y + (PADDLE_HEIGHT / 2)) - ballY;
            ballSpeedY = -(relativeIntersectY / (PADDLE_HEIGHT / 2)) * baseSpeed;
        } else if (ballX < 0) {
            loseLife();
        }
    }

    if (ballX >= canvas.width - PADDLE_WIDTH - BALL_SIZE) {
        if (ballY + BALL_SIZE > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -Math.abs(baseSpeed);
            const relativeIntersectY = (paddle2Y + (PADDLE_HEIGHT / 2)) - ballY;
            ballSpeedY = -(relativeIntersectY / (PADDLE_HEIGHT / 2)) * baseSpeed;
            incrementScore();
        } else if (ballX > canvas.width) {
            resetBall();
        }
    }

    // Computer paddle movement remains the same
    const paddleCenter = paddle2Y + PADDLE_HEIGHT / 2;
    const ballFutureY = ballY + (ballSpeedY * ((canvas.width - ballX) / ballSpeedX));
    if (paddleCenter < ballFutureY - 35) {
        paddle2Y += PADDLE_SPEED;
    } else if (paddleCenter > ballFutureY + 35) {
        paddle2Y -= PADDLE_SPEED;
    }

    paddle1Y = Math.max(Math.min(paddle1Y, canvas.height - PADDLE_HEIGHT), 0);
    paddle2Y = Math.max(Math.min(paddle2Y, canvas.height - PADDLE_HEIGHT), 0);
}

function drawEverything() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
    ctx.fillRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(canvas.width - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);
}

function handleKeyDown(evt) {
    if (evt.key === " ") {
        const currentTime = Date.now();
        if (currentTime - lastPauseTime > 300) {
            togglePause();
            lastPauseTime = currentTime;
        }
    }

    if (!gameState.paused) {
        switch (evt.key) {
            case "ArrowUp":
                paddle1Y -= PADDLE_SPEED;
                break;
            case "ArrowDown":
                paddle1Y += PADDLE_SPEED;
                break;
        }
    }
}

function togglePause() {
    gameState.paused = !gameState.paused;
    message.textContent = gameState.paused ? "PAUSED" : "";
    message.className = "";
}

function loseLife() {
    gameState.lives--;
    updateScoreboard();

    // Dispatch custom event for testing
    document.dispatchEvent(new CustomEvent('lifeLost'));

    if (gameState.lives === 0) {
        endGame("Game Over", false);
    } else {
        resetBall();
    }
}

function incrementScore() {
    gameState.score++;
    updateScoreboard();

    // Dispatch custom event for testing
    document.dispatchEvent(new CustomEvent('scoreIncremented'));

    if (gameState.score >= 10) {
        endGame("Victory!", true);
    }
}

function endGame(msg, isVictory) {
    gameState.gameRunning = false;
    message.textContent = msg;
    message.className = isVictory ? "victory" : "gameover";
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -baseSpeed;
    ballSpeedY = (Math.random() * 2 - 1) * baseSpeed;
}

function updateScoreboard() {
    scoreDisplay.textContent = gameState.score;
    livesDisplay.textContent = gameState.lives;
}

// Export functions and variables for testing
window.gameExports = {
    initGame,
    togglePause,
    handleKeyDown,
    loseLife,
    incrementScore,
    gameState
};

// Add event listeners
document.addEventListener("keydown", handleKeyDown);
restartButton.addEventListener("click", initGame);

// Initialize the game
initGame();