"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface JSViewerProps {
  content: string;
}

export function JSViewer({ content }: JSViewerProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <SyntaxHighlighter
        language="javascript"
        style={vscDarkPlus}
        customStyle={{ margin: 0, maxHeight: '600px' }}
        showLineNumbers
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}
