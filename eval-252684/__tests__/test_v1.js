describe('Datalist Input Validation Tests - Response 1', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <label for="ice-cream-flavor">Choose a flavor:</label>
            <input type="text" id="ice-cream-flavor" list="flavors">
            <datalist id="flavors">
                <option value="Chocolate">
                <option value="Vanilla">
                <option value="Strawberry">
                <option value="Mint Chip">
            </datalist>
        `;

        // Add the validation script
        const iceCreamInput = document.getElementById('ice-cream-flavor');
        const flavorsList = document.getElementById('flavors');
        iceCreamInput.addEventListener('blur', () => {
            let isValid = false;
            for (const option of flavorsList.options) {
                if (option.value === iceCreamInput.value) {
                    isValid = true;
                    break;
                }
            }
            if (!isValid) {
                alert('Please choose a flavor from the list.');
                iceCreamInput.focus();
            }
        });
    });

    test('Test #1: should accept input that is present in the list', () => {
        const input = document.getElementById('ice-cream-flavor');
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

        input.value = 'Chocolate';
        input.dispatchEvent(new Event('blur'));

        expect(alertMock).not.toHaveBeenCalled();
        expect(input.value).toBe('Chocolate');

        alertMock.mockRestore();
    });

    test('Test #2: should accept input that is not present in the list', () => {
        const input = document.getElementById('ice-cream-flavor');
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        const focusMock = jest.spyOn(input, 'focus');

        input.value = 'Pistachio';
        input.dispatchEvent(new Event('blur'));

        expect(alertMock).toHaveBeenCalledWith('Please choose a flavor from the list.');
        expect(focusMock).toHaveBeenCalled();

        alertMock.mockRestore();
        focusMock.mockRestore();
    });
});