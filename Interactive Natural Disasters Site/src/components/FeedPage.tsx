import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, MapPin, Clock, Filter, Search, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '../types/event';
import { ImageWithFallback } from './figma/ImageWithFallback';
// import { format } from 'date-fns';
// import { ptBR } from 'date-fns/locale';

interface FeedPageProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

// Mapeamento de tipos de evento para imagens
const eventTypeImages: Record<string, string> = {
  'Wildfires': 'https://images.unsplash.com/photo-1648464680431-ac400e806714?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwZGlzYXN0ZXIlMjB3aWxkZmlyZSUyMGFlcmlhbHxlbnwxfHx8fDE3NTc2MDI3MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'Severe Storms': 'https://images.unsplash.com/photo-1608933520361-9f397ca051c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodXJyaWNhbmUlMjBzdG9ybSUyMGFlcmlhbCUyMHZpZXd8ZW58MXx8fHwxNzU3NjAyNzI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'Earthquakes': 'https://images.unsplash.com/photo-1707317683665-972a5561c74e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aHF1YWtlJTIwZGFtYWdlJTIwYWVyaWFsfGVufDF8fHx8MTc1NzYwMjcyOHww&ixlib=rb-4.1.0&q=80&w=1080',
  'Floods': 'https://images.unsplash.com/photo-1706737373665-6ff5e08347e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vZCUyMGRpc2FzdGVyJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NTc2MDI3MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'default': 'https://images.unsplash.com/photo-1636565214233-6d1019dfbc36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXNhJTIwZWFydGglMjBvYnNlcnZhdGlvbnxlbnwxfHx8fDE3NTc2MDI3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080'
};

const ITEMS_PER_PAGE = 9;

export function FeedPage({ events, onEventClick }: FeedPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique event types and regions
  const eventTypes = useMemo(() => {
    const types = [...new Set(events.flatMap(event => event.categories.map(cat => cat.title)))];
    return types;
  }, [events]);

  const regions = useMemo(() => {
    // Simplified region mapping based on coordinates
    const regionMapping = (coords: [number, number]): string => {
      const [lng, lat] = coords;
      if (lat > 0) return 'Norte';
      if (lat < -30) return 'Sul';
      if (lng < -60) return 'Oeste';
      if (lng > -40) return 'Leste';
      return 'Centro';
    };

    const regions = [...new Set(events.map(event => {
      const coords = event.geometry[0]?.coordinates;
      return coords ? regionMapping(coords) : 'Desconhecida';
    }))];
    
    return regions;
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(event =>
        event.categories.some(cat => cat.title === selectedType)
      );
    }

    // Region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(event => {
        const coords = event.geometry[0]?.coordinates;
        if (!coords) return false;
        
        const [lng, lat] = coords;
        const region = lat > 0 ? 'Norte' : lat < -30 ? 'Sul' : lng < -60 ? 'Oeste' : lng > -40 ? 'Leste' : 'Centro';
        return region === selectedRegion;
      });
    }

    // Date filters
    if (dateFrom) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.geometry[0]?.date || '');
        return eventDate >= dateFrom;
      });
    }

    if (dateTo) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.geometry[0]?.date || '');
        return eventDate <= dateTo;
      });
    }

    return filtered.sort((a, b) => 
      new Date(b.geometry[0]?.date || '').getTime() - new Date(a.geometry[0]?.date || '').getTime()
    );
  }, [events, searchTerm, selectedType, selectedRegion, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getEventImage = (event: Event): string => {
    const categoryTitle = event.categories[0]?.title;
    return eventTypeImages[categoryTitle] || eventTypeImages.default;
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Wildfires': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Severe Storms': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Earthquakes': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Floods': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'Volcanoes': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Dust and Haze': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    };
    return colors[type] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getLocationName = (coordinates: [number, number]): string => {
    const [lng, lat] = coordinates;
    // Simplified location mapping
    if (lat > -10 && lng < -40) return 'Nordeste, Brasil';
    if (lat < -20 && lng > -50) return 'Sudeste, Brasil';
    if (lat < -25 && lng < -50) return 'Sul, Brasil';
    if (lat > -10 && lng > -50) return 'Norte, Brasil';
    if (lng < -60) return 'América do Sul';
    return `${lat.toFixed(1)}°, ${lng.toFixed(1)}°`;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedRegion('all');
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-white mb-2">Feed de Desastres Naturais</h2>
          <p className="text-slate-400">
            {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
            {filteredEvents.length !== events.length && ` de ${events.length} total`}
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={clearFilters}
          className="text-[rgba(255,255,255,1)] hover:text-white border-slate-600/50 hover:border-slate-500 bg-[rgba(42,72,137,1)]"
        >
          Limpar Filtros
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900/50 border-slate-700/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg text-white">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Event Type */}
          <Select value={selectedType} onValueChange={(value) => {
            setSelectedType(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-white">
              <SelectValue placeholder="Tipo de evento" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">Todos os tipos</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Region */}
          <Select value={selectedRegion} onValueChange={(value) => {
            setSelectedRegion(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-white">
              <SelectValue placeholder="Região" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">Todas as regiões</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date From */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? dateFrom.toLocaleDateString('pt-BR') : 'Data início'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={(date) => {
                  setDateFrom(date);
                  setCurrentPage(1);
                }}
                disabled={(date) => date > new Date() || date < new Date('2020-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Date To */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? dateTo.toLocaleDateString('pt-BR') : 'Data fim'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={(date) => {
                  setDateTo(date);
                  setCurrentPage(1);
                }}
                disabled={(date) => date > new Date() || date < new Date('2020-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </Card>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-700/50 p-12">
          <div className="text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl text-slate-300 mb-2">Nenhum evento encontrado</h3>
            <p className="text-slate-400 mb-6">
              Tente ajustar os filtros para encontrar eventos relevantes.
            </p>
            <Button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Limpar Filtros
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEvents.map((event) => (
            <Card 
              key={event.id}
              className="bg-slate-900/50 border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all duration-300 cursor-pointer group"
              onClick={() => onEventClick(event)}
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={getEventImage(event)}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                {/* Event Type Badge */}
                <Badge 
                  className={`absolute top-3 left-3 ${getEventTypeColor(event.categories[0]?.title)}`}
                >
                  {event.categories[0]?.title}
                </Badge>

                {/* Severity Badge */}
                {event.severity && (
                  <Badge 
                    className="absolute top-3 right-3 bg-slate-900/80 text-white border-slate-600"
                  >
                    {event.severity === 'low' ? 'Baixa' : 
                     event.severity === 'medium' ? 'Média' : 
                     event.severity === 'high' ? 'Alta' : 'Crítica'}
                  </Badge>
                )}

                {/* View Details Button */}
                <Button
                  size="sm"
                  className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Ver Detalhes
                </Button>
              </div>

              {/* Event Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-white font-medium mb-1 line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {formatEventDate(event.geometry[0]?.date || '')}
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {getLocationName(event.geometry[0]?.coordinates || [0, 0])}
                  </div>

                  {event.affectedArea && (
                    <div className="text-slate-400">
                      Área afetada: {event.affectedArea}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="text-slate-400 hover:text-white border-slate-600/50 hover:border-slate-500"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 
                ? i + 1 
                : currentPage >= totalPages - 2 
                  ? totalPages - 4 + i 
                  : currentPage - 2 + i;

              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={
                    pageNum === currentPage
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "text-slate-400 hover:text-white border-slate-600/50 hover:border-slate-500"
                  }
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="text-slate-400 hover:text-white border-slate-600/50 hover:border-slate-500"
          >
            Próxima
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Results Info */}
      <div className="text-center text-slate-400 text-sm">
        Mostrando {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredEvents.length)} de {filteredEvents.length} resultados
      </div>
    </div>
  );
}