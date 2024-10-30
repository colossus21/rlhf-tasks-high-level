// Set of questions, each with one correct answer and multiple incorrect answers
const questions = [
    {
        question: "What is the capital of France?",
        answers: {
            a: "Berlin",
            b: "Paris",
            c: "Madrid",
            d: "Rome",
        },
        correctAnswer: "b",
    },
    {
        question: "What is the highest mountain in the world?",
        answers: {
            a: "K2",
            b: "Kangchenjunga",
            c: "Mount Everest",
            d: "Lhotse",
        },
        correctAnswer: "c",
    },
    {
        question: "What is the smallest country in the world?",
        answers: {
            a: "Monaco",
            b: "Nauru",
            c: "Vatican City",
            d: "Tuvalu",
        },
        correctAnswer: "c",
    },
    // Add more questions here...
];

// Function to shuffle an array (Fisher-Yates Shuffle Algorithm)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to start the quiz
function startQuiz() {
    const numQuestions = 5; // Number of questions per quiz
    const quizQuestions = shuffle(questions).slice(
        0,
        Math.min(numQuestions, questions.length)
    );
    let score = 0;
    let questionIndex = 0;
    let quizEnded = false;

    // Set a timer for 10 minutes
    const quizTimer = setTimeout(() => {
        quizEnded = true;
        alert(`Time's up! Your final score is ${score}/${quizQuestions.length}`);
        disableInput();
    }, 600000); // 10 minutes in milliseconds

    // Function to ask a question
    function askQuestion() {
        if (quizEnded) return;

        if (questionIndex < quizQuestions.length) {
            const currentQuestion = quizQuestions[questionIndex];
            let answerOptions = "";
            for (const key in currentQuestion.answers) {
                answerOptions += `${key}) ${currentQuestion.answers[key]}\n`;
            }

            let attempts = 2; // 2 attempts per question (2 extra turns)
            let answeredCorrectly = false;

            while (attempts >= 0 && !answeredCorrectly) {
                const userAnswer = prompt(
                    `${currentQuestion.question}\n${answerOptions}\nAttempts left: ${
                        attempts + 1
                    }`
                );

                if (userAnswer === currentQuestion.correctAnswer) {
                    score++;
                    alert("Correct!");
                    answeredCorrectly = true;
                } else if (userAnswer !== null) {
                    // User provided an answer
                    attempts--;
                    if (attempts >= 0) {
                        alert("Incorrect. Try again.");
                    } else {
                        alert(
                            `Incorrect. The correct answer was ${currentQuestion.correctAnswer}.`
                        );
                    }
                } else {
                    // User pressed "Cancel"
                    clearTimeout(quizTimer); // Stop the timer
                    quizEnded = true;
                    alert("Quiz cancelled.");
                    return; // Exit the quiz
                }
            }

            questionIndex++;
            askQuestion(); // Ask the next question
        } else {
            clearTimeout(quizTimer); // Stop the timer
            alert(
                `Quiz finished! Your final score is ${score}/${quizQuestions.length}`
            );
        }
    }

    // Start asking questions
    askQuestion();
}

// Function to disable further input after quiz ends or is cancelled
function disableInput() {
    // You might want to add more robust input disabling here
    // depending on how you are handling user input.
    // For a simple console-based quiz, this might be sufficient.
    prompt = function () {};
}

// Start the quiz
startQuiz();