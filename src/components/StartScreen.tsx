interface StartScreenProps {
  best: number;
  totalRounds: number;
  onStart: () => void;
}

export function StartScreen({ best, totalRounds, onStart }: StartScreenProps) {
  return (
    <div className="animate-pop-in flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <h1 className="font-pixel text-lg leading-relaxed text-[#d6293e] sm:text-xl">
        Who's That
        <br />
        Pokémon?
      </h1>
      <p className="max-w-xs text-sm text-black/70">
        Guess all {totalRounds} silhouettes correctly to beat your best score.
      </p>
      <div className="font-pixel text-[10px] text-black/50">
        BEST {best}/{totalRounds}
      </div>
      <button
        onClick={onStart}
        className="rounded-full bg-[#d6293e] px-8 py-3 font-pixel text-xs text-white shadow-[0_4px_0_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-100 ease-out active:translate-y-1 active:shadow-none"
      >
        Start
      </button>
    </div>
  );
}
