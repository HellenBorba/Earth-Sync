import { useState, useEffect, useRef } from 'react';
import { Input } from '../atoms/input';
import { Search, X, History, Trash2 } from 'lucide-react';
import { Button } from '../atoms/button';
import { Card } from '../atoms/card';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  storageKey?: string;
  maxHistory?: number;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar...',
  className = '',
  storageKey = 'earth-sync-search-history',
  maxHistory = 10
}: SearchInputProps) {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(storageKey);
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, [storageKey]);

  // Save search history to localStorage
  const saveToHistory = (term: string) => {
    if (!term.trim() || term.length < 2) return;

    const newHistory = [
      term,
      ...searchHistory.filter(item => item.toLowerCase() !== term.toLowerCase())
    ].slice(0, maxHistory);

    setSearchHistory(newHistory);
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  // Clear all history
  const clearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  // Remove specific item from history
  const removeFromHistory = (term: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newHistory = searchHistory.filter(item => item !== term);
    setSearchHistory(newHistory);
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error removing from search history:', error);
    }
  };

  // Filter history based on current input
  const filteredHistory = searchHistory.filter(item =>
    item.toLowerCase().includes(value.toLowerCase())
  );

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!showSuggestions || filteredHistory.length === 0) {
      // If Enter is pressed and there are no suggestions shown, save to history
      if (event.key === 'Enter' && value.trim()) {
        saveToHistory(value);
        setShowSuggestions(false);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredHistory.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredHistory.length) {
          const selectedTerm = filteredHistory[focusedIndex];
          onChange(selectedTerm);
          saveToHistory(selectedTerm);
          setShowSuggestions(false);
          setFocusedIndex(-1);
        } else if (value.trim()) {
          saveToHistory(value);
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (e.target.value.trim()) {
      setShowSuggestions(true);
    }
    setFocusedIndex(-1);
  };

  // Handle input focus
  const handleFocus = () => {
    if (searchHistory.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (term: string) => {
    onChange(term);
    saveToHistory(term);
    setShowSuggestions(false);
    setFocusedIndex(-1);
  };

  // Clear input
  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className={`pl-10 pr-10 ${className}`}
          autoComplete="off"
        />

        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            aria-label="Limpar pesquisa"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (filteredHistory.length > 0 || (!value && searchHistory.length > 0)) && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-lg border-slate-700/50 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50 bg-slate-800/30">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <History className="w-3.5 h-3.5" />
              <span>Pesquisas recentes</span>
            </div>
            
            {searchHistory.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="h-auto py-1 px-2 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Limpar tudo
              </Button>
            )}
          </div>

          {/* Suggestions List */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {(value ? filteredHistory : searchHistory).length === 0 && value && (
              <div className="px-4 py-8 text-center">
                <Search className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-sm text-slate-500">Nenhuma pesquisa anterior encontrada</p>
              </div>
            )}
            
            {(value ? filteredHistory : searchHistory).map((term, index) => (
              <div
                key={index}
                className={`
                  flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-150
                  ${focusedIndex === index 
                    ? 'bg-blue-600/20 border-l-2 border-blue-500 pl-[14px]' 
                    : 'hover:bg-slate-800/50 border-l-2 border-transparent'
                  }
                `}
                onClick={() => handleSuggestionClick(term)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <History className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="text-white text-sm truncate">{term}</span>
                </div>

                <button
                  onClick={(e) => removeFromHistory(term, e)}
                  className="ml-2 p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors flex-shrink-0"
                  aria-label={`Remover "${term}" do histórico`}
                  title="Remover do histórico"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Footer hint */}
          {(value ? filteredHistory : searchHistory).length > 0 && (
            <div className="px-4 py-2 bg-slate-800/30 border-t border-slate-700/50">
              <p className="text-xs text-slate-500">
                Use <kbd className="px-1 py-0.5 bg-slate-700/50 rounded text-slate-400">↑↓</kbd> para navegar, 
                <kbd className="px-1 py-0.5 bg-slate-700/50 rounded text-slate-400 mx-1">Enter</kbd> para selecionar, 
                <kbd className="px-1 py-0.5 bg-slate-700/50 rounded text-slate-400">Esc</kbd> para fechar
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
