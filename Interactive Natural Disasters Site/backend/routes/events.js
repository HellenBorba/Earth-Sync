const express = require("express");
const axios = require("axios");
const cache = require("../cache");
const router = express.Router();

// URL base da API EONET (NASA)
const EONET_BASE = "https://eonet.gsfc.nasa.gov/api/v3/events";


router.get("/", async (req, res) => {
  try {
    const { category, start, end } = req.query;

    // Verifica se os dados estão em cache
    const cacheKey = `events-${category || "all"}-${start || "any"}-${end || "any"}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    // Consulta a API da NASA com os parâmetros fornecidos
    const response = await axios.get(EONET_BASE, {
      params: {
        category,
        start,
        end,
        limit: 50,
      },
    });

    // Salva os dados no cache e retorna
    cache.set(cacheKey, response.data);
    res.json(response.data);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica cache local
    const cacheKey = `event-${id}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    // Busca os detalhes do evento na API
    const response = await axios.get(`${EONET_BASE}/${id}`);
    cache.set(cacheKey, response.data);
    res.json(response.data);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erro ao buscar detalhes do evento" });
  }
});

/**
 * @route GET /api/events/:id/images
 * @desc Gera imagem do evento com base na localização e data via NASA GIBS
 */
router.get("/:id/images", async (req, res) => {
  try {
    const { id } = req.params;

    // Busca os dados do evento
    const eventResp = await axios.get(`${EONET_BASE}/${id}`);
    const event = eventResp.data;

    // Obtém a primeira coordenada e a data
    const geom = event.geometry && event.geometry[0];
    if (!geom) return res.json([]);

    const [lon, lat] = geom.coordinates;
    const date = geom.date.split("T")[0]; // Formato: YYYY-MM-DD

    // Gera URL da imagem com base na posição e data
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

