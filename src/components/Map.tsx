import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { FruitMarker } from "@/types";
import { createFruitIcon } from "@/utils/fruitIcon";

interface MapProps {
  markers: FruitMarker[];
  onMarkerClick: (marker: FruitMarker) => void;
  isPlantingMode?: boolean;
  onMoveEnd?: (lat: number, lng: number) => void;
}

const MapEvents = ({
  onMoveEnd,
}: {
  onMoveEnd?: (lat: number, lng: number) => void;
}) => {
  const map = useMap();

  useMapEvents({
    moveend: () => {
      if (onMoveEnd) {
        const center = map.getCenter();
        onMoveEnd(center.lat, center.lng);
      }
    },
    zoomend: () => {
      if (onMoveEnd) {
        const center = map.getCenter();
        onMoveEnd(center.lat, center.lng);
      }
    },
  });

  // Emit initial center on mount
  useEffect(() => {
    if (onMoveEnd) {
      const center = map.getCenter();
      onMoveEnd(center.lat, center.lng);
    }
  }, [map, onMoveEnd]);

  return null;
};

export const Map: React.FC<MapProps> = ({
  markers,
  onMarkerClick,
  isPlantingMode,
  onMoveEnd,
}) => {
  return (
    <div className="w-full h-full border-4 border-black shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.2)] relative z-0">
      <MapContainer
        center={[-23.5505, -46.6333]}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="pixelated opacity-80"
        />
        <MapEvents onMoveEnd={onMoveEnd} />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={createFruitIcon(marker.fruitName, marker.verified)}
            eventHandlers={{
              click: () => onMarkerClick(marker),
            }}
          />
        ))}
      </MapContainer>

      {isPlantingMode && (
        <>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-[1000] pointer-events-none flex flex-col items-center">
            <div className="text-red-600 drop-shadow-md animate-bounce mb-1">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="22" />
                <polyline points="19 15 12 22 5 15" />
              </svg>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] pointer-events-none">
            <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-md" />
          </div>
        </>
      )}
    </div>
  );
};
