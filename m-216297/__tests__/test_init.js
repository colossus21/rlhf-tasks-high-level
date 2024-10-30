// quiz.js (Your original quiz code, slightly modified for testing)

// ... (Your original quiz code from the previous response) ...

// Export functions for testing
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        shuffle,
        startQuiz,
    };
}


// quiz.test.js (Unit tests using Jest and JSDOM)

const { shuffle, startQuiz } = require("../i1");
const { JSDOM } = require("jsdom");

// Mock prompt and alert for testing
global.prompt = jest.fn();
global.alert = jest.fn();

// Setup JSDOM
const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;

describe("Quiz Functions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("shuffle()", () => {
        it("should shuffle an array randomly", () => {
            const originalArray = [1, 2, 3, 4, 5];
            const shuffledArray = shuffle([...originalArray]); // Create a copy to avoid modifying the original

            expect(shuffledArray).not.toEqual(originalArray); // Ensure it's shuffled
            expect(shuffledArray.length).toBe(originalArray.length); // Ensure all elements are present

            // Check if all original elements are in the shuffled array (in a different order)
            expect(originalArray.every(item => shuffledArray.includes(item))).toBe(true);
        });

        it("should handle an empty array", () => {
            expect(shuffle([])).toEqual([]);
        });

        it("should handle an array with a single element", () => {
            expect(shuffle([1])).toEqual([1]);
        });
    });

    describe("startQuiz()", () => {
        it("should start the quiz and ask questions", () => {
            // Mock user inputs
            let promptResponses = ["b", "c", "a", "b", "d"]; // Simulate user answering questions
            prompt.mockImplementation(() => promptResponses.shift());

            // Start the quiz
            startQuiz();

            // Check if prompt and alert were called the expected number of times
            expect(prompt).toHaveBeenCalledTimes(5); // 5 questions in the quiz
            expect(alert).toHaveBeenCalledTimes(5); // Feedback for each question
        });

        it("should handle correct answers", () => {
            prompt.mockImplementation(() => "b"); // Correct answer for the first question
            startQuiz();
            expect(alert).toHaveBeenCalledWith("Correct!");
        });

        it("should handle incorrect answers and extra attempts", () => {
            prompt.mockImplementationOnce(() => "a")
                .mockImplementationOnce(() => "c")
                .mockImplementationOnce(() => "b");  // Correct on the last try
            startQuiz();
            expect(alert).toHaveBeenCalledWith("Incorrect. Try again.");
            expect(alert).toHaveBeenCalledWith("Incorrect. The correct answer was b.");
        });

        it("should handle quiz cancellation (user pressing 'Cancel')", () => {
            prompt.mockImplementationOnce(() => null); // Simulate user pressing "Cancel"
            startQuiz();
            expect(alert).toHaveBeenCalledWith("Quiz cancelled.");
        });

        it("should end the quiz after 10 minutes", () => {
            jest.useFakeTimers(); // Use fake timers for testing timeouts

            startQuiz();

            jest.advanceTimersByTime(600000); // Advance timer by 10 minutes (in milliseconds)

            expect(alert).toHaveBeenCalledWith(expect.stringContaining("Time's up!"));
        });
    });
});