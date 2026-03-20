export function CategoryPicker({ categories, selectedIndex, onSelect }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64748b]">
        Category
      </p>
      <div className="flex flex-wrap gap-3">
        {categories.map((category, index) => {
          const isSelected = selectedIndex === index;

          return (
            <button
              key={category.label}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={isSelected}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition duration-200 hover:brightness-110 ${
                isSelected
                  ? 'border-[#00ff88] bg-[rgba(0,255,136,0.1)] text-[#00ff88]'
                  : 'border-[#1f2937] bg-[#0d1117] text-[#64748b]'
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
