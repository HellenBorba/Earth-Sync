import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Home, Rss, Info, Satellite, Menu, X } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'feed', label: 'Feed', icon: Rss },
    { id: 'sobre', label: 'Sobre', icon: Info },
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="flex items-center justify-between mb-6">
      {/* Logo and Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg glow-blue animate-pulse-glow">
          <Satellite className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl text-white mb-1 stellar-glow">EarthSync</h1>
          <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">
            Sistema de Monitoramento de Desastres Naturais
          </p>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 backdrop-blur-sm ${
                isActive 
                  ? 'bg-[rgba(42,72,137,1)] hover:bg-blue-700 text-white glow-blue' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-slate-700/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Button>
          );
        })}
      </div>

      {/* Mobile Navigation */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            className="md:hidden text-white hover:bg-slate-800/50 border border-slate-700/30"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 bg-slate-900/95 backdrop-blur-md border-slate-700/50">
          <SheetHeader>
            <SheetTitle className="sr-only">Menu de Navegação EarthSync</SheetTitle>
            <SheetDescription className="sr-only">
              Navegue pelas diferentes seções do sistema de monitoramento de desastres naturais
            </SheetDescription>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg glow-blue">
                  <Satellite className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg text-white stellar-glow">EarthSync</h2>
                  <p className="text-xs text-slate-400">Menu de Navegação</p>
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full justify-start gap-3 h-12 ${
                    isActive 
                      ? 'bg-[rgba(42,72,137,1)] text-white glow-blue' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-base">{item.label}</span>
                </Button>
              );
            })}
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <p className="text-xs text-slate-400 text-center">
                Dados em tempo real da NASA EONET
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}