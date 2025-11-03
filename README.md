# 🌍 EarthSync

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow) ![License](https://img.shields.io/badge/license-MIT-blue)

**Rastreador de Desastres Naturais em Tempo Real**

EarthSync é uma plataforma interativa que exibe desastres naturais em tempo quase real usando a API **EONET** da NASA. Permite acompanhar eventos recentes, explorar no mapa, filtrar por tipo, pesquisar com histórico e visualizar estatísticas de forma clara e acessível.

---

## 🧑‍💻 Integrantes
- Hellen Machado Borba  
- Letícia Beatriz Souza  
- Maria Luiza Garcia  
- Noah Freitas Rabelo  

---

## ⚙️ Tecnologias Utilizadas

### Frontend
- React.js + Vite  
- TypeScript  
- TailwindCSS  
- Material UI  
- Leaflet.js / Mapbox  

### Backend
- Node.js + Express  
- TypeScript  
- Prisma ORM  
- MySQL  
- Swagger  

### Integrações
- NASA EONET API  
- Serviços WMS/WMTS (imagens de satélite)  

---

## 🏛 Arquitetura

- **Frontend:** Componentes organizados seguindo Atomic Design.  
- **Backend:** Arquitetura em camadas, separando responsabilidades.  
- **Cache inteligente:** Reduz latência e sobrecarga da API.  
- **Tipagem estática com TypeScript:** Maior confiabilidade e detecção de erros.  
- **Escalabilidade e acessibilidade:** Design consistente, responsivo e fácil de expandir.  

---

## 📌 Funcionalidades Principais

### Página Inicial (`/`)
- Lista eventos das últimas 48 horas  
- Dashboard de contagem por tipo  
- Mapa interativo com detalhes clicáveis  
- Barra de pesquisa  

### Página de Detalhes do Evento (`/evento/:id`)
- Nome, tipo e categoria do evento  
- Datas, localização e imagens de satélite  
- Compartilhamento de link  
- Galeria de imagens (carrossel)  

### Feed de Desastres (`/feed`)
- Feed de eventos em cards com foto, nome, data e tipo  
- Filtros por tipo, datas e região  
- Histórico de pesquisa com MySQL + Prisma  
- Paginação e links para detalhes  

### Sobre Nós (`/sobre`)
- Propósito do projeto  
- Tecnologias utilizadas  
- Créditos e fontes de dados  
- Links da documentação da API  

### Recursos Adicionais
- Responsivo para mobile  
- Mensagens de erro amigáveis  
- Cache de dados recentes  

---

## 🚀 Rodando o Projeto

### Frontend
```bash
cd earthsync-client
npm install
npm run dev
```

## 🖥️ Backend

### Instalação e execução
```bash
cd earthsync-server
npm install
npm install swagger-ui-express  # Instala dependência do Swagger
npm run dev
```

## 💾 Banco de dados
```bash
npx prisma migrate dev
```

---

## 📄 Licença
MIT License

---

<p align="center">
  🌍 <strong>EarthSync</strong> &mdash; Rastreador de Desastres Naturais em Tempo Real
</p>

<p align="center">
  Feito com ❤️ por Hellen Machado Borba, Letícia Beatriz Souza, Maria Luiza Garcia e Noah Freitas Rabelo
</p>

<p align="center">
  <sub>Projetos como este ajudam a tornar dados de desastres naturais mais acessíveis e compreensíveis para todos 🌱</sub>
</p>
