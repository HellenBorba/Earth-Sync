import { EventsResult } from "../../types/event";

const BACKEND_BASE_URL = "http://localhost:5000";

export async function getEvents(params?: {
  includeImages?: boolean;
  category?: string;
  start?: string;
  end?: string;
}): Promise<EventsResult> {
  const query = new URLSearchParams();

  if (params?.category && params.category !== "all") {
    query.set("category", params.category);
  }
  if (params?.start) query.set("start", params.start);
  if (params?.end) query.set("end", params.end);

  if (params?.includeImages !== undefined) {
    query.set("includeImages", String(params.includeImages));
  }

  const API_ENDPOINT =
    `${BACKEND_BASE_URL}/api/events` +
    (query.toString() ? `?${query.toString()}` : "");

  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      throw new Error(
        `Erro HTTP ${response.status} ao carregar eventos do backend.`
      );
    }

    const data = (await response.json()) as EventsResult;

    return {
      events: data.events ?? [],
      total: (data as any).total ?? data.events?.length ?? 0,
    };
  } catch (error) {
    console.error("FALHA CRÍTICA AO BUSCAR EVENTOS:", error);
    return { events: [], total: 0 };
  }
}