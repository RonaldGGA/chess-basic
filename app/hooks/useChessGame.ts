import { useState, useRef, useCallback, useEffect } from "react";
import { Chess, Square } from "chess.js";
import { OpeningsMap, Variation, GameState } from "../../types";

export const useChessGame = (openings: OpeningsMap) => {
  const chessGameRef = useRef<Chess | null>(null);
  const gameHistoryRef = useRef<string[]>([]); // Para almacenar FEN de cada posición
  
  const [gameState, setGameState] = useState<GameState>({
    chessPosition: "start",
    moveFrom: "",
    optionSquares: {},
    boardOrientation: "white",
    chessNotation: [],
    nextSuggestedMove: "",
    practiceType: "Guided",
    selectedOpening: "spanishOpening",
    selectedVariation: "main",
    showContinueModal: false,
    currentVariation: null,
    isOutOfOpening: false,
    cpuPlays: true,
  });

  // Debug logging
  useEffect(() => {
    console.log("Game State Updated:", {
      position: gameState.chessPosition,
      notation: gameState.chessNotation,
      suggestedMove: gameState.nextSuggestedMove,
      variation: gameState.currentVariation?.name,
      isOutOfOpening: gameState.isOutOfOpening,
      historyLength: gameHistoryRef.current.length
    });
  }, [gameState]);

  // Guardar posición en el historial cuando cambia
  useEffect(() => {
    if (gameState.chessPosition && gameState.chessPosition !== "start") {
      gameHistoryRef.current.push(gameState.chessPosition);
      console.log("Position saved to history:", gameState.chessPosition);
    }
  }, [gameState.chessPosition]);

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const getCurrentMoves = useCallback((): string[] => {
    const opening = openings[gameState.selectedOpening];
    if (gameState.selectedVariation !== "main") {
      const variation = opening.variations.find(v => v.name === gameState.selectedVariation);
      return variation ? variation.moves : opening.moves;
    }
    if (gameState.currentVariation) {
      return gameState.currentVariation.moves;
    }
    return opening.moves;
  }, [gameState.selectedOpening, gameState.selectedVariation, gameState.currentVariation, openings]);

  const findVariation = useCallback((notation: string[]): Variation | null => {
    const opening = openings[gameState.selectedOpening];
    if (!opening.variations || opening.variations.length === 0) return null;
    
    for (const variation of opening.variations) {
      let matches = true;
      for (let i = 0; i < notation.length && i < variation.moves.length; i++) {
        if (notation[i] !== variation.moves[i]) {
          matches = false;
          break;
        }
      }
      if (matches && notation.length <= variation.moves.length) {
        return variation;
      }
    }
    return null;
  }, [gameState.selectedOpening, openings]);

  // Función para deshacer jugadas
  const undoMove = useCallback((movesToUndo: number = 1) => {
    const chessGame = chessGameRef.current;
    if (!chessGame || gameHistoryRef.current.length <= 1) {
      console.log("No moves to undo");
      return false;
    }

    try {
      // Calcular cuántas jugadas deshacer basado en si la CPU juega
      const undoCount = gameState.cpuPlays ? Math.min(movesToUndo * 2, chessGame.history().length) : movesToUndo;
      
      console.log(`Undoing ${undoCount} moves from ${chessGame.history().length} total moves`);
      
      // Deshacer movimientos
      for (let i = 0; i < undoCount; i++) {
        const undoneMove = chessGame.undo();
        if (!undoneMove) break;
        console.log(`Undid move: ${undoneMove.san}`);
      }

      // Actualizar estado
      const newNotation = chessGame.history();
      const newPosition = chessGame.fen();
      
      updateGameState({
        chessPosition: newPosition,
        chessNotation: newNotation,
        moveFrom: "",
        optionSquares: {},
      });

      // Actualizar historial
      gameHistoryRef.current = gameHistoryRef.current.slice(0, -undoCount);
      
      console.log(`Undo completed. Remaining moves: ${newNotation.length}, History positions: ${gameHistoryRef.current.length}`);
      return true;
    } catch (error) {
      console.error("Error undoing move:", error);
      return false;
    }
  }, [gameState.cpuPlays, updateGameState]);

  const resetGame = useCallback(() => {
    chessGameRef.current = new Chess();
    gameHistoryRef.current = []; // Limpiar historial
    
    const opening = openings[gameState.selectedOpening];
    
    if (gameState.selectedVariation !== "main") {
      const variation = opening.variations.find(v => v.name === gameState.selectedVariation);
      
      if (variation) {
        const game = chessGameRef.current;
        try {
          // Aplicar todos los movimientos de la variante
          variation.moves.forEach(move => {
            const result = game.move(move);
            if (!result) {
              console.error(`Failed to apply move: ${move}`, game.fen());
            }
          });
          // Guardar posición inicial en el historial
          gameHistoryRef.current.push(game.fen());
          
          updateGameState({
            chessPosition: game.fen(),
            chessNotation: game.history(),
            nextSuggestedMove: variation.moves.length > 0 ? variation.moves[variation.moves.length - 1] : "",
          });
        } catch (error) {
          console.error("Error applying variation moves:", error);
          // Fallback to initial position
          gameHistoryRef.current.push(game.fen());
          updateGameState({
            chessPosition: game.fen(),
            chessNotation: [],
            nextSuggestedMove: opening.moves[0] || "",
          });
        }
      }
    } else {
      gameHistoryRef.current.push(chessGameRef.current.fen());
      updateGameState({
        chessPosition: chessGameRef.current.fen(),
        chessNotation: [],
        nextSuggestedMove: opening.moves[0] || "",
      });
    }
    
    updateGameState({
      moveFrom: "",
      optionSquares: {},
      isOutOfOpening: false,
      currentVariation: null,
    });
  }, [gameState.selectedOpening, gameState.selectedVariation, openings, updateGameState]);

  const makeMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
    const chessGame = chessGameRef.current;
    if (!chessGame) return null;

    try {
      const moveResult = chessGame.move(move);
      if (moveResult) {
        const newNotation = chessGame.history();
        const newPosition = chessGame.fen();
        
        updateGameState({
          chessPosition: newPosition,
          chessNotation: newNotation,
        });
        return moveResult;
      }
    } catch (error) {
      console.error("Error making move:", error);
    }
    return null;
  }, [updateGameState]);

  const makeRandomMove = useCallback(() => {
    const chessGame = chessGameRef.current;
    if (!chessGame) return;
    
    const possibleMoves = chessGame.moves({ verbose: true });

    if (chessGame.isGameOver() || possibleMoves.length === 0) {
      return;
    }

    const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    makeMove({
      from: randomMove.from,
      to: randomMove.to,
      promotion: "q",
    });
  }, [makeMove]);

  const makeOpeningMove = useCallback(() => {
    const chessGame = chessGameRef.current;
    if (!chessGame || chessGame.isGameOver()) return;
    
    const currentMoveIndex = gameState.chessNotation.length;
    const currentMoves = getCurrentMoves();
    
    if (currentMoveIndex + 1 < currentMoves.length) {
      const nextOpeningMoveSAN = currentMoves[currentMoveIndex + 1];
      
      console.log(`CPU attempting move: ${nextOpeningMoveSAN} at position: ${chessGame.fen()}`);
      
      try {
        const moveResult = chessGame.move(nextOpeningMoveSAN);
        if (moveResult) {
          console.log(`CPU move successful: ${nextOpeningMoveSAN}`);
          updateGameState({
            chessPosition: chessGame.fen(),
            chessNotation: chessGame.history(),
          });
          return;
        }
      } catch (error) {
        console.error(`CPU move failed: ${nextOpeningMoveSAN}`, error);
      }
    }
    
    console.log("CPU fallback to random move");
    makeRandomMove();
  }, [gameState.chessNotation.length, getCurrentMoves, makeRandomMove, updateGameState]);

  const getMoveOptions = useCallback((square: Square) => {
    const chessGame = chessGameRef.current;
    if (!chessGame) return false;
    
    const moves = chessGame.moves({
      square,
      verbose: true,
    });

    if (moves.length === 0) {
      updateGameState({ optionSquares: {} });
      return false;
    }

    const newSquares: Record<string, React.CSSProperties> = {};

    for (const move of moves) {
      newSquares[move.to] = {
        background:
          chessGame.get(move.to) &&
          chessGame.get(move.to)?.color !== chessGame.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    }
    newSquares[square] = { background: "rgba(255,255,0,0.4" };

    updateGameState({ optionSquares: newSquares });
    return true;
  }, [updateGameState]);

  return {
    chessGameRef,
    gameState,
    updateGameState,
    getCurrentMoves,
    findVariation,
    resetGame,
    makeMove,
    makeRandomMove,
    makeOpeningMove,
    getMoveOptions,
    undoMove,
  };
};