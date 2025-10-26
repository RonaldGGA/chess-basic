import React from "react";
import { OpeningsMap, Variation } from "../../types";

interface InformationPanelProps {
  gameState: any;
  openings: OpeningsMap;
  getCurrentMoves: () => string[];
  isUserMoveCorrect: (move: string, index: number) => boolean;
  onVariationChange: (variationName: string) => void;
  onUndoMove: () => void;
}

export const InformationPanel: React.FC<InformationPanelProps> = ({
  gameState,
  openings,
  getCurrentMoves,
  isUserMoveCorrect,
  onVariationChange,
  onUndoMove,
}) => {
  const getAvailableVariations = (): Variation[] => {
    const opening = openings[gameState.selectedOpening];
    return opening.variations || [];
  };

  const formatMoveNumber = (index: number): string => {
    const moveNumber = Math.floor(index / 2) + 1;
    const isWhite = index % 2 === 0;
    return isWhite ? `${moveNumber}.` : `${moveNumber}...`;
  };

  const getCurrentOpening = () => {
    return openings[gameState.selectedOpening];
  };

  const calculateWinPercentage = (wins: number, total: number): string => {
    if (total === 0) return "0%";
    return `${((wins / total) * 100).toFixed(1)}%`;
  };

  const getMoveStatistics = () => {
    const opening = getCurrentOpening();
    return opening.moveStatistics || [];
  };

  return (
    <div className="w-80 bg-gray-100 p-4 rounded-lg shadow-lg">
      {/* Botón Deshacer */}
      <div className="mb-4">
        <button
          onClick={onUndoMove}
          disabled={gameState.chessNotation.length === 0}
          className={`w-full p-2 rounded-md ${
            gameState.chessNotation.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          } text-white transition-colors`}
        >
          ↩️ Deshacer Jugada
        </button>
        <p className="text-xs text-gray-600 text-center mt-1">
          {gameState.chessNotation.length > 0 
            ? `Puedes deshacer hasta el movimiento ${Math.max(0, gameState.chessNotation.length - (gameState.cpuPlays ? 2 : 1))}`
            : "No hay jugadas para deshacer"
          }
        </p>
      </div>

      {/* Next Move Suggestion */}
      {gameState.nextSuggestedMove && gameState.practiceType === "Guided" && !gameState.isOutOfOpening && (
        <div className="mb-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500">
          <p className="font-bold text-blue-800">Next suggested move:</p>
          <p className="text-xl text-blue-700 font-mono">{gameState.nextSuggestedMove}</p>
        </div>
      )}
      
      {/* Current Variation Info */}
      {gameState.currentVariation && gameState.currentVariation.name !== gameState.selectedVariation && (
        <div className="mb-4 p-3 bg-purple-100 rounded border-l-4 border-purple-500">
          <p className="font-bold text-purple-800">Switched to variation:</p>
          <p className="text-lg text-purple-700">{gameState.currentVariation.name}</p>
        </div>
      )}
      
      {/* Move Statistics */}
      <div className="mb-4">
        <p className="font-bold text-gray-800 mb-2">Move Statistics:</p>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {getMoveStatistics().map((stat, index) => (
            <div key={index} className="bg-white p-2 rounded border">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold">{stat.move}</span>
                <span className="text-sm text-gray-600">
                  {stat.wins + stat.losses + stat.draws} games
                </span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-green-600">✅ {stat.wins}</span>
                <span className="text-red-600">❌ {stat.losses}</span>
                <span className="text-blue-600">🤝 {stat.draws}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ 
                    width: `${(stat.wins / stat.total) * 100}%` 
                  }}
                />
              </div>
              <div className="text-xs text-gray-600 text-center mt-1">
                Win: {calculateWinPercentage(stat.wins, stat.total)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Principal Moves */}
      <div className="mb-4">
        <p className="font-bold text-gray-800 mb-2">
          {gameState.selectedVariation !== "main" ? "Variation Line:" : "Principal Line:"}
        </p>
        <div className="flex flex-wrap gap-1">
          {getCurrentMoves().map((move, index) => (
            <span 
              key={index} 
              className={`px-2 py-1 rounded text-sm font-mono ${
                index < gameState.chessNotation.length 
                  ? isUserMoveCorrect(gameState.chessNotation[index], index) 
                    ? "bg-green-200 text-green-800 border border-green-300" 
                    : "bg-red-200 text-red-800 border border-red-300"
                  : "bg-gray-200 text-gray-600 border border-gray-300"
              }`}
            >
              {formatMoveNumber(index)} {move}
            </span>
          ))}
        </div>
      </div>

      {/* Available Variations */}
      {getAvailableVariations().length > 0 && (
        <div className="mb-4">
          <p className="font-bold text-gray-800 mb-2">Available Variations:</p>
          <div className="flex flex-col gap-2">
            {getAvailableVariations().map((variation) => (
              <div 
                key={variation.name} 
                className={`p-2 rounded border cursor-pointer transition-all ${
                  gameState.selectedVariation === variation.name 
                    ? 'bg-blue-200 border-blue-500 shadow-md' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onVariationChange(variation.name)}
              >
                <p className="font-semibold text-gray-800">{variation.name}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {variation.moves.map((move, index) => (
                    <span 
                      key={index} 
                      className="px-1 py-0.5 bg-gray-200 rounded text-xs font-mono text-gray-600"
                    >
                      {formatMoveNumber(index)} {move}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Game History */}
      <div className="mb-4">
        <p className="font-bold text-gray-800 mb-2">Game History:</p>
        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
          {gameState.chessNotation.map((move: string, index: number) => (
            <span 
              key={index} 
              className={`px-2 py-1 rounded text-sm font-mono ${
                isUserMoveCorrect(move, index) 
                  ? "bg-green-200 text-green-800 border border-green-300" 
                  : "bg-red-200 text-red-800 border border-red-300"
              }`}
            >
              {formatMoveNumber(index)} {move}
            </span>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 p-3 bg-gray-200 rounded border">
        <p className="font-bold text-gray-800 mb-2">Game Statistics:</p>
        <div className="text-sm text-gray-700">
          <p>Moves played: <span className="font-mono">{gameState.chessNotation.length}</span></p>
          <p>
            Correct moves:{" "}
            <span className="font-mono">
              {gameState.chessNotation.filter((move: string, index: number) => 
                isUserMoveCorrect(move, index)
              ).length}
              /{Math.min(gameState.chessNotation.length, getCurrentMoves().length)}
            </span>
          </p>
          {gameState.selectedVariation !== "main" && (
            <p className="text-blue-600 font-semibold">
              Practicing: {gameState.selectedVariation}
            </p>
          )}
          {gameState.currentVariation && gameState.currentVariation.name !== gameState.selectedVariation && (
            <p className="text-purple-600 font-semibold">
              Switched to: {gameState.currentVariation.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};