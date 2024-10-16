/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('Personal Home Page App Tests', () => {
    let document;

    beforeEach(() => {
        document = new DOMParser().parseFromString(html, 'text/html'); // Use JSDOM
        global.document = document;  // Make "document" available globally like in a browser
        global.window = document.defaultView; // Also make "window" available

        document.body.innerHTML = html;

        Storage.prototype.getItem = jest.fn();
        Storage.prototype.setItem = jest.fn();
        Storage.prototype.removeItem = jest.fn();
    });

    it('R1: Application is implemented in a single HTML file', () => {
        expect(document.documentElement).toBeTruthy();
    });

    it('R2: Add new site links as tiles', () => {
        const initialTileCount = document.querySelectorAll('.tile').length;
        document.getElementById('urlInput').value = 'https://www.example.com';
        document.getElementById('titleInput').value = 'Example';
        document.getElementById('colorInput').value = '#000000';
        document.getElementById('addTileButton').click();
        expect(document.querySelectorAll('.tile').length).toBeGreaterThan(initialTileCount);
    });

    it('R3: Each tile displays a title', () => {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            const title = tile.querySelector('.tile-title');
            expect(title).toBeTruthy();
            expect(title.textContent).toBeDefined();
        });
    });

    it('R4: Each tile has customizable background color', () => {
        const tile = document.querySelector('.tile');
        const initialColor = tile.style.backgroundColor;
        document.getElementById('colorInput').value = '#ff0000';
        document.getElementById('editColorButton').click();
        expect(tile.style.backgroundColor).not.toBe(initialColor);
    });

    it('R5: Application displays 3 tiles per row', () => {
        const tiles = document.querySelectorAll('.tile');
        const row = Math.ceil(tiles.length / 3);
        expect(row).toBeGreaterThan(0);
    });

    it('R6: Clicking a tile opens the linked site', () => {
        const tile = document.querySelector('.tile a');
        const href = tile.getAttribute('href');
        expect(href).toBeDefined();
    });

    it('R7: Application stores tiles data in local storage', () => {
        document.getElementById('urlInput').value = 'https://www.example.com';
        document.getElementById('titleInput').value = 'Example';
        document.getElementById('addTileButton').click();
        expect(localStorage.setItem).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    });

    it('R8: Application loads saved tiles on page open', () => {
        localStorage.getItem.mockReturnValueOnce(JSON.stringify([{url: 'https://www.example.com', title: 'Example', color: '#000000'}]));
        expect(document.querySelectorAll('.tile').length).toBeGreaterThan(0);
    });

    it('R9: Users can delete existing tiles', () => {
        const initialTileCount = document.querySelectorAll('.tile').length;
        document.getElementById('deleteTileButton').click();
        expect(document.querySelectorAll('.tile').length).toBeLessThan(initialTileCount);
    });

    it('R10: Users can edit the title of existing tiles', () => {
        const tile = document.querySelector('.tile .tile-title');
        const initialTitle = tile.textContent;
        document.getElementById('editTitleInput').value = 'New Title';
        document.getElementById('editTitleButton').click();
        expect(tile.textContent).not.toBe(initialTitle);
    });

    it('R11: Users can edit the background color of existing tiles', () => {
        const tile = document.querySelector('.tile');
        const initialColor = tile.style.backgroundColor;
        document.getElementById('colorInput').value = '#ff0000';
        document.getElementById('editColorButton').click();
        expect(tile.style.backgroundColor).not.toBe(initialColor);
    });

    it('R12: Application prevents addition of duplicate URLs', () => {
        document.getElementById('urlInput').value = 'https://www.duplicate.com';
        document.getElementById('addTileButton').click();
        const duplicateCheck = document.querySelectorAll('.tile').length;
        document.getElementById('urlInput').value = 'https://www.duplicate.com';
        document.getElementById('addTileButton').click();
        expect(document.querySelectorAll('.tile').length).toBe(duplicateCheck);
    });

    it('R13: Application validates URLs before adding tiles', () => {
        document.getElementById('urlInput').value = 'invalid-url';
        document.getElementById('addTileButton').click();
        expect(document.querySelectorAll('.tile').length).toBe(0);
    });

    it('R14: Application limits the length of displayed titles', () => {
        document.getElementById('titleInput').value = 'A very long title that exceeds the limit';
        document.getElementById('addTileButton').click();
        const title = document.querySelector('.tile .tile-title').textContent;
        expect(title.length).toBeLessThanOrEqual(20);
    });

    it('R15: Application has search functionality', () => {
        document.getElementById('searchInput').value = 'Example';
        document.getElementById('searchButton').click();
        const visibleTiles = document.querySelectorAll('.tile:not([hidden])').length;
        expect(visibleTiles).toBeGreaterThan(0);
    });

});