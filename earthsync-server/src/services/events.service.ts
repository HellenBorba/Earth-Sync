import axios from "axios";
// @ts-ignore: no declaration file for '../utils/cache'
import cache from "../utils/cache";

const EONET_BASE = "https://eonet.gsfc.nasa.gov/api/v3/events";

export const eventsService = {
  async fetchEvents(params: { category?: string; start?: string; end?: string }) {
    const { category, start, end } = params;
    const cacheKey = `events-${category || "all"}-${start || "any"}-${end || "any"}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return cachedData;

    const response = await axios.get(EONET_BASE, {
      params: { category, start, end, limit: 50 },
    });

    cache.set(cacheKey, response.data);
    return response.data;
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
