// src/hooks/useEventDetails.ts
import { useEffect, useState, useMemo } from "react";
import { Event, SatelliteImage } from "../types/event";
import { formatDate } from "../utils/formatDate";


interface UseEventDetailsProps {
  event: Event;
}

export function useEventDetails({ event }: UseEventDetailsProps) {
  const [images, setImages] = useState<SatelliteImage[]>([]);
  const [loading, setLoading] = useState(true);

  // load images
  useEffect(() => {
    const API = "http://localhost:5000";
    async function loadImages() {
      if (!event?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/events/${event.id}?includeImages=true`);
        const data = await res.json();
        setImages(data.images || []);
      } catch (error) {
        console.error("Erro ao buscar imagens:", error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    }
    loadImages();
  }, [event.id]);

  // coordenadas
  const coordinates = useMemo(() => {
    if (!event.geometry) return [];
    return event.geometry.map((geom) => ({
      lat: geom.coordinates[1],
      lng: geom.coordinates[0],
      date: geom.date,
    }));
  }, [event]);


  return {
    images,
    loading,
    coordinates,
    formatDate,
  };
}
