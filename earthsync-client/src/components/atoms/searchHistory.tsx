import { useState } from 'react';
import { SearchInput } from '../atoms/searchInput';
import { Card } from '../atoms/card';
import { Search, History, Lightbulb } from 'lucide-react';

/**
 * Componente de demonstração do histórico de pesquisa
 * Pode ser usado para testes ou como referência
 */
export function searchHistory() {
  const [demoSearch1, setDemoSearch1] = useState('');
  const [demoSearch2, setDemoSearch2] = useState('');

  return (
    <div className="space-y-8 p-8 bg-slate-900/50 rounded-lg">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <History className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl text-white">Sistema de Histórico de Pesquisa</h2>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          O sistema salva automaticamente suas pesquisas recentes e oferece sugestões 
          inteligentes enquanto você digita. Navegue com as setas do teclado e pressione Enter para selecionar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Exemplo 1 - Feed de eventos */}
        <Card className="p-6 bg-slate-800/30 border-slate-700/50">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg text-white">Pesquisa de Eventos</h3>
            </div>
            <p className="text-sm text-slate-400">
              Busque por eventos naturais e veja suas pesquisas anteriores
            </p>
          </div>

          <SearchInput
            value={demoSearch1}
            onChange={setDemoSearch1}
            placeholder="Buscar eventos naturais..."
            className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400"
            storageKey="demo-events-search"
            maxHistory={10}
          />

          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2 text-xs text-slate-500">
              <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="mb-1">Experimente buscar por:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>incêndio</li>
                  <li>terremoto</li>
                  <li>tempestade</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Exemplo 2 - Pesquisa geral */}
        <Card className="p-6 bg-slate-800/30 border-slate-700/50">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg text-white">Pesquisa Geral</h3>
            </div>
            <p className="text-sm text-slate-400">
              Outro exemplo com histórico independente
            </p>
          </div>

          <SearchInput
            value={demoSearch2}
            onChange={setDemoSearch2}
            placeholder="Pesquisar qualquer coisa..."
            className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400"
            storageKey="demo-general-search"
            maxHistory={8}
          />

          <div className="mt-4 space-y-2">
            <div className="text-xs text-slate-500 space-y-1">
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-slate-700/50 flex items-center justify-center">↑</span>
                <span className="w-6 h-6 rounded bg-slate-700/50 flex items-center justify-center">↓</span>
                Navegar nas sugestões
              </p>
              <p className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-slate-700/50 text-xs">Enter</span>
                Selecionar sugestão
              </p>
              <p className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-slate-700/50 text-xs">Esc</span>
                Fechar sugestões
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Funcionalidades */}
      <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <h3 className="text-lg text-white mb-4">✨ Funcionalidades do Histórico</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-slate-300">Armazenamento local persistente</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-slate-300">Filtragem inteligente em tempo real</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-slate-300">Navegação por teclado completa</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-slate-300">Limite configurável de itens</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-slate-300">Remover itens individualmente</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-slate-300">Limpar todo o histórico</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-slate-300">Históricos independentes por página</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-slate-300">Design responsivo e acessível</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
