import { useEffect, useRef } from 'react';
import { Event } from '../types/event';
import { MapPin, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface GlobalMapOverviewProps {
  events: Event[];
  onEventSelect?: (event: Event) => void;
  onViewFullMap?: () => void;
}

export function GlobalMapOverview({ events, onEventSelect, onViewFullMap }: GlobalMapOverviewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  // Event type colors for markers
  const getEventColor = (event: Event) => {
    const category = event.categories[0]?.title;
    switch (category) {
      case 'Wildfires': return '#ef4444'; // red-500
      case 'Severe Storms': return '#3b82f6'; // blue-500
      case 'Earthquakes': return '#eab308'; // yellow-500
      case 'Floods': return '#06b6d4'; // cyan-500
      case 'Volcanoes': return '#f97316'; // orange-500
      case 'Dust and Haze': return '#8b5cf6'; // violet-500
      default: return '#64748b'; // slate-500
    }
  };

  // Simple coordinate to pixel conversion for world map
  const coordsToPixel = (coords: [number, number], mapWidth: number, mapHeight: number) => {
    const [lng, lat] = coords;
    const x = ((lng + 180) * mapWidth) / 360;
    const y = ((90 - lat) * mapHeight) / 180;
    return [x, y];
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const rect = map.getBoundingClientRect();
    
    // Clear existing markers
    const existingMarkers = map.querySelectorAll('.event-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add event markers
    events.forEach(event => {
      const coords = event.geometry[0]?.coordinates;
      if (!coords) return;

      const [x, y] = coordsToPixel(coords, rect.width, rect.height);
      
      // Skip if coordinates are outside visible area
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

      const marker = document.createElement('div');
      marker.className = 'event-marker absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-125 z-10';
      marker.style.left = `${x}px`;
      marker.style.top = `${y}px`;
      
      const color = getEventColor(event);
      
      marker.innerHTML = `
        <div class="relative">
          <div class="w-3 h-3 rounded-full animate-pulse shadow-lg" style="background-color: ${color}; box-shadow: 0 0 10px ${color}50"></div>
          <div class="absolute inset-0 w-3 h-3 rounded-full animate-ping" style="background-color: ${color}; opacity: 0.4"></div>
        </div>
      `;

      marker.title = event.title;
      marker.addEventListener('click', () => {
        onEventSelect?.(event);
      });

      map.appendChild(marker);
    });
  }, [events, onEventSelect]);

  const severityStats = {
    high: events.filter(e => e.severity === 'high').length,
    medium: events.filter(e => e.severity === 'medium').length,
    low: events.filter(e => e.severity === 'low').length
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg text-white mb-1">Panorama Global</h3>
            <p className="text-slate-400 text-xs sm:text-sm">{events.length} eventos ativos detectados</p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onViewFullMap}
            className="text-[rgba(255,255,255,1)] border-slate-600 hover:bg-blue-700 hover:text-white bg-[rgba(42,72,137,1)] w-full sm:w-auto"
          >
            <Eye className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Ver Mapa Completo</span>
            <span className="sm:hidden">Mapa Completo</span>
          </Button>
        </div>
      </div>

      <div className="relative">
        {/* World Map Background */}
        <div 
          ref={mapRef}
          className="relative h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-slate-800/50 to-slate-900/50 overflow-hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 800 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23334155' stroke-width='0.5' opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        >
          {/* Continents outline (simplified) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400">
            {/* Very simplified world map outline */}
            <g fill="none" stroke="#475569" strokeWidth="1" opacity="0.4">
              {/* North America */}
              <path d="M120 80 L200 70 L220 120 L180 160 L120 140 Z" />
              {/* South America */}
              <path d="M180 180 L220 170 L240 240 L200 280 L180 240 Z" />
              {/* Europe */}
              <path d="M380 80 L420 75 L430 110 L390 120 Z" />
              {/* Africa */}
              <path d="M380 140 L420 130 L440 200 L400 240 L380 200 Z" />
              {/* Asia */}
              <path d="M450 70 L600 80 L620 140 L480 150 Z" />
              {/* Australia */}
              <path d="M580 240 L640 235 L650 260 L590 265 Z" />
            </g>
          </svg>

          {/* Coordinate grid */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
          </div>

          {/* Center crosshair */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-4 h-4 border border-blue-400/30 rounded-full"></div>
            <div className="absolute inset-0 w-4 h-4 border-t border-l border-blue-400/50 rounded-tl-full animate-spin" style={{ animationDuration: '8s' }}></div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-slate-700/50 max-w-[140px] sm:max-w-none">
          <div className="text-xs text-slate-300 mb-2 hidden sm:block">Tipos de Eventos:</div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500"></div>
              <span className="text-slate-400 text-xs">Incêndios</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500"></div>
              <span className="text-slate-400 text-xs">Tempestades</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500"></div>
              <span className="text-slate-400 text-xs">Terremotos</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-500"></div>
              <span className="text-slate-400 text-xs">Inundações</span>
            </div>
          </div>
        </div>

        {/* Stats overlay */}
        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-slate-700/50">
          <div className="text-xs text-slate-300 mb-2 hidden sm:block">Severidade:</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500"></div>
                <span className="text-slate-400 text-xs">Alta</span>
              </div>
              <span className="text-white text-xs">{severityStats.high}</span>
            </div>
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500"></div>
                <span className="text-slate-400 text-xs">Média</span>
              </div>
              <span className="text-white text-xs">{severityStats.medium}</span>
            </div>
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
                <span className="text-slate-400 text-xs">Baixa</span>
              </div>
              <span className="text-white text-xs">{severityStats.low}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 bg-slate-800/30 border-t border-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="text-slate-400 flex items-center">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
            Clique nos marcadores para detalhes
          </div>
          <div className="text-slate-300">
            Última atualização: agora
          </div>
        </div>
      </div>
    </Card>
  );
}