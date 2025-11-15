import { useState } from 'react';
import { EventCard } from '../molecules/EventCard';
import { SearchInput } from '../atoms/searchInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../atoms/select';
import { Button } from '../atoms/button';
import { Badge } from '../atoms/badge';
import { Search, Filter, Calendar, MapPin, Activity } from 'lucide-react';
import { Event } from '../../types/event';
import { tCategory } from '../../utils/categoryTranslator';

interface EventListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  isLoading: boolean;
}

export function EventList({ events, onEventClick, isLoading }: EventListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'type'>('date');

  // Get unique categories (translated)
  const categories = Array.from(
    new Set(events.flatMap(event =>
      event.categories.map(cat => tCategory(cat.title))
    ))
  ).sort();

  // 🔥 FUNCTION: translate title exactly like EventCard
  const translateTitle = (title: string) => {
    return title
      .replace(/\bTropical Storm(s)?\b/gi, 'Tempestade Tropical')
      .replace(/\bTropical Cyclone(s)?\b/gi, 'Ciclone Tropical')
      .replace(/\bSevere Storm(s)?\b/gi, 'Tempestade Severa')
      .replace(/\bSea and Lake Ice\b/gi, 'Gelo Marinho e Lacustre')
      .replace(/\bDust and Haze\b/gi, 'Névoa e Poeira')
      .replace(/\bTemperature Extremes?\b/gi, 'Temperatura Extrema')
      .replace(/\bWildfire(s)?\b/gi, 'Incêndio Florestal')
      .replace(/\bPrescribed Fire(s)?\b/gi, 'Queima Controlada')
      .replace(/\bFire(s)?\b/gi, 'Incêndio')
      .replace(/\bFlood(s)?\b/gi, 'Inundação')
      .replace(/\bEarthquake(s)?\b/gi, 'Terremoto')
      .replace(/\bVolcano(es)?\b/gi, 'Vulcão')
      .replace(/\bDrought(s)?\b/gi, 'Seca')
      .replace(/\bSnow(s)?\b/gi, 'Nevasca')
      .replace(/\bLandslide(s)?\b/gi, 'Deslizamento de Terra')
      .replace(/\bManmade\b/gi, 'Causado por Humanos');
  };

  // 🔥 Main filter logic (NOW works in Portuguese)
  const filteredEvents = events
    .filter(event => {
      const translatedTitle = translateTitle(event.title).toLowerCase();
      const translatedCategories = event.categories.map(cat =>
        tCategory(cat.title).toLowerCase()
      );

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        translatedTitle.includes(search) ||
        translatedCategories.some(cat => cat.includes(search));

      const matchesCategory =
        selectedCategory === 'all' ||
        translatedCategories.includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          const dateA = new Date(a.geometry[0]?.date || 0).getTime();
          const dateB = new Date(b.geometry[0]?.date || 0).getTime();
          return dateB - dateA;

        case 'title':
          return translateTitle(a.title).localeCompare(translateTitle(b.title));

        case 'type':
          return tCategory(a.categories[0]?.title || '').localeCompare(
            tCategory(b.categories[0]?.title || '')
          );

        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400">Carregando eventos...</p>
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

          <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
            <Activity className="w-3 h-3 mr-1" />
            {events.length} eventos ativos
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Pesquisar eventos..."
            className="bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400"
            storageKey="earth-sync-events-search"
            maxHistory={10}
          />

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

          <Select
            value={sortBy}
            onValueChange={(value: 'date' | 'title' | 'type') => setSortBy(value)}
          >
            <SelectTrigger className="w-full sm:w-40 bg-slate-800/50 border-slate-700/50 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="date" className="text-white">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data (mais recente)
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
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Busca: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="ml-2">×</button>
              </Badge>
            )}

            {selectedCategory !== 'all' && (
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Tipo: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="ml-2">×</button>
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
            <h3 className="text-lg text-slate-300 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-slate-400">Tente ajustar os filtros de busca.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-400">
              Mostrando {filteredEvents.length} de {events.length} eventos
            </p>

            <div className="grid gap-4">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} onClick={() => onEventClick(event)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
