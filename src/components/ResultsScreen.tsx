interface ResultsScreenProps {
  score: number;
  totalRounds: number;
  best: number;
  onPlayAgain: () => void;
}

export function ResultsScreen({ score, totalRounds, best, onPlayAgain }: ResultsScreenProps) {
  const isNewBest = score > 0 && score === best;

  return (
    <div className="animate-pop-in flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <h2 className="font-pixel text-sm text-[#d6293e]">Game Over</h2>
      <p className="font-pixel text-3xl text-black/80">
        {score}/{totalRounds}
      </p>
      {isNewBest && <p className="font-pixel text-[10px] text-amber-600">New Best!</p>}
      <p className="font-pixel text-[10px] text-black/50">
        BEST {best}/{totalRounds}
      </p>
      <button
        onClick={onPlayAgain}
        className="rounded-full bg-[#d6293e] px-8 py-3 font-pixel text-xs text-white shadow-[0_4px_0_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-100 ease-out active:translate-y-1 active:shadow-none"
      >
        Play Again
      </button>
    </div>
  );
}
