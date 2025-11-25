import express, { Request, Response } from "express";
import axios from "axios";
import cache from "../utils/cache";

const router = express.Router();

const EONET_BASE = "https://eonet.gsfc.nasa.gov/api/v3/events";
const EONET_MAX_PER_PAGE = 50;

// basic event geometry type
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
  sources?: any[];
  link?: string;
  status?: string;
  [key: string]: any;
}

interface LinksObject {
  next?: string;
  prev?: string;
  self?: string;
}
interface LinksArrayItem {
  rel: string;
  href: string;
}

interface EonetEventsResponse {
  title?: string;
  description?: string;
  link?: string;
  events?: Event[];
  links?: LinksObject | LinksArrayItem[];
}

function extractNextUrl(links?: LinksObject | LinksArrayItem[]): string | null {
  if (!links) return null;

  if (!Array.isArray(links)) {
    return links.next || null;
  }

  const next = links.find(l => l.rel === "next");
  return next?.href || null;
}

// get event by id using cache
async function getEventById(id: string): Promise<Event> {
  const cacheKey = `event-${id}`;
  const cachedData = cache.get<Event>(cacheKey);
  if (cachedData) return cachedData;

  const response = await axios.get<Event>(`${EONET_BASE}/${id}`);
  const event = response.data;
  cache.set(cacheKey, event);
  return event;
}

// generate nasa gibs image for event
function generateEventImage(event: Event, id: string) {
  const geom = event.geometry?.[0];
  if (!geom) return [];

  const [lon, lat] = geom.coordinates;
  const date = geom.date.split("T")[0];

  const imageUrl =
    `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?` +
    `SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&` +
    `LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&` +
    `FORMAT=image/jpeg&TRANSPARENT=FALSE&HEIGHT=512&WIDTH=512&` +
    `CRS=EPSG:4326&BBOX=${lat - 1},${lon - 1},${lat + 1},${lon + 1}&` +
    `TIME=${date}`;

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

async function fetchAllEventsFromEonet(params: {
  category?: string;
  start?: string;
  end?: string;
  limitTotal?: number;
}): Promise<{ title?: string; description?: string; link?: string; events: Event[] }> {
  const { category, start, end, limitTotal } = params;

  const allEvents: Event[] = [];
  const seen = new Set<string>();

  let page = 1;
  let nextUrl: string | null = null;

  let metaTitle: string | undefined;
  let metaDescription: string | undefined;
  let metaLink: string | undefined;

  while (true) {
    const resp = nextUrl
      ? await axios.get<EonetEventsResponse>(nextUrl)
      : await axios.get<EonetEventsResponse>(EONET_BASE, {
          params: {
            category,
            start,
            end,
            limit: EONET_MAX_PER_PAGE,
            page,
          },
        });

    const data = resp.data || {};
    if (!metaTitle) metaTitle = data.title;
    if (!metaDescription) metaDescription = data.description;
    if (!metaLink) metaLink = data.link;

    const eventsPage = data.events || [];

    for (const ev of eventsPage) {
      if (ev?.id && !seen.has(ev.id)) {
        seen.add(ev.id);
        allEvents.push(ev);
      }

      if (limitTotal && allEvents.length >= limitTotal) {
        return {
          title: metaTitle,
          description: metaDescription,
          link: metaLink,
          events: allEvents.slice(0, limitTotal),
        };
      }
    }

    nextUrl = extractNextUrl(data.links);
    if (!nextUrl) break;
    if (eventsPage.length === 0) break;

    page += 1;
  }

  return { title: metaTitle, description: metaDescription, link: metaLink, events: allEvents };
}

// list events with optional filters (+ pagination real)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, start, end, limit } = req.query as {
      category?: string;
      start?: string;
      end?: string;
      limit?: string;
    };

    const limitTotal = limit ? Math.max(1, parseInt(limit, 10)) : undefined;

    const cacheKey = `events-${category || "all"}-${start || "any"}-${end || "any"}-limit-${limitTotal || "all"}-images-true`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    const baseData = await fetchAllEventsFromEonet({ category, start, end, limitTotal });

    let events: Event[] = baseData.events;

    events = events.map((event) => {
      const images = generateEventImage(event, event.id);
      return { ...event, images };
    });

    const result = {
      title: baseData.title,
      description: baseData.description,
      link: baseData.link,
      total: events.length,
      events,
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
});

// get event details with optional images
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { includeImages } = req.query as { includeImages?: string };

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