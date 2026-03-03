import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="retro-container max-w-md w-full animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4 border-b-4 border-black pb-2">
          <h2 className="text-sm uppercase tracking-wider text-white drop-shadow-md">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#F8D820] font-bold px-2 drop-shadow-md"
          >
            X
          </button>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};
