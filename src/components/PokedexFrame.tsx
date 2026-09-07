import type { ReactNode } from "react";

export function PokedexFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-[2rem] border-4 border-black/30 bg-[#d6293e] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="relative h-10 w-10 rounded-full border-4 border-black/40 bg-sky-300 shadow-inner">
          <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-white/80" />
        </div>
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500 shadow-inner" />
          <span className="h-3 w-3 rounded-full bg-yellow-400 shadow-inner" />
          <span className="h-3 w-3 rounded-full bg-green-500 shadow-inner" />
        </div>
      </div>
      <div className="flex min-h-[26rem] flex-col rounded-xl border-4 border-black/70 bg-[#f5f1e3] p-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.25)]">
        {children}
      </div>
    </div>
  );
}
