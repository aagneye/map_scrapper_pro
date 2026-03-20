// Exporter utilities for PlaceMapper Pro

import * as XLSX from 'xlsx';

export function exportToExcel(data, cityName, categoryLabel) {
  const headers = [
    "#", "Name", "Address", "Latitude", "Longitude", "Phone", "Website",
    "Rating", "Reviews", "Ports", "Connector Types", "Opening Hours", "Category", "Source"
  ];

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

  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Style header row
  headers.forEach((_, colIndex) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
    if (!ws[cellAddress]) ws[cellAddress] = {};
    ws[cellAddress].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { patternType: 'solid', fgColor: { rgb: '1E3A5F' } },
      alignment: { horizontal: 'center' }
    };
  });

  // Auto column widths
  const colWidths = headers.map((_, colIndex) => {
    let maxLen = headers[colIndex].length;
    rows.forEach(row => {
      const cellValue = String(row[colIndex] || '');
      if (cellValue.length > maxLen) maxLen = cellValue.length;
    });
    return { wch: maxLen + 4 };
  });
  ws['!cols'] = colWidths;
}