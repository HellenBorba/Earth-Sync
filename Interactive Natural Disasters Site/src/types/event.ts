export interface EventGeometry {
  magnitudeValue?: number;
  magnitudeUnit?: string;
  date: string;
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface EventCategory {
  id: string;
  title: string;
}

export interface EventSource {
  id: string;
  url: string;
}

export interface SatelliteImage {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  source: string;
  date: string;
  resolution: string;
  type: 'WMS' | 'WMTS' | 'RGB' | 'INFRARED' | 'THERMAL';
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  link?: string;
  categories: EventCategory[];
  sources: EventSource[];
  geometry: EventGeometry[];
  satelliteImages?: SatelliteImage[];
  status?: 'active' | 'closed' | 'monitoring';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  affectedArea?: string;
  estimatedImpact?: string;
}

export interface EONETResponse {
  title: string;
  description: string;
  link: string;
  events: Event[];
}