export async function geocodeCity(cityName) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
  const response = await fetch(url, {
    headers: {
      'Accept-Language': 'en',
    },
  });

  if (!response.ok) {
    throw new Error('Unable to geocode that city right now.');
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('City not found. Try a different name.');
  }

  const firstMatch = data[0];

  return {
    lat: Number(firstMatch.lat),
    lon: Number(firstMatch.lon),
    displayName: firstMatch.display_name,
  };
}

export async function fetchOSMPlaces(osmTag, osmValue, lat, lon, radius) {
  const url = 'https://overpass-api.de/api/interpreter';
  const query = `[out:json][timeout:60];
  (
    node["${osmTag}"="${osmValue}"](around:${radius},${lat},${lon});
    way["${osmTag}"="${osmValue}"](around:${radius},${lat},${lon});
    relation["${osmTag}"="${osmValue}"](around:${radius},${lat},${lon});
  );
  out center tags;`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error('OpenStreetMap search failed. Please try again.');
  }

  const data = await response.json();
  return data.elements || [];
}

export async function fetchOCMPlaces(lat, lon, radiusMeters) {
  const radiusKm = radiusMeters / 1000;
  const url = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lon}&distance=${radiusKm}&distanceunit=KM&maxresults=500&compact=true&verbose=false`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('OpenChargeMap search failed. Please try again.');
  }

  return response.json();
}
