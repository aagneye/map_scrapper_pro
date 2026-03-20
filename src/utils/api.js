export function geocodeCity(cityName) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
  const response = fetch(url, { headers: { 'Accept-Language': 'en' } });
  // TODO
}

export function fetchOSMPlaces(lat, lon, radius, osmTag, osmValue) {
  // TODO
}

export function fetchOCMPlaces(lat, lon, radiusMeters) {
  // TODO
}