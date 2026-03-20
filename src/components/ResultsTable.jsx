const columns = [
  '#',
  'Name',
  'Address',
  'Lat',
  'Lon',
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

function sourceBadgeClass(source) {
  if (source === 'OpenChargeMap') {
    return 'border-[rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.12)] text-[#00ff88]';
  }

  return 'border-[rgba(0,212,255,0.22)] bg-[rgba(0,212,255,0.12)] text-[#38bdf8]';
}

export function ResultsTable({ results, categoryLabel }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#1f2937] bg-[#111827]">
      <div className="max-h-[520px] overflow-auto">
        <table className="min-w-full border-separate border-spacing-0 text-sm text-[#cbd5e1]">
          <thead className="sticky top-0 z-10 bg-[#0d1117]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="border-b border-[#1f2937] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64748b]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr
                key={`${result.name}-${result.address}-${index}`}
                className={`transition-colors hover:bg-[rgba(0,255,136,0.04)] ${
                  index % 2 === 0 ? 'bg-[#111827]' : 'bg-[#0d1117]'
                }`}
              >
                <td className="border-b border-[#1f2937] px-4 py-3 align-top">{index + 1}</td>
                <td className="border-b border-[#1f2937] px-4 py-3 align-top whitespace-nowrap text-[#f8fafc]">
                  {result.name || 'N/A'}
                </td>
                <td className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap border-b border-[#1f2937] px-4 py-3 align-top">
                  {result.address || 'N/A'}
                </td>
                <td className="border-b border-[#1f2937] px-4 py-3 align-top">{result.lat || 'N/A'}</td>
                <td className="border-b border-[#1f2937] px-4 py-3 align-top">{result.lon || 'N/A'}</td>
                <td className="border-b border-[#1f2937] px-4 py-3 align-top">{result.phone || 'N/A'}</td>
                <td className="border-b border-[#1f2937] px-4 py-3 align-top">
                  {result.website && result.website !== 'N/A' ? (
                    <a
                      href={result.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[#67e8f9] transition hover:text-[#a5f3fc]"
                    >
                      🔗 Link
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="border-b border-[#1f2937] px-4 py-3 align-top">{result.rating || 'N/A'}</td>
                <td className="border-b border-[#1f2937] px-4 py-3 align-top">{result.reviews || 'N/A'}</td>
                <td className="border-b border-[#1f2937] px-4 py-3 align-top">{result.ports || 'N/A'}</td>
                <td className="border-b border-[#1f2937] px-4 py-3 align-top">{result.connectors || 'N/A'}</td>
                <td className="border-b border-[#1f2937] px-4 py-3 align-top">{result.hours || 'N/A'}</td>
                <td className="border-b border-[#1f2937] px-4 py-3 align-top">
                  {result.category || categoryLabel}
                </td>
                <td className="border-b border-[#1f2937] px-4 py-3 align-top">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${sourceBadgeClass(
                      result.source,
                    )}`}
                  >
                    {result.source || 'Unknown'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
