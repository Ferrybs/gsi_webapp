enum MatchPhase {
  Live = "Live",
  Warmup = "Warmup",
  Intermission = "Pause",
  Gameover = "Game Over",
}

type MatchPhaseKey = keyof typeof MatchPhase;

export function formatMatchPhase(key: MatchPhaseKey): string {
  return MatchPhase[key];
}
