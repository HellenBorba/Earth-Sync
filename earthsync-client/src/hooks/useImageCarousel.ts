import { useState } from "react";
import { SatelliteImage } from "../types/event";

export function useImageCarousel(images: SatelliteImage[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<SatelliteImage | null>(null);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return {
    currentIndex,
    selectedImage,
    setSelectedImage,
    nextImage,
    prevImage,
    currentImage: images[currentIndex],
  };
}
