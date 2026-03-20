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
  return items.map(item => {
    const info = item.AddressInfo || {};
    const comments = Array.isArray(item.UserComments) ? item.UserComments : [];
    const connections = Array.isArray(item.Connections) ? item.Connections : [];
    const addressParts = [
      info.AddressLine1,
      info.Town,
      info.StateOrProvince,
      info.Country?.Title
    ].filter(Boolean);
    const ratings = comments.map(c => Number(c.Rating || 0)).filter(r => r > 0);
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A';
    return {
      name: info.Title || 'Unnamed',
      address: addressParts.join(', '),
      lat: info.Latitude || '',
      lon: info.Longitude || '',
      phone: info.ContactTelephone1 || 'N/A',
      website: info.RelatedURL || 'N/A',
      rating: avgRating,
      reviews: comments.length || 0,
      ports: connections.length || 'N/A',
      connector_types: 'N/A',
      opening_hours: 'N/A',
      category: '⚡ EV Charging Stations',
      source: 'OpenChargeMap'
    };
  });
}