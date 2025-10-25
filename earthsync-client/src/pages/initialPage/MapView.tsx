import { Event } from '../types/event';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  events: Event[];
  selectedEvent?: Event | null;
  onEventSelect: (event: Event) => void;
}

export function MapView({ events, selectedEvent, onEventSelect }: MapViewProps) {
  const getMarkerColor = (category: string) => {
    const colors: Record<string, string> = {
      'Wildfires': 'bg-red-500',
      'Severe Storms': 'bg-purple-500',
      'Volcanoes': 'bg-orange-500',
      'Earthquakes': 'bg-yellow-500',
      'Floods': 'bg-blue-500',
      'Droughts': 'bg-amber-500',
      'Dust and Haze': 'bg-gray-500',
      'Snow': 'bg-cyan-500',
      'Water Color': 'bg-teal-500',
      'Landslides': 'bg-stone-500',
      'Manmade': 'bg-rose-500',
      'Sea and Lake Ice': 'bg-indigo-500',
      'Temperature Extremes': 'bg-pink-500',
    };
    return colors[category] || 'bg-slate-500';
  };

  const normalizeCoordinate = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const eventsWithCoords = events.filter(event => 
    event.geometry && 
    event.geometry.length > 0 && 
    event.geometry[0].coordinates
  );

  // Calculate bounds for positioning markers
  const lats = eventsWithCoords.map(e => e.geometry[0].coordinates[1]);
  const lngs = eventsWithCoords.map(e => e.geometry[0].coordinates[0]);
  
  const minLat = Math.min(...lats, -90);
  const maxLat = Math.max(...lats, 90);
  const minLng = Math.min(...lngs, -180);
  const maxLng = Math.max(...lngs, 180);

  return (
    <div className="relative h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700/50 overflow-hidden">
      {/* Map Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* World Continents Silhouette (Simplified) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="text-slate-600">
          <svg width="400" height="200" viewBox="0 0 400 200" className="w-full h-full">
            {/* Simplified world map silhouette */}
            <path d="M50 100 Q100 80 150 100 Q200 120 250 100 Q300 80 350 100 L350 150 Q300 130 250 150 Q200 170 150 150 Q100 130 50 150 Z" fill="currentColor" />
            <circle cx="100" cy="120" r="15" fill="currentColor" />
            <circle cx="200" cy="90" r="20" fill="currentColor" />
            <circle cx="300" cy="110" r="18" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Event Markers */}
      <div className="absolute inset-0 p-4">
        {eventsWithCoords.map((event) => {
          const coords = event.geometry[0].coordinates;
          const lat = coords[1];
          const lng = coords[0];
          
          const x = normalizeCoordinate(lng, minLng, maxLng);
          const y = 100 - normalizeCoordinate(lat, minLat, maxLat); // Invert Y axis
          
          const isSelected = selectedEvent?.id === event.id;
          const category = event.categories[0]?.title || 'Unknown';
          
          return (
            <div
              key={event.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                isSelected ? 'scale-150 z-20' : 'hover:scale-125 z-10'
              }`}
              style={{
                left: `${Math.max(2, Math.min(98, x))}%`,
                top: `${Math.max(2, Math.min(98, y))}%`,
              }}
              onClick={() => onEventSelect(event)}
            >
              <div className={`relative`}>
                <div className={`w-4 h-4 rounded-full ${getMarkerColor(category)} shadow-lg ring-2 ring-white/30 ${
                  isSelected ? 'animate-pulse' : ''
                }`} />
                
                {/* Pulse animation for active events */}
                <div className={`absolute inset-0 w-4 h-4 rounded-full ${getMarkerColor(category)} animate-ping opacity-30`} />
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30 pointer-events-none">
                  <div>{event.title}</div>
                  <div className="text-slate-400">{category}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
        <h4 className="text-xs text-slate-300 mb-2">Legenda</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Array.from(new Set(events.map(e => e.categories[0]?.title).filter(Boolean))).slice(0, 6).map(category => (
            <div key={category} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getMarkerColor(category)}`} />
              <span className="text-slate-400 truncate">{category}</span>
            </div>
          ))}
        </div>
        {events.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-700/50">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Tempo real</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
        <div className="text-xs text-slate-300">
          <div>Eventos ativos: <span className="text-white">{events.length}</span></div>
          <div>Últimas 48h</div>
        </div>
      </div>
    </div>
  );
}