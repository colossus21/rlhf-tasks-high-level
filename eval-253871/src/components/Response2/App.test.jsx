import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import mediaQuery from 'css-mediaquery';
import ThreeColumnLayout from './App.jsx';

function createMatchMedia(width) {
    return (query) => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
        media: query,
    });
}

describe('ThreeColumnLayout Static Grid Tests', () => {
    const mockData = {
        title: 'Test Card',
        image: <img src="test.jpg" alt="test" data-testid="card-image" />
    };

    // Test #1: Check if layout renders in exactly 3 columns on desktop view
    it('renders exactly 3 columns on desktop view', () => {
        window.matchMedia = createMatchMedia(1200);

        const { container } = render(
            <ThemeProvider theme={createTheme()}>
                <ThreeColumnLayout data={mockData} />
            </ThemeProvider>
        );

        const gridItems = container.querySelectorAll('.MuiGrid-item');
        expect(gridItems).toHaveLength(3);

        gridItems.forEach(item => {
            expect(item).toHaveClass('MuiGrid-grid-sm-4');
            expect(item).toHaveClass('MuiGrid-grid-md-4');
        });

        const gridContainer = container.querySelector('.MuiGrid-container');
        expect(gridContainer).toHaveStyle({
            display: 'flex',
            justifyContent: 'center'
        });
    });

    // Test #2: Verify equal width distribution among columns
    it('ensures equal width distribution among columns', () => {
        window.matchMedia = createMatchMedia(1200);

        const { container } = render(
            <ThemeProvider theme={createTheme()}>
                <ThreeColumnLayout data={mockData} />
            </ThemeProvider>
        );

        const gridItems = container.querySelectorAll('.MuiGrid-item');
        const widths = Array.from(gridItems).map(item =>
            window.getComputedStyle(item).width
        );

        expect(widths[0]).toBe(widths[1]);
        expect(widths[1]).toBe(widths[2]);

        gridItems.forEach(item => {
            expect(item).toHaveClass('MuiGrid-grid-sm-4');
        });
    });
});