// API utilities for PlaceMapper Pro

export async function geocodeCity(cityName) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
  const response = await fetch(url, {
    headers: { 'Accept-Language': 'en' }
  });
  const data = await response.json();
}