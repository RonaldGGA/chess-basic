import React from "react";
import { OpeningsMap } from "../../types";

interface ControlPanelProps {
  gameState: any;
  openings: OpeningsMap;
  onOrientationChange: (orientation: "white" | "black") => void;
  onPracticeTypeChange: (type: "Guided" | "Free") => void;
  onCpuPlayChange: (plays: boolean) => void;
  onResetGame: () => void;
  onOpeningChange: (opening: string) => void;
  onVariationChange: (variation: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  gameState,
  openings,
  onOrientationChange,
  onPracticeTypeChange,
  onCpuPlayChange,
  onResetGame,
  onOpeningChange,
  onVariationChange,
}) => {
  const getAvailableVariations = () => {
    const opening = openings[gameState.selectedOpening];
    return opening.variations || [];
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-center text-white mb-4">
        <p className="p-2 font-bold text-xl capitalize bg-gray-800 rounded-lg px-4">
          {gameState.selectedOpening} 
          {gameState.selectedVariation !== "main" && ` - ${gameState.selectedVariation}`}
          {gameState.isOutOfOpening && " (Out of book)"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button
          onClick={() => onOrientationChange(gameState.boardOrientation === "white" ? "black" : "white")}
          className="cursor-pointer p-2 rounded-md bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
        >
          Flip Board
        </button>
        <button
          onClick={() => onPracticeTypeChange(gameState.practiceType === "Guided" ? "Free" : "Guided")}
          className="cursor-pointer p-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
        >
          {gameState.practiceType} Practice
        </button>
        <button
          onClick={() => onCpuPlayChange(!gameState.cpuPlays)}
          className={`cursor-pointer p-2 rounded-md ${
            gameState.cpuPlays ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
          } text-white transition-colors`}
        >
          CPU: {gameState.cpuPlays ? "ON" : "OFF"}
        </button>
        <button
          onClick={onResetGame}
          className="cursor-pointer p-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          Reset Game
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <select
          onChange={(e) => onOpeningChange(e.target.value)}
          value={gameState.selectedOpening}
          className="p-2 rounded border bg-white text-gray-800 min-w-[200px]"
        >
          {Object.keys(openings).map((opening) => (
            <option key={opening} value={opening}>
              {opening}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => onVariationChange(e.target.value)}
          value={gameState.selectedVariation}
          className="p-2 rounded border bg-white text-gray-800 min-w-[200px]"
        >
          <option value="main">Main Line</option>
          {getAvailableVariations().map((variation) => (
            <option key={variation.name} value={variation.name}>
              {variation.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};