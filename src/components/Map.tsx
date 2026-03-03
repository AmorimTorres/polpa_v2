import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { FruitMarker } from "../types";

// Pixel art SVGs for fruits
export const FRUIT_SVGS: Record<string, string> = {
  Goiaba: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 2h2v2H7z" fill="#3f6212"/><path d="M5 4h6v8H5z" fill="#fcd34d"/><path d="M4 5h8v6H4z" fill="#fcd34d"/><path d="M6 12h4v1H6z" fill="#fcd34d"/><path d="M6 6h4v4H6z" fill="#f472b6"/><path d="M7 7h2v2H7z" fill="#be185d"/><path d="M5 5h1v1H5zm5 0h1v1h-1z" fill="#fef9c3"/></svg>`,
  Limão: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M8 2h2v2H8z" fill="#4ade80"/><path d="M3 6h2v4H3zm8 0h2v4h-2z" fill="#facc15"/><path d="M5 4h6v8H5z" fill="#facc15"/><path d="M5 12h6v2H5z" fill="#eab308"/><path d="M5 4h6v1H5z" fill="#fef08a"/><path d="M5 5h1v6H5z" fill="#fde047"/></svg>`,
  Jaca: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 1h2v2H7z" fill="#3f6212"/><path d="M5 3h6v10H5z" fill="#65a30d"/><path d="M4 4h8v8H4z" fill="#65a30d"/><path d="M3 5h10v6H3z" fill="#65a30d"/><path d="M5 4h1v1H5zm2 0h1v1H7zm2 0h1v1H9zm-3 2h1v1H6zm2 0h1v1H8zm-3 2h1v1H5zm2 0h1v1H7zm2 0h1v1H9zm-3 2h1v1H6zm2 0h1v1H8z" fill="#365314" fill-opacity="0.3"/><path d="M6 3h1v1H6zm2 0h1v1H8z" fill="#bef264"/></svg>`,
  Manga: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 1h2v2H7z" fill="#15803d"/><path d="M6 3h5v3H6z" fill="#facc15"/><path d="M5 6h7v7H5z" fill="#facc15"/><path d="M4 7h8v5H4z" fill="#facc15"/><path d="M6 13h5v1H6z" fill="#facc15"/><path d="M9 4h2v8h-1v1H9z" fill="#fb923c"/><path d="M6 4h1v1H6zm-1 3h1v4H5zm1 5h2v1H6z" fill="#fef08a" fill-opacity="0.6"/></svg>`,
  Mamão: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 1h2v2H7z" fill="#15803d"/><path d="M6 3h4v3H6z" fill="#fb923c"/><path d="M5 6h6v7H5z" fill="#fb923c"/><path d="M4 7h8v5H4z" fill="#fb923c"/><path d="M6 13h4v1H6z" fill="#fb923c"/><path d="M6 4h1v1H6zm-1 3h1v4H5zm1 5h2v1H6z" fill="#fcd34d" fill-opacity="0.6"/><path d="M9 4h1v2h1v5h-1v2H9v1H8" fill="#ea580c" fill-opacity="0.3"/><path d="M7 3h2v1H7z" fill="#86efac"/></svg>`,
  Amora: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 2h2v2H7z" fill="#15803d"/><path d="M6 4h4v2H6z" fill="#4c0519"/><path d="M5 6h6v2H5z" fill="#4c0519"/><path d="M6 8h4v2H6z" fill="#4c0519"/><path d="M7 10h2v2H7z" fill="#4c0519"/><path d="M6 4h1v1H6zm2 0h1v1H8zm-2 2h1v1H6zm2 0h1v1H8zm2 0h1v1h-1zm-2 2h1v1H6zm2 0h1v1H8z" fill="#be123c" fill-opacity="0.3"/></svg>`,
  Tomate: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 2h2v2H7z" fill="#22c55e"/><path d="M6 3h4v2H6z" fill="#4ade80"/><path d="M4 5h8v6H4z" fill="#dc2626"/><path d="M5 11h6v1H5z" fill="#dc2626"/><path d="M4 5h2v2H4z" fill="#fca5a5"/><path d="M9 11h1v1h-1z" fill="#991b1b" fill-opacity="0.2"/></svg>`,
  Abacate: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 1h2v2H7z" fill="#3f6212"/><path d="M6 3h4v3H6z" fill="#166534"/><path d="M5 6h6v7H5z" fill="#166534"/><path d="M4 7h8v5H4z" fill="#166534"/><path d="M6 13h4v1H6z" fill="#166534"/><path d="M6 7h4v4H6z" fill="#fcd34d"/><path d="M7 8h2v2H7z" fill="#78350f"/><path d="M6 4h1v1H6zm-1 3h1v4H5zm1 5h2v1H6z" fill="#86efac" fill-opacity="0.4"/></svg>`,
  Ervas: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 10h2v4H7z" fill="#fcd34d"/><path d="M6 2h4v2H6z" fill="#4ade80"/><path d="M4 4h8v3H4z" fill="#22c55e"/><path d="M5 7h6v3H5z" fill="#16a34a"/><path d="M6 3h1v1H6zm-1 2h1v1H5zm6 0h-1v1h1z" fill="#bbf7d0"/><path d="M4 4h1v3H4zm7 0h1v3h-1z" fill="#14532d" fill-opacity="0.3"/></svg>`,
  Jabuticaba: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 2h2v12H7z" fill="#78350f"/><path d="M5 5h3v3H5z" fill="#1e1b4b"/><path d="M8 8h3v3H8z" fill="#1e1b4b"/><path d="M5 11h3v3H5z" fill="#1e1b4b"/><path d="M5 5h1v1H5zm3 3h1v1H8zm-3 3h1v1H5z" fill="#4c1d95"/></svg>`,
  Pitanga: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 2h2v3H7z" fill="#15803d"/><path d="M4 5h8v2H4z" fill="#dc2626"/><path d="M3 7h10v4H3z" fill="#dc2626"/><path d="M4 11h8v2H4z" fill="#dc2626"/><path d="M6 5h1v8H6zm3 0h1v8H9z" fill="#991b1b" fill-opacity="0.4"/><path d="M4 6h1v1H4zm4 0h1v1H8zm4 0h1v1h-1z" fill="#fca5a5"/></svg>`,
  Acerola: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M8 2h1v4H8z" fill="#15803d"/><path d="M6 3h2v1H6z" fill="#15803d"/><path d="M9 3h2v1H9z" fill="#15803d"/><path d="M4 4h2v1H4z" fill="#15803d"/><path d="M11 4h2v1h-2z" fill="#15803d"/><path d="M3 5h3v3H3z" fill="#dc2626"/><path d="M11 5h3v3h-3z" fill="#dc2626"/><path d="M7 7h3v3H7z" fill="#dc2626"/><path d="M3 5h1v1H3zm8 0h1v1h-1zm-4 2h1v1H7z" fill="#fca5a5"/></svg>`,
  Banana: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M11 2h2v2h-2z" fill="#15803d"/><path d="M10 4h2v2h-2z" fill="#facc15"/><path d="M9 6h2v3H9z" fill="#facc15"/><path d="M7 9h3v2H7z" fill="#facc15"/><path d="M5 10h3v2H5z" fill="#facc15"/><path d="M3 10h2v2H3z" fill="#facc15"/><path d="M2 9h2v2H2z" fill="#15803d"/></svg>`,
};

// Custom pixel art icon for fruits
const createFruitIcon = (fruitName: string, verified: boolean) => {
  const svgContent = FRUIT_SVGS[fruitName] || `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 2h2v2H7z" fill="#15803d"/><path d="M4 4h8v8H4z" fill="#22c55e"/><path d="M5 5h1v1H5z" fill="#86efac"/></svg>`;
  const badge = verified
    ? '<div class="absolute -top-2 -right-2 bg-[#F8D820] text-black text-[8px] px-1 border-2 border-black rounded-sm z-10 shadow-sm">V</div>'
    : "";

  return L.divIcon({
    html: `<div class="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-black shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.2)] p-1 pixelated">
      ${svgContent}
      ${badge}
    </div>`,
    className: "custom-fruit-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface MapProps {
  markers: FruitMarker[];
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick: (marker: FruitMarker) => void;
  isPlantingMode?: boolean;
  onMoveEnd?: (lat: number, lng: number) => void;
}

const MapEvents = ({
  onMapClick,
  onMoveEnd,
}: {
  onMapClick: (lat: number, lng: number) => void;
  onMoveEnd?: (lat: number, lng: number) => void;
}) => {
  const map = useMap();

  const handlers = React.useMemo(() => {
    const h: any = {};
    if (onMapClick) {
      h.click = (e: any) => onMapClick(e.latlng.lat, e.latlng.lng);
    }
    if (onMoveEnd) {
      h.moveend = () => {
        const center = map.getCenter();
        onMoveEnd(center.lat, center.lng);
      };
      h.zoomend = () => {
        const center = map.getCenter();
        onMoveEnd(center.lat, center.lng);
      };
    }
    return h;
  }, [map, onMapClick, onMoveEnd]);

  useMapEvents(handlers);

  // Initialize center on mount
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
  onMapClick,
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
        <MapEvents onMapClick={onMapClick} onMoveEnd={onMoveEnd} />

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
                <line x1="12" y1="2" x2="12" y2="22"></line>
                <polyline points="19 15 12 22 5 15"></polyline>
              </svg>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] pointer-events-none">
            <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-md"></div>
          </div>
        </>
      )}
    </div>
  );
};
