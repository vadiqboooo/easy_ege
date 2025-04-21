import React from 'react';

const CodeOutput = ({ output }) => {
  if (!output) {
    return (
      <div className="h-80 bg-gray-100 p-4 font-mono text-gray-500 overflow-auto">
        Здесь будет выведен результат выполнения кода
      </div>
    );
  }

  return (
    <div className="h-80 overflow-auto">
      <div className="bg-gray-800 text-white px-4 py-2 font-mono text-sm">
        <span>Результат выполнения</span>
      </div>
      
      <div className="p-4 font-mono text-sm bg-gray-900 text-white h-full overflow-auto">
        {output.stdout && (
          <div className="mb-4">
            <div className="text-gray-400 mb-1">stdout:</div>
            <pre className="whitespace-pre-wrap">{output.stdout}</pre>
          </div>
        )}
        
        {output.stderr && (
          <div className="text-red-400">
            <div className="text-gray-400 mb-1">stderr:</div>
            <pre className="whitespace-pre-wrap">{output.stderr}</pre>
          </div>
        )}
        
        {output.result !== undefined && (
          <div>
            <div className="text-gray-400 mb-1">result:</div>
            <pre className="whitespace-pre-wrap">{String(output.result)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeOutput;