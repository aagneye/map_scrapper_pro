import React from 'react';

export function CategoryPicker({ categories, selectedIndex, onSelect }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#64748b] uppercase mb-2">
        CATEGORY
      </label>
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
              selectedIndex === index
                ? 'border-[#00ff88] bg-[rgba(0,255,136,0.1)] text-[#00ff88]'
                : 'border-[#1f2937] bg-[#0d1117] text-[#64748b] hover:brightness-110'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}