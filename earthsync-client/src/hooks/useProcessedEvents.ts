import { useEffect, useState, useMemo } from "react";
import { Event } from "../types/event";
import { tCategory } from "../utils/categoryTranslator";
import { getRegionFromCoordinates } from "../utils/regionMapper";

export function useProcessedEvents(events: Event[]) {
  const [processedEvents, setProcessedEvents] = useState<Event[]>([]);

  // category mapping
  const categoryMapPtToEn: Record<string, string> = useMemo(() => ({
    "Incêndios": "Wildfires",
    "Tempestades Severas": "Severe Storms",
    "Ciclone Tropical": "Tropical Cyclone",
    "Ciclones Tropicais": "Tropical Cyclones",
    "Terremotos": "Earthquakes",
    "Inundações": "Floods",
    "Vulcões": "Volcanoes",
    "Névoa e Poeira": "Dust and Haze",
    "Secas": "Drought",
    "Deslizamentos": "Landslides",
    "Nevascas": "Snow",
    "Ações Humanas": "Manmade",
    "Gelo Marinho e Lacustre": "Sea and Lake Ice",
    "Temperatura Extrema": "Extreme Temperature",
  }), []);

  // process and translate events
  useEffect(() => {
    if (!events || events.length === 0) {
      setProcessedEvents([]);
      return;
    }

    const processed = events.map(event => {
      const mainCategoryTitleEn = event.categories[0]?.title || "";
      const mainCategoryTitlePt = tCategory(mainCategoryTitleEn);

      let translatedTitle = event.title;

      translatedTitle = translatedTitle
        .replace(/\bTropical Cyclone(s)?\b/gi, "Ciclone Tropical")
        .replace(/\bSevere Storm(s)?\b/gi, "Tempestade Severa")
        .replace(/\bSea and Lake Ice\b/gi, "Gelo Marinho e Lacustre")
        .replace(/\bDust and Haze\b/gi, "Névoa e Poeira")
        .replace(/\bTemperature Extremes?\b/gi, "Temperatura Extrema")
        .replace(/\bWater Color\b/gi, "Cor da Água")
        .replace(/\bWildfire(s)?\b/gi, "Incêndio")
        .replace(/\bFire(s)?\b/gi, "Incêndio")
        .replace(/\bFlood(s)?\b/gi, "Inundação")
        .replace(/\bEarthquake(s)?\b/gi, "Terremoto")
        .replace(/\bVolcano(es)?\b/gi, "Vulcão")
        .replace(/\bStorm(s)?\b/gi, "Tempestade")
        .replace(/\bCyclone(s)?\b/gi, "Ciclone")
        .replace(/\bDrought(s)?\b/gi, "Seca")
        .replace(/\bSnow(s)?\b/gi, "Nevasca")
        .replace(/\bLandslide(s)?\b/gi, "Deslizamento")
        .replace(/\bDust\b/gi, "Poeira")
        .replace(/\bHaze\b/gi, "Névoa")
        .replace(/\bIce\b/gi, "Gelo")
        .replace(/\bManmade\b/gi, "Ação Humana");

    
      const hasLocation = /,|\bfrom\b|\bin\b/i.test(translatedTitle);
      if (hasLocation) {
        const regexEvent = /^(.*?)(Incêndio|Inundação|Terremoto|Vulcão|Tempestade|Ciclone|Seca|Nevasca|Deslizamento|Névoa|Gelo|Ação Humana)(.*)$/i;
        const match = translatedTitle.match(regexEvent);
        if (match) {
          const before = match[1].trim();
          const disaster = match[2].trim();
          const after = match[3].trim();
          if (before && after) {
            translatedTitle = `${disaster} em ${before.replace(/[-,]+$/, "")}${after ? ", " + after : ""}`;
          } else if (before) {
            translatedTitle = `${disaster} em ${before}`;
          } else {
            translatedTitle = disaster;
          }
        }
      }

      if (mainCategoryTitleEn && mainCategoryTitlePt && mainCategoryTitleEn !== mainCategoryTitlePt) {
        const regex = new RegExp(mainCategoryTitleEn, "gi");
        translatedTitle = translatedTitle.replace(regex, mainCategoryTitlePt);
      }

      return { ...event, title: translatedTitle };
    });

    setProcessedEvents(processed);
  }, [events]);

  
  const eventTypes = useMemo(() => {
    const typesEn = [...new Set(processedEvents.flatMap(e => e.categories.map(c => c.title)))];
    return typesEn.map(tCategory);
  }, [processedEvents]);

 
  const regions = useMemo(() => {
    return [...new Set(processedEvents.map(e => getRegionFromCoordinates(e)))];
  }, [processedEvents]);

  return { processedEvents, eventTypes, regions, categoryMapPtToEn };
}
