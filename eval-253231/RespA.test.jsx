import React from 'react';
import AsyncComponent from './AsyncComponent'; // Path to your component
import { render, screen, waitFor } from '@testing-library/react';

describe('AsyncComponent', () => {
    it('displays loading message initially', () => {
        render(<AsyncComponent />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('fetches and displays data', async () => {
        // Mock the fetch call
        const mockData = { results: [{ name: { first: 'John', last: 'Doe' } }] }; // Simplified mock data
        fetch.mockResolvedValueOnce(new Response(JSON.stringify(mockData)));

        render(<AsyncComponent />);

        // Wait for the data to be fetched and rendered
        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        // Assertions based on your expected data structure.  This example is generic; adapt it to your specific API response:
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument(); // Check for part of the name. More robust than checking the full rendered output.
        // Or you could check for a specific element containing the data if your component renders it in a predictable way, e.g. within a list item or a specific div.

    });


    it('handles errors gracefully', async () => {
        // Mock a failed fetch call
        fetch.mockRejectedValueOnce(new Error('Network error'));

        render(<AsyncComponent />);

        // Wait for an error message or fallback UI. How you handle errors determines the assertion:
        // Example 1: Display an error message
        await waitFor(() => { expect(screen.getByText(/error/i)).toBeInTheDocument(); }); // Adjust the text as needed


        // Example 2: Display fallback UI (if you render something different on error)
        // await waitFor(() => { expect(screen.getByTestId('error-fallback')).toBeInTheDocument(); });


    });



});

