export interface Variation {
  name: string;
  moves: string[];
}

export interface Opening {
  eco: string;
  name: string;
  moves: string[];
  description: string;
  whiteWins: number;
  blackWins: number;
  draws: number;
  totalGames: number;
  popularity: number;
  initialFen: string;
  variations: Variation[];
  moveStatistics: Array<{
    move: string;
    wins: number;
    losses: number;
    draws: number;
    total: number;
  }>;
}

export interface OpeningsMap {
  [key: string]: Opening;
}

export interface GameState {
  chessPosition: string;
  moveFrom: string;
  optionSquares: Record<string, React.CSSProperties>;
  boardOrientation: "white" | "black";
  chessNotation: string[];
  nextSuggestedMove: string;
  practiceType: "Guided" | "Free";
  selectedOpening: string;
  selectedVariation: string;
  showContinueModal: boolean;
  currentVariation: Variation | null;
  isOutOfOpening: boolean;
  cpuPlays: boolean;
}