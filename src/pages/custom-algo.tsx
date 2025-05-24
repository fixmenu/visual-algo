import { Inter } from 'next/font/google'
import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; // Example theme
import AlgorithmRunner from '@/components/AlgorithmRunner';

const inter = Inter({ subsets: ['latin'] })

const initialCode =
`// Welcome to the Custom Algorithm Visualizer!

// Your code runs in an environment where 'ObsArray', 'ObsVar',
// and an 'eventManager' instance are globally available.

// How to use:
// 1. Declare observable arrays:
//    const myArray = new ObsArray('uniqueKey1', [1, 2, 3], eventManager);
//    Keys ('uniqueKey1') must be unique across all observables.
// 2. Declare observable variables:
//    const myVar = new ObsVar('uniqueKey2', 'initialValue', eventManager);
// 3. Modify them:
//    myArray.array[0] = 5; // Changes are tracked
//    myVar.value = 'newValue'; // Changes are tracked
//    The visualizer will update based on these changes.

async function simpleArrayReversal(arrObs, statusObs) {
  statusObs.value = 'Starting array reversal...';
  await new Promise(r => setTimeout(r, 50)); // Simulate async work / allow status update to render

  const arr = arrObs.array; // Get the actual array
  let left = 0;
  let right = arr.length - 1;
  statusObs.value = 'Reversing...';

  while (left < right) {
    // Simulate work & allow UI to update by yielding
    // The hook adds its own delay, this is more for complex logic within a step
    await new Promise(r => setTimeout(r, 20)); 
    
    // Swap elements
    const temp = arr[left];
    arr[left] = arr[right]; // This will trigger an event via ObsArray's proxy
    arr[right] = temp;      // This will trigger another event

    // To make the change more visible step-by-step with current EventManager,
    // we explicitly tell ObsArray the array has changed after both assignments for a single "swap" view.
    // Note: Direct arr[index] = value assignment is already tracked.
    // This explicit notification is useful if you batch multiple changes before wanting a state update.
    // However, for this simple swap, each assignment already creates an event.
    // For more complex scenarios, you might group changes and then call:
    // arrObs.notifyChange(); // If you did many non-proxy-triggering changes

    left++;
    right--;
    statusObs.value = \`Swapped elements, left: \${left}, right: \${right}\`;
  }

  statusObs.value = 'Array reversal complete!';
  console.log('Reversal complete:', arrObs.array);
}

// Setup and Run:
// 'eventManager' is injected globally by the runner.
const numbers = new ObsArray('numbersArr', [10, 20, 30, 40, 50], eventManager);
const processStatus = new ObsVar('processStatus', 'Idle', eventManager);

simpleArrayReversal(numbers, processStatus);
`;

export default function CustomAlgoPage() {
  const [code, setCode] = useState(initialCode);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-start p-8 md:p-12 ${inter.className}`} // Adjusted padding
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">Custom Algorithm Visualization</h1>
      
      {/* Flex container for Editor and Runner */}
      <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-6 md:gap-8">
        
        {/* Code Editor Section with Instructions */}
        <div className="lg:w-1/2 w-full flex flex-col">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">Algorithm Code</h2>
          <div className="mb-4 p-3 text-sm bg-blue-50 border border-blue-200 rounded-md text-blue-700">
            <h3 className="font-semibold mb-1">Quick Guide:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Your code has access to <code>ObsArray</code>, <code>ObsVar</code>, and an <code>eventManager</code> instance.</li>
              <li>Declare observable arrays: <code>new ObsArray('key1', [1,2,3], eventManager)</code>.</li>
              <li>Declare observable variables: <code>new ObsVar('key2', 'val', eventManager)</code>.</li>
              <li>Modify data via <code>myArray.array[i] = ...</code> or <code>myVar.value = ...</code>.</li>
              <li>Changes are automatically tracked and visualized.</li>
              <li><strong>Important:</strong> Keys (e.g., 'key1', 'key2') must be unique.</li>
            </ul>
          </div>
          <Editor
            value={code}
            onValueChange={newCode => setCode(newCode)}
            highlight={c => highlight(c, languages.js, 'js')}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              border: '1px solid #ddd',
              borderRadius: '4px',
              minHeight: '400px', 
              backgroundColor: '#f8f9fa', // Slightly off-white background
            }}
            className="rounded shadow-sm flex-grow" // flex-grow to take available space
          />
        </div>

        {/* Algorithm Runner Section */}
        <div className="lg:w-1/2 w-full mt-6 lg:mt-0">
           <h2 className="text-xl md:text-2xl font-semibold mb-3">Controls & Output</h2>
          <AlgorithmRunner userCode={code} />
        </div>
      </div>
    </main>
  )
}
