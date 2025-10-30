import { useState, useMemo, useEffect } from 'react'; 
import { Card } from '../../components/atoms/card';
import { Button } from '../../components/atoms/button';
import { Input } from '../../components/atoms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/atoms/select';
import { Calendar } from '../../components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/atoms/popover';
import { CalendarIcon, MapPin, Clock, Filter, Search, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '../../types/event';
import { EventCard } from '../../components/molecules/EventCard';
import { tCategory } from '../../utils/i18n'; // Adicionado tCategory

interface FeedPageProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const ITEMS_PER_PAGE = 9;

export function FeedPage({ events, onEventClick }: FeedPageProps) {
  
  const [processedEvents, setProcessedEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  // Mapping from English to Portuguese
  const categoryMapPtToEn: Record<string, string> = useMemo(() => {
    return {
      'Incêndios': 'Wildfires',
      'Tempestades Severas': 'Severe Storms',
      'Ciclone Tropical': 'Tropical Cyclone',
      'Ciclones Tropicais': 'Tropical Cyclones',
      'Terremotos': 'Earthquakes',
      'Inundações': 'Floods',
      'Vulcões': 'Volcanoes',
      'Névoa e Poeira': 'Dust and Haze',
      'Secas': 'Drought',
      'Deslizamentos': 'Landslides',
      'Nevascas': 'Snow',
      'Ações Humanas': 'Manmade',
      'Gelo Marinho e Lacustre': 'Sea and Lake Ice',
      'Temperatura Extrema': 'Extreme Temperature',
    };
  }, []);

  useEffect(() => {
    if (events && events.length > 0) {
      const processed = events.map(event => {
        const mainCategoryTitleEn = event.categories[0]?.title || '';
        const mainCategoryTitlePt = tCategory(mainCategoryTitleEn);

        let translatedTitle = event.title;

        // Treats plurals and compound nouns first
        translatedTitle = translatedTitle
          .replace(/\bTropical Cyclone(s)?\b/gi, 'Ciclone Tropical')
          .replace(/\bSevere Storm(s)?\b/gi, 'Tempestade Severa')
          .replace(/\bSea and Lake Ice\b/gi, 'Gelo Marinho e Lacustre')
          .replace(/\bDust and Haze\b/gi, 'Névoa e Poeira')
          .replace(/\bTemperature Extremes?\b/gi, 'Temperatura Extrema')
          .replace(/\bWater Color\b/gi, 'Cor da Água');

        // Treats simple words (singular/plural) first
        translatedTitle = translatedTitle
          .replace(/\bWildfire(s)?\b/gi, 'Incêndio')
          .replace(/\bFire(s)?\b/gi, 'Incêndio')
          .replace(/\bFlood(s)?\b/gi, 'Inundação')
          .replace(/\bEarthquake(s)?\b/gi, 'Terremoto')
          .replace(/\bVolcano(es)?\b/gi, 'Vulcão')
          .replace(/\bStorm(s)?\b/gi, 'Tempestade')
          .replace(/\bCyclone(s)?\b/gi, 'Ciclone')
          .replace(/\bDrought(s)?\b/gi, 'Seca')
          .replace(/\bSnow(s)?\b/gi, 'Nevasca')
          .replace(/\bLandslide(s)?\b/gi, 'Deslizamento')
          .replace(/\bDust\b/gi, 'Poeira')
          .replace(/\bHaze\b/gi, 'Névoa')
          .replace(/\bIce\b/gi, 'Gelo')
          .replace(/\bManmade\b/gi, 'Ação Humana');

        // Reorder logic
        const hasLocation = /,|\bfrom\b|\bin\b/i.test(translatedTitle);
        if (hasLocation) {
          const regexEvent = /^(.*?)(Incêndio|Inundação|Terremoto|Vulcão|Tempestade|Ciclone|Seca|Nevasca|Deslizamento|Névoa|Gelo|Ação Humana)(.*)$/i;
          const match = translatedTitle.match(regexEvent);
          if (match) {
            const before = match[1].trim();
            const disaster = match[2].trim();
            const after = match[3].trim();
            
            // Simplified reordering logic
            if (before && after) {
              translatedTitle = `${disaster} em ${before.replace(/[-,]+$/, '')}${after ? ', ' + after : ''}`;
            } else if (before) {
              translatedTitle = `${disaster} em ${before}`;
            } else {
              translatedTitle = disaster;
            }
          }
        }

        // Translate category within title if necessary (fallback)
        if (mainCategoryTitleEn && mainCategoryTitlePt && mainCategoryTitleEn !== mainCategoryTitlePt) {
          const regex = new RegExp(mainCategoryTitleEn, 'gi');
          translatedTitle = translatedTitle.replace(regex, mainCategoryTitlePt);
        }

        return { ...event, title: translatedTitle };
      });

      setProcessedEvents(processed);
    } else {
      setProcessedEvents([]);
    }
  }, [events]);

  // Extracts unique event types, TRANSLATED to SELECT
  const eventTypes = useMemo(() => {
    // Get the unique categories in ENGLISH from processedEvents
    const typesEn = [...new Set(processedEvents.flatMap(event => event.categories.map(cat => cat.title)))];
    // Translates for display in the processedEvents filterS
    return typesEn.map(tCategory);
  }, [processedEvents]);

  // Region mapping functions (USING processedEvents)
  const regions = useMemo(() => {
    const regionMapping = (event: Event): string => {
      const coords = event.geometry?.[0]?.coordinates as [number, number];
      if (!coords) return 'Desconhecida';
      const [lng, lat] = coords;

      if (lat >= 60) return 'Ártico';
      if (lat <= -60) return 'Antártida';
      if (lat > 0 && lng < -30) return 'América do Norte';
      if (lat < 0 && lng < -30) return 'América do Sul';
      if (lat > 0 && lng >= -30 && lng < 60) return 'Europa';
      if (lat < 0 && lng >= -30 && lng < 60) return 'África';
      if (lat > 0 && lng >= 60) return 'Ásia';
      if (lat < 0 && lng >= 60) return 'Oceania';

      return lat > 0 ? 'Norte' : 'Sul';
    };

    return [...new Set(
      processedEvents.map(e => regionMapping(e)) 
    )];
  }, [processedEvents]);


  // Filtering using processedEvents and PT -> EN conversion
  const filteredEvents = useMemo(() => {
    let filtered = processedEvents;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      const selectedTypeEn = categoryMapPtToEn[selectedType] || selectedType;
      
      filtered = filtered.filter(event =>
        event.categories.some(cat => cat.title === selectedTypeEn || cat.title === selectedType)
      );
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(event => {
        const coords = event.geometry?.[0]?.coordinates; 

        if (!coords) return selectedRegion === 'Desconhecida'; 

        const [lng, lat] = coords;

        const region = (() => {
          if (lat >= 60) return 'Ártico';
          if (lat <= -60) return 'Antártida';
          if (lat > 0 && lng < -30) return 'América do Norte';
          if (lat < 0 && lng < -30) return 'América do Sul';
          if (lat > 0 && lng >= -30 && lng < 60) return 'Europa';
          if (lat < 0 && lng >= -30 && lng < 60) return 'África';
          if (lat > 0 && lng >= 60) return 'Ásia';
          if (lat < 0 && lng >= 60) return 'Oceania';
          return lat > 0 ? 'Norte' : 'Sul';
        })();

        return region === selectedRegion;
      });
    }

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
  }, [processedEvents, searchTerm, selectedType, selectedRegion, dateFrom, dateTo, categoryMapPtToEn]);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => onEventClick(event)}
              showImage={true}
              showSeverityBadge={true}
              showAffectedArea={true}
            />
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