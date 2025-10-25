const express = require("express");
const axios = require("axios");
const cache = require("../cache");
const router = express.Router();

const EONET_BASE = "https://eonet.gsfc.nasa.gov/api/v3/events";

// Função utilitária para buscar evento por ID, usando cache
async function getEventById(id) {
  const cacheKey = `event-${id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await axios.get(`${EONET_BASE}/${id}`);
  cache.set(cacheKey, response.data);
  return response.data;
}

// Função utilitária para gerar imagem do evento
function generateEventImage(event, id) {
  const geom = event.geometry?.[0];
  if (!geom) return [];

  const [lon, lat] = geom.coordinates;
  const date = geom.date.split("T")[0];

  const imageUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&FORMAT=image/jpeg&TRANSPARENT=FALSE&HEIGHT=512&WIDTH=512&CRS=EPSG:4326&BBOX=${lat - 1},${lon - 1},${lat + 1},${lon + 1}&TIME=${date}`;

  return [{
    id: `gibs-${id}`,
    url: imageUrl,
    thumbnail: imageUrl,
    title: "NASA GIBS - True Color",
    date,
    type: "RGB",
    source: "NASA GIBS",
    resolution: "1km"
  }];
}

// Listar eventos com filtro
router.get("/", async (req, res) => {
  try {
    const { category, start, end } = req.query; 
    
    // O backend agora DEVE SEMPRE incluir as imagens (ou pelo menos um array vazio)
    // para satisfazer o contrato do frontend.
    const includeImagesFlag = true; // Forçamos a inclusão no backend

    // Usaremos a flag no cache key para que diferentes filtros de imagens sejam cacheados separadamente
    const cacheKey = `events-${category || "all"}-${start || "any"}-${end || "any"}-images-true`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    // 1. REQUISIÇÃO ÚNICA AO EONET
    const response = await axios.get(EONET_BASE, {
      params: { category, start, end, limit: 50 },
    });

    let events = response.data.events;
    
    // 2. ENRIQUECIMENTO DE DADOS NO BACKEND (MAIS RÁPIDO QUE O FRONTEND)
    // Fazemos o map para adicionar o campo 'images' em todos os eventos.
    events = events.map(event => {
        // Usa generateEventImage para criar a imagem do GIBS
        const images = generateEventImage(event, event.id);

        return {
          ...event,
          // Garante que o campo 'images' sempre exista no objeto retornado
          images: images 
        };
    });

    const result = { events };
    cache.set(cacheKey, result); // salva no cache
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
});

// Endpoint unificado para detalhes e imagens
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { includeImages } = req.query;

    const event = await getEventById(id);

    let result = { ...event };

    if (includeImages === "true") {
      result.images = generateEventImage(event, id);
    }

    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erro ao buscar detalhes do evento" });
  }
});

module.exports = router;
