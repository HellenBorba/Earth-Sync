// NASA EONET category translator for Portuguese

export function tCategory(category: string = ''): string {
  const key = category.trim().toLowerCase();

  const map: Record<string, string> = {
    'wildfires': 'Incêndios',
    'severe storms': 'Tempestades Severas',
    'earthquakes': 'Terremotos',
    'floods': 'Inundações',
    'volcanoes': 'Vulcões',
    'dust and haze': 'Névoa e Poeira',
    'drought': 'Secas',
    'landslides': 'Deslizamentos',
    'snow': 'Nevascas',
    'tropical cyclone': 'Ciclone Tropical',
    'tropical cyclones': 'Ciclones Tropicais',
    'extreme temperature': 'Temperatura Extrema',
    'sea and lake ice': 'Gelo Marinho e Lacustre',
    'water bodies': 'Corpos d\'Água',
    'tsunami': 'Tsunami',
    'manmade': 'Ações Humanas',
    'water color': 'Cor da Água',
  };

  return map[key] || category;
}
