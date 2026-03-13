"use client";

import { Aperture, Pencil } from "lucide-react";

export default function SketchNavbar() {
  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4 sm:px-8">
      <div className="graphite-panel max-w-6xl mx-auto px-5 sm:px-6 h-14 rounded-full backdrop-blur-md flex items-center justify-between">
        {/* Wordmark */}
        <div className="flex items-center gap-2.5">
          <Aperture size={15} strokeWidth={1.6} className="text-zinc-500" />
          <span className="font-display italic text-zinc-900 tracking-wide text-lg leading-none">
            Graphite
          </span>
        </div>

        {/* Right side */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <span className="hidden sm:inline text-[11px] tracking-[0.3em] uppercase text-zinc-500 font-light">
            2B – 8B
          </span>
          <div className="hidden sm:block w-px h-4 bg-zinc-300" />
          <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-zinc-600 font-light">
            Original works
          </span>
          <Pencil size={14} strokeWidth={1.5} className="text-zinc-500" />
        </nav>
      </div>
    </header>
  );
}
