import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Response1 from './App';

describe('Response1 Tests', () => {
    beforeEach(() => {
        render(<Response1 />);
    });

    it('Test Case 1: should show all records when search input is empty', () => {
        const rows = screen.getAllByRole('row');
        // 2 data rows + 1 header row = 3
        expect(rows).toHaveLength(3);
        expect(screen.getByText('Tony')).toBeInTheDocument();
        expect(screen.getByText('Steve')).toBeInTheDocument();
    });

    it('Test Case 2: should filter for specific row with "Tony"', () => {
        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'Tony' } });

        const rows = screen.getAllByRole('row');
        // 1 data row + 1 header row = 2
        expect(rows).toHaveLength(2);
        expect(screen.getByText('Tony')).toBeInTheDocument();
        expect(screen.queryByText('Steve')).not.toBeInTheDocument();
    });

    it('Test Case 3: should work with case-insensitive search "steve"', () => {
        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'steve' } });

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(2);
        expect(screen.getByText('Steve')).toBeInTheDocument();
        expect(screen.queryByText('Tony')).not.toBeInTheDocument();
    });

    it('Test Case 4: should work with partial matches "Rog"', () => {
        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'Rog' } });

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(2);
        expect(screen.getByText('Rogers')).toBeInTheDocument();
        expect(screen.queryByText('Stark')).not.toBeInTheDocument();
    });

    it('Test Case 5: should match multiple columns with "40"', () => {
        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: '40' } });

        const rows = screen.getAllByRole('row');
        // Should match both Tony (age 40) and Steve (visits 40)
        expect(rows).toHaveLength(3);
        expect(screen.getByText('Tony')).toBeInTheDocument();
        expect(screen.getByText('Steve')).toBeInTheDocument();
    });

    it('Test Case 6: should show no results for non-existent value "XYZ"', () => {
        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'XYZ' } });

        expect(screen.getByText('No results found')).toBeInTheDocument();
        const rows = screen.getAllByRole('row');
        // Only header row should be present
        expect(rows).toHaveLength(1);
    });

    it('Test Case 7: should reset and show all records when clearing search', () => {
        const searchInput = screen.getByTestId('search-input');

        // First filter
        fireEvent.change(searchInput, { target: { value: 'Tony' } });
        expect(screen.queryByText('Steve')).not.toBeInTheDocument();

        // Then clear
        fireEvent.change(searchInput, { target: { value: '' } });

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(3);
        expect(screen.getByText('Tony')).toBeInTheDocument();
        expect(screen.getByText('Steve')).toBeInTheDocument();
    });

    it('Test Case 8: should handle consecutive filter applications', () => {
        const searchInput = screen.getByTestId('search-input');

        // First filter
        fireEvent.change(searchInput, { target: { value: 'Tony' } });
        expect(screen.getAllByRole('row')).toHaveLength(2);
        expect(screen.getByText('Tony')).toBeInTheDocument();

        // Second filter
        fireEvent.change(searchInput, { target: { value: 'Steve' } });
        expect(screen.getAllByRole('row')).toHaveLength(2);
        expect(screen.getByText('Steve')).toBeInTheDocument();
    });

    it('Test Case 9: should handle special characters properly', () => {
        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: '@#$%' } });

        expect(screen.getByText('No results found')).toBeInTheDocument();
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(1);
    });
});