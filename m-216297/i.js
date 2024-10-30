function startQuiz() {
    const questions = [
        {
            question: "What is the capital of France?",
            answers: { a: "Paris", b: "London", c: "Berlin", d: "Rome" },
            correct: "a",
        },
        {
            question: "What is the highest mountain in the world?",
            answers: { a: "K2", b: "Kangchenjunga", c: "Mount Everest", d: "Lhotse" },
            correct: "c",
        },
        {
            question: "What is the largest planet in our solar system?",
            answers: { a: "Mars", b: "Jupiter", c: "Saturn", d: "Earth" },
            correct: "b",
        },
    ];

    let numQuestions = 5;
    let score = 0;
    let quizStartTime = Date.now();
    let timeLimitMillis = 10 * 60 * 1000; // 10 minutes

    // Select a subset of questions at random
    let quizQuestions = questions
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(numQuestions, questions.length));

    function askQuestion(index) {
        // Check time limit
        if ((Date.now() - quizStartTime) > timeLimitMillis) {
            console.log("Time's up!");
            endQuiz();
            return;
        }

        if (index >= quizQuestions.length) {
            endQuiz();
            return;
        }

        let questionData = quizQuestions[index];
        let questionText = `Question ${index + 1}: ${questionData.question}\n`;
        for (const key in questionData.answers) {
            questionText += `${key}) ${questionData.answers[key]}\n`;
        }

        askForAnswer(questionData, 2, index, questionText);
    }

    function askForAnswer(questionData, turnsLeft, index, questionText) {
        // Check time limit again before each attempt
        if ((Date.now() - quizStartTime) > timeLimitMillis) {
            console.log("Time's up!");
            endQuiz();
            return;
        }

        let userAnswer = prompt(questionText).toLowerCase();

        if (!questionData.answers[userAnswer]) {
            console.log("Invalid answer! Please choose from the available options.");
            askForAnswer(questionData, turnsLeft, index, questionText);
            return;
        }

        if (userAnswer === questionData.correct) {
            console.log("Correct!");
            score++;
            askQuestion(index + 1);
        } else if (turnsLeft > 1) {
            console.log(`Incorrect. You have ${turnsLeft - 1} more attempts left.`);
            askForAnswer(questionData, turnsLeft - 1, index, questionText);
        } else {
            console.log(`Incorrect. The correct answer was ${questionData.correct}) ${questionData.answers[questionData.correct]}`);
            askQuestion(index + 1);
        }
    }

    function endQuiz() {
        let timeTaken = (Date.now() - quizStartTime) / 1000;
        alert(`Quiz finished!\nYour final score is ${score}/${quizQuestions.length}`);
    }

    askQuestion(0);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { startQuiz };
} else {
    startQuiz();
}