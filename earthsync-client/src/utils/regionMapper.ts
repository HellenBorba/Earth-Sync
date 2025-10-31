// src/utils/regionMapper.ts
import { Event } from "../types/event";

export function getRegionFromCoordinates(event: Event): string {
  const coords = event.geometry?.[0]?.coordinates as [number, number] | undefined;
  if (!coords) return "Desconhecida";

  const [lng, lat] = coords;

  if (lat >= 60) return "Ártico";
  if (lat <= -60) return "Antártida";
  if (lat > 0 && lng < -30) return "América do Norte";
  if (lat < 0 && lng < -30) return "América do Sul";
  if (lat > 0 && lng >= -30 && lng < 60) return "Europa";
  if (lat < 0 && lng >= -30 && lng < 60) return "África";
  if (lat > 0 && lng >= 60) return "Ásia";
  if (lat < 0 && lng >= 60) return "Oceania";

  return lat > 0 ? "Norte" : "Sul";
}
