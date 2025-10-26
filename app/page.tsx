"use client";
import { useCallback, useEffect } from "react";
import { Chessboard, SquareHandlerArgs, PieceDropHandlerArgs } from "react-chessboard";
import { useChessGame } from "./hooks/useChessGame";
import { useOpeningPractice } from "./hooks/useOpeningPractice";
import { Modal } from "./components/modal";
import { ControlPanel } from "./components/controlPanel";
import { InformationPanel } from "./components/informationPanel";
import { defaultOpenings } from "./components/data";
import { OpeningsMap } from "../types";

const Home: React.FC = () => {
  const openings: OpeningsMap = defaultOpenings;
  
  const {
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
  } = useChessGame(openings);

  const {
    handleCPUMove,
    handleContinuePractice,
    handleRestartOpening,
  } = useOpeningPractice(
    gameState,
    updateGameState,
    getCurrentMoves,
    findVariation,
    makeOpeningMove,
    makeRandomMove
  );

  // Efecto para inicializar el juego
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const isUserMoveCorrect = useCallback((userMove: string, moveIndex: number): boolean => {
    const currentMoves = getCurrentMoves();
    if (moveIndex >= currentMoves.length) {
      return false;
    }
    return userMove === currentMoves[moveIndex];
  }, [getCurrentMoves]);

  // Función para manejar deshacer jugada
  const handleUndoMove = useCallback(() => {
    console.log("Undo move requested");
    undoMove(1); // Deshacer una jugada (que puede ser 1 o 2 movimientos dependiendo de la CPU)
  }, [undoMove]);

  const onSquareClick = useCallback(({ square, piece }: SquareHandlerArgs) => {
    const chessGame = chessGameRef.current;
    if (!chessGame) return;
    
    // Piece clicked to move
    if (!gameState.moveFrom && piece) {
      const hasMoveOptions = getMoveOptions(square as any);
      if (hasMoveOptions) {
        updateGameState({ moveFrom: square });
      }
      return;
    }
    
    // Square clicked to move to
    const moves = chessGame.moves({
      square: gameState.moveFrom as any,
      verbose: true,
    });
    
    const foundMove = moves.find((m) => m.from === gameState.moveFrom && m.to === square);

    if (!foundMove) {
      const hasMoveOptions = getMoveOptions(square as any);
      updateGameState({ moveFrom: hasMoveOptions ? square : "" });
      return;
    }

    // Make the move
    const moveResult = makeMove({
      from: gameState.moveFrom,
      to: square,
      promotion: "q",
    });

    if (moveResult) {
      // Computer responds after short delay if enabled
      if (gameState.cpuPlays) {
        setTimeout(() => {
          handleCPUMove();
        }, 300);
      }
    }

    updateGameState({ 
      moveFrom: "",
      optionSquares: {},
    });
  }, [chessGameRef, gameState.moveFrom, gameState.cpuPlays, getMoveOptions, makeMove, handleCPUMove, updateGameState]);

  const onPieceDrop = useCallback(({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
    if (!targetSquare) return false;

    const moveResult = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!moveResult) return false;

    updateGameState({ 
      moveFrom: "",
      optionSquares: {},
    });

    if (gameState.cpuPlays) {
      setTimeout(() => {
        handleCPUMove();
      }, 300);
    }

    return true;
  }, [makeMove, gameState.cpuPlays, handleCPUMove, updateGameState]);

  const chessBoardOptions = {
    id: "chessboard-id",
    position: gameState.chessPosition,
    onPieceDrop,
    squareStyles: gameState.optionSquares,
    onSquareClick,
    boardOrientation: gameState.boardOrientation,
    customBoardStyle: {
      borderRadius: "4px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <Modal
        show={gameState.showContinueModal}
        onClose={() => updateGameState({ showContinueModal: false })}
        onRestart={handleRestartOpening}
        onContinue={handleContinuePractice}
        title={gameState.chessNotation.length >= getCurrentMoves().length 
          ? "¡Apertura completada!" 
          : "Te has salido de la línea principal"}
        message={gameState.chessNotation.length >= getCurrentMoves().length
          ? "Has completado todos los movimientos de esta apertura. ¿Qué deseas hacer?"
          : "Tu movimiento no coincide con la línea principal de esta apertura. ¿Qué deseas hacer?"}
        movesPlayed={gameState.chessNotation.length}
        totalMoves={getCurrentMoves().length}
      />

      <ControlPanel
        gameState={gameState}
        openings={openings}
        onOrientationChange={(orientation) => updateGameState({ boardOrientation: orientation })}
        onPracticeTypeChange={(type) => updateGameState({ practiceType: type })}
        onCpuPlayChange={(plays) => updateGameState({ cpuPlays: plays })}
        onResetGame={resetGame}
        onOpeningChange={(opening) => updateGameState({ selectedOpening: opening })}
        onVariationChange={(variation) => updateGameState({ selectedVariation: variation })}
      />
      
      <div className="flex flex-col lg:flex-row gap-8 mt-8 justify-center items-start max-w-7xl mx-auto">
        <div className="flex-shrink-0">
          <div className="w-full max-w-[500px] bg-white rounded-lg shadow-2xl overflow-hidden">
            {gameState.chessPosition !== "start" ? (
              <Chessboard options={chessBoardOptions} />
            ) : (
              <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
                <div className="text-gray-600">LOADING CHESSBOARD...</div>
              </div>
            )}
          </div>
        </div>
        
        <InformationPanel
          gameState={gameState}
          openings={openings}
          getCurrentMoves={getCurrentMoves}
          isUserMoveCorrect={isUserMoveCorrect}
          onVariationChange={(variation) => updateGameState({ selectedVariation: variation })}
          onUndoMove={handleUndoMove}
        />
      </div>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded text-xs max-w-md">
          <div>Position: {gameState.chessPosition.split(' ')[0]}</div>
          <div>Moves: {gameState.chessNotation.join(', ')}</div>
          <div>Current Line: {getCurrentMoves().join(', ')}</div>
          <div>History Length: {gameState.chessNotation.length}</div>
        </div>
      )}
    </div>
  );
};

export default Home;