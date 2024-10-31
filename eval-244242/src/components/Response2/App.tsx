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

interface Props {
    data: Data[];
    columns: ColumnDef<Data>[];
}

function Response2({ data, columns }: Props) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
            columnFilters: Object.entries(columnFilters).map(([id, value]) => ({
                id,
                value,
            })),
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const handleColumnFilter = (columnId: string, value: string) => {
        setColumnFilters(prev => ({
            ...prev,
            [columnId]: value,
        }));
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Implementation 2 (Global + Column Filters)</h2>
            <div className="mb-4 space-y-4">
                <input
                    type="text"
                    value={globalFilter}
                    data-testid="global-search"
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Global search..."
                    className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
                />

                <div className="flex flex-wrap gap-4">
                    {columns.map((column) => (
                        <div key={column.accessorKey as string} className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {column.header as string}
                            </label>
                            <input
                                type="text"
                                data-testid={`column-filter-${column.accessorKey}`}
                                value={columnFilters[column.accessorKey as string] || ''}
                                onChange={(e) => handleColumnFilter(column.accessorKey as string, e.target.value)}
                                placeholder={`Filter ${column.header as string}...`}
                                className="px-3 py-1 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                    ))}
                </div>
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

export default Response2;