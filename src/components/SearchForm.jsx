import React from 'react';
import { CategoryPicker } from './CategoryPicker.jsx';

export function SearchForm({ city, onCityChange, radius, onRadiusChange, selectedCategory, onCategorySelect, categories, onSearch, loading, statusMessage, errorMessage }) {
  const radiusOptions = [
    { value: 1000, label: '1km' },
    { value: 2000, label: '2km' },
    { value: 5000, label: '5km' },
    { value: 10000, label: '10km' },
    { value: 20000, label: '20km' },
    { value: 50000, label: '50km' },
  ];

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8">
      <h2 className="text-xs font-semibold text-[#64748b] uppercase mb-6">
        SEARCH CONFIGURATION
      </h2>
      <CategoryPicker categories={categories} selectedIndex={selectedCategory} onSelect={onCategorySelect} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block text-xs font-semibold text-[#64748b] uppercase mb-2">
            CITY NAME
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            placeholder="e.g. Amsterdam, Tokyo, Mumbai..."
            className="w-full px-4 py-3 bg-[#0d1117] border border-[#1f2937] rounded-lg text-[#e2e8f0] placeholder-[#64748b] focus:ring-2 focus:ring-[#00ff88] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#64748b] uppercase mb-2">
            SEARCH RADIUS
          </label>
          <select
            value={radius}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
            className="w-full px-4 py-3 bg-[#0d1117] border border-[#1f2937] rounded-lg text-[#e2e8f0] focus:ring-2 focus:ring-[#00ff88] focus:border-transparent"
          >
            {radiusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={onSearch}
        disabled={loading}
        className={`mt-6 w-full py-3 rounded-lg font-semibold text-white transition-all ${
          loading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#00ff88] to-[#00d4ff] hover:shadow-lg hover:shadow-[#00ff88]/50'
        }`}
      >
        {loading ? '⏳ Searching...' : '🔍 Search Now'}
      </button>
      {statusMessage && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-lg text-green-400">
          {statusMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
          {errorMessage}
        </div>
      )}
    </div>
  );
}