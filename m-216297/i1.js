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
            answers: { a: "Mars", b: "Jupiter", c: "Saturn", d: "Neptune" },
            correct: "b",
        },
        // ... more questions
    ];

    let score = 0;
    let numQuestions = 5; // Number of questions per quiz
    let quizQuestions = shuffleArray(questions).slice(0, numQuestions);
    let startTime = Date.now();
    let timeLimit = 10 * 1000; // 10 minutes in milliseconds
    // let timeLimit = 10 * 60 * 1000; // 10 minutes in milliseconds

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function askQuestion(question, turns = 2) {
        let timeElapsed = Date.now() - startTime;
        if (timeElapsed >= timeLimit) {
            alert("Time's up! Your final score is " + score);
            return;
        }

        console.log(question.question);
        for (let key in question.answers) {
            console.log(`${key}: ${question.answers[key]}`);
        }

        let answer = prompt("Your answer (a, b, c, d):").toLowerCase();

        if (answer === question.correct) {
            console.log("Correct!");
            score++;
        } else {
            console.log("Incorrect.");
            if (turns > 0) {
                console.log("You have " + turns + " extra turn(s) left.");
                askQuestion(question, turns - 1);
                return;
            }
        }

        if (quizQuestions.length > 0) {
            askQuestion(quizQuestions.shift());
        } else {
            alert("Quiz finished! Your final score is " + score);
        }
    }

    askQuestion(quizQuestions.shift());
}

startQuiz();