'use client';

import { Idea } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IdeasTableProps {
  ideas: Idea[];
  onView?: (idea: Idea) => void;
  onDelete?: (ideaId: string) => void;
}

export function IdeasTable({ ideas, onView, onDelete }: IdeasTableProps) {
  return (
    <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider border-r-2 border-white w-[120px]">
                ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider border-r-2 border-white w-[30%]">
                Problema
              </th>
              <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider border-r-2 border-white w-[30%]">
                Solución
              </th>
              <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider w-[25%]">
                Integraciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {ideas.map((idea, index) => {
              return (
                <tr
                  key={idea.id}
                  className={cn(
                    'border-t-4 border-black hover:bg-yellow-50 transition-colors cursor-pointer',
                    idea.favorita && 'bg-yellow-50'
                  )}
                  onClick={() => onView?.(idea)}
                >
                  {/* ID */}
                  <td className="px-6 py-5 border-r-2 border-black align-top">
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className="border-2 border-black font-mono font-bold text-xs w-fit">
                        {idea.id}
                      </Badge>
                      {idea.favorita && (
                        <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      )}
                      {idea.nombre && (
                        <p className="font-black text-xs mt-2 line-clamp-3">
                          {idea.nombre}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Problema */}
                  <td className="px-6 py-5 border-r-2 border-black align-top">
                    <p className="text-base leading-relaxed line-clamp-4">{idea.problema}</p>
                  </td>

                  {/* Solución */}
                  <td className="px-6 py-5 border-r-2 border-black align-top">
                    <p className="text-base leading-relaxed line-clamp-4">{idea.solucion}</p>
                  </td>

                  {/* Integraciones */}
                  <td className="px-6 py-5 align-top">
                    <p className="text-base leading-relaxed line-clamp-4">
                      {idea.integracionesNecesarias && idea.integracionesNecesarias.length > 0
                        ? idea.integracionesNecesarias.map(i => i.nombre).join(', ')
                        : '-'}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {ideas.length === 0 && (
        <div className="text-center py-12 bg-white">
          <p className="text-lg font-medium mb-2">No hay ideas aún</p>
          <p className="text-sm text-muted-foreground">Agrega la primera con el botón de arriba</p>
        </div>
      )}
    </div>
  );
}
