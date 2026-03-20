import { CategoryPicker } from './CategoryPicker.jsx';
import { RADIUS_OPTIONS } from '../constants/index.js';

export function SearchForm({
  city,
  onCityChange,
  radius,
  onRadiusChange,
  onSearch,
  loading,
  statusMessage,
  errorMessage,
  categories,
  selectedCategory,
  onCategorySelect,
}) {
  return (
    <section className="rounded-[24px] border border-[#1f2937] bg-[#111827] p-8 shadow-[0_24px_80px_rgba(3,7,18,0.45)]">
      <div className="space-y-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64748b]">
          Search Configuration
        </p>

        <CategoryPicker
          categories={categories}
          selectedIndex={selectedCategory}
          onSelect={onCategorySelect}
        />

        <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(180px,0.8fr)]">
          <label className="space-y-3">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64748b]">
              City Name
            </span>
            <input
              type="text"
              value={city}
              placeholder="e.g. Amsterdam, Tokyo, Mumbai..."
              onChange={(event) => onCityChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onSearch();
                }
              }}
              className="w-full rounded-2xl border border-[#1f2937] bg-[#0d1117] px-4 py-3 text-base text-[#e2e8f0] outline-none transition placeholder:text-[#64748b] focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]"
            />
          </label>

          <label className="space-y-3">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64748b]">
              Search Radius
            </span>
            <select
              value={radius}
              onChange={(event) => onRadiusChange(Number(event.target.value))}
              className="w-full rounded-2xl border border-[#1f2937] bg-[#0d1117] px-4 py-3 text-base text-[#e2e8f0] outline-none transition focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]"
            >
              {RADIUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option / 1000}km
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={onSearch}
          disabled={loading}
          className={`w-full rounded-2xl px-6 py-4 text-base font-semibold text-[#04130d] transition duration-200 ${
            loading
              ? 'cursor-not-allowed bg-[#334155] text-[#94a3b8] shadow-none'
              : 'bg-gradient-to-r from-[#00ff88] to-[#00d4ff] shadow-[0_0_30px_rgba(0,255,136,0.28)] hover:brightness-110'
          }`}
        >
          {loading ? '⏳ Searching...' : '🔍 Search Now'}
        </button>

        {statusMessage ? (
          <div className="rounded-2xl border border-[rgba(0,255,136,0.22)] bg-[rgba(0,255,136,0.08)] px-4 py-3 text-sm text-[#86efac]">
            {statusMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-2xl border border-[rgba(248,113,113,0.26)] bg-[rgba(127,29,29,0.24)] px-4 py-3 text-sm text-[#fca5a5]">
            {errorMessage}
          </div>
        ) : null}
      </div>
    </section>
  );
}
