import express, { Request, Response } from "express";
import axios from "axios";
import cache from "../utils/cache"; // ← ajuste aqui

const router = express.Router();

const EONET_BASE = "https://eonet.gsfc.nasa.gov/api/v3/events";

// Tipagem básica para geometria de evento
interface Geometry {
  coordinates: [number, number];
  date: string;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  categories?: any[];
  geometry?: Geometry[];
  [key: string]: any; // para campos adicionais
}

// Função utilitária para buscar evento por ID, usando cache
async function getEventById(id: string): Promise<Event> {
  const cacheKey = `event-${id}`;
  const cachedData = cache.get<Event>(cacheKey); // ⬅️ diz que o cache retorna um Event
  if (cachedData) return cachedData;

  const response = await axios.get(`${EONET_BASE}/${id}`);
  const event: Event = response.data;
  cache.set(cacheKey, event);
  return event;
}

// Função utilitária para gerar imagem do evento
function generateEventImage(event: Event, id: string) {
  const geom = event.geometry?.[0];
  if (!geom) return [];

  const [lon, lat] = geom.coordinates;
  const date = geom.date.split("T")[0];

  const imageUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&FORMAT=image/jpeg&TRANSPARENT=FALSE&HEIGHT=512&WIDTH=512&CRS=EPSG:4326&BBOX=${lat - 1},${lon - 1},${lat + 1},${lon + 1}&TIME=${date}`;

  return [
    {
      id: `gibs-${id}`,
      url: imageUrl,
      thumbnail: imageUrl,
      title: "NASA GIBS - True Color",
      date,
      type: "RGB",
      source: "NASA GIBS",
      resolution: "1km",
    },
  ];
}

// Listar eventos com filtro
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, start, end } = req.query as {
      category?: string;
      start?: string;
      end?: string;
    };

    const cacheKey = `events-${category || "all"}-${start || "any"}-${end || "any"}-images-true`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    const response = await axios.get(EONET_BASE, {
      params: { category, start, end, limit: 50 },
    });

    let events: Event[] = response.data.events;

    events = events.map((event) => {
      const images = generateEventImage(event, event.id);
      return { ...event, images };
    });

    const result = { events };
    cache.set(cacheKey, result);
    res.json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
});

// Endpoint unificado para detalhes e imagens
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { includeImages } = req.query;

    const event = await getEventById(id);

    let result: any = { ...event };

    if (includeImages === "true") {
      result.images = generateEventImage(event, id);
    }

    res.json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: "Erro ao buscar detalhes do evento" });
  }
});

export default router;
