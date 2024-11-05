import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import mediaQuery from 'css-mediaquery';
import MyComponent from './App.jsx';

function createMatchMedia(width) {
    return (query) => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
        media: query,
    });
}

describe('MyComponent Grid Layout Tests', () => {
    const mockData = [
        { id: 1, title: 'Card 1', image: <img src="test1.jpg" alt="test1" data-testid="card-image-1" /> },
        { id: 2, title: 'Card 2', image: <img src="test2.jpg" alt="test2" data-testid="card-image-2" /> },
        { id: 3, title: 'Card 3', image: <img src="test3.jpg" alt="test3" data-testid="card-image-3" /> }
    ];

    // Test #1: Check if layout renders in exactly 3 columns on desktop view
    it('renders exactly 3 columns on desktop view with Grid approach', () => {
        window.matchMedia = createMatchMedia(1200);

        const { container } = render(
            <ThemeProvider theme={createTheme()}>
                <MyComponent cardData={mockData} />
            </ThemeProvider>
        );

        const gridItems = container.querySelectorAll('.MuiGrid-item');
        expect(gridItems).toHaveLength(3);

        gridItems.forEach(item => {
            expect(item).toHaveClass('MuiGrid-grid-sm-4');
        });

        const gridContainer = container.querySelector('.MuiGrid-container');
        expect(gridContainer).toHaveStyle({ display: 'flex' });
    });

    // Test #2: Verify equal width distribution among columns
    it('ensures equal width distribution among columns in Grid layout', () => {
        window.matchMedia = createMatchMedia(1200);

        const { container } = render(
            <ThemeProvider theme={createTheme()}>
                <MyComponent cardData={mockData} />
            </ThemeProvider>
        );

        const gridItems = container.querySelectorAll('.MuiGrid-item');
        const widths = Array.from(gridItems).map(item =>
            window.getComputedStyle(item).width
        );

        expect(widths[0]).toBe(widths[1]);
        expect(widths[1]).toBe(widths[2]);

        // Test flex layout width (30% for each item)
        const flexboxContainer = container.querySelector('[style*="flex-wrap: wrap"]');
        if (flexboxContainer) {
            const flexItems = flexboxContainer.children;
            Array.from(flexItems).forEach(item => {
                expect(item).toHaveStyle({ width: '30%' });
            });
        }
    });
});