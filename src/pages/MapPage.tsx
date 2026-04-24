import React, { useState, useCallback } from "react";
import { Map } from "@/components/Map";
import { Modal } from "@/components/Modal";
import { Autocomplete } from "@/components/Autocomplete";
import { Leaderboard } from "@/components/Leaderboard";
import { FruitMarker, User } from "@/types";
import { FruitType, FRUIT_NAMES, FRUITS } from "@/data/fruits";
import { logoutUser, saveCurrentUser } from "@/store/authStore";
import { Plus, Trophy, LogOut } from "lucide-react";

const VOTE_THRESHOLD = 3;

interface MapPageProps {
    currentUser: string;
    onLogout: () => void;
}

export const MapPage: React.FC<MapPageProps> = ({ currentUser, onLogout }) => {
    const [markers, setMarkers] = useState<FruitMarker[]>([
        {
            id: "1",
            lat: -23.5505,
            lng: -46.6333,
            fruitName: "Goiaba",
            creator: "FarmerJoe",
            approvals: 1,
            refutations: 0,
            voters: ["FarmerJoe"],
            consolidated: false,
            verified: false,
        },
    ]);

    const [users, setUsers] = useState<User[]>([
        { username: currentUser, points: 0 },
        { username: "FarmerJoe", points: 250 },
        { username: "AppleSeed", points: 120 },
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
    const [isPlantingMode, setIsPlantingMode] = useState(false);

    const [currentMapCenter, setCurrentMapCenter] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<FruitMarker | null>(null);
    const [newFruitName, setNewFruitName] = useState<FruitType | "">("");

    // ── Points ──────────────────────────────────────────────────────────────

    const updateUserPoints = useCallback((username: string, delta: number) => {
        setUsers((prev) =>
            prev.map((u) => {
                const updated = u.username === username
                    ? { ...u, points: u.points + delta }
                    : u;
                // Persist current user's points in session
                if (updated.username === currentUser) {
                    saveCurrentUser({
                        username: updated.username,
                        passwordHash: "", // not needed here
                        points: updated.points,
                    });
                }
                return updated;
            })
        );
    }, [currentUser]);

    // ── Map events ──────────────────────────────────────────────────────────

    const handleMoveEnd = useCallback((lat: number, lng: number) => {
        setCurrentMapCenter((prev) => {
            if (prev && prev.lat === lat && prev.lng === lng) return prev;
            return { lat, lng };
        });
    }, []);

    const handleMarkerClick = useCallback((marker: FruitMarker) => {
        setSelectedMarker(marker);
        setIsDetailModalOpen(true);
    }, []);

    // ── Add fruit ────────────────────────────────────────────────────────────

    const handleAddFruit = () => {
        if (!selectedLocation || !newFruitName) return;

        const newMarker: FruitMarker = {
            id: Date.now().toString(),
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            fruitName: newFruitName,
            creator: currentUser,
            approvals: 0,
            refutations: 0,
            voters: [currentUser],
            consolidated: false,
            verified: false,
        };

        setMarkers((prev) => [...prev, newMarker]);
        updateUserPoints(currentUser, 50);
        setIsAddModalOpen(false);
        setNewFruitName("");
        setSelectedLocation(null);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setNewFruitName("");
    };

    // ── Voting ───────────────────────────────────────────────────────────────

    const handleVote = (approve: boolean) => {
        if (!selectedMarker) return;

        setMarkers((prev) => {
            const target = prev.find((m) => m.id === selectedMarker.id);
            if (!target) return prev;

            const newApprovals = target.approvals + (approve ? 1 : 0);
            const newRefutations = target.refutations + (!approve ? 1 : 0);
            const newVoters = [...target.voters, currentUser];

            let { consolidated, verified } = target;

            if (newApprovals >= VOTE_THRESHOLD) {
                consolidated = true;
                verified = true;
                updateUserPoints(target.creator, 50);
            } else if (newRefutations >= VOTE_THRESHOLD) {
                consolidated = true;
                updateUserPoints(target.creator, -50);
                // Remove after a short delay so the user sees the result
                setTimeout(() => {
                    setMarkers((m) => m.filter((x) => x.id !== target.id));
                }, 1000);
            }

            return prev.map((m) =>
                m.id === target.id
                    ? { ...m, approvals: newApprovals, refutations: newRefutations, voters: newVoters, consolidated, verified }
                    : m
            );
        });

        updateUserPoints(currentUser, 10);
        setIsDetailModalOpen(false);
        setSelectedMarker(null);
    };

    // ── Logout ───────────────────────────────────────────────────────────────

    const handleLogout = () => {
        logoutUser();
        onLogout();
    };

    // ── Render ───────────────────────────────────────────────────────────────

    const currentPoints = users.find((u) => u.username === currentUser)?.points ?? 0;

    return (
        <div className="h-screen w-full flex flex-col relative overflow-hidden">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full z-10 p-4 flex justify-between items-start pointer-events-none">
                <div className="retro-container pointer-events-auto inline-block">
                    <h1 className="text-sm md:text-base text-white drop-shadow-md">
                        Pomar Urbano
                    </h1>
                    <div className="text-[10px] text-white mt-1 drop-shadow-sm">
                        {currentUser} · {currentPoints} PTS
                    </div>
                </div>

                <div className="flex gap-2 pointer-events-auto">
                    <button
                        onClick={() => setIsLeaderboardOpen(true)}
                        className="retro-button flex items-center justify-center p-3"
                        aria-label="Leaderboard"
                    >
                        <Trophy size={20} />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="retro-button flex items-center justify-center p-3 !bg-[#E83030] hover:!bg-[#FF5050] active:!bg-[#C02020] text-white"
                        aria-label="Sair"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            {/* Map */}
            <div className="flex-1 w-full relative z-0">
                <Map
                    markers={markers}
                    onMarkerClick={handleMarkerClick}
                    isPlantingMode={isPlantingMode}
                    onMoveEnd={handleMoveEnd}
                />

                {isPlantingMode && (
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
                        <div className="retro-container py-2 px-4 text-center animate-bounce">
                            <p className="text-[10px] text-white font-bold drop-shadow-md">
                                ARRASTE O MAPA ATÉ O ALVO
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Planting Mode Buttons */}
            {!isPlantingMode ? (
                <button
                    onClick={() => setIsPlantingMode(true)}
                    className="absolute bottom-8 right-8 retro-button p-4 rounded-full z-10 shadow-xl"
                    aria-label="Adicionar fruta"
                >
                    <Plus size={24} strokeWidth={3} />
                </button>
            ) : (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-10 w-full max-w-xs px-4">
                    <button
                        onClick={() => setIsPlantingMode(false)}
                        className="retro-button flex-1 !bg-[#E83030] hover:!bg-[#FF5050] active:!bg-[#C02020] text-white"
                    >
                        CANCELAR
                    </button>
                    <button
                        onClick={() => {
                            if (currentMapCenter) {
                                setSelectedLocation(currentMapCenter);
                                setIsAddModalOpen(true);
                                setIsPlantingMode(false);
                            }
                        }}
                        className="retro-button flex-1"
                    >
                        CONFIRMAR
                    </button>
                </div>
            )}

            {/* Add Fruit Modal */}
            <Modal isOpen={isAddModalOpen} onClose={closeAddModal} title="Plantar um Marcador">
                <div className="space-y-4">
                    <p className="text-[10px] leading-relaxed text-white drop-shadow-sm">
                        Encontrou uma árvore frutífera? Adicione-a ao mapa para ganhar 50 pontos!
                    </p>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-white drop-shadow-sm">
                            Tipo de Fruta
                        </label>
                        <Autocomplete
                            options={FRUIT_NAMES}
                            value={newFruitName}
                            onChange={(v) => setNewFruitName(v as FruitType)}
                            placeholder="ex: Goiaba"
                        />
                    </div>

                    {newFruitName && FRUITS[newFruitName as FruitType] && (
                        <div className="flex justify-center py-2">
                            <div
                                className="w-16 h-16 bg-white border-4 border-black shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.2)] p-2 pixelated animate-bounce"
                                dangerouslySetInnerHTML={{
                                    __html: FRUITS[newFruitName as FruitType].svg,
                                }}
                            />
                        </div>
                    )}

                    <button
                        onClick={handleAddFruit}
                        disabled={!newFruitName}
                        className="retro-button w-full mt-4"
                    >
                        PLANTAR (+50 PTS)
                    </button>
                </div>
            </Modal>

            {/* Fruit Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Detalhes da Árvore"
            >
                {selectedMarker && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-start border-b-4 border-black pb-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 bg-white border-2 border-black shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.2)] p-1 pixelated flex-shrink-0"
                                    dangerouslySetInnerHTML={{
                                        __html: FRUITS[selectedMarker.fruitName]?.svg ?? "",
                                    }}
                                />
                                <div>
                                    <h3 className="text-lg text-white drop-shadow-md mb-1">
                                        {selectedMarker.fruitName}
                                    </h3>
                                    <p className="text-[10px] text-white drop-shadow-sm">
                                        Por: {selectedMarker.creator}
                                    </p>
                                </div>
                            </div>
                            {selectedMarker.verified && (
                                <span className="retro-badge">Verificado</span>
                            )}
                        </div>

                        {/* Consensus progress */}
                        <div className="bg-[#C84C0C] p-3 border-4 border-black shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.2),inset_4px_4px_0px_rgba(255,255,255,0.2)]">
                            <p className="text-[10px] uppercase mb-2 font-bold text-white drop-shadow-sm">
                                Progresso do Consenso
                            </p>
                            <div className="flex justify-between items-center text-[10px] text-white drop-shadow-sm">
                                <span>Aprovar: {selectedMarker.approvals}/{VOTE_THRESHOLD}</span>
                                <span>Refutar: {selectedMarker.refutations}/{VOTE_THRESHOLD}</span>
                            </div>
                            <div className="w-full h-4 bg-black border-2 border-white mt-2 flex">
                                <div
                                    className="h-full bg-[#58D854]"
                                    style={{ width: `${(selectedMarker.approvals / VOTE_THRESHOLD) * 100}%` }}
                                />
                                <div
                                    className="h-full bg-[#E83030] ml-auto"
                                    style={{ width: `${(selectedMarker.refutations / VOTE_THRESHOLD) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Vote buttons */}
                        {!selectedMarker.consolidated && !selectedMarker.voters.includes(currentUser) && (
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => handleVote(true)}
                                    className="retro-button flex-1 text-[10px]"
                                >
                                    ✅ APROVAR
                                </button>
                                <button
                                    onClick={() => handleVote(false)}
                                    className="retro-button flex-1 !bg-[#E83030] hover:!bg-[#FF5050] active:!bg-[#C02020] text-white text-[10px]"
                                >
                                    ❌ REFUTAR
                                </button>
                            </div>
                        )}

                        {selectedMarker.consolidated && (
                            <div className="text-center p-2 border-4 border-dashed border-black text-[10px] text-white bg-[#C84C0C]">
                                Este marcador está consolidado.
                            </div>
                        )}

                        {!selectedMarker.consolidated && selectedMarker.voters.includes(currentUser) && (
                            <div className="text-center p-2 border-4 border-dashed border-black text-[10px] text-white bg-[#C84C0C]">
                                {selectedMarker.creator === currentUser
                                    ? "Aguardando votos da comunidade..."
                                    : "Você já votou neste marcador."}
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Leaderboard */}
            <Leaderboard
                isOpen={isLeaderboardOpen}
                onClose={() => setIsLeaderboardOpen(false)}
                users={users}
            />
        </div>
    );
};
