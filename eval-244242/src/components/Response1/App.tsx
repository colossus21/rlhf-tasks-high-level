import { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table';

interface Data {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
}

function Response1() {
    const data: Data[] = [
        {
            firstName: 'Tony',
            lastName: 'Stark',
            age: 40,
            visits: 1,
            status: 'In Relationship',
            progress: 50,
        },
        {
            firstName: 'Steve',
            lastName: 'Rogers',
            age: 100,
            visits: 40,
            status: 'Single',
            progress: 80,
        },
    ];

    const [globalFilter, setGlobalFilter] = useState('');

    const columns: ColumnDef<Data>[] = [
        {
            header: 'First Name',
            accessorKey: 'firstName',
        },
        {
            header: 'Last Name',
            accessorKey: 'lastName',
        },
        {
            header: 'Age',
            accessorKey: 'age',
        },
        {
            header: 'Visits',
            accessorKey: 'visits',
        },
        {
            header: 'Status',
            accessorKey: 'status',
        },
        {
            header: 'Progress',
            accessorKey: 'progress',
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Implementation 1 (Global Filter Only)</h2>
            <div className="mb-4">
                <input
                    data-testid="search-input"
                    type="text"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search all columns..."
                    className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border">
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="border p-2 bg-gray-100 text-left">
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="border p-2">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {table.getRowModel().rows.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                    No results found
                </div>
            )}
        </div>
    );
}

export default Response1;