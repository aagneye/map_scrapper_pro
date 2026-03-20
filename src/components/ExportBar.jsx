export function ExportBar({ results, city, onExport }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex rounded-full border border-[rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.1)] px-3 py-1 text-sm font-semibold text-[#00ff88]">
            📊 {results.length} results found
          </span>
          <span className="inline-flex rounded-full border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.1)] px-3 py-1 text-sm font-semibold text-[#38bdf8]">
            📍 {city}
          </span>
        </div>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.35)] transition hover:brightness-110"
        >
          ⬇️ Export to Excel
        </button>
      </div>

      <div className="rounded-2xl border border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.08)] px-4 py-3 text-sm text-[#a78bfa]">
        💡 Tip: Export opens directly in Excel or Google Sheets, fully formatted.
      </div>
    </div>
  );
}
