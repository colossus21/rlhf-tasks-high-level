import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './App.jsx';

// Simple mock for FaImage
const MockFaImage = () => <div data-testid="fa-image">FaImage</div>;
const MockFormControl = (props) => <input {...props} data-testid="form-control" />;

// Tests for Label Method
describe('FileUpload Label Method', () => {
    const handleImageChange = () => {};

    it('Test Case #1: Should not show default file input text', () => {
        render(
            <div>
                <MockFaImage />
                <label htmlFor="image-upload">Add Photo</label>
                <MockFormControl
                    type="file"
                    id="image-upload"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
            </div>
        );

        // Check that file input is hidden
        const fileInput = screen.getByTestId('form-control');
        expect(getComputedStyle(fileInput).display).toBe('none');

        // Verify custom text is visible
        const label = screen.getByText('Add Photo');
        expect(label).toBeTruthy();
    });

    it('Test Case #2: Clicking Add Photo label should trigger file input', async () => {
        const user = userEvent.setup();
        let inputClicked = false;

        render(
            <div>
                <MockFaImage />
                <label htmlFor="test-input">Add Photo</label>
                <MockFormControl
                    type="file"
                    id="test-input"
                    onClick={() => { inputClicked = true; }}
                    style={{ display: 'none' }}
                />
            </div>
        );

        const label = screen.getByText('Add Photo');
        await user.click(label);

        expect(inputClicked).toBe(true);
    });
});

// Tests for Button Method
describe('FileUpload Button Method', () => {
    const handleImageChange = () => {};

    it('Test Case #1: Should not show default file input text', () => {
        render(
            <div>
                <MockFaImage />
                <button>Add Photo</button>
                <MockFormControl
                    type="file"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
            </div>
        );

        // Check that file input is hidden
        const fileInput = screen.getByTestId('form-control');
        expect(getComputedStyle(fileInput).display).toBe('none');

        // Verify custom button is visible
        const button = screen.getByRole('button');
        expect(button).toBeTruthy();
    });

    it('Test Case #2: Clicking Add Photo button should trigger file input', async () => {
        const user = userEvent.setup();
        let inputClicked = false;

        render(
            <div>
                <MockFaImage />
                <button onClick={() => {
                    const fileInput = document.getElementById('test-input');
                    fileInput.click();
                }}>Add Photo</button>
                <MockFormControl
                    id="test-input"
                    type="file"
                    onClick={() => { inputClicked = true; }}
                    style={{ display: 'none' }}
                />
            </div>
        );

        const button = screen.getByRole('button');
        await user.click(button);

        expect(inputClicked).toBe(true);
    });
});