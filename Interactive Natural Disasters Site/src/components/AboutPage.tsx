import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Satellite, 
  Globe, 
  Zap, 
  Shield, 
  ExternalLink, 
  Github, 
  Heart,
  Code,
  Database,
  Map,
  Smartphone,
  Monitor
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function AboutPage() {
  const technologies = [
    { name: 'React', description: 'Interface interativa e componentes reutilizáveis', icon: Code },
    { name: 'TypeScript', description: 'Tipagem estática para maior segurança', icon: Shield },
    { name: 'Tailwind CSS', description: 'Estilização moderna e responsiva', icon: Smartphone },
    { name: 'NASA EONET API', description: 'Dados em tempo real de desastres naturais', icon: Satellite },
    { name: 'Leaflet Maps', description: 'Visualização cartográfica interativa', icon: Map },
    { name: 'Unsplash API', description: 'Imagens de alta qualidade para ilustrações', icon: Monitor },
  ];

  const features = [
    {
      title: 'Monitoramento em Tempo Real',
      description: 'Dados atualizados a cada 5 minutos da API EONET da NASA',
      icon: Zap
    },
    {
      title: 'Visualização Cartográfica',
      description: 'Mapa interativo com marcadores dos eventos detectados',
      icon: Globe
    },
    {
      title: 'Filtragem Avançada',
      description: 'Filtros por tipo, região, data e severidade dos eventos',
      icon: Database
    },
    {
      title: 'Interface Responsiva',
      description: 'Otimizada para desktop, tablet e dispositivos móveis',
      icon: Smartphone
    }
  ];

  const nasaLinks = [
    {
      title: 'NASA EONET API',
      description: 'Documentação oficial da API EONET (Earth Observing System Data and Information System)',
      url: 'https://eonet.gsfc.nasa.gov/docs/v3'
    },
    {
      title: 'NASA Worldview',
      description: 'Visualizador de dados de observação da Terra da NASA',
      url: 'https://worldview.earthdata.nasa.gov/'
    },
    {
      title: 'NASA Earth Observatory',
      description: 'Imagens, histórias e descobertas sobre nosso planeta',
      url: 'https://earthobservatory.nasa.gov/'
    },
    {
      title: 'NASA FIRMS',
      description: 'Sistema de Informações sobre Incêndios para Gestão de Recursos',
      url: 'https://firms.modaps.eosdis.nasa.gov/'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 p-8 overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                  <Satellite className="w-8 h-8 text-white" />
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Versão 1.0.0
                </Badge>
              </div>
              
              <h1 className="text-4xl text-white mb-4">
                EarthSync
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed">
                Sistema de monitoramento de desastres naturais em tempo real, 
                utilizando dados da NASA para fornecer informações precisas e 
                atualizadas sobre eventos naturais ao redor do mundo.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button 
                className="bg-[rgba(42,72,137,1)] hover:bg-blue-700 text-white"
                onClick={() => window.open('https://eonet.gsfc.nasa.gov/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visitar NASA EONET
              </Button>
              
              <Button 
                variant="outline"
                className="text-[rgba(255,255,255,1)] border-slate-600 hover:bg-slate-800/50 bg-[rgba(42,72,137,1)]"
                onClick={() => window.open('https://github.com/', '_blank')}
              >
                <Github className="w-4 h-4 mr-2" />
                Ver no GitHub
              </Button>
            </div>
          </div>

          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1636565214233-6d1019dfbc36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXNhJTIwZWFydGglMjBvYnNlcnZhdGlvbnxlbnwxfHx8fDE3NTc2MDI3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="NASA Earth Observation"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-lg" />
          </div>
        </div>
      </Card>

      {/* Purpose and Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900/50 border-slate-700/50 p-6">
          <h2 className="text-2xl text-white mb-4 flex items-center gap-3">
            <Globe className="w-6 h-6 text-blue-400" />
            Propósito
          </h2>
          
          <div className="space-y-4 text-slate-300">
            <p>
              O EarthSync foi desenvolvido para democratizar o acesso às informações 
              sobre desastres naturais, utilizando os dados fornecidos pela NASA através 
              da API EONET (Earth Observing System Data and Information System).
            </p>
            
            <p>
              Nossa missão é fornecer uma interface intuitiva e moderna que permita a 
              qualquer pessoa acompanhar eventos naturais em tempo real, contribuindo 
              para a conscientização e preparação diante de fenômenos naturais.
            </p>
            
            <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-blue-300 font-medium mb-2">Dados Confiáveis</p>
              <p className="text-sm">
                Todos os dados exibidos são fornecidos diretamente pela NASA, 
                garantindo precisão e confiabilidade das informações.
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 p-6">
          <h2 className="text-2xl text-white mb-4 flex items-center gap-3">
            <Zap className="w-6 h-6 text-green-400" />
            Funcionalidades
          </h2>
          
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex gap-3">
                  <div className="p-2 bg-slate-800/50 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Technologies */}
      <Card className="bg-slate-900/50 border-slate-700/50 p-6">
        <h2 className="text-2xl text-white mb-6 flex items-center gap-3">
          <Code className="w-6 h-6 text-purple-400" />
          Tecnologias Utilizadas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-medium">{tech.name}</h3>
                </div>
                <p className="text-slate-400 text-sm">{tech.description}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* NASA Credits and Links */}
      <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-600/20 rounded-xl">
            <Satellite className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl text-white">Créditos e Fontes</h2>
            <p className="text-slate-400">Recursos e documentação da NASA</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-white font-medium">Agradecimentos</span>
            </div>
            <p className="text-slate-300 text-sm">
              Este projeto é possível graças ao trabalho da NASA e sua iniciativa de dados abertos. 
              Agradecemos especialmente à equipe do EONET (Earth Observing System Data and Information System) 
              por fornecer dados precisos e em tempo real sobre desastres naturais.
            </p>
          </div>
        </div>

        <Separator className="bg-slate-700/50 mb-6" />

        <div>
          <h3 className="text-lg text-white mb-4">Links Úteis da NASA</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nasaLinks.map((link, index) => (
              <div 
                key={index}
                className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{link.title}</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-1 h-auto text-blue-400 hover:text-blue-300"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-slate-400 text-sm mb-3">{link.description}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-[rgba(255,255,255,1)] border-slate-600 hover:bg-slate-700/50 bg-[rgba(42,72,137,1)]"
                  onClick={() => window.open(link.url, '_blank')}
                >
                  Acessar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Technical Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50 p-6">
          <h3 className="text-lg text-white mb-4">Informações Técnicas</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Frequência de atualização:</span>
              <span className="text-white">5 minutos</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-400">Cobertura temporal:</span>
              <span className="text-white">Últimas 48 horas</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-400">Precisão geográfica:</span>
              <span className="text-white">±100 metros</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-400">Tipos de eventos:</span>
              <span className="text-white">8 categorias</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-400">Fonte dos dados:</span>
              <span className="text-white">NASA EONET API v3</span>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 p-6">
          <h3 className="text-lg text-white mb-4">Limitações e Avisos</h3>
          
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-white">Dados em Tempo Real:</span>
                <p>Os dados são fornecidos para fins informativos e não devem ser usados como única fonte para tomada de decisões críticas.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Database className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-white">Dependência da API:</span>
                <p>A disponibilidade dos dados depende do funcionamento da API EONET da NASA.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Globe className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-white">Cobertura Global:</span>
                <p>Nem todos os eventos naturais são detectados pelos sistemas de monitoramento satelital.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <Card className="bg-slate-800/30 border-slate-700/30 p-6 text-center">
        <p className="text-slate-400 mb-2">
          Desenvolvido com <Heart className="w-4 h-4 text-red-400 inline mx-1" /> para a comunidade
        </p>
        <p className="text-slate-500 text-sm">
          Este projeto é open source e não possui afiliação oficial com a NASA.
        </p>
      </Card>
    </div>
  );
}