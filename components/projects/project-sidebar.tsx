'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, LayoutDashboard, Calendar, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewType = 'prompts' | 'planner';

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
      id: 'planner' as ViewType,
      label: 'Planificador',
      icon: LayoutDashboard,
      gradient: 'from-accent to-primary',
    },
  ];

  return (
    <Card className="h-full border-2 border-light-blue shadow-elevated bg-white dark:bg-federal-blue sticky top-6">
      <div className="p-6 space-y-6">
        {/* Project Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-marian-blue dark:text-mint-green">
            <Layers className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Proyecto</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight line-clamp-2 text-dark-purple dark:text-white">{projectName}</h2>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-federal-blue dark:text-light-blue mb-3">
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
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative font-semibold',
                  isActive
                    ? 'bg-marian-blue text-white dark:bg-light-blue dark:text-dark-purple shadow-lg border-l-4 border-federal-blue dark:border-mint-green'
                    : 'hover:bg-light-blue/30 dark:hover:bg-marian-blue/40 border-l-4 border-transparent text-federal-blue dark:text-light-blue'
                )}
              >
                <div
                  className={cn(
                    'h-9 w-9 rounded-lg flex items-center justify-center transition-all',
                    isActive
                      ? 'bg-white/20 dark:bg-dark-purple/30'
                      : 'bg-marian-blue/10 dark:bg-light-blue/10 group-hover:bg-marian-blue/20 dark:group-hover:bg-light-blue/20'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-all',
                      isActive ? 'text-white dark:text-dark-purple' : 'text-marian-blue dark:text-light-blue'
                    )}
                  />
                </div>

                <div className="flex-1 text-left">
                  <p className="text-sm">
                    {item.label}
                  </p>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <Badge
                    className={cn(
                      'ml-auto text-xs font-bold',
                      isActive
                        ? 'bg-white/20 text-white dark:bg-dark-purple/40 dark:text-white border-white/40 dark:border-mint-green/40'
                        : 'bg-marian-blue/20 dark:bg-light-blue/20 text-federal-blue dark:text-mint-green border-marian-blue/50 dark:border-light-blue/50'
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
        <div className="pt-4 border-t-2 border-light-blue/40 dark:border-light-blue/30">
          <p className="text-xs text-federal-blue/70 dark:text-light-blue/60 text-center font-semibold">
            Más componentes próximamente
          </p>
        </div>
      </div>
    </Card>
  );
}
