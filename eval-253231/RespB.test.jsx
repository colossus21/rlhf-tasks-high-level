import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AsyncComponent from './AsyncComponent';

beforeAll(() => {
    // Mock the fetch function before running tests
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ message: 'Success' }),
        })
    );
});

afterAll(() => {
    // Clean up fetch mock after tests
    global.fetch.mockClear();
});

test('renders loading message initially', () => {
    const { container } = render(<AsyncComponent />);
    expect(container).toMatchSnapshot();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('renders fetched data correctly', async () => {
    const { container } = render(<AsyncComponent />);

    // Wait for the async data to load
    await waitFor(() => expect(screen.getByText('Success')).toBeInTheDocument());

    expect(container).toMatchSnapshot();
});