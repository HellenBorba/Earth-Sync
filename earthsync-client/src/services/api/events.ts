import { API_BASE_URL } from "./config";
import { SatelliteImage } from "../../types/event";

export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) {
    throw new Error("Erro ao buscar eventos");
  }
  return response.json();
}
