'use client';

import { Idea, IdeaIntegration } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface IntegrationsTableProps {
  ideas: Idea[];
}

interface UniqueIntegration extends IdeaIntegration {
  usedByIdeas: string[]; // IDs de las ideas que usan esta integración
}

export function IntegrationsTable({ ideas }: IntegrationsTableProps) {
  // Consolidar todas las integraciones únicas
  const uniqueIntegrations = new Map<string, UniqueIntegration>();

  ideas.forEach((idea) => {
    if (idea.integracionesNecesarias && idea.integracionesNecesarias.length > 0) {
      idea.integracionesNecesarias.forEach((integracion) => {
        const key = integracion.nombre.toLowerCase();

        if (uniqueIntegrations.has(key)) {
          // Ya existe, solo agregar el ID de la idea
          const existing = uniqueIntegrations.get(key)!;
          if (!existing.usedByIdeas.includes(idea.id)) {
            existing.usedByIdeas.push(idea.id);
          }
        } else {
          // Nueva integración
          uniqueIntegrations.set(key, {
            ...integracion,
            usedByIdeas: [idea.id],
          });
        }
      });
    }
  });

  // Convertir a array y ordenar por cantidad de usos (más usadas primero)
  const integrationsList = Array.from(uniqueIntegrations.values()).sort(
    (a, b) => b.usedByIdeas.length - a.usedByIdeas.length
  );

  if (integrationsList.length === 0) {
    return (
      <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
        <div className="text-center py-20">
          <p className="text-lg font-bold mb-2">No hay integraciones definidas</p>
          <p className="text-sm text-gray-600">Las integraciones aparecerán cuando analices ideas con IA</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* Stats Header */}
      <div className="bg-[hsl(280,100%,50%)] border-b-4 border-black p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white uppercase">Integraciones Consolidadas</h3>
            <p className="text-sm text-white/80 font-bold">
              {integrationsList.length} {integrationsList.length === 1 ? 'integración única' : 'integraciones únicas'} encontradas en {ideas.length} {ideas.length === 1 ? 'idea' : 'ideas'}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider border-r-2 border-white w-[30%]">
                Integración
              </th>
              <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider w-[70%]">
                Funcionalidad
              </th>
            </tr>
          </thead>
          <tbody>
            {integrationsList.map((integration, index) => (
              <tr
                key={index}
                className="border-t-4 border-black hover:bg-purple-50 transition-colors"
              >
                {/* Integración Column */}
                <td className="px-6 py-5 border-r-2 border-black align-top">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <p className="font-black text-base leading-tight flex-1">
                        {integration.nombre}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`border-2 text-xs ${
                          integration.complejidad === 'alta'
                            ? 'border-red-500 text-red-700 bg-red-50'
                            : integration.complejidad === 'media'
                            ? 'border-orange-500 text-orange-700 bg-orange-50'
                            : 'border-green-500 text-green-700 bg-green-50'
                        }`}
                      >
                        {integration.complejidad}
                      </Badge>

                      <Badge variant="outline" className="border-2 border-purple-500 text-purple-700 bg-purple-50 text-xs">
                        Usada en {integration.usedByIdeas.length} {integration.usedByIdeas.length === 1 ? 'idea' : 'ideas'}
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                      <a
                        href={integration.api}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 w-fit"
                      >
                        <ExternalLink className="h-3 w-3" />
                        API
                      </a>
                      <a
                        href={integration.documentacion}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 w-fit"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Documentación
                      </a>
                    </div>
                  </div>
                </td>

                {/* Funcionalidad Column */}
                <td className="px-6 py-5 align-top">
                  <p className="text-base leading-relaxed">
                    {integration.funcionalidad || (
                      <span className="text-gray-400 italic">
                        Sin descripción de funcionalidad (idea creada antes de esta funcionalidad)
                      </span>
                    )}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
