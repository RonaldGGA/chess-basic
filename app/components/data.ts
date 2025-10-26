// 1. APERTURA ESPAÑOLA (Ruy López)
const spanishOpening = {
  eco: "C60",
  name: "Apertura Española (Ruy López)",
  moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
  description: "Una de las aperturas más antiguas y analizadas del ajedrez",
  whiteWins: 1500,
  blackWins: 1200,
  draws: 900,
  totalGames: 3600,
  popularity: 0.85,
  initialFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  variations: [
    {
      name: "Variación Principal",
      moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7"]
    },
    {
      name: "Variación Berlín",
      moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6"]
    },
    {
      name: "Variación Schliemann",
      moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "f5"]
    }
  ],
  moveStatistics: [
    { move: "e4", wins: 850, losses: 650, draws: 500, total: 2000 },
    { move: "e5", wins: 820, losses: 630, draws: 550, total: 2000 },
    { move: "Nf3", wins: 830, losses: 620, draws: 550, total: 2000 },
    { move: "Nc6", wins: 810, losses: 640, draws: 550, total: 2000 },
    { move: "Bb5", wins: 840, losses: 610, draws: 550, total: 2000 }
  ]
}

// 2. DEFENSA SICILIANA
const sicilianDefense = {
  eco: "B20",
  name: "Defensa Siciliana",
  moves: ["e4", "c5"],
  description: "La defensa más popular y agresiva contra 1.e4",
  whiteWins: 1800,
  blackWins: 1600,
  draws: 1100,
  totalGames: 4500,
  popularity: 0.92,
  initialFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  variations: [
    {
      name: "Variación del Dragón",
      moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6"]
    },
    {
      name: "Variación Najdorf",
      moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"]
    },
    {
      name: "Ataque Inglés",
      moves: ["e4", "c5", "Nf3", "d6", "c3"]
    }
  ],
  moveStatistics: [
    { move: "e4", wins: 950, losses: 750, draws: 300, total: 2000 },
    { move: "c5", wins: 920, losses: 730, draws: 350, total: 2000 }
  ]
}

// 3. GAMBITO DE DAMA
const queensGambit = {
  eco: "D06",
  name: "Gambito de Dama",
  moves: ["d4", "d5", "c4"],
  description: "Apertura clásica que lleva a posiciones estratégicas complejas",
  whiteWins: 1700,
  blackWins: 1400,
  draws: 1300,
  totalGames: 4400,
  popularity: 0.88,
  initialFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  variations: [
    {
      name: "Gambito de Dama Aceptado",
      moves: ["d4", "d5", "c4", "dxc4"]
    },
    {
      name: "Gambito de Dama Declinado",
      moves: ["d4", "d5", "c4", "e6"]
    },
    {
      name: "Defensa Eslava",
      moves: ["d4", "d5", "c4", "c6"]
    }
  ],
  moveStatistics: [
    { move: "d4", wins: 900, losses: 600, draws: 500, total: 2000 },
    { move: "d5", wins: 850, losses: 650, draws: 500, total: 2000 },
    { move: "c4", wins: 880, losses: 620, draws: 500, total: 2000 }
  ]
}

export const defaultOpenings = {
    spanishOpening,
    sicilianDefense,
    queensGambit
}