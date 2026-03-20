export function geocodeCity(cityName) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
  const response = fetch(url, { headers: { 'Accept-Language': 'en' } });
  const data = response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('City not found. Try a different name.');
  }
  const first = data[0];
  return { lat: parseFloat(first.lat), lon: parseFloat(first.lon), displayName: first.display_name };
}

export function fetchOSMPlaces(lat, lon, radius, osmTag, osmValue) {
  const query = `[out:json][timeout:60]; ( node["${osmTag}"="${osmValue}"](around:${radius},${lat},${lon}); way["${osmTag}"="${osmValue}"](around:${radius},${lat},${lon}); ); out center tags;`;
  const response = fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: `data=${encodeURIComponent(query)}`
  });
  // TODO
}

export function fetchOCMPlaces(lat, lon, radiusMeters) {
  // TODO
}