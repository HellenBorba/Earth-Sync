export async function getAddressFromCoords(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    const data = await response.json();

    if (data && data.address) {
      const { city, state, country } = data.address;
      return [city, state, country].filter(Boolean).join(', ');
    }

    return 'Localização não encontrada';
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    return 'Erro ao obter localização';
  }
}
