function formatAddress(parts) {
  return parts.filter(Boolean).join(', ') || 'N/A';
}

export function parseOSMResults(elements, categoryLabel) {
  return elements.map((element) => {
    const tags = element.tags || {};

    return {
      name: tags.name || tags['name:en'] || 'Unnamed',
      address: formatAddress([
        tags['addr:housenumber'],
        tags['addr:street'],
        tags['addr:city'],
        tags['addr:country'],
      ]),
      lat: element.lat || element.center?.lat || 'N/A',
      lon: element.lon || element.center?.lon || 'N/A',
      phone: tags.phone || tags['contact:phone'] || 'N/A',
      website: tags.website || tags['contact:website'] || 'N/A',
      rating: 'N/A',
      reviews: 'N/A',
      ports: tags.capacity || 'N/A',
      connectors: 'N/A',
      hours: tags.opening_hours || 'N/A',
      category: categoryLabel,
      source: 'OpenStreetMap',
    };
  });
}

export function parseOCMResults(items, categoryLabel) {
  return items.map((item) => {
    const info = item.AddressInfo || {};
    const comments = Array.isArray(item.UserComments) ? item.UserComments : [];
    const connections = Array.isArray(item.Connections) ? item.Connections : [];
    const ratings = comments
      .map((comment) => Number(comment.Rating || 0))
      .filter((rating) => rating > 0);

    return {
      name: info.Title || 'Unnamed',
      address: formatAddress([
        info.AddressLine1,
        info.Town,
        info.StateOrProvince,
        info.Country?.Title,
      ]),
      lat: info.Latitude || 'N/A',
      lon: info.Longitude || 'N/A',
      phone: info.ContactTelephone1 || 'N/A',
      website: info.RelatedURL || 'N/A',
      rating:
        ratings.length > 0
          ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
          : 'N/A',
      reviews: comments.length || 'N/A',
      ports: connections.length || 'N/A',
      connectors:
        [...new Set(connections.map((connection) => connection.ConnectionType?.Title).filter(Boolean))]
          .join(', ') || 'N/A',
      hours: 'N/A',
      category: categoryLabel,
      source: 'OpenChargeMap',
    };
  });
}
