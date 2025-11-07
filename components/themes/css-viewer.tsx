"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CSSViewerProps {
  content: string;
}

export function CSSViewer({ content }: CSSViewerProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <SyntaxHighlighter
        language="css"
        style={vscDarkPlus}
        customStyle={{ margin: 0, maxHeight: '600px' }}
        showLineNumbers
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}
