import React from "react";
import { Modal } from "@/components/Modal";
import { User } from "@/types";

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
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  const rowColor = (index: number): string => {
    if (index === 0) return "bg-[#F8D820] text-black";
    if (index === 1) return "bg-[#D8D8D8] text-black";
    if (index === 2) return "bg-[#C84C0C] text-white";
    return "bg-[#58D854] text-black";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Melhores Fazendeiros">
      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
        {sortedUsers.map((user, index) => (
          <div
            key={user.username}
            className={`flex justify-between items-center p-2 border-4 border-black shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.2),inset_2px_2px_0px_rgba(255,255,255,0.4)] ${rowColor(index)}`}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold w-6">{index + 1}.</span>
              <span className="truncate max-w-[120px]">{user.username}</span>
            </div>
            <div className="font-bold">{user.points} pts</div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
