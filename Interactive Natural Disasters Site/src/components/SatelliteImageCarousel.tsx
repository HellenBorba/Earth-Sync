import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, ZoomIn, ExternalLink, Download, Calendar, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { SatelliteImage } from '../types/event';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SatelliteImageCarouselProps {
  images: SatelliteImage[];
}

const imageTypeColors: Record<string, string> = {
  'RGB': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'INFRARED': 'bg-red-500/20 text-red-300 border-red-500/30',
  'THERMAL': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'WMS': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'WMTS': 'bg-green-500/20 text-green-300 border-green-500/30',
};

export function SatelliteImageCarousel({ images }: SatelliteImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<SatelliteImage | null>(null);

  if (!images || images.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50 p-8">
        <div className="text-center">
          <Camera className="w-12 h-12 mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg text-slate-300 mb-2">Imagens não disponíveis</h3>
          <p className="text-slate-400">
            Nenhuma imagem de satélite foi encontrada para este evento.
          </p>
        </div>
      </Card>
    );
  }

  const currentImage = images[currentIndex];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg text-white mb-2 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Imagens de Satélite
            </h3>
            <p className="text-slate-400">
              {images.length} imagem{images.length !== 1 ? 's' : ''} disponível{images.length !== 1 ? 'eis' : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={imageTypeColors[currentImage.type] || 'bg-slate-500/20 text-slate-300 border-slate-500/30'}
            >
              {currentImage.type}
            </Badge>
            <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600/50">
              {currentIndex + 1} de {images.length}
            </Badge>
          </div>
        </div>

        {/* Main Image */}
        <div className="relative group mb-6">
          <div className="aspect-video bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50">
            <ImageWithFallback
              src={currentImage.url}
              alt={currentImage.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-4 right-4 flex gap-2">
                <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800/80"
                      onClick={() => setSelectedImage(currentImage)}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl bg-slate-900 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        {selectedImage?.title}
                      </DialogTitle>
                    </DialogHeader>
                    {selectedImage && (
                      <div className="space-y-4">
                        <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={selectedImage.url}
                            alt={selectedImage.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Fonte:</span>
                            <span className="text-white ml-2">{selectedImage.source}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Resolução:</span>
                            <span className="text-white ml-2">{selectedImage.resolution}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Data:</span>
                            <span className="text-white ml-2">{formatDate(selectedImage.date)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Tipo:</span>
                            <span className="text-white ml-2">{selectedImage.type}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800/80"
                  onClick={() => window.open(currentImage.url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800/80"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = currentImage.url;
                    link.download = `${currentImage.title}.jpg`;
                    link.click();
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800/80"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800/80"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Image Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
              <h4 className="text-white font-medium mb-1">{currentImage.title}</h4>
              <div className="flex items-center gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(currentImage.date)}
                </div>
                <div>{currentImage.source}</div>
                <div>{currentImage.resolution}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm text-slate-300">Outras imagens</h4>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={prevImage}
                  disabled={currentIndex === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={nextImage}
                  disabled={currentIndex === images.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <ImageWithFallback
                    src={image.thumbnail}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-blue-500/20" />
                  )}
                  
                  <Badge 
                    className={`absolute top-1 right-1 text-xs px-1 py-0 ${imageTypeColors[image.type] || 'bg-slate-500/80 text-slate-200'}`}
                  >
                    {image.type}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}