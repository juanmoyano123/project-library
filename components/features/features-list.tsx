'use client';

import { useState, useMemo } from 'react';
import { Feature } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturesListProps {
  features: Feature[];
  onFeatureClick: (feature: Feature) => void;
}

const priorityColors = {
  P0: 'bg-[hsl(0,100%,60%)] text-white',
  P1: 'bg-[hsl(30,100%,60%)] text-white',
  P2: 'bg-[hsl(200,100%,40%)] text-white',
};

const statusColors = {
  todo: 'bg-gray-200 text-black',
  in_progress: 'bg-[hsl(200,100%,70%)] text-black',
  testing: 'bg-[hsl(60,100%,70%)] text-black',
  done: 'bg-[hsl(120,60%,70%)] text-black',
};

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  testing: 'Testing',
  done: 'Done',
};

export function FeaturesList({ features, onFeatureClick }: FeaturesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Feature['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Feature['priority'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rice' | 'priority' | 'created'>('rice');

  const filteredAndSortedFeatures = useMemo(() => {
    let result = [...features];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.id.toLowerCase().includes(query) ||
          f.name.toLowerCase().includes(query) ||
          f.description?.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((f) => f.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      result = result.filter((f) => f.priority === priorityFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rice': {
          const aScore = (a.riceScore as any)?.riceScore || 0;
          const bScore = (b.riceScore as any)?.riceScore || 0;
          return bScore - aScore;
        }
        case 'priority': {
          const priorityOrder = { P0: 0, P1: 1, P2: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [features, searchQuery, statusFilter, priorityFilter, sortBy]);

  return (
    <Card className="neo-card bg-white">
      <CardHeader className="p-6 border-b-4 border-black">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-black text-black uppercase tracking-tight">
              Lista de Features
            </CardTitle>
            <Badge className="bg-black text-white font-black text-base neo-border-sm px-3 py-1">
              {filteredAndSortedFeatures.length} / {features.length}
            </Badge>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
              <Input
                placeholder="Buscar por ID, nombre o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 neo-border font-bold"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="neo-border font-bold">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as any)}>
              <SelectTrigger className="neo-border font-bold">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="P0">P0 - Crítico</SelectItem>
                <SelectItem value="P1">P1 - Alto</SelectItem>
                <SelectItem value="P2">P2 - Medio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-black uppercase">Ordenar por:</span>
            <div className="flex gap-2">
              {[
                { id: 'rice', label: 'RICE Score' },
                { id: 'priority', label: 'Prioridad' },
                { id: 'created', label: 'Fecha' },
              ].map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  size="sm"
                  onClick={() => setSortBy(option.id as any)}
                  className={cn(
                    'neo-border font-black text-xs',
                    sortBy === option.id
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-gray-100'
                  )}
                >
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredAndSortedFeatures.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="h-12 w-12 mx-auto text-black opacity-30 mb-4" />
            <p className="text-black font-bold text-lg">No se encontraron features</p>
            <p className="text-black text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="divide-y-4 divide-black">
            {filteredAndSortedFeatures.map((feature) => {
              const riceScore = (feature.riceScore as any)?.riceScore || 0;

              return (
                <div
                  key={feature.id}
                  onClick={() => onFeatureClick(feature)}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors grid grid-cols-12 gap-4 items-center"
                >
                  {/* ID + Name */}
                  <div className="col-span-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-black uppercase">{feature.id}</span>
                      <Badge className={cn('text-xs font-black', priorityColors[feature.priority])}>
                        {feature.priority}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-black text-black uppercase tracking-tight">
                      {feature.name}
                    </h4>
                    {feature.description && (
                      <p className="text-xs text-black mt-1 line-clamp-1">{feature.description}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <Badge className={cn('font-black text-xs neo-border-sm', statusColors[feature.status])}>
                      {statusLabels[feature.status]}
                    </Badge>
                  </div>

                  {/* RICE Score */}
                  <div className="col-span-1 text-center">
                    {riceScore > 0 && (
                      <div className="inline-flex flex-col items-center bg-[hsl(60,100%,50%)] neo-border-sm px-3 py-1">
                        <span className="text-xs font-black text-black uppercase">RICE</span>
                        <span className="text-lg font-black text-black">{riceScore.toFixed(0)}</span>
                      </div>
                    )}
                  </div>

                  {/* Hours */}
                  <div className="col-span-1 text-center">
                    {feature.estimatedHours && (
                      <div className="text-sm font-bold text-black">
                        {feature.estimatedHours}h
                      </div>
                    )}
                  </div>

                  {/* Dependencies */}
                  <div className="col-span-1 text-center">
                    {feature.dependencies && feature.dependencies.length > 0 && (
                      <Badge className="bg-[hsl(30,100%,60%)] text-white font-black text-xs">
                        {feature.dependencies.length} dep
                      </Badge>
                    )}
                  </div>

                  {/* Assigned To */}
                  <div className="col-span-2">
                    {feature.assignedTo && (
                      <div className="text-xs font-bold text-black truncate">
                        👤 {feature.assignedTo}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
