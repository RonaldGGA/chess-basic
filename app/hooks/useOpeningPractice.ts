import { useEffect, useCallback } from "react";
import { Variation } from "../../types";

export const useOpeningPractice = (
  gameState: any,
  updateGameState: any,
  getCurrentMoves: () => string[],
  findVariation: (notation: string[]) => Variation | null,
  makeOpeningMove: () => void,
  makeRandomMove: () => void
) => {
  // Actualizar movimiento sugerido
  useEffect(() => {
    const currentMoves = getCurrentMoves();
    if (gameState.chessNotation.length < currentMoves.length) {
      updateGameState({ nextSuggestedMove: currentMoves[gameState.chessNotation.length] });
    } else {
      updateGameState({ nextSuggestedMove: "" });
    }
  }, [gameState.chessNotation, getCurrentMoves, updateGameState]);

  // Detectar cuando el usuario sale de la línea principal
  useEffect(() => {
    if (gameState.practiceType === "Guided" && gameState.chessNotation.length > 0) {
      const lastMoveIndex = gameState.chessNotation.length - 1;
      const currentMoves = getCurrentMoves();
      
      if (lastMoveIndex < currentMoves.length) {
        const expectedMove = currentMoves[lastMoveIndex];
        const actualMove = gameState.chessNotation[lastMoveIndex];
        
        if (expectedMove !== actualMove) {
          const variation = findVariation(gameState.chessNotation);
          if (variation && variation.name !== gameState.selectedVariation) {
            updateGameState({ 
              currentVariation: variation,
              isOutOfOpening: false 
            });
          } else {
            updateGameState({ 
              showContinueModal: true,
              isOutOfOpening: true 
            });
          }
        }
      }
      
      if (gameState.chessNotation.length >= currentMoves.length) {
        updateGameState({ 
          showContinueModal: true,
          isOutOfOpening: true 
        });
      }
    }
  }, [
    gameState.chessNotation,
    gameState.practiceType,
    gameState.selectedVariation,
    getCurrentMoves,
    findVariation,
    updateGameState
  ]);

  const handleCPUMove = useCallback(() => {
    if (gameState.practiceType === "Guided" && !gameState.isOutOfOpening) {
      makeOpeningMove();
    } else {
      makeRandomMove();
    }
  }, [gameState.practiceType, gameState.isOutOfOpening, makeOpeningMove, makeRandomMove]);

  const handleContinuePractice = useCallback(() => {
    updateGameState({ 
      showContinueModal: false,
      practiceType: "Free" 
    });
  }, [updateGameState]);

  const handleRestartOpening = useCallback(() => {
    updateGameState({ 
      showContinueModal: false,
      isOutOfOpening: false,
      currentVariation: null 
    });
  }, [updateGameState]);

  return {
    handleCPUMove,
    handleContinuePractice,
    handleRestartOpening,
  };
};