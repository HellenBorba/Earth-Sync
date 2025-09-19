const express = require("express");
const axios = require("axios");
const cache = require("../cache");
const router = express.Router();

// URL base da API EONET
const EONET_BASE = "https://eonet.gsfc.nasa.gov/api/v3/events";

// GET /api/events?category=wildfires&start=2025-01-01&end=2025-09-11
router.get("/", async (req, res) => {
  try {
    const { category, start, end } = req.query;
    const cacheKey = `events-${category || "all"}-${start || "any"}-${end || "any"}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) return res.json(cachedData);

    // Consumir API da NASA com parâmetros
    const response = await axios.get(EONET_BASE, {
      params: {
        category,
        start,
        end,
        limit: 50,
      },
    });

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
});

// GET /api/events/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `event-${id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) return res.json(cachedData);

    const response = await axios.get(`${EONET_BASE}/${id}`);
    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erro ao buscar detalhes do evento" });
  }
});

// ...outros endpoints...

router.get("/:id/images", async (req, res) => {
  try {
    // 1. Buscar o evento pelo ID na EONET
    const { id } = req.params;
    const eventResp = await axios.get(`https://eonet.gsfc.nasa.gov/api/v3/events/${id}`);
    const event = eventResp.data;

    // 2. Pegar a primeira coordenada e data do evento
    const geom = event.geometry && event.geometry[0];
    if (!geom) return res.json([]);

    const [lon, lat] = geom.coordinates;
    const date = geom.date.split("T")[0]; // formato YYYY-MM-DD

    // 3. Montar a URL da imagem do NASA GIBS (exemplo com MODIS)
    const imageUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&FORMAT=image/jpeg&TRANSPARENT=FALSE&HEIGHT=512&WIDTH=512&CRS=EPSG:4326&BBOX=${lat-1},${lon-1},${lat+1},${lon+1}&TIME=${date}`;

    res.json([
      {
        id: `gibs-${id}`,
        url: imageUrl,
        thumbnail: imageUrl,
        title: "NASA GIBS - True Color",
        date,
        type: "RGB",
        source: "NASA GIBS",
        resolution: "1km"
      }
    ]);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

module.exports = router;
