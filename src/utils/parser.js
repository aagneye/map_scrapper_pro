// Parser utilities for PlaceMapper Pro

export function parseOSMResults(elements, categoryLabel) {
  return elements.map(el => {
    const tags = el.tags || {};
    const addressParts = [
      tags['addr:housenumber'],
      tags['addr:street'],
      tags['addr:city'],
      tags['addr:country']
    ].filter(Boolean);
    return {
      name: tags.name || tags['name:en'] || 'Unnamed',
      address: addressParts.join(', '),
      lat: el.lat || el.center?.lat || '',
      lon: el.lon || el.center?.lon || '',
      phone: tags.phone || tags['contact:phone'] || 'N/A',
      website: tags.website || tags['contact:website'] || 'N/A',
      rating: 'N/A',
      reviews: 'N/A',
      ports: tags.capacity || 'N/A',
      connector_types: 'N/A',
      opening_hours: tags.opening_hours || 'N/A',
      category: categoryLabel,
      source: 'OpenStreetMap'
    };
  });
}

export function parseOCMResults(items) {
  // TODO: implement
}