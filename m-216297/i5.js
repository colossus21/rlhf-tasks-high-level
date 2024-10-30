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
        // ... more questions
    ];

    let score = 0;
    const numQuestions = 5; // Number of questions per quiz
    const selectedQuestions = shuffleArray(questions).slice(0, numQuestions);
    let startTime = new Date();

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function askQuestion(question, remainingTurns = 2) {
        console.log(question.question);
        for (const key in question.answers) {
            console.log(`${key}: ${question.answers[key]}`);
        }

        let answer = prompt("Your answer (a, b, c, d):").toLowerCase();

        if (answer === question.correct) {
            console.log("Correct!");
            score++;
        } else if (remainingTurns > 0) {
            console.log("Incorrect. You have " + remainingTurns + " extra turn(s). Try again:");
            askQuestion(question, remainingTurns -1);
            return;
        } else {
            console.log("Incorrect. The correct answer was " + question.correct);
        }

        if (selectedQuestions.length > 0) {
            if (new Date() - startTime > 600000) {
                endQuiz();
                return;
            }
            askQuestion(selectedQuestions.shift());
        } else {
            endQuiz();
        }
    }

    function endQuiz() {
        alert("Quiz finished! Your final score: " + score + " out of " + numQuestions);
    }

    askQuestion(selectedQuestions.shift());
}


startQuiz();