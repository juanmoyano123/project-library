'use client';

import { useState } from 'react';
import { IdeaForm } from '@/components/ideas/idea-form';
import { Idea } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TestIdeasPage() {
  const [savedIdea, setSavedIdea] = useState<Idea | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleSave = async (idea: Idea) => {
    console.log('💾 Guardando idea:', idea);

    // Call API to save
    const response = await fetch('/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(idea),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al guardar');
    }

    const savedData = await response.json();
    setSavedIdea(savedData);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFCF0] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="border-2 border-black">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-black">
              🧪 Test: IdeaForm Component
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Esta es una página de prueba para el componente IdeaForm.
              Completa el formulario y verifica que todos los campos funcionen correctamente.
            </p>
          </CardContent>
        </Card>

        {showForm ? (
          <IdeaForm
            onSave={handleSave}
            autoSave={false} // Disable auto-save for testing
          />
        ) : (
          <Card className="border-4 border-green-500 bg-green-50 shadow-[8px_8px_0px_0px_rgba(34,197,94,1)]">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-green-700">
                ✅ Idea Guardada Exitosamente!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded border-2 border-green-500">
                <pre className="text-sm overflow-auto max-h-96">
                  {JSON.stringify(savedIdea, null, 2)}
                </pre>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setSavedIdea(null);
                  }}
                  className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Crear Otra Idea
                </Button>
                <Link href={`/api/ideas/${savedIdea?.id}`}>
                  <Button
                    variant="outline"
                    className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Ver en API
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
