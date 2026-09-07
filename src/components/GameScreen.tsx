import type { PokemonData, RoundOption } from "../types";

interface GameScreenProps {
  round: number;
  totalRounds: number;
  score: number;
  pokemon: PokemonData | null;
  options: RoundOption[];
  selected: string | null;
  isCorrect: boolean | null;
  isRevealed: boolean;
  isLoading: boolean;
  onGuess: (name: string) => void;
  onNext: () => void;
}

export function GameScreen({
  round,
  totalRounds,
  score,
  pokemon,
  options,
  selected,
  isCorrect,
  isRevealed,
  isLoading,
  onGuess,
  onNext,
}: GameScreenProps) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between font-pixel text-[10px] text-black/70">
        <span>
          ROUND {round}/{totalRounds}
        </span>
        <span>SCORE {score}</span>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg border-2 border-black/40 bg-white">
        {isLoading || !pokemon ? (
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-black/15 border-t-[#d6293e]" />
        ) : (
          <img
            key={pokemon.id}
            src={pokemon.artworkUrl}
            alt={isRevealed ? pokemon.name : "Mystery Pokémon"}
            className={`h-48 w-48 object-contain drop-shadow-md ${isRevealed ? "animate-reveal" : ""}`}
            style={{ filter: isRevealed ? "brightness(1)" : "brightness(0)" }}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const isSelected = selected === option.name;
          const isTheAnswer = pokemon?.name === option.name;

          let stateClasses = "bg-white border-black/30 hover:border-black/60";
          if (isRevealed && isTheAnswer) {
            stateClasses = "bg-green-200 border-green-600";
          } else if (isRevealed && isSelected && !isCorrect) {
            stateClasses = "bg-red-200 border-red-600 animate-shake";
          } else if (isRevealed) {
            stateClasses = "bg-white/60 border-black/10 opacity-60";
          }

          return (
            <button
              key={option.id}
              disabled={isRevealed || isLoading}
              onClick={() => onGuess(option.name)}
              className={`press rounded-lg border-2 px-3 py-2 text-xs font-semibold capitalize transition-colors disabled:cursor-default ${stateClasses}`}
            >
              {option.name}
            </button>
          );
        })}
      </div>

      <div className="flex min-h-[2.5rem] items-center justify-center">
        {isRevealed && (
          <button
            onClick={onNext}
            className="rounded-full bg-[#d6293e] px-6 py-2 font-pixel text-[10px] text-white shadow-[0_4px_0_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-100 ease-out active:translate-y-1 active:shadow-none"
          >
            {round >= totalRounds ? "See Results" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
