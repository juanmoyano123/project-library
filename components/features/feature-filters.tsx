'use client';

import { useState } from 'react';
import { Feature } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface FeatureFilters {
  priority?: Feature['priority'];
  status?: Feature['status'];
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

interface FeatureFiltersProps {
  onFiltersChange: (filters: FeatureFilters) => void;
  features: Feature[];
}

export function FeatureFiltersPanel({ onFiltersChange, features }: FeatureFiltersProps) {
  const [filters, setFilters] = useState<FeatureFilters>({});
  const [isOpen, setIsOpen] = useState(false);

  // Extract unique assigned users from features
  const uniqueAssignees = Array.from(
    new Set(features.map((f) => f.assignedTo).filter(Boolean))
  ).sort();

  const updateFilter = (key: keyof FeatureFilters, value: string | undefined) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };

    // Remove undefined values
    Object.keys(newFilters).forEach((k) => {
      if (newFilters[k as keyof FeatureFilters] === undefined) {
        delete newFilters[k as keyof FeatureFilters];
      }
    });

    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(filters).filter(
    (k) => filters[k as keyof FeatureFilters] !== undefined
  ).length;

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="neo-border font-black uppercase text-sm"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge className="ml-2 bg-[hsl(0,100%,60%)] text-white neo-border-sm">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button
            onClick={clearFilters}
            variant="outline"
            size="sm"
            className="neo-border font-bold text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {isOpen && (
        <Card className="neo-card bg-white p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-black">
                Prioridad
              </label>
              <Select
                value={filters.priority || ''}
                onValueChange={(value) => updateFilter('priority', value || undefined)}
              >
                <SelectTrigger className="neo-border font-bold">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent className="neo-border bg-white">
                  <SelectItem value="all" className="font-bold">Todas</SelectItem>
                  <SelectItem value="critical" className="font-bold">Crítico</SelectItem>
                  <SelectItem value="high" className="font-bold">Alto</SelectItem>
                  <SelectItem value="medium" className="font-bold">Medio</SelectItem>
                  <SelectItem value="low" className="font-bold">Bajo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-black">
                Estado
              </label>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => updateFilter('status', value || undefined)}
              >
                <SelectTrigger className="neo-border font-bold">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="neo-border bg-white">
                  <SelectItem value="all" className="font-bold">Todos</SelectItem>
                  <SelectItem value="todo" className="font-bold">To Do</SelectItem>
                  <SelectItem value="in_progress" className="font-bold">In Progress</SelectItem>
                  <SelectItem value="testing" className="font-bold">Testing</SelectItem>
                  <SelectItem value="done" className="font-bold">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assigned To Filter */}
            {uniqueAssignees.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-black">
                  Asignado a
                </label>
                <Select
                  value={filters.assignedTo || ''}
                  onValueChange={(value) => updateFilter('assignedTo', value || undefined)}
                >
                  <SelectTrigger className="neo-border font-bold">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="neo-border bg-white">
                    <SelectItem value="all" className="font-bold">Todos</SelectItem>
                    {uniqueAssignees.map((assignee) => (
                      <SelectItem key={assignee} value={assignee!} className="font-bold">
                        {assignee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date From */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-black flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Desde
              </label>
              <Input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => updateFilter('dateFrom', e.target.value)}
                className="neo-border font-bold"
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-black flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Hasta
              </label>
              <Input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => updateFilter('dateTo', e.target.value)}
                className="neo-border font-bold"
              />
            </div>

            {/* Search Term */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-black">
                Buscar
              </label>
              <Input
                type="text"
                value={filters.searchTerm || ''}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                placeholder="Nombre o descripción..."
                className="neo-border font-bold"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.priority && (
            <Badge className="neo-border-sm bg-white text-black font-bold">
              Prioridad: {filters.priority}
              <button
                onClick={() => updateFilter('priority', undefined)}
                className="ml-2 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge className="neo-border-sm bg-white text-black font-bold">
              Estado: {filters.status}
              <button
                onClick={() => updateFilter('status', undefined)}
                className="ml-2 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.assignedTo && (
            <Badge className="neo-border-sm bg-white text-black font-bold">
              Asignado: {filters.assignedTo}
              <button
                onClick={() => updateFilter('assignedTo', undefined)}
                className="ml-2 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.dateFrom && (
            <Badge className="neo-border-sm bg-white text-black font-bold">
              Desde: {filters.dateFrom}
              <button
                onClick={() => updateFilter('dateFrom', undefined)}
                className="ml-2 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.dateTo && (
            <Badge className="neo-border-sm bg-white text-black font-bold">
              Hasta: {filters.dateTo}
              <button
                onClick={() => updateFilter('dateTo', undefined)}
                className="ml-2 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.searchTerm && (
            <Badge className="neo-border-sm bg-white text-black font-bold">
              Búsqueda: "{filters.searchTerm}"
              <button
                onClick={() => updateFilter('searchTerm', undefined)}
                className="ml-2 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

// Utility function to apply filters to features array
export function applyFeatureFilters(
  features: Feature[],
  filters: FeatureFilters
): Feature[] {
  return features.filter((feature) => {
    // Priority filter
    if (filters.priority && filters.priority !== 'all' && feature.priority !== filters.priority) {
      return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all' && feature.status !== filters.status) {
      return false;
    }

    // Assigned to filter
    if (filters.assignedTo && filters.assignedTo !== 'all' && feature.assignedTo !== filters.assignedTo) {
      return false;
    }

    // Date from filter (using createdAt)
    if (filters.dateFrom) {
      const createdDate = new Date(feature.createdAt);
      const fromDate = new Date(filters.dateFrom);
      if (createdDate < fromDate) {
        return false;
      }
    }

    // Date to filter (using createdAt)
    if (filters.dateTo) {
      const createdDate = new Date(feature.createdAt);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Include the entire day
      if (createdDate > toDate) {
        return false;
      }
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const nameMatch = feature.name.toLowerCase().includes(searchLower);
      const descMatch = feature.description?.toLowerCase().includes(searchLower);
      const idMatch = feature.id.toLowerCase().includes(searchLower);
      if (!nameMatch && !descMatch && !idMatch) {
        return false;
      }
    }

    return true;
  });
}
