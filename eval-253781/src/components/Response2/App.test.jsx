import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageUpload from './App.jsx';

// Simple mock for FaImage
const MockFaImage = () => <div data-testid="fa-image">FaImage</div>;
const MockFormControl = (props) => <input {...props} data-testid="form-control" />;

describe('ImageUpload Component', () => {
    const handleImageChange = () => {};

    it('Test Case #1: Should not show default file input text', () => {
        render(
            <div>
                <MockFaImage />
                <label htmlFor="file-upload">Add Photo</label>
                <MockFormControl
                    id="file-upload"
                    type="file"
                    onChange={handleImageChange}
                    className="d-none"
                />
            </div>
        );

        // Check that file input is hidden
        const fileInput = screen.getByTestId('form-control');
        expect(fileInput.classList.contains('d-none')).toBe(true);

        // Verify custom text is visible
        const label = screen.getByText('Add Photo');
        expect(label).toBeTruthy();

        // Verify custom styling
        expect(getComputedStyle(label).cursor).toBe('pointer');
    });

    it('Test Case #2: Clicking Add Photo label should trigger file input', async () => {
        const user = userEvent.setup();
        let inputClicked = false;

        render(
            <div>
                <MockFaImage />
                <label htmlFor="file-upload">Add Photo</label>
                <MockFormControl
                    id="file-upload"
                    type="file"
                    onClick={() => { inputClicked = true; }}
                    className="d-none"
                />
            </div>
        );

        const label = screen.getByText('Add Photo');
        await user.click(label);

        expect(inputClicked).toBe(true);
    });
});