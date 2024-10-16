/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Team Shuffler App', () => {
    let htmlContent;
    let dom;

    beforeAll(() => {
        htmlContent = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8'); // Update path if necessary
        document.body.innerHTML = htmlContent;
        dom = new DOMParser().parseFromString(htmlContent, 'text/html');
    })


    // R1: Single HTML file structure (covered by beforeAll - ensuring the file loads)
    test('R1: The application is implemented in a single HTML file', () => {
        expect(htmlContent).toContain('<html');
        expect(htmlContent).toContain('<head>');
        expect(htmlContent).toContain('<body>');
        expect(htmlContent).toContain('<script>');
        expect(htmlContent).toContain('<style>');
    });

    // R2 & A2: Player name input area
    test('R2: Player name input exists', () => {
        expect(document.getElementById('playerNames')).toBeInstanceOf(HTMLTextAreaElement);
    });

    // R3 & A3: Number of teams input
    test('R3: Number of teams input exists', () => {
        expect(document.getElementById('numTeams')).toBeInstanceOf(HTMLInputElement);
        expect(document.getElementById('numTeams').type).toBe('number');
    });


    // R4 & A4: Generate Team button
    test('R4: Generate Team button exists', () => {
        expect(document.querySelector('button[onclick="generateTeams()"]')).toBeInstanceOf(HTMLButtonElement);
        expect(document.querySelector('button[onclick="generateTeams()"]').textContent).toMatch(/Generate Teams/);
    });

    // R5 & A5: Re-shuffle button
    test('R5: Re-shuffle button exists', () => {
        expect(document.querySelector('button[onclick="shuffleTeams()"]')).toBeInstanceOf(HTMLButtonElement);
        expect(document.querySelector('button[onclick="shuffleTeams()"]').textContent).toMatch(/Re-shuffle/);
    });



    // R6, R7, R8, R9, R10, R11 are tested together in a functional test
    test('R6-R11: Team generation, distribution, sub team, validation, and display', () => {
        const playerNamesInput = document.getElementById('playerNames');
        const numTeamsInput = document.getElementById('numTeams');
        const generateButton = document.querySelector('button[onclick="generateTeams()"]');
        const teamsContainer = document.getElementById('teamsContainer');

        // Invalid input: no players
        generateButton.click();
        expect(teamsContainer.innerHTML.trim()).toBe(""); // Expect some feedback or no change

        // Invalid input: zero teams
        playerNamesInput.value = "Player 1";
        numTeamsInput.value = 0;
        generateButton.click();

        expect(teamsContainer.innerHTML.trim()).toBe(""); // Expect some feedback


        // Valid input
        playerNamesInput.value = "Player 1\nPlayer 2\nPlayer 3\nPlayer 4\nPlayer 5";
        numTeamsInput.value = 2;
        generateButton.click();

        // Check team distribution and sub team
        expect(teamsContainer.querySelectorAll('.team').length).toBe(3); // 2 teams + 1 sub team

        // Check clearing of previous teams (implicitly tested – if it didn't clear, the above assertion would likely fail)

        // Check display format (more detailed assertions based on your actual structure)
        expect(teamsContainer.innerHTML).toContain("Team 1");
        expect(teamsContainer.innerHTML).toContain("Team 2");
        expect(teamsContainer.innerHTML).toContain("Sub");  // Check for sub team

    });




    // R12: Re-shuffle button enabled after team generation
    test('R12: Re-shuffle button enabled state', () => {
        const playerNamesInput = document.getElementById('playerNames');
        const numTeamsInput = document.getElementById('numTeams');
        const generateButton = document.querySelector('button[onclick="generateTeams()"]');
        const reshuffleButton = document.querySelector('button[onclick="shuffleTeams()"]');

        playerNamesInput.value = "Player A";  // Provide valid input for teams to generate
        numTeamsInput.value = 1;
        generateButton.click();
        expect(reshuffleButton.disabled).toBe(false);
    });


    // R13 & A13: Same number of teams and players on re-shuffle
    test('R13: Re-shuffle maintains teams and players', () => {
        const playerNamesInput = document.getElementById('playerNames');
        const numTeamsInput = document.getElementById('numTeams');
        const generateButton = document.querySelector('button[onclick="generateTeams()"]');
        const reshuffleButton = document.querySelector('button[onclick="shuffleTeams()"]');
        const teamsContainer = document.getElementById('teamsContainer');

        playerNamesInput.value = "Player 1\nPlayer 2\nPlayer 3";
        numTeamsInput.value = 2;
        generateButton.click();

        const initialNumTeams = teamsContainer.querySelectorAll('.team').length;
        const initialPlayerCount = Array.from(teamsContainer.querySelectorAll('.team li')).length;


        reshuffleButton.click();

        const afterReshuffleNumTeams = teamsContainer.querySelectorAll('.team').length;
        const afterReshufflePlayerCount = Array.from(teamsContainer.querySelectorAll('.team li')).length;

        expect(afterReshuffleNumTeams).toBe(initialNumTeams);
        expect(afterReshufflePlayerCount).toBe(initialPlayerCount);

    });



    // R14 & A14: Whitespace trimming
    test('R14: Whitespace trimming from player names', () => {
        const playerNamesInput = document.getElementById('playerNames');
        const numTeamsInput = document.getElementById('numTeams');
        const generateButton = document.querySelector('button[onclick="generateTeams()"]');
        const teamsContainer = document.getElementById('teamsContainer');

        playerNamesInput.value = "  Player A  \n  Player B  ";
        numTeamsInput.value = 1;
        generateButton.click();

        const playerNames = Array.from(teamsContainer.querySelectorAll('.team li')).map(li => li.textContent);

        expect(playerNames).toEqual(['Player A', 'Player B']);
    });


    // R15 & A15: Duplicate player names
    test('R15: Handling of duplicate player names', () => {
        const playerNamesInput = document.getElementById('playerNames');
        const numTeamsInput = document.getElementById('numTeams');
        const generateButton = document.querySelector('button[onclick="generateTeams()"]');
        const teamsContainer = document.getElementById('teamsContainer');

        playerNamesInput.value = "Player X\nPlayer X\nPlayer Y";
        numTeamsInput.value = 2;
        generateButton.click();


        const playerNames = Array.from(teamsContainer.querySelectorAll('.team li')).map(li => li.textContent);
        expect(playerNames.length).toBe(3);  // All 3 players should be present, even the duplicates
        expect(playerNames).toContain("Player X");
        expect(playerNames).toContain("Player Y");
    });


});
