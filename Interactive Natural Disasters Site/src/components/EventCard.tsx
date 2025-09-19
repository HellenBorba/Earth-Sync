import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Calendar, Zap } from 'lucide-react';
import { Event } from '../types/event';

interface EventCardProps {
  event: Event;
  onClick: () => void;
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

export function EventCard({ event, onClick }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLocation = () => {
    if (event.geometry && event.geometry.length > 0) {
      const coords = event.geometry[0].coordinates;
      return `${coords[1].toFixed(2)}°, ${coords[0].toFixed(2)}°`;
    }
    return 'Localização não disponível';
  };

  return (
    <Card 
      className="group relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-slate-600/80 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-slate-100 group-hover:text-white transition-colors duration-200 text-sm sm:text-base line-clamp-2">
              {event.title}
            </h3>
          </div>
          
          <Badge 
            variant="outline" 
            className={`${eventTypeColors[event.categories[0]?.title] || 'bg-slate-500/20 text-slate-300 border-slate-500/30'} flex items-center gap-1.5 whitespace-nowrap self-start`}
          >
            {eventTypeIcons[event.categories[0]?.title] || <Zap className="w-3 h-3 sm:w-4 sm:h-4" />}
            <span className="text-xs sm:text-sm">{event.categories[0]?.title || 'Desconhecido'}</span>
          </Badge>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{formatDate(event.geometry[0]?.date || new Date().toISOString())}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">{getLocation()}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              ID: {event.id}
            </span>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>
      </div>
    </Card>
  );
}