export function EmptyState({ searchDone }) {
  const content = searchDone
    ? {
        icon: '🔍',
        title: 'No results found.',
        description: 'Try increasing the search radius or check the city name spelling.',
      }
    : {
        icon: '🌍',
        title: 'Ready to search.',
        description: 'Select a category, enter a city, and hit Search.',
      };

  return (
    <div className="rounded-[24px] border border-dashed border-[#1f2937] bg-[rgba(15,23,42,0.38)] px-6 py-16 text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
        <div className="text-5xl">{content.icon}</div>
        <h3 className="text-2xl font-semibold text-[#e2e8f0]">{content.title}</h3>
        <p className="max-w-md text-sm leading-7 text-[#64748b]">{content.description}</p>
      </div>
    </div>
  );
}
