'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Idea } from '@/lib/types';
import { IdeaCard } from './idea-card';
import { Lightbulb, Search, Filter, Star, Loader2 } from 'lucide-react';

interface IdeasDashboardProps {
  onNewIdea?: () => void;
  onViewIdea?: (idea: Idea) => void;
}

export function IdeasDashboard({ onNewIdea, onViewIdea }: IdeasDashboardProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgencia, setFilterUrgencia] = useState<string>('all');
  const [filterComplejidad, setFilterComplejidad] = useState<string>('all');
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ideas');
      if (response.ok) {
        const data = await response.json();
        setIdeas(data);
      }
    } catch (error) {
      console.error('Error loading ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ideaId: string) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIdeas(ideas.filter(i => i.id !== ideaId));
      }
    } catch (error) {
      console.error('Error deleting idea:', error);
      alert('Error al eliminar la idea');
    }
  };

  // Apply filters
  let filteredIdeas = ideas.filter(idea => {
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        idea.problema.toLowerCase().includes(query) ||
        idea.solucion.toLowerCase().includes(query) ||
        idea.mercadoObjetivo.toLowerCase().includes(query) ||
        idea.id.toLowerCase().includes(query) ||
        idea.tags?.some(tag => tag.toLowerCase().includes(query));

      if (!matchesSearch) return false;
    }

    // Urgencia filter
    if (filterUrgencia !== 'all' && idea.urgencia !== filterUrgencia) {
      return false;
    }

    // Complejidad filter
    if (filterComplejidad !== 'all' && idea.complejidadTecnica !== Number(filterComplejidad)) {
      return false;
    }

    // Categoría filter
    if (filterCategoria !== 'all' && idea.categoria !== filterCategoria) {
      return false;
    }

    // Favorites filter
    if (showFavoritesOnly && !idea.favorita) {
      return false;
    }

    return true;
  });

  // Apply sorting
  filteredIdeas = [...filteredIdeas].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'urgencia':
        const urgenciaOrder = { crítica: 4, alta: 3, media: 2, baja: 1 };
        return urgenciaOrder[b.urgencia] - urgenciaOrder[a.urgencia];
      case 'complejidad-asc':
        return a.complejidadTecnica - b.complejidadTecnica;
      case 'complejidad-desc':
        return b.complejidadTecnica - a.complejidadTecnica;
      default:
        return 0;
    }
  });

  // Get unique categories
  const uniqueCategories = Array.from(new Set(ideas.map(i => i.categoria).filter(Boolean)));

  if (loading) {
    return (
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardContent className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black flex items-center gap-2">
                <Lightbulb className="h-6 w-6" />
                Mis Ideas
              </CardTitle>
              <CardDescription>
                {filteredIdeas.length} {filteredIdeas.length === 1 ? 'idea' : 'ideas'}
                {ideas.length !== filteredIdeas.length && ` (de ${ideas.length} total)`}
              </CardDescription>
            </div>
            {onNewIdea && (
              <Button
                onClick={onNewIdea}
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-bold"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Nueva Idea
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Filters & Search */}
      <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar ideas (problema, solución, mercado, tags...)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-black"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {/* Urgencia */}
              <Select value={filterUrgencia} onValueChange={setFilterUrgencia}>
                <SelectTrigger className="border-2 border-black">
                  <SelectValue placeholder="Urgencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="crítica">Crítica</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>

              {/* Complejidad */}
              <Select value={filterComplejidad} onValueChange={setFilterComplejidad}>
                <SelectTrigger className="border-2 border-black">
                  <SelectValue placeholder="Complejidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="1">1 - Muy Baja</SelectItem>
                  <SelectItem value="2">2 - Baja</SelectItem>
                  <SelectItem value="3">3 - Media</SelectItem>
                  <SelectItem value="4">4 - Alta</SelectItem>
                  <SelectItem value="5">5 - Muy Alta</SelectItem>
                </SelectContent>
              </Select>

              {/* Categoría */}
              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger className="border-2 border-black">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {uniqueCategories.map(cat => (
                    <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-2 border-black">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Más Recientes</SelectItem>
                  <SelectItem value="oldest">Más Antiguas</SelectItem>
                  <SelectItem value="urgencia">Mayor Urgencia</SelectItem>
                  <SelectItem value="complejidad-asc">Complejidad (Baja → Alta)</SelectItem>
                  <SelectItem value="complejidad-desc">Complejidad (Alta → Baja)</SelectItem>
                </SelectContent>
              </Select>

              {/* Favorites Toggle */}
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <Star className={`h-4 w-4 mr-2 ${showFavoritesOnly ? 'fill-white' : ''}`} />
                Favoritas
              </Button>
            </div>

            {/* Active Filters Indicators */}
            {(searchQuery || filterUrgencia !== 'all' || filterComplejidad !== 'all' ||
              filterCategoria !== 'all' || showFavoritesOnly) && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filtros activos:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterUrgencia('all');
                    setFilterComplejidad('all');
                    setFilterCategoria('all');
                    setShowFavoritesOnly(false);
                  }}
                  className="text-xs underline"
                >
                  Limpiar todo
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="py-20 text-center">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-bold mb-2">
              {ideas.length === 0 ? 'No tienes ideas todavía' : 'No se encontraron ideas con estos filtros'}
            </p>
            <p className="text-gray-600 mb-4">
              {ideas.length === 0
                ? 'Crea tu primera idea usando el análisis con IA'
                : 'Prueba ajustando los filtros de búsqueda'
              }
            </p>
            {ideas.length === 0 && onNewIdea && (
              <Button
                onClick={onNewIdea}
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-bold"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Nueva Idea
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map(idea => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onView={onViewIdea}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
