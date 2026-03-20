export function Header() {
  return (
    <header className="relative overflow-hidden rounded-[28px] border border-[#1f2937] bg-[#111827]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,136,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(0,212,255,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
      <div className="relative h-1 bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#7c3aed]" />
      <div className="relative flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00ff88] to-[#00d4ff] text-3xl text-[#04130d] shadow-[0_14px_40px_rgba(0,255,136,0.22)]">
            🌍
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              PlaceMapper Pro
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[#94a3b8]">
              Universal place data extractor for EV charging stations, restaurants, hotels,
              pharmacies, and more.
            </p>
          </div>
        </div>

        <div className="rounded-full border border-[rgba(0,255,136,0.18)] bg-[rgba(0,255,136,0.08)] px-4 py-2 text-sm font-medium text-[#86efac]">
          Open data powered
        </div>
      </div>
    </header>
  );
}
