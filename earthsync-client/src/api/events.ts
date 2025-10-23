import { API_BASE_URL } from "./config";
import { SatelliteImage } from "../types/event";

export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) {
    throw new Error("Erro ao buscar eventos");
  }
  return response.json();
}

export async function getEventImages(eventId: string): Promise<SatelliteImage[]> {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}/images`);
  if (!res.ok) throw new Error("Erro ao buscar imagens do evento");
  return res.json();
}
