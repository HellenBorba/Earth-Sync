import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Smartphone, Tablet, Monitor, Eye, EyeOff } from 'lucide-react';

interface ResponsiveDemoProps {
  children: React.ReactNode;
}

export function ResponsiveDemo({ children }: ResponsiveDemoProps) {
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop' | 'hidden'>('hidden');

  const getViewportStyles = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' }; // iPhone size
      case 'tablet':
        return { width: '768px', height: '1024px' }; // iPad size
      case 'desktop':
        return { width: '1440px', height: '900px' }; // Desktop size
      case 'hidden':
      default:
        return null;
    }
  };

  if (viewMode === 'hidden') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="p-3 bg-slate-900/95 border-slate-700/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewMode('mobile')}
              className="text-slate-400 hover:text-white"
            >
              <Eye className="w-4 h-4 mr-1" />
              Ver Layout Responsivo
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const viewportStyles = getViewportStyles();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-full flex flex-col">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4 p-3 bg-slate-900/95 rounded-lg border border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">Layout Responsivo:</span>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setViewMode('mobile')}
                className="text-xs"
              >
                <Smartphone className="w-3 h-3 mr-1" />
                Mobile
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                onClick={() => setViewMode('tablet')}
                className="text-xs"
              >
                <Tablet className="w-3 h-3 mr-1" />
                Tablet
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setViewMode('desktop')}
                className="text-xs"
              >
                <Monitor className="w-3 h-3 mr-1" />
                Desktop
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs">
              {viewMode === 'mobile' && '375x667px (iPhone)'}
              {viewMode === 'tablet' && '768x1024px (iPad)'}
              {viewMode === 'desktop' && '1440x900px (Desktop)'}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewMode('hidden')}
              className="text-slate-400 hover:text-white"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Viewport */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="bg-white rounded-lg shadow-2xl overflow-hidden border-8 border-slate-800"
            style={viewportStyles}
          >
            <div className="w-full h-full overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}