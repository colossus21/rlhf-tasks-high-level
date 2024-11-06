describe('Datalist Input Tests - Response 2', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <label for="browser">Choose your browser:</label>
            <input list="browsers" id="browser" name="browser">
            <datalist id="browsers">
                <option value="Chrome">
                <option value="Firefox">
                <option value="Safari">
                <option value="Edge">
            </datalist>
        `;
    });

    test('Test #1: should accept input that is present in the list', () => {
        const input = document.getElementById('browser');

        input.value = 'Chrome';
        input.dispatchEvent(new Event('change'));

        expect(input.value).toBe('Chrome');
        expect(input.validity.valid).toBe(true);
    });

    test('Test #2: should accept input that is not present in the list (no validation)', () => {
        const input = document.getElementById('browser');

        input.value = 'Opera';
        input.dispatchEvent(new Event('change'));

        expect(input.value).toBe('Opera');
        expect(input.validity.valid).toBe(true);
    });
});