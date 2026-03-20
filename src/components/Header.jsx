import React from 'react';

export function Header() {
  return (
    <header className="bg-[#0a0a0f] relative">
      <div className="h-1 bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#7c3aed]"></div>
      <div className="flex items-center p-6">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-2xl mr-4">
          🌍
        </div>
        {/* Title and Subtitle */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
            PlaceMapper Pro
          </h1>
          <p className="text-[#64748b] text-sm mt-1">
            Universal place data extractor — EV stations, restaurants, hotels & more
          </p>
        </div>
      </div>
    </header>
  );
}