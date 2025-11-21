
import { Event } from "../types/event";
import { tCategory } from "./categoryTranslator";

export function getEventColor(category?: string): string {
  switch (category) {
    case "Wildfires": return "#ef4444";
    case "Severe Storms": return "#3b82f6";
    case "Earthquakes": return "#eab308";
    case "Floods": return "#06b6d4";
    case "Volcanoes": return "#f97316";
    default: return "#64748b";
  }
}

export function coordsToPixel(coords: [number, number], mapWidth: number, mapHeight: number) {
  const [lng, lat] = coords;
  const x = ((lng + 180) * mapWidth) / 360;
  const y = ((90 - lat) * mapHeight) / 180;
  return [x, y];
}

export function renderMapMarkers(mapElement: HTMLDivElement, events: Event[], onEventSelect: (event: Event) => void) {
  const rect = mapElement.getBoundingClientRect();

  
  mapElement.querySelectorAll(".event-marker").forEach(el => el.remove());

  events.forEach(event => {
    const coords = event.geometry?.[0]?.coordinates as [number, number] | undefined;
    if (!coords) return;

    const [x, y] = coordsToPixel(coords, rect.width, rect.height);
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    const color = getEventColor(event.categories[0]?.title);
    const marker = document.createElement("div");
    marker.className = "event-marker absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer";
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    marker.innerHTML = `
      <div class="relative">
        <div class="w-3 h-3 rounded-full animate-pulse" style="background-color: ${color}"></div>
        <div class="absolute inset-0 w-3 h-3 rounded-full animate-ping" style="background-color: ${color}; opacity: 0.4"></div>
      </div>
    `;
    marker.addEventListener("click", () => onEventSelect(event));
    mapElement.appendChild(marker);
  });
}

export function getMarkerColor(category: string): string {
  const catPt = tCategory(category);
  const colors: Record<string, string> = {
    "Incêndios": "bg-red-500",
    "Tempestades Severas": "bg-purple-500",
    "Vulcões": "bg-orange-500",
    "Terremotos": "bg-yellow-500",
    "Inundações": "bg-blue-500",
    "Seca": "bg-amber-500",
    "Névoa e Poeira": "bg-gray-500",
    "Nevasca": "bg-cyan-500",
    "Cor da Água": "bg-teal-500",
    "Deslizamento de Terra": "bg-stone-500",
    "Causado por Humanos": "bg-rose-500",
    "Gelo Marinho e Lacustre": "bg-indigo-500",
    "Temperatura Extrema": "bg-pink-500",
  };

  return colors[catPt] || "bg-slate-500";
}

export function normalizeCoordinate(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}
