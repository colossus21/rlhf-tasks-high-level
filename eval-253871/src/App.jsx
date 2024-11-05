import { useState } from 'react';
import Response1 from './components/Response1/App.jsx';
import Response2 from './components/Response2/App.jsx';

function App() {
    const [implementation, setImplementation] = useState('response1');

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
                <Response2 />
            )}
        </div>
    );
}

export default App;
