// API utilities for PlaceMapper Pro

export async function geocodeCity(cityName) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
  const response = await fetch(url, {
    headers: { 'Accept-Language': 'en' }
  });
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('City not found. Try a different name.');
  }
  const first = data[0];
  return {
    lat: parseFloat(first.lat),
    lon: parseFloat(first.lon),
    displayName: first.display_name
  };
}

export function fetchOSMPlaces(lat, lon, radius, osmTag, osmValue) {
  const url = 'https://overpass-api.de/api/interpreter';
  const response = fetch(url, {
    method: 'POST'
  });
}