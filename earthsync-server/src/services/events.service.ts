import axios, { AxiosResponse } from "axios";
import cache from "../utils/cache";

const EONET_BASE = "https://eonet.gsfc.nasa.gov/api/v3/events";
const DEFAULT_LIMIT = 50;
const MAX_PAGES_GUARD = 25;

interface EonetEventsResponse {
  title?: string;
  description?: string;
  link?: string;
  events?: any[];
  links?: { next?: string | null };
}

async function fetchAllEvents(params: {
  category?: string;
  start?: string;
  end?: string;
  limit?: number;
}) {
  const { category, start, end } = params;
  const limit = params.limit ?? DEFAULT_LIMIT;

  const allEvents: any[] = [];
  const seen = new Set<string>();

  let page = 1;
  let nextUrl: string | null = null;
  let meta: Omit<EonetEventsResponse, "events"> = {};

  for (let guard = 0; guard < MAX_PAGES_GUARD; guard++) {
    let resp: AxiosResponse<EonetEventsResponse>;

    if (nextUrl) {
      resp = await axios.get<EonetEventsResponse>(nextUrl);
    } else {
      resp = await axios.get<EonetEventsResponse>(EONET_BASE, {
        params: { category, start, end, limit, page },
      });
    }

    const data = resp.data ?? {};
    if (guard === 0) {
      const { events: _ignore, ...rest } = data;
      meta = rest;
    }

    const eventsPage = Array.isArray(data.events) ? data.events : [];
    if (eventsPage.length === 0) break;

    for (const ev of eventsPage) {
      if (ev?.id && !seen.has(ev.id)) {
        seen.add(ev.id);
        allEvents.push(ev);
      }
    }

    if (data.links?.next) {
      nextUrl = data.links.next;
      page += 1;
      continue;
    }

    if (eventsPage.length < limit) break;
    page += 1;
    nextUrl = null;
  }

  return { ...meta, events: allEvents };
}

export const eventsService = {
  async fetchEvents(params: { category?: string; start?: string; end?: string; limit?: number }) {
    const { category, start, end, limit } = params;

    const safeLimit = limit ? Math.min(limit, 100) : DEFAULT_LIMIT;
    const cacheKey = `events-${category || "all"}-${start || "any"}-${end || "any"}-limit-${safeLimit}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) return cachedData;

    const data = await fetchAllEvents({ category, start, end, limit: safeLimit });
    cache.set(cacheKey, data);
    return data;
  },

  async fetchEventById(id: string) {
    const cacheKey = `event-${id}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return cachedData;

    const response = await axios.get(`${EONET_BASE}/${id}`);
    cache.set(cacheKey, response.data);
    return response.data;
  },

  async fetchEventImages(id: string) {
    const eventResp = await axios.get(`${EONET_BASE}/${id}`);
    const event = eventResp.data;

    const geom = event.geometry && event.geometry[0];
    if (!geom) return [];

    const [lon, lat] = geom.coordinates;
    const date = geom.date.split("T")[0];

    const imageUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&FORMAT=image/jpeg&TRANSPARENT=FALSE&HEIGHT=512&WIDTH=512&CRS=EPSG:4326&BBOX=${lat-1},${lon-1},${lat+1},${lon+1}&TIME=${date}`;

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
  },
};