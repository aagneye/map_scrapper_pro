import React from 'react';

export function ResultsTable({ results, city, categoryLabel }) {
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <span className="px-3 py-1 bg-green-900/20 border border-green-700 rounded-full text-green-400 text-sm">
          📊 {results.length} results found
        </span>
        <span className="px-3 py-1 bg-blue-900/20 border border-blue-700 rounded-full text-blue-400 text-sm">
          📍 {city}
        </span>
      </div>
      <div className="max-h-[520px] overflow-auto border border-[#1f2937] rounded-2xl bg-[#111827]">
        <table className="w-full">
          <thead className="sticky top-0 bg-[#0d1117]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Address</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Lat</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Lon</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Website</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Rating</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Reviews</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Ports</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Connectors</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Hours</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Source</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className={`hover:bg-[rgba(0,255,136,0.04)] ${index % 2 === 0 ? 'bg-[#0d1117]' : 'bg-[#111827]'}`}>
                <td className="px-4 py-3 text-[#e2e8f0]">{index + 1}</td>
                <td className="px-4 py-3 text-[#e2e8f0] whitespace-nowrap">{result.name || 'N/A'}</td>
                <td className="px-4 py-3 text-[#e2e8f0] max-w-[200px] truncate">{result.address || 'N/A'}</td>
                <td className="px-4 py-3 text-[#e2e8f0]">{result.lat || 'N/A'}</td>
                <td className="px-4 py-3 text-[#e2e8f0]">{result.lon || 'N/A'}</td>
                <td className="px-4 py-3 text-[#e2e8f0]">{result.phone || 'N/A'}</td>
                <td className="px-4 py-3 text-[#e2e8f0]">
                  {result.website && result.website !== 'N/A' ? (
                    <a href={result.website} target="_blank" rel="noopener noreferrer" className="text-[#00ff88] hover:underline">
                      🔗 Link
                    </a>
                  ) : 'N/A'}
                </td>
                <td className="px-4 py-3 text-[#e2e8f0]">{result.rating || 'N/A'}</td>
                <td className="px-4 py-3 text-[#e2e8f0]">{result.reviews || 'N/A'}</td>
                <td className="px-4 py-3 text-[#e2e8f0]">{result.ports || 'N/A'}</td>
                <td className="px-4 py-3 text-[#e2e8f0]">{result.connectors || 'N/A'}</td>
                <td className="px-4 py-3 text-[#e2e8f0]">{result.hours || 'N/A'}</td>
                <td className="px-4 py-3 text-[#e2e8f0]">{result.category || categoryLabel}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    result.source === 'OpenChargeMap' ? 'bg-green-900/20 text-green-400' : 'bg-blue-900/20 text-blue-400'
                  }`}>
                    {result.source}
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