// Exporter utilities for PlaceMapper Pro

import * as XLSX from 'xlsx';

export function exportToExcel(data, cityName, categoryLabel) {
  const headers = [
    "#", "Name", "Address", "Latitude", "Longitude", "Phone", "Website",
    "Rating", "Reviews", "Ports", "Connector Types", "Opening Hours", "Category", "Source"
  ];

  const rows = data.map((item, index) => [
    index + 1,
    item.name,
    item.address,
    item.lat,
    item.lon,
    item.phone,
    item.website,
    item.rating,
    item.reviews,
    item.ports,
    item.connector_types,
    item.opening_hours,
    item.category,
    item.source
  ]);
}