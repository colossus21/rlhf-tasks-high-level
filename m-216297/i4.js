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

    let numQuestions = 5; // Number of questions per quiz
    let score = 0;
    let quizStartTime = Date.now();
    let timeLimitMillis = 10 * 60 * 1000; // 10 minutes

    // Select a subset of questions at random
    let quizQuestions = questions.sort(() => Math.random() - 0.5).slice(0, numQuestions);

    function askQuestion(index) {
        if (index >= quizQuestions.length || (Date.now() - quizStartTime) > timeLimitMillis) {
            endQuiz();
            return;
        }

        let questionData = quizQuestions[index];
        let questionText = questionData.question + "\n";
        for (const key in questionData.answers) {
            questionText += `${key}) ${questionData.answers[key]}\n`;
        }

        let turns = 2;
        askForAnswer(questionData, turns);
    }

    function askForAnswer(questionData, turns) {
        let userAnswer = prompt(questionText);

        if (userAnswer === questionData.correct) {
            console.log("Correct!");
            score++;
            askQuestion(index + 1);
        } else if (turns > 0) {
            console.log("Incorrect. You have " + turns + " more attempts left.");
            askForAnswer(questionData, turns - 1);
        } else {
            console.log("Incorrect. The correct answer was " + questionData.correct);
            askQuestion(index + 1);
        }
    }

    function endQuiz() {
        let timeTaken = (Date.now() - quizStartTime) / (1000);
        alert("Quiz finished! Your final score is " + score + "/" + numQuestions + ". Time taken: " + timeTaken.toFixed(2) + " seconds.");
    }

    askQuestion(0);
}

startQuiz();