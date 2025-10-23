import { useState } from 'react';
import { EventCard } from './EventCard';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, Filter, Calendar, MapPin, Activity } from 'lucide-react';
import { Event } from '../types/event';

interface EventListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  isLoading: boolean;
}

export function EventList({ events, onEventClick, isLoading }: EventListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'type'>('date');

  // Get unique categories
  const categories = Array.from(
    new Set(events.flatMap(event => event.categories.map(cat => cat.title)))
  ).sort();

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.categories.some(cat => cat.title.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
                            event.categories.some(cat => cat.title === selectedCategory);
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          const dateA = new Date(a.geometry[0]?.date || 0).getTime();
          const dateB = new Date(b.geometry[0]?.date || 0).getTime();
          return dateB - dateA; // Most recent first
        case 'title':
          return a.title.localeCompare(b.title);
        case 'type':
          const typeA = a.categories[0]?.title || '';
          const typeB = b.categories[0]?.title || '';
          return typeA.localeCompare(typeB);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Carregando eventos em tempo real...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl text-white mb-2">Eventos Recentes</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Monitoramento de desastres naturais das últimas 48 horas
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
              <Activity className="w-3 h-3 mr-1" />
              {events.length} eventos ativos
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar eventos ou categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-44 bg-slate-800/50 border-slate-700/50 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white">Todos os tipos</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category} className="text-white">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: 'date' | 'title' | 'type') => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-40 bg-slate-800/50 border-slate-700/50 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="date" className="text-white">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Data (mais recente)</span>
                  <span className="sm:hidden">Data</span>
                </div>
              </SelectItem>
              <SelectItem value="title" className="text-white">Nome</SelectItem>
              <SelectItem value="type" className="text-white">Tipo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCategory !== 'all') && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-400">Filtros ativos:</span>
            
            {searchTerm && (
              <Badge 
                variant="secondary" 
                className="bg-blue-500/20 text-blue-300 border-blue-500/30"
              >
                Busca: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 hover:text-blue-200"
                >
                  ×
                </button>
              </Badge>
            )}
            
            {selectedCategory !== 'all' && (
              <Badge 
                variant="secondary" 
                className="bg-purple-500/20 text-purple-300 border-purple-500/30"
              >
                Tipo: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-2 hover:text-purple-200"
                >
                  ×
                </button>
              </Badge>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-slate-400 hover:text-white text-xs"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg text-slate-300 mb-2">
              {events.length === 0 ? 'Nenhum evento encontrado' : 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-slate-400">
              {events.length === 0 
                ? 'Não há eventos nas últimas 48 horas.'
                : 'Tente ajustar os filtros de busca.'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-sm text-slate-400">
                Mostrando {filteredEvents.length} de {events.length} eventos
              </p>
              <div className="text-xs text-slate-500">
                Ordenado por: {sortBy === 'date' ? 'Data' : sortBy === 'title' ? 'Nome' : 'Tipo'}
              </div>
            </div>

            <div className="grid gap-4">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}