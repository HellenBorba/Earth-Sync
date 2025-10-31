// src/utils/aboutData.ts
import { Satellite, Globe, Zap, Shield, Code, Database, Map, Smartphone, Monitor } from "lucide-react";

export const technologies = [
  { name: 'React', description: 'Interface interativa e componentes reutilizáveis', icon: Code },
  { name: 'TypeScript', description: 'Tipagem estática para maior segurança', icon: Shield },
  { name: 'Tailwind CSS', description: 'Estilização moderna e responsiva', icon: Smartphone },
  { name: 'NASA EONET API', description: 'Dados em tempo real de desastres naturais', icon: Satellite },
  { name: 'Leaflet Maps', description: 'Visualização cartográfica interativa', icon: Map },
  { name: 'Unsplash API', description: 'Imagens de alta qualidade para ilustrações', icon: Monitor },
];

export const features = [
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

export const nasaLinks = [
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
