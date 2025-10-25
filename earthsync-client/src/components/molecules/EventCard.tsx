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

const eventTypeIcons: Record<string, React.ReactNode> = {
  'Wildfires': <Zap className="w-3 h-3 sm:w-4 sm:h-4" />,
  'Severe Storms': <Zap className="w-3 h-3 sm:w-4 sm:h-4" />,
  'Volcanoes': <Zap className="w-3 h-3 sm:w-4 sm:h-4" />,
  'Earthquakes': <Zap className="w-3 h-3 sm:w-4 sm:h-4" />,
  'Floods': <Zap className="w-3 h-3 sm:w-4 sm:h-4" />,
  'Droughts': <Zap className="w-3 h-3 sm:w-4 sm:h-4" />,
  'Dust and Haze': <Zap className="w-3 h-3 sm:w-4 sm:h-4" />,
  'Snow': <Zap className="w-3 h-3 sm:w-4 sm:h-4" />,
  'Water Color': <Zap className="w-3 h-3 sm:w-4 sm:h-4" />,
  'Landslides': <Zap className="w-3 h-3 sm:w-4 sm:h-4" />,
  'Manmade': <Zap className="w-3 h-3 sm:w-4 sm:h-4" />,
  'Sea and Lake Ice': <Zap className="w-3 h-3 sm:w-4 sm:h-4" />,
  'Temperature Extremes': <Zap className="w-3 h-3 sm:w-4 sm:h-4" />,
};

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

const eventTypeImages: Record<string, string> = {
  'Wildfires': 'https://images.unsplash.com/photo-1648464680431-ac400e806714?...',
  'Severe Storms': 'https://images.unsplash.com/photo-1608933520361-9f397ca051c5?...',
  'Earthquakes': 'https://images.unsplash.com/photo-1707317683665-972a5561c74e?...',
  'Floods': 'https://images.unsplash.com/photo-1706737373665-6ff5e08347e5?...',
  'default': 'https://images.unsplash.com/photo-1636565214233-6d1019dfbc36?...',
};

export function EventCard({
  event,
  onClick,
  showImage = true,
  showSeverityBadge = true,
  showAffectedArea = false,
}: EventCardProps) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getLocation = () => {
    if (event.geometry && event.geometry.length > 0) {
      const coords = event.geometry[0].coordinates;
      return `${coords[1].toFixed(2)}°, ${coords[0].toFixed(2)}°`;
    }
    return 'Localização não disponível';
  };

  const getEventImage = () => {
    const categoryTitle = event.categories[0]?.title;
    return eventTypeImages[categoryTitle] || eventTypeImages.default;
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
            src={getEventImage()}
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
            {getLocation()}
          </div>
          {showAffectedArea && event.affectedArea && (
            <div className="text-slate-400">Área afetada: {event.affectedArea}</div>
          )}
        </div>
      </div>
    </Card>
  );
}
