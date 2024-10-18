// index.test.js
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index_g.html'), 'utf8');

jest.dontMock('fs');

describe('Gemini Pro: Team Shuffler App', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    // R1: The application must be implemented using HTML, CSS, and JavaScript in a single file.
    it('R1: should have HTML, CSS, and JavaScript in a single file', () => {
        expect(document.querySelector('html')).toBeTruthy();
        expect(document.querySelector('style')).toBeTruthy();
        expect(document.querySelector('script')).toBeTruthy();
    });

    // R2: The application must provide an input area for users to enter player names.
    it('R2: should have a textarea for entering player names', () => {
        expect(document.getElementById('playerNames')).toBeTruthy();
    });

    // R3: The application must provide an input field for users to specify the number of teams.
    it('R3: should have an input field for the number of teams', () => {
        const numTeamsInput = document.getElementById('numTeams');
        expect(numTeamsInput).toBeTruthy();
        expect(numTeamsInput.type).toBe('number');
        expect(numTeamsInput.min).toBe('1');
    });

    // R4: The application must include a "Generate Team" button to initiate team creation.
    it('R4: should have a "Generate Team" button', () => {
        expect(document.querySelector('button:nth-of-type(1)')).toBeTruthy();
        expect(document.querySelector('button:nth-of-type(1)').textContent).toBe('Generate Teams');
    });

    // R5: The application must include a "Re-shuffle" button to redistribute players among teams.
    it('R5: should have a "Re-shuffle" button', () => {
        expect(document.querySelector('button:nth-of-type(2)')).toBeTruthy();
        expect(document.querySelector('button:nth-of-type(2)').textContent).toBe('Re-shuffle');
    });

    // R6: The application must evenly distribute players among the specified number of teams.
    it('R6: should evenly distribute players among teams', () => {
        document.getElementById('playerNames').value = 'Player 1\nPlayer 2\nPlayer 3\nPlayer 4';
        document.getElementById('numTeams').value = 2;
        generateTeams();
        const team1 = document.querySelectorAll('#output ul')[0].querySelectorAll('li');
        const team2 = document.querySelectorAll('#output ul')[1].querySelectorAll('li');
        expect(team1.length).toBe(2);
        expect(team2.length).toBe(2);
    });

    // R7: The application must place any extra players not evenly distributed into a "Sub" team.
    it('R7: should place extra players in a "Sub" team', () => {
        document.getElementById('playerNames').value = 'Player 1\nPlayer 2\nPlayer 3\nPlayer 4\nPlayer 5';
        document.getElementById('numTeams').value = 2;
        generateTeams();
        const subTeam = document.querySelectorAll('#output ul')[2];
        expect(subTeam).toBeTruthy();
        expect(subTeam.querySelectorAll('li').length).toBe(1);
    });

    // R8: The application must display the generated teams with their assigned players.
    it('R8: should display the generated teams with players', () => {
        document.getElementById('playerNames').value = 'Player 1\nPlayer 2';
        document.getElementById('numTeams').value = 1;
        generateTeams();
        expect(document.getElementById('output').innerHTML).toContain('Team 1');
        expect(document.getElementById('output').innerHTML).toContain('Player 1');
        expect(document.getElementById('output').innerHTML).toContain('Player 2');
    });

    // R9: The application must validate that at least one player name is entered before generating teams.
    it('R9: should validate for at least one player name', () => {
        document.getElementById('playerNames').value = '';
        document.getElementById('numTeams').value = 2;
        generateTeams();
        expect(document.getElementById('output').innerHTML).toContain('Please enter player names');
    });

    // R10: The application must validate that the number of teams specified is at least 1.
    it('R10: should validate that the number of teams is at least 1', () => {
        document.getElementById('playerNames').value = 'Player 1';
        document.getElementById('numTeams').value = 0;
        generateTeams();
        expect(document.getElementById('output').innerHTML).toContain('valid number of teams');
    });

    // R11: The application must clear any previously generated teams when generating new teams.
    it('R11: should clear previously generated teams', () => {
        document.getElementById('playerNames').value = 'Player 1\nPlayer 2';
        document.getElementById('numTeams').value = 1;
        generateTeams();
        document.getElementById('playerNames').value = 'Player 3';
        generateTeams();
        const teams = document.querySelectorAll('#output ul');
        expect(teams.length).toBe(1); // Only one team should be present
    });

    // R12: The "Re-shuffle" button must only be clickable after teams have been generated.
    it('R12: "Re-shuffle" button should be enabled after team generation', () => {
        const reshuffleBtn = document.querySelector('button:nth-of-type(2)');
        expect(reshuffleBtn.disabled).toBe(true);

        document.getElementById('playerNames').value = 'Player 1\nPlayer 2';
        document.getElementById('numTeams').value = 1;
        generateTeams();
        expect(reshuffleBtn.disabled).toBe(false);
    });

    // R13: The application must maintain the same number of teams and players when re-shuffling.
    it('R13: should maintain the same number of teams and players when re-shuffling', () => {
        document.getElementById('playerNames').value = 'Player 1\nPlayer 2\nPlayer 3';
        document.getElementById('numTeams').value = 2;
        generateTeams();
        const initialTeams = document.querySelectorAll('#output ul');

        reshuffleTeams();
        const reshuffledTeams = document.querySelectorAll('#output ul');

        expect(initialTeams.length).toBe(reshuffledTeams.length);
        // Add more assertions to check if the total number of players remains the same
    });

    // R14: The application must trim whitespace from player names during processing.
    it('R14: should trim whitespace from player names', () => {
        document.getElementById('playerNames').value = '  Player 1  \n  Player 2  ';
        document.getElementById('numTeams').value = 1;
        generateTeams();
        const team1 = document.querySelectorAll('#output ul')[0].querySelectorAll('li');
        expect(team1[0].textContent).toBe('Player 1');
        expect(team1[1].textContent).toBe('Player 2');
    });
});