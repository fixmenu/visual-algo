import React from 'react';
import { useAlgorithmRunner, UseAlgorithmRunnerResult } from './hooks/useAlgorithmRunner';

interface AlgorithmRunnerProps {
  userCode: string;
}

const AlgorithmRunner: React.FC<AlgorithmRunnerProps> = ({ userCode }) => {
  const {
    observablesState,
    executionStatus,
    errorMessage,
    run,
    pause,
    resume,
    reset,
  }: UseAlgorithmRunnerResult = useAlgorithmRunner();

  const handleRun = () => {
    if (userCode) {
      run(userCode);
    } else {
      // Optionally, display a message to the user that code is empty
      console.warn('User code is empty. Cannot run.');
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-semibold mb-4">Algorithm Controls & Output</h2>

      {/* Controls */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={handleRun}
          disabled={executionStatus === 'running' || executionStatus === 'paused'}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          Run
        </button>
        <button
          onClick={pause}
          disabled={executionStatus !== 'running'}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400"
        >
          Pause
        </button>
        <button
          onClick={resume}
          disabled={executionStatus !== 'paused'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Resume
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>

      {/* Status and Error Messages */}
      <div className="mb-4">
        <p className="text-lg">
          Status: <span className={`font-semibold ${
            executionStatus === 'running' ? 'text-yellow-600' :
            executionStatus === 'completed' ? 'text-green-600' :
            executionStatus === 'error' ? 'text-red-600' :
            executionStatus === 'paused' ? 'text-blue-600' :
            'text-gray-700'
          }`}>{executionStatus}</span>
        </p>
        {errorMessage && (
          <div className="mt-2 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            <p className="font-semibold">Error:</p>
            <pre className="whitespace-pre-wrap">{errorMessage}</pre>
          </div>
        )}
      </div>

      {/* Observables State Display */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Observed Variables:</h3>
        {Object.keys(observablesState).length === 0 && executionStatus !== 'running' && (
          <p className="text-gray-500">No variables to display. Run an algorithm to see output.</p>
        )}
        {Object.keys(observablesState).length > 0 && (
          <div className="p-3 bg-gray-50 border rounded max-h-96 overflow-y-auto">
            {Object.entries(observablesState).map(([key, value]) => (
              <div key={key} className="mb-2 p-2 border-b last:border-b-0">
                <span className="font-mono font-semibold">{key}: </span>
                <pre className="inline-block whitespace-pre-wrap bg-white p-1 rounded text-sm">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmRunner;
