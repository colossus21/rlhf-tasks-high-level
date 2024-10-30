// Set of questions, each with a question, correct answer, and incorrect answers
const questionBank = [
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
    // Add more questions here...
];

// Function to generate a random subset of questions
function getRandomQuestions(numQuestions) {
    const shuffledQuestions = questionBank.sort(() => 0.5 - Math.random());
    return shuffledQuestions.slice(0, numQuestions);
}

// Function to display a question and get user input
function askQuestion(questionData, remainingTurns) {
    const options = [questionData.correctAnswer, ...questionData.incorrectAnswers].sort(() => 0.5 - Math.random());
    let answer;

    while (remainingTurns > 0) {
        console.log(questionData.question);
        for (let i = 0; i < options.length; i++) {
            console.log(`${i + 1}. ${options[i]}`);
        }

        answer = prompt("Enter your answer (number):");
        if (options[parseInt(answer) - 1] === questionData.correctAnswer) {
            console.log("Correct!\n");
            return true;
        } else {
            console.log("Incorrect. You have", --remainingTurns, "turns left.\n");
        }
    }

    console.log(`Incorrect. The answer was: ${questionData.correctAnswer}\n`);
    return false;
}

// Main game function
function startQuiz(numQuestions = 5) {
    const questions = getRandomQuestions(numQuestions);
    let score = 0;
    let startTime = new Date();

    // Set timeout for 10 minutes (600,000 milliseconds)
    setTimeout(() => {
        alert(`Time's up! Your final score is ${score} out of ${numQuestions}`);
    }, 600000); // 10 minutes in milliseconds

    for (let i = 0; i < questions.length; i++) {
        if (askQuestion(questions[i], 2)) {
            score++;
        }

        // Check for timeout
        if (new Date() - startTime > 600000) {
            break; // Exit quiz if time limit is exceeded.
        }
    }

    alert(`Your final score is ${score} out of ${numQuestions}`);
}

// Start the quiz with 5 questions (you can change this number)
startQuiz();