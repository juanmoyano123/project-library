"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, FileCode2, FileText, Braces, FileType } from 'lucide-react';
import { MarkdownViewer } from '@/components/themes/markdown-viewer';
import { HTMLViewer } from '@/components/themes/html-viewer';
import { CSSViewer } from '@/components/themes/css-viewer';
import { JSViewer } from '@/components/themes/js-viewer';

interface Theme {
  id: string;
  name: string;
  description: string;
  preview_path: string;
  created_at: string;
}

interface ThemeFile {
  id: number;
  file_path: string;
  file_type: string;
  size: number;
  created_at: string;
}

export default function ThemeDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [theme, setTheme] = useState<Theme | null>(null);
  const [files, setFiles] = useState<ThemeFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ThemeFile | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    async function fetchTheme() {
      try {
        const response = await fetch(`/api/themes/${id}`);
        const data = await response.json();
        if (data.success) {
          setTheme(data.data.theme);
          setFiles(data.data.files);

          // Seleccionar el primer archivo por defecto
          if (data.data.files.length > 0) {
            const firstFile = data.data.files[0];
            setSelectedFile(firstFile);
            await loadFileContent(firstFile.file_path);
          }
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTheme();
  }, [id]);

  async function loadFileContent(filePath: string) {
    setLoadingContent(true);
    try {
      const response = await fetch(`/api/themes/${id}/files/${filePath}`);
      const content = await response.text();
      setFileContent(content);
    } catch (error) {
      console.error('Error loading file:', error);
      setFileContent('Error loading file content');
    } finally {
      setLoadingContent(false);
    }
  }

  async function handleFileClick(file: ThemeFile) {
    setSelectedFile(file);
    await loadFileContent(file.file_path);
  }

  function getFileIcon(fileType: string) {
    switch (fileType) {
      case 'md':
        return <FileText className="h-4 w-4" />;
      case 'html':
        return <FileCode2 className="h-4 w-4" />;
      case 'css':
        return <Braces className="h-4 w-4" />;
      case 'js':
        return <FileType className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  }

  function renderFileContent() {
    if (loadingContent) {
      return <div className="p-8 text-center">Loading file content...</div>;
    }

    if (!selectedFile) {
      return <div className="p-8 text-center text-muted-foreground">Select a file to view</div>;
    }

    switch (selectedFile.file_type) {
      case 'md':
        return <MarkdownViewer content={fileContent} />;
      case 'html':
        return <HTMLViewer content={fileContent} filePath={selectedFile.file_path} themeId={id} />;
      case 'css':
        return <CSSViewer content={fileContent} />;
      case 'js':
        return <JSViewer content={fileContent} />;
      default:
        return <pre className="p-4 bg-muted rounded-lg overflow-auto">{fileContent}</pre>;
    }
  }

  // Organizar archivos por carpeta
  function organizeFilesByFolder(files: ThemeFile[]) {
    const organized: Record<string, ThemeFile[]> = {
      root: [],
    };

    files.forEach((file) => {
      const parts = file.file_path.split('/');
      if (parts.length === 1) {
        organized.root.push(file);
      } else {
        const folder = parts[0];
        if (!organized[folder]) {
          organized[folder] = [];
        }
        organized[folder].push(file);
      }
    });

    return organized;
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading theme...</p>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="container mx-auto py-8">
        <p>Theme not found</p>
      </div>
    );
  }

  const organizedFiles = organizeFilesByFolder(files);

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/themes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{theme.name}</h1>
          <p className="text-muted-foreground mt-1">{theme.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - File Tree */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Files</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="p-4 space-y-4">
                {Object.entries(organizedFiles).map(([folder, folderFiles]) => (
                  <div key={folder}>
                    {folder !== 'root' && (
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        {folder}
                      </h3>
                    )}
                    <div className="space-y-1">
                      {folderFiles.map((file) => (
                        <button
                          key={file.id}
                          onClick={() => handleFileClick(file)}
                          className={`w-full text-left p-2 rounded-md text-sm flex items-center gap-2 hover:bg-accent transition-colors ${
                            selectedFile?.id === file.id ? 'bg-accent' : ''
                          }`}
                        >
                          {getFileIcon(file.file_type)}
                          <span className="truncate text-xs">
                            {file.file_path.split('/').pop()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Content - File Viewer */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-mono">
                {selectedFile?.file_path || 'No file selected'}
              </CardTitle>
              {selectedFile && (
                <span className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)]">
              {renderFileContent()}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
