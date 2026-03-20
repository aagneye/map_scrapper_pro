import React from 'react';

export function ExportBar({ results, city, categoryLabel, onExport }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-900/20 border border-green-700 rounded-full text-green-400 text-sm">
            📊 {results.length} results found
          </span>
          <span className="px-3 py-1 bg-blue-900/20 border border-blue-700 rounded-full text-blue-400 text-sm">
            📍 {city}
          </span>
        </div>
        <button
          onClick={onExport}
          className="px-6 py-2 bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7c3aed]/50 transition-all"
        >
          ⬇️ Export to Excel
        </button>
      </div>
      <div className="p-4 bg-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.2)] rounded-lg text-[#a78bfa]">
        💡 Tip: Export opens directly in Excel or Google Sheets, fully formatted.
      </div>
    </div>
  );
}