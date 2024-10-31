import { useState } from 'react';
import Response1 from './components/Response1/App';
import Response2 from './components/Response2/App';

function App() {
    const [implementation, setImplementation] = useState<'response1' | 'response2'>('response1')

    const data = [
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
    ]

    const columns = [
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
    ]

    return (
        <div className="p-4">
            <div className="mb-4 space-x-4">
                <button
                    className={`px-4 py-2 rounded ${
                        implementation === 'response1'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200'
                    }`}
                    onClick={() => setImplementation('response1')}
                >
                    Implementation 1
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        implementation === 'response2'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200'
                    }`}
                    onClick={() => setImplementation('response2')}
                >
                    Implementation 2
                </button>
            </div>

            {implementation === 'response1' ? (
                <Response1 />
            ) : (
                <Response2 data={data} columns={columns} />
            )}
        </div>
    )
}

export default App