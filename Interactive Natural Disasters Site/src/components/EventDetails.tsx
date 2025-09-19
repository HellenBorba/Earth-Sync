import { ArrowLeft, MapPin, Calendar, Globe, Zap, ExternalLink, Share2, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { SatelliteImageCarousel } from './SatelliteImageCarousel';
import { toast } from 'sonner';
import { Event } from '../types/event';
import { useEffect, useState } from "react";
import { getEventImages } from "../api/events";
import { SatelliteImage } from "../types/event";

interface EventDetailsProps {
  event: Event;
  onBack: () => void;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function EventDetails({ event, onBack }: EventDetailsProps) {
  const [images, setImages] = useState<SatelliteImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEventImages(event.id)
      .then(setImages)
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [event.id]);

  const getEventTypeColor = (category: string) => {
    const colors: Record<string, string> = {
      'Wildfires': 'from-red-500/20 to-orange-500/20 border-red-500/50',
      'Severe Storms': 'from-purple-500/20 to-indigo-500/20 border-purple-500/50',
      'Volcanoes': 'from-orange-500/20 to-red-500/20 border-orange-500/50',
      'Earthquakes': 'from-yellow-500/20 to-amber-500/20 border-yellow-500/50',
      'Floods': 'from-blue-500/20 to-cyan-500/20 border-blue-500/50',
      'Droughts': 'from-amber-500/20 to-yellow-500/20 border-amber-500/50',
      'Dust and Haze': 'from-gray-500/20 to-slate-500/20 border-gray-500/50',
      'Snow': 'from-cyan-500/20 to-blue-500/20 border-cyan-500/50',
      'Water Color': 'from-teal-500/20 to-emerald-500/20 border-teal-500/50',
      'Landslides': 'from-stone-500/20 to-gray-500/20 border-stone-500/50',
      'Manmade': 'from-rose-500/20 to-pink-500/20 border-rose-500/50',
      'Sea and Lake Ice': 'from-indigo-500/20 to-blue-500/20 border-indigo-500/50',
      'Temperature Extremes': 'from-pink-500/20 to-rose-500/20 border-pink-500/50',
    };
    return colors[category] || 'from-slate-500/20 to-gray-500/20 border-slate-500/50';
  };

  const getAllCoordinates = () => {
    if (!event.geometry) return [];
    return event.geometry.map(geom => ({
      lat: geom.coordinates[1],
      lng: geom.coordinates[0],
      date: geom.date
    }));
  };

  const coordinates = getAllCoordinates();
  const category = event.categories[0]?.title || 'Desconhecido';

  const handleShare = () => {
    const eventUrl = `${window.location.origin}${window.location.pathname}#/evento/${encodeURIComponent(event.id)}`;
    if (navigator.share) {
      navigator.share({
        title: `EONET Monitor - ${event.title}`,
        text: `Confira este evento de ${category} detectado pelo sistema de monitoramento da NASA`,
        url: eventUrl,
      }).catch(() => {
        copyToClipboard(eventUrl);
      });
    } else {
      copyToClipboard(eventUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Link copiado para a área de transferência!', {
        description: 'Você pode compartilhar este link com outras pessoas.',
      });
    }).catch(() => {
      toast.error('Não foi possível copiar o link.');
    });
  };

  const getSeverityColor = (severity?: string) => {
    const colors = {
      'low': 'bg-green-500/20 text-green-300 border-green-500/30',
      'medium': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'high': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'critical': 'bg-red-500/20 text-red-300 border-red-500/30',
    };
    return colors[severity as keyof typeof colors] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'low': return <TrendingUp className="w-3 h-3" />;
      case 'medium': return <Activity className="w-3 h-3" />;
      case 'high': return <AlertTriangle className="w-3 h-3" />;
      case 'critical': return <AlertTriangle className="w-3 h-3" />;
      default: return <Zap className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <Badge 
                variant="outline" 
                className={`${getSeverityColor(event.severity)}`}
              >
                {getSeverityIcon(event.severity)}
                {event.severity ? 
                  `Severidade ${event.severity === 'low' ? 'Baixa' : event.severity === 'medium' ? 'Média' : event.severity === 'high' ? 'Alta' : 'Crítica'}` : 
                  'Evento Ativo'
                }
              </Badge>
              <Badge 
                variant="outline" 
                className="bg-slate-800/50 text-slate-300 border-slate-600/50"
              >
                ID: {event.id}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={handleShare}
                className="text-[rgba(255,255,255,1)] hover:text-white border-slate-600/50 hover:border-slate-500 bg-[rgba(42,72,137,1)]"
              >
                <Share2 className="w-3 h-3 mr-1" />
                Compartilhar
              </Button>
            </div>
            <h1 className="text-3xl font-medium text-white">{event.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Overview */}
            <Card className={`bg-gradient-to-br ${getEventTypeColor(category)} backdrop-blur-sm border p-6`}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl text-white mb-2">Visão Geral do Evento</h2>
                    <p className="text-slate-300 leading-relaxed">
                      Evento de tipo <strong>{category}</strong> detectado pelo sistema de monitoramento EONET da NASA. 
                      Este evento está sendo monitorado em tempo real através de dados satelitais e outras fontes confiáveis.
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-slate-300 border-slate-600/50 bg-slate-800/30"
                  >
                    {category}
                  </Badge>
                </div>

                {event.description && (
                  <div className="mt-4 p-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
                    <p className="text-slate-300">{event.description}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Timeline */}
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <h3 className="text-lg text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Linha do Tempo
              </h3>
              
              <div className="space-y-4">
                {coordinates.map((coord, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
                      {index < coordinates.length - 1 && (
                        <div className="w-px h-8 bg-slate-700 mt-2" />
                      )}
                    </div>
                    
                    <div className="flex-1 pb-4">
                      <div className="text-white font-medium">
                        {formatDate(coord.date)}
                      </div>
                      <div className="text-slate-400 text-sm">
                        Coordenadas: {coord.lat.toFixed(4)}°, {coord.lng.toFixed(4)}°
                      </div>
                      {index === 0 && (
                        <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30">
                          Mais recente
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Satellite Images */}
            <div>
              <h3 className="text-lg text-white mb-4">Imagens de Satélite</h3>
              {loading && <div className="text-slate-400">Carregando imagens...</div>}
              {!loading && images.length === 0 && (
                <div className="text-slate-400">Nenhuma imagem encontrada.</div>
              )}
              {!loading && images.length > 0 && (
                <SatelliteImageCarousel images={images} />
              )}
            </div>

            {/* Sources */}
            {event.sources && event.sources.length > 0 && (
              <Card className="bg-slate-900/50 border-slate-700/50 p-6">
                <h3 className="text-lg text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Fontes de Dados
                </h3>
                
                <div className="grid gap-3">
                  {event.sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                      <div>
                        <div className="text-white font-medium">{source.id}</div>
                        <div className="text-slate-400 text-sm">{source.url}</div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => window.open(source.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location Info */}
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <h3 className="text-lg text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Localização
              </h3>
              
              <div className="space-y-3">
                {coordinates.slice(0, 3).map((coord, index) => (
                  <div key={index} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                    <div className="text-slate-300 font-medium">
                      {coord.lat.toFixed(4)}°, {coord.lng.toFixed(4)}°
                    </div>
                    <div className="text-slate-400 text-sm">
                      {new Date(coord.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))}
                
                {coordinates.length > 3 && (
                  <div className="text-center text-slate-400 text-sm">
                    +{coordinates.length - 3} outras localizações
                  </div>
                )}
              </div>
            </Card>

            {/* Categories */}
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <h3 className="text-lg text-white mb-4">Categorias</h3>
              
              <div className="space-y-2">
                {event.categories.map((cat, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="w-full justify-start bg-slate-800/30 text-slate-300 border-slate-600/50"
                  >
                    {cat.title}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Impact Assessment */}
            {(event.affectedArea || event.estimatedImpact) && (
              <Card className="bg-slate-900/50 border-slate-700/50 p-6">
                <h3 className="text-lg text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Avaliação de Impacto
                </h3>
                
                <div className="space-y-4">
                  {event.affectedArea && (
                    <div>
                      <span className="text-slate-400 text-sm">Área Afetada:</span>
                      <div className="text-white font-medium">{event.affectedArea}</div>
                    </div>
                  )}
                  
                  {event.estimatedImpact && (
                    <div>
                      <span className="text-slate-400 text-sm">Impacto Estimado:</span>
                      <div className="text-white">{event.estimatedImpact}</div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Status */}
            <Card className={`${event.status === 'active' ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30' : 'bg-slate-900/50 border-slate-700/50'} p-6`}>
              <h3 className="text-lg text-white mb-4">Status do Evento</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${event.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
                  <span className={event.status === 'active' ? 'text-green-300' : 'text-slate-300'}>
                    {event.status === 'active' ? 'Monitoramento Ativo' : 
                     event.status === 'closed' ? 'Evento Encerrado' : 'Em Observação'}
                  </span>
                </div>
                
                <Separator className="bg-slate-700/50" />
                
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Última atualização:</span>
                    <span className="text-white">{formatDate(coordinates[0]?.date || new Date().toISOString())}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Próxima verificação:</span>
                    <span className="text-white">Em tempo real</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Localizações registradas:</span>
                    <span className="text-white">{coordinates.length}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}