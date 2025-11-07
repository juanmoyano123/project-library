"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Code2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface HTMLViewerProps {
  content: string;
  filePath: string;
  themeId: string;
}

export function HTMLViewer({ content, filePath, themeId }: HTMLViewerProps) {
  const [showCode, setShowCode] = useState(false);

  // Usar preview endpoint para HTML procesado con assets
  const previewUrl = `/api/themes/${themeId}/preview/${filePath}`;
  const rawUrl = `/api/themes/${themeId}/files/${filePath}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant={!showCode ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowCode(false)}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button
          variant={showCode ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowCode(true)}
        >
          <Code2 className="h-4 w-4 mr-2" />
          Source Code
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <a href={rawUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Raw HTML
          </a>
        </Button>
      </div>

      {showCode ? (
        <div className="border rounded-lg overflow-hidden">
          <SyntaxHighlighter
            language="html"
            style={vscDarkPlus}
            customStyle={{ margin: 0, maxHeight: '600px' }}
          >
            {content}
          </SyntaxHighlighter>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white">
          <iframe
            src={previewUrl}
            className="w-full h-[600px]"
            sandbox="allow-same-origin allow-scripts"
            title={filePath}
          />
        </div>
      )}
    </div>
  );
}
