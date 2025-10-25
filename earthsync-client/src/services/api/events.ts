import { EventsResult } from "../../types/event";

const BACKEND_BASE_URL = 'http://localhost:5000'; 

export async function getEvents(): Promise<EventsResult> {
    const API_ENDPOINT = `${BACKEND_BASE_URL}/api/events`; 

    try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status} ao carregar eventos do backend.`);
        }
        const data: EventsResult = await response.json();
        return data;
    } catch (error) {
        console.error("FALHA CRÍTICA AO BUSCAR EVENTOS:", error); 
        return { events: [] };
    }
}