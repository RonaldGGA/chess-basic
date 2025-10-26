import React from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onRestart: () => void;
  onContinue: () => void;
  title: string;
  message: string;
  movesPlayed: number;
  totalMoves: number;
}

export const Modal: React.FC<ModalProps> = ({
  show,
  onClose,
  onRestart,
  onContinue,
  title,
  message,
  movesPlayed,
  totalMoves,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="mb-2">{message}</p>
        <p className="mb-4 text-sm text-gray-600">
          Moves played: {movesPlayed}/{totalMoves}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onRestart}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reiniciar Apertura
          </button>
          <button
            onClick={onContinue}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Continuar Practicando
          </button>
        </div>
      </div>
    </div>
  );
};