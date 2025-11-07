'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCode2, Calendar, Files, ArrowRight, Sparkles } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  description: string;
  preview_path: string;
  created_at: string;
  file_count: number;
}

export function ThemesSection() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThemes() {
      try {
        const response = await fetch('/api/themes');
        const data = await response.json();
        if (data.success) {
          setThemes(data.data);
        }
      } catch (error) {
        console.error('Error fetching themes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchThemes();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16">
        <Sparkles className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
        <p className="text-lg text-muted-foreground font-bold">Cargando themes...</p>
      </div>
    );
  }

  if (themes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white neo-card p-12 text-center">
          <FileCode2 className="h-20 w-20 mx-auto mb-6 text-[hsl(280,100%,50%)]" />
          <h3 className="text-2xl font-black uppercase mb-4 text-black">No hay themes todavía</h3>
          <p className="text-lg text-black mb-8 font-bold">
            Los themes son guías de estilo generadas por el comando <code className="bg-[hsl(60,100%,50%)] px-2 py-1 neo-border-sm font-mono">/design-system</code>
          </p>
          <div className="bg-[hsl(280,100%,95%)] p-6 neo-border-sm space-y-3 text-left">
            <p className="font-bold text-black">💡 Para crear tu primer theme:</p>
            <ol className="list-decimal list-inside space-y-2 text-black font-medium">
              <li>Ejecuta el comando <code className="bg-white px-2 py-1 neo-border-sm font-mono">/design-system</code></li>
              <li>Se generará una guía de estilo completa</li>
              <li>Guarda la carpeta resultante en el proyecto</li>
              <li>Los archivos se almacenarán aquí para usarlos en tus proyectos</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header con stats */}
      <div className="max-w-4xl mx-auto bg-white neo-card p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase text-black mb-2">Design Themes</h2>
            <p className="text-black font-bold">
              Guías de estilo y sistemas de diseño para tus proyectos
            </p>
          </div>
          <div className="bg-[hsl(280,100%,50%)] text-white px-6 py-4 neo-border-sm neo-shadow-sm">
            <div className="text-3xl font-black">{themes.length}</div>
            <div className="text-xs font-bold uppercase tracking-wider">
              {themes.length === 1 ? 'Theme' : 'Themes'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de themes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {themes.map((theme) => (
          <div key={theme.id} className="bg-white neo-card hover:neo-shadow-lg transition-all group">
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="p-3 bg-[hsl(280,100%,50%)] neo-border-sm group-hover:rotate-6 transition-transform">
                  <FileCode2 className="h-8 w-8 text-white" />
                </div>
                <span className="text-xs font-black text-black bg-[hsl(280,100%,95%)] px-3 py-1 neo-border-sm uppercase">
                  {theme.id}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-xl font-black text-black uppercase leading-tight line-clamp-2">
                  {theme.name}
                </h3>
                <p className="text-sm text-black font-medium line-clamp-3">
                  {theme.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs font-bold text-black pt-2 border-t-2 border-black">
                <div className="flex items-center gap-1">
                  <Files className="h-4 w-4" />
                  <span>{theme.file_count} archivos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(theme.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* CTA */}
              <Link href={`/themes/${theme.id}`}>
                <Button className="w-full bg-[hsl(280,100%,50%)] hover:bg-[hsl(280,100%,45%)] text-white neo-btn font-black uppercase tracking-wide">
                  Ver Theme
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
