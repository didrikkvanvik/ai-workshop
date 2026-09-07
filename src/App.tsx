import { GameScreen } from "./components/GameScreen";
import { PokedexFrame } from "./components/PokedexFrame";
import { ResultsScreen } from "./components/ResultsScreen";
import { StartScreen } from "./components/StartScreen";
import { useGame } from "./hooks/useGame";

export default function App() {
  const game = useGame();

  const handleStart = () => {
    game.playClick();
    game.startGame();
  };

  const handleNext = () => {
    game.playClick();
    game.nextRound();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2b2b2b] p-4">
      <PokedexFrame>
        {game.error && <p className="mb-2 text-center text-xs text-red-600">{game.error}</p>}

        {game.status === "start" && (
          <StartScreen best={game.best} totalRounds={game.totalRounds} onStart={handleStart} />
        )}

        {(game.status === "loading" || game.status === "playing" || game.status === "revealed") && (
          <GameScreen
            round={game.round}
            totalRounds={game.totalRounds}
            score={game.score}
            pokemon={game.pokemon}
            options={game.options}
            selected={game.selected}
            isCorrect={game.isCorrect}
            isRevealed={game.status === "revealed"}
            isLoading={game.status === "loading"}
            onGuess={game.submitGuess}
            onNext={handleNext}
          />
        )}

        {game.status === "gameover" && (
          <ResultsScreen
            score={game.score}
            totalRounds={game.totalRounds}
            best={game.best}
            onPlayAgain={handleStart}
          />
        )}
      </PokedexFrame>
    </div>
  );
}
