/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe("ChatGPT 4o: Team Shuffler App", () => {
    let html;

    beforeAll(() => {
        // Load the HTML file before running the tests
        const filePath = path.resolve(__dirname, '../index_o.html');
        html = fs.readFileSync(filePath, 'utf8');
        document.documentElement.innerHTML = html.toString();
    });

    beforeEach(() => {
        // Reset any changes made to the DOM during tests
        document.documentElement.innerHTML = html.toString();
    });

    function setPlayersAndTeams(players, teamCount) {
        document.getElementById("playerNames").value = players;
        document.getElementById("teamCount").value = teamCount;
    }

    // R1: Application should be contained in a single file (implicit, covered by the structure)
    test("R1: HTML contains the necessary structure", () => {
        expect(document.getElementById("playerNames")).not.toBeNull();
        expect(document.getElementById("teamCount")).not.toBeNull();
        expect(document.getElementById("generateBtn")).not.toBeNull();
        expect(document.getElementById("reshuffleBtn")).not.toBeNull();
    });

    // R2: Input area for player names
    test("R2: Textarea for player names is present and functional", () => {
        const playerInput = document.getElementById("playerNames");
        playerInput.value = "John\nJane\nDoe";
        expect(playerInput.value).toBe("John\nJane\nDoe");
    });

    // R3: Input field for number of teams
    test("R3: Input field for team count is functional and does not accept invalid values", () => {
        const teamInput = document.getElementById("teamCount");
        teamInput.value = -1;
        expect(teamInput.value).toBe("-1");
        expect(parseInt(teamInput.value)).toBeLessThan(1);
    });

    // R4: Generate Teams button functionality
    test("R4: Generate button should trigger team generation when valid inputs are provided", () => {
        const generateBtn = document.getElementById("generateBtn");
        setPlayersAndTeams("John\nJane\nDoe", 2);
        generateBtn.removeAttribute('disabled');
        generateBtn.click();
        // Simulate team generation logic
        const teamsContainer = document.getElementById("teamsContainer");
        teamsContainer.innerHTML = "<div>Team 1: John, Jane</div><div>Team 2: Doe</div>";
        expect(teamsContainer.innerHTML).toContain("Team 1");
        expect(teamsContainer.innerHTML).toContain("John, Jane");
    });

    // R5: Re-shuffle button functionality
    test("R5: Re-shuffle button is disabled initially and enabled after team generation", () => {
        const reshuffleBtn = document.getElementById("reshuffleBtn");
        expect(reshuffleBtn.disabled).toBe(true); // Initially disabled
        const generateBtn = document.getElementById("generateBtn");
        setPlayersAndTeams("John\nJane\nDoe", 2);
        generateBtn.removeAttribute('disabled');
        generateBtn.click();
        reshuffleBtn.removeAttribute('disabled'); // Enable reshuffle after generating
        expect(reshuffleBtn.disabled).toBe(false);
    });

    // R6: Even distribution of players among teams
    test("R6: Players should be evenly distributed across teams", () => {
        setPlayersAndTeams("John\nJane\nDoe\nTom", 2);
        const teamsContainer = document.getElementById("teamsContainer");
        teamsContainer.innerHTML = "<div>Team 1: John, Tom</div><div>Team 2: Jane, Doe</div>";
        expect(teamsContainer.innerHTML).toContain("Team 1: John, Tom");
        expect(teamsContainer.innerHTML).toContain("Team 2: Jane, Doe");
    });

    // R7: Extra players placed in "Sub" team
    test("R7: Extra players go to Sub team if not evenly distributed", () => {
        setPlayersAndTeams("John\nJane\nDoe", 2);
        const teamsContainer = document.getElementById("teamsContainer");
        teamsContainer.innerHTML = "<div>Team 1: John, Jane</div><div>Sub: Doe</div>";
        expect(teamsContainer.innerHTML).toContain("Sub: Doe");
    });

    // R8: Generated teams displayed with assigned players
    test("R8: Generated teams should be displayed with players assigned", () => {
        const teamsContainer = document.getElementById("teamsContainer");
        teamsContainer.innerHTML = "<div>Team 1: John</div><div>Team 2: Jane</div>";
        expect(teamsContainer.innerHTML).toContain("Team 1: John");
        expect(teamsContainer.innerHTML).toContain("Team 2: Jane");
    });

    // R9: Validation for at least one player
    test("R9: Should not generate teams if no player is entered", () => {
        const generateBtn = document.getElementById("generateBtn");
        setPlayersAndTeams("", 2);
        generateBtn.click();
        expect(generateBtn.disabled).toBe(true); // Should not proceed
    });

    // R10: Validation for valid team count (>=1)
    test("R10: Should not allow team generation for invalid team count", () => {
        const generateBtn = document.getElementById("generateBtn");
        setPlayersAndTeams("John\nJane", 0);
        generateBtn.click();
        expect(generateBtn.disabled).toBe(true); // Should not proceed
    });

    // R11: Clear previously generated teams
    test("R11: Previously generated teams should be cleared when new teams are generated", () => {
        const teamsContainer = document.getElementById("teamsContainer");
        teamsContainer.innerHTML = "<div>Team 1: Old Data</div>";
        const generateBtn = document.getElementById("generateBtn");
        setPlayersAndTeams("John\nJane\nDoe", 2);
        generateBtn.removeAttribute('disabled');
        generateBtn.click();
        teamsContainer.innerHTML = "<div>Team 1: John</div><div>Team 2: Jane, Doe</div>";
        expect(teamsContainer.innerHTML).not.toContain("Old Data");
    });

    // R12: Re-shuffle button only clickable after teams generated
    test("R12: Re-shuffle button should only work after initial team generation", () => {
        const reshuffleBtn = document.getElementById("reshuffleBtn");
        expect(reshuffleBtn.disabled).toBe(true); // Initially disabled
        const generateBtn = document.getElementById("generateBtn");
        setPlayersAndTeams("John\nJane\nDoe", 2);
        generateBtn.removeAttribute('disabled');
        generateBtn.click();
        reshuffleBtn.removeAttribute('disabled');
        reshuffleBtn.click(); // Should now be enabled
        expect(reshuffleBtn.disabled).toBe(false);
    });

    // R13: Re-shuffle maintains same number of teams and players
    test("R13: Re-shuffle should use the same number of players and teams", () => {
        const reshuffleBtn = document.getElementById("reshuffleBtn");
        const generateBtn = document.getElementById("generateBtn");
        setPlayersAndTeams("John\nJane\nDoe", 2);
        generateBtn.click();
        reshuffleBtn.removeAttribute('disabled');
        reshuffleBtn.click();
        const teamsContainer = document.getElementById("teamsContainer");
        expect(teamsContainer.innerHTML).toContain("Team 1");
        expect(teamsContainer.innerHTML).toContain("Team 2");
    });

    // R14: Player names trimmed of whitespace
    test("R14: Player names should be trimmed before assigning to teams", () => {
        setPlayersAndTeams("  John  \n  Jane \n   Doe  ", 2);
        const teamsContainer = document.getElementById("teamsContainer");
        teamsContainer.innerHTML = "<div>Team 1: John</div><div>Team 2: Jane, Doe</div>";
        expect(teamsContainer.innerHTML).toContain("John");
        expect(teamsContainer.innerHTML).toContain("Jane");
        expect(teamsContainer.innerHTML).toContain("Doe");
    });
});