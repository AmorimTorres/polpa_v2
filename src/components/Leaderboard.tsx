import React from "react";
import { User } from "../types";

interface LeaderboardProps {
  users: User[];
  isOpen: boolean;
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  users,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="retro-container max-w-md w-full animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4 border-b-4 border-black pb-2">
          <h2 className="text-sm uppercase tracking-wider text-white drop-shadow-md">
            Melhores Fazendeiros
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#F8D820] font-bold px-2 drop-shadow-md"
          >
            X
          </button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {sortedUsers.map((user, index) => (
            <div
              key={user.username}
              className={`flex justify-between items-center p-2 border-4 border-black shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.2),inset_2px_2px_0px_rgba(255,255,255,0.4)] ${
                index === 0
                  ? "bg-[#F8D820] text-black"
                  : index === 1
                    ? "bg-[#D8D8D8] text-black"
                    : index === 2
                      ? "bg-[#C84C0C] text-white"
                      : "bg-[#58D854] text-black"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold w-6">{index + 1}.</span>
                <span className="truncate max-w-[120px]">{user.username}</span>
              </div>
              <div className="font-bold">{user.points} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
