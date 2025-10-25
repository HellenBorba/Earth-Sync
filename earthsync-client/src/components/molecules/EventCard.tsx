import { Card } from '../atoms/card';
import { Badge } from '../atoms/badge';
import { MapPin, Calendar, Zap, Clock, ExternalLink } from 'lucide-react';
import { Button } from '../atoms/button';
import { Event } from '../../types/event';
import { ImageWithFallback } from '../atoms/ImageWithFallback';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  showImage?: boolean;
  showSeverityBadge?: boolean;
  showAffectedArea?: boolean;
}

const eventTypeColors: Record<string, string> = {
  'Wildfires': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Severe Storms': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Volcanoes': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Earthquakes': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Floods': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Droughts': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Dust and Haze': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  'Snow': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Water Color': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Landslides': 'bg-stone-500/20 text-stone-300 border-stone-500/30',
  'Manmade': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'Sea and Lake Ice': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'Temperature Extremes': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
};

export function EventCard({
  event,
  onClick,
  showImage = true,
  showSeverityBadge = false,
  showAffectedArea = false
}: EventCardProps) {
  // Pega a primeira imagem do evento ou fallback
  const imageUrl = event.images?.[0]?.url || '/images/placeholder-400x200.png';

  console.log(event.images)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getRegion = () => {
    if (event.geometry && event.geometry.length > 0) {
      const coords = event.geometry[0].coordinates as [number, number];
      const [lng, lat] = coords;

      if (lat >= 60) return 'Ártico';
      if (lat <= -60) return 'Antártida';

      // Hemisférios
      const north = lat > 0;

      // Aproximação por continente
      if (lat > 0 && lng < -30) return 'América do Norte';
      if (lat < 0 && lng < -30) return 'América do Sul';
      if (lat > 0 && lng > -30 && lng < 60) return 'Europa';
      if (lat < 0 && lng > -30 && lng < 60) return 'África';
      if (lat > 0 && lng >= 60) return 'Ásia';
      if (lat < 0 && lng >= 60) return 'Oceania';

      return north ? 'Norte' : 'Sul';
    }
    return 'Desconhecida';
  };

  const getEventTypeColor = () => {
    const type = event.categories[0]?.title || '';
    return eventTypeColors[type] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  };

  return (
    <Card
      className="group relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-slate-600/80 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
      onClick={onClick}
    >
      {showImage && (
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={event.images?.[0]?.url || '/images/placeholder-400x200.png'}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          <Badge className={`absolute top-3 left-3 ${getEventTypeColor()}`}>
            {event.categories[0]?.title}
          </Badge>
          {showSeverityBadge && event.severity && (
            <Badge className="absolute top-3 right-3 bg-slate-900/80 text-white border-slate-600">
              {event.severity === 'low' ? 'Baixa' : event.severity === 'medium' ? 'Média' : event.severity === 'high' ? 'Alta' : 'Crítica'}
            </Badge>
          )}
          <Button
            size="sm"
            className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Ver Detalhes
          </Button>
        </div>
      )}

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-medium mb-1 line-clamp-2 group-hover:text-blue-300 transition-colors">
            {event.title}
          </h3>
          {event.description && <p className="text-slate-400 text-sm line-clamp-2">{event.description}</p>}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-3 h-3 text-slate-400" />
            {formatDate(event.geometry[0]?.date || new Date().toISOString())}
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-3 h-3 text-slate-400" />
            {getRegion()}
          </div>
          {showAffectedArea && event.affectedArea && (
            <div className="text-slate-400">Área afetada: {event.affectedArea}</div>
          )}
        </div>
      </div>
    </Card>
  );
}
