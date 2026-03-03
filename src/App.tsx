import React, { useState, useEffect, useCallback } from "react";
import { Map, FRUIT_SVGS } from "./components/Map";
import { Modal } from "./components/Modal";
import { Autocomplete } from "./components/Autocomplete";
import { Leaderboard } from "./components/Leaderboard";
import { FruitMarker, User, FruitType } from "./types";
import { Plus, Trophy } from "lucide-react";

const FRUIT_LIST: FruitType[] = [
  "Goiaba",
  "Limão",
  "Jaca",
  "Manga",
  "Mamão",
  "Amora",
  "Tomate",
  "Jabuticaba",
  "Pitanga",
  "Acerola",
  "Banana",
  "Abacate",
  "Ervas",
];

const CURRENT_USER = "Você";

export default function App() {
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
    { username: CURRENT_USER, points: 100 },
    { username: "FarmerJoe", points: 250 },
    { username: "AppleSeed", points: 120 },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isPlantingMode, setIsPlantingMode] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [currentMapCenter, setCurrentMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<FruitMarker | null>(
    null,
  );
  const [newFruitName, setNewFruitName] = useState("");

  const handleMapClick = useCallback((lat: number, lng: number) => {
    // We no longer open the modal directly on map click.
    // The user must use the planting mode.
  }, []);

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

  const handleAddFruit = () => {
    if (!selectedLocation || !newFruitName) return;

    const newMarker: FruitMarker = {
      id: Date.now().toString(),
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      fruitName: newFruitName,
      creator: CURRENT_USER,
      approvals: 0,
      refutations: 0,
      voters: [CURRENT_USER],
      consolidated: false,
      verified: false,
    };

    setMarkers([...markers, newMarker]);
    updateUserPoints(CURRENT_USER, 50);

    setIsAddModalOpen(false);
    setNewFruitName("");
    setSelectedLocation(null);
  };

  const handleVote = (approve: boolean) => {
    if (!selectedMarker) return;

    const markerToUpdate = markers.find((m) => m.id === selectedMarker.id);
    if (!markerToUpdate) return;

    const newApprovals = markerToUpdate.approvals + (approve ? 1 : 0);
    const newRefutations = markerToUpdate.refutations + (!approve ? 1 : 0);
    const newVoters = [...markerToUpdate.voters, CURRENT_USER];

    let consolidated = markerToUpdate.consolidated;
    let verified = markerToUpdate.verified;

    if (newApprovals >= 3 || newRefutations >= 3) {
      consolidated = true;
      if (newApprovals >= 3) {
        verified = true;
        updateUserPoints(markerToUpdate.creator, 50); // Bonus for verified
      } else if (newRefutations >= 3) {
        updateUserPoints(markerToUpdate.creator, -50); // Penalty for refuted
        // Remove the marker after a short delay so the user sees the result
        setTimeout(() => {
          setMarkers((m) => m.filter((x) => x.id !== markerToUpdate.id));
        }, 1000);
      }
    }

    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === markerToUpdate.id
          ? {
              ...marker,
              approvals: newApprovals,
              refutations: newRefutations,
              voters: newVoters,
              consolidated,
              verified,
            }
          : marker
      )
    );

    updateUserPoints(CURRENT_USER, 10);
    setIsDetailModalOpen(false);
    setSelectedMarker(null);
  };

  const updateUserPoints = (username: string, pointsToAdd: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.username === username
          ? { ...user, points: user.points + pointsToAdd }
          : user,
      ),
    );
  };

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full z-10 p-4 flex justify-between items-start pointer-events-none">
        <div className="retro-container pointer-events-auto inline-block">
          <h1 className="text-sm md:text-base text-white drop-shadow-md">
            Pomar Urbano
          </h1>
          <div className="text-[10px] text-white mt-1 drop-shadow-sm">
            {users.find((u) => u.username === CURRENT_USER)?.points || 0} PTS
          </div>
        </div>

        <button
          onClick={() => setIsLeaderboardOpen(true)}
          className="retro-button pointer-events-auto flex items-center justify-center p-3"
          aria-label="Leaderboard"
        >
          <Trophy size={20} />
        </button>
      </div>

      {/* Map Area */}
      <div className="flex-1 w-full relative z-0">
        <Map
          markers={markers}
          onMapClick={handleMapClick}
          onMarkerClick={handleMarkerClick}
          isPlantingMode={isPlantingMode}
          onMoveEnd={handleMoveEnd}
        />

        {isPlantingMode && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
            <div className="retro-container py-2 px-4 text-center animate-bounce">
              <p className="text-[10px] text-white font-bold drop-shadow-md">ARRASTE O MAPA ATÉ O ALVO</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Add Button / Confirm Buttons */}
      {!isPlantingMode ? (
        <button
          onClick={() => setIsPlantingMode(true)}
          className="absolute bottom-8 right-8 retro-button p-4 rounded-full z-10 shadow-xl"
          aria-label="Add Fruit"
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
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewFruitName("");
        }}
        title="Plantar um Marcador"
      >
        <div className="space-y-4">
          <p className="text-[10px] leading-relaxed text-white drop-shadow-sm">
            Encontrou uma árvore frutífera? Adicione-a ao mapa para ganhar 50 pontos!
          </p>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white drop-shadow-sm">
              Tipo de Fruta
            </label>
            <Autocomplete
              options={FRUIT_LIST}
              value={newFruitName}
              onChange={setNewFruitName}
              placeholder="ex: Goiaba"
            />
          </div>

          {newFruitName && FRUIT_SVGS[newFruitName] && (
            <div className="flex justify-center py-2">
              <div 
                className="w-16 h-16 bg-white border-4 border-black shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.2)] p-2 pixelated animate-bounce"
                dangerouslySetInnerHTML={{ 
                  __html: FRUIT_SVGS[newFruitName]
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
                    __html: FRUIT_SVGS[selectedMarker.fruitName] || `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 2h2v2H7z" fill="#15803d"/><path d="M4 4h8v8H4z" fill="#22c55e"/><path d="M5 5h1v1H5z" fill="#86efac"/></svg>`
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

            <div className="bg-[#C84C0C] p-3 border-4 border-black shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.2),inset_4px_4px_0px_rgba(255,255,255,0.2)]">
              <p className="text-[10px] uppercase mb-2 font-bold text-white drop-shadow-sm">
                Progresso do Consenso
              </p>
              <div className="flex justify-between items-center text-[10px] text-white drop-shadow-sm">
                <span>
                  Aprovar: {selectedMarker.approvals}/3
                </span>
                <span>
                  Refutar: {selectedMarker.refutations}/3
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-4 bg-black border-2 border-white mt-2 flex">
                <div
                  className="h-full bg-[#58D854]"
                  style={{ width: `${(selectedMarker.approvals / 3) * 100}%` }}
                />
                <div
                  className="h-full bg-[#E83030] ml-auto"
                  style={{
                    width: `${(selectedMarker.refutations / 3) * 100}%`,
                  }}
                />
              </div>
            </div>

            {!selectedMarker.consolidated &&
              !selectedMarker.voters.includes(CURRENT_USER) && (
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

            {!selectedMarker.consolidated &&
              selectedMarker.voters.includes(CURRENT_USER) && (
                <div className="text-center p-2 border-4 border-dashed border-black text-[10px] text-white bg-[#C84C0C]">
                  {selectedMarker.creator === CURRENT_USER 
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
}
