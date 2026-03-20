const sources = [
  {
    accent: 'bg-[#38bdf8]',
    nameColor: 'text-[#38bdf8]',
    name: 'OpenStreetMap',
    description: 'Free community mapping data',
  },
  {
    accent: 'bg-[#00ff88]',
    nameColor: 'text-[#00ff88]',
    name: 'OpenChargeMap',
    description: 'Global EV charging network',
  },
  {
    accent: 'bg-[#a78bfa]',
    nameColor: 'text-[#a78bfa]',
    name: 'Nominatim',
    description: 'City geocoding service',
  },
];

export function Footer() {
  return (
    <footer className="rounded-[24px] border border-[#1f2937] bg-[#111827] p-8">
      <div className="space-y-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64748b]">
          Data Sources
        </p>

        <div className="flex flex-wrap gap-3">
          {sources.map((source) => (
            <div
              key={source.name}
              className="flex min-w-[220px] flex-1 items-center gap-3 rounded-2xl border border-[#1f2937] bg-[#0d1117] px-4 py-4"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${source.accent}`} />
              <div>
                <p className={`font-semibold ${source.nameColor}`}>{source.name}</p>
                <p className="text-sm text-[#64748b]">{source.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-[#94a3b8]">
          100% free and open data. No API keys, no billing, no Google Maps.
        </p>
      </div>
    </footer>
  );
}
