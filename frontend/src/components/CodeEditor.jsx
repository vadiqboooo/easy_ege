import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeEditor = ({ code, onChange, disabled }) => {
  return (
    <div className="h-80 overflow-hidden flex flex-col">
      <div className="bg-gray-800 text-white px-4 py-2 font-mono text-sm flex justify-between">
        <span>Python</span>
      </div>
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="absolute inset-0 font-mono p-4 resize-none bg-transparent text-transparent caret-white z-10 outline-none"
          style={{ 
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            tabSize: 4
          }}
        />
        <SyntaxHighlighter
          language="python"
          style={vscDarkPlus}
          className="absolute inset-0 overflow-auto"
          customStyle={{
            margin: 0,
            padding: '16px',
            background: '#1e1e1e',
            fontSize: '14px',
            lineHeight: '1.5',
            fontFamily: 'monospace'
          }}
        >
          {code || '# Введите ваш код здесь\n'}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeEditor;