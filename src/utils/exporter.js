import * as XLSX from 'xlsx';

const HEADERS = [
  '#',
  'Name',
  'Address',
  'Latitude',
  'Longitude',
  'Phone',
  'Website',
  'Rating',
  'Reviews',
  'Ports',
  'Connectors',
  'Hours',
  'Category',
  'Source',
];

function sanitize(value) {
  return String(value || 'N/A').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

export function exportToExcel(data, cityName, categoryLabel) {
  const rows = data.map((item, index) => [
    index + 1,
    item.name || 'N/A',
    item.address || 'N/A',
    item.lat || 'N/A',
    item.lon || 'N/A',
    item.phone || 'N/A',
    item.website || 'N/A',
    item.rating || 'N/A',
    item.reviews || 'N/A',
    item.ports || 'N/A',
    item.connectors || 'N/A',
    item.hours || 'N/A',
    item.category || categoryLabel,
    item.source || 'N/A',
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([HEADERS, ...rows]);

  HEADERS.forEach((_, colIndex) => {
    const address = XLSX.utils.encode_cell({ r: 0, c: colIndex });
    worksheet[address] = worksheet[address] || {};
    worksheet[address].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { patternType: 'solid', fgColor: { rgb: '0F172A' } },
      alignment: { horizontal: 'center' },
    };
  });

  worksheet['!cols'] = HEADERS.map((header, colIndex) => {
    const maxLength = rows.reduce((longest, row) => {
      return Math.max(longest, String(row[colIndex] || '').length);
    }, header.length);

    return { wch: Math.min(maxLength + 4, 42) };
  });

  worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'PlaceMapper Data');

  const dateStamp = new Date().toISOString().split('T')[0];
  const safeCity = sanitize(cityName);
  const safeCategory = sanitize(categoryLabel);
  const filename = `${safeCity || 'city'}_${safeCategory || 'category'}_${dateStamp}.xlsx`;

  XLSX.writeFile(workbook, filename);
}
