'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Layers, Wrench, Sparkles, ClipboardList, Kanban } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewType = 'prompts' | 'tools' | 'validator' | 'prd' | 'features';

interface ProjectSidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  promptCount?: number;
  projectName: string;
}

export function ProjectSidebar({ activeView, onViewChange, promptCount = 0, projectName }: ProjectSidebarProps) {
  const menuItems = [
    {
      id: 'prompts' as ViewType,
      label: 'Historial de Prompts',
      icon: FileText,
      count: promptCount,
      gradient: 'from-primary to-secondary',
    },
    {
      id: 'validator' as ViewType,
      label: 'Validador de Ideas',
      icon: Sparkles,
      gradient: 'from-accent to-secondary',
    },
    {
      id: 'prd' as ViewType,
      label: 'Product Manager',
      icon: ClipboardList,
      gradient: 'from-secondary to-primary',
    },
    {
      id: 'features' as ViewType,
      label: 'Features Dashboard',
      icon: Kanban,
      gradient: 'from-primary to-secondary',
    },
    {
      id: 'tools' as ViewType,
      label: 'Herramientas',
      icon: Wrench,
      gradient: 'from-primary to-accent',
    },
  ];

  return (
    <Card className="h-full neo-card bg-white sticky top-6">
      <div className="p-6 space-y-6">
        {/* Project Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-black">
            <Layers className="h-4 w-4" />
            <span className="text-xs font-black uppercase tracking-widest">Proyecto</span>
          </div>
          <h2 className="text-lg font-black tracking-tight line-clamp-2 text-black uppercase">{projectName}</h2>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-3">
          <p className="text-xs font-black uppercase tracking-widest text-black mb-3">
            Navegación
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 group relative font-bold uppercase tracking-wide text-sm',
                  isActive
                    ? 'bg-[hsl(0,100%,60%)] text-white neo-border-sm neo-shadow-sm'
                    : 'hover:bg-gray-100 neo-border-sm text-black bg-white'
                )}
              >
                <div
                  className={cn(
                    'h-9 w-9 flex items-center justify-center transition-all bg-black',
                    isActive ? '' : 'bg-white neo-border-sm'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-all',
                      isActive ? 'text-white' : 'text-black'
                    )}
                  />
                </div>

                <div className="flex-1 text-left">
                  <p className="text-xs">
                    {item.label}
                  </p>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <Badge
                    className={cn(
                      'ml-auto text-xs font-black',
                      isActive
                        ? 'bg-white text-[hsl(0,100%,60%)] neo-border-sm'
                        : 'bg-[hsl(60,100%,50%)] text-black neo-border-sm'
                    )}
                  >
                    {item.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Future components placeholder */}
        <div className="pt-4 border-t-2 border-black">
          <p className="text-xs text-black text-center font-bold uppercase tracking-wide">
            Más componentes próximamente
          </p>
        </div>
      </div>
    </Card>
  );
}
