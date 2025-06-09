enum MatchPhase {
  Live = "live",
  Warmup = "warmup",
  Intermission = "pause",
  Gameover = "gameover",
}

type MatchPhaseKey = keyof typeof MatchPhase;

export function formatMatchPhase(key: MatchPhaseKey): string {
  return MatchPhase[key];
}
