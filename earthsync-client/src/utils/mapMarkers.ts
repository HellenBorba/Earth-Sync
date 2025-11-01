
import { Event } from "../types/event";

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
  const colors: Record<string, string> = {
    "Wildfires": "bg-red-500",
    "Severe Storms": "bg-purple-500",
    "Volcanoes": "bg-orange-500",
    "Earthquakes": "bg-yellow-500",
    "Floods": "bg-blue-500",
    "Droughts": "bg-amber-500",
    "Dust and Haze": "bg-gray-500",
    "Snow": "bg-cyan-500",
    "Water Color": "bg-teal-500",
    "Landslides": "bg-stone-500",
    "Manmade": "bg-rose-500",
    "Sea and Lake Ice": "bg-indigo-500",
    "Temperature Extremes": "bg-pink-500",
  };
  return colors[category] || "bg-slate-500";
}

export function normalizeCoordinate(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}
