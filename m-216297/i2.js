// Set of questions, each with a correct answer and multiple incorrect answers
const questions = [
    {
        question: "What is the capital of France?",
        correctAnswer: "Paris",
        incorrectAnswers: ["London", "Berlin", "Rome"],
    },
    {
        question: "What is the highest mountain in the world?",
        correctAnswer: "Mount Everest",
        incorrectAnswers: ["K2", "Kangchenjunga", "Lhotse"],
    },
    {
        question: "What is the largest planet in our solar system?",
        correctAnswer: "Jupiter",
        incorrectAnswers: ["Saturn", "Uranus", "Neptune"],
    },
];

// Function to generate a random subset of questions
function getRandomQuestions(numQuestions) {
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    return shuffledQuestions.slice(0, numQuestions);
}

// Function to shuffle the answer choices for a question
function shuffleAnswers(question) {
    const allAnswers = [question.correctAnswer, ...question.incorrectAnswers];
    return allAnswers.sort(() => Math.random() - 0.5);
}

// Function to start the quiz
function startQuiz(numQuestions = 3) {
    const selectedQuestions = getRandomQuestions(numQuestions);
    let score = 0;
    let questionIndex = 0;

    // Set a timer for 10 minutes
    const startTime = Date.now();
    const timeLimit = 10 * 60 * 1000; // 10 minutes in milliseconds

    function askQuestion() {
        if (questionIndex >= selectedQuestions.length || Date.now() - startTime > timeLimit) {
            alert(`Quiz finished! Your final score is: ${score}`);
            return;
        }

        const currentQuestion = selectedQuestions[questionIndex];
        const shuffledAnswers = shuffleAnswers(currentQuestion);

        let remainingAttempts = 2; // Initial attempts for each question
        askCurrentQuestion();

        function askCurrentQuestion() {
            const userAnswer = prompt(`${currentQuestion.question}\n\n Choices:\n${shuffledAnswers.map((answer, i) => `${i + 1}. ${answer}`).join("\n")}\n\nEnter your choice (1-${shuffledAnswers.length}):`);

            if (userAnswer === null) {
                alert(`Quiz finished! Your final score is: ${score}`);
                return;
            }

            const selectedAnswerIndex = parseInt(userAnswer) - 1;

            if (isNaN(selectedAnswerIndex) || selectedAnswerIndex < 0 || selectedAnswerIndex >= shuffledAnswers.length) {
                alert("Invalid choice. Please enter a valid number.");
                askCurrentQuestion();
                return;
            }

            if (shuffledAnswers[selectedAnswerIndex] === currentQuestion.correctAnswer) {
                alert("Correct!");
                score++;
                questionIndex++;
                askQuestion();
            } else if (remainingAttempts > 0) {
                remainingAttempts--;
                alert(`Incorrect. You have ${remainingAttempts} attempts remaining.`);
                askCurrentQuestion();
            } else {
                alert(`Incorrect. The correct answer was: ${currentQuestion.correctAnswer}`);
                questionIndex++;
                askQuestion();
            }
        }
    }

    askQuestion();
}

// Start the quiz with 3 questions when the page loads
startQuiz();