import L from "leaflet";
import { FRUITS } from "@/data/fruits";

const FALLBACK_SVG = `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 2h2v2H7z" fill="#15803d"/><path d="M4 4h8v8H4z" fill="#22c55e"/><path d="M5 5h1v1H5z" fill="#86efac"/></svg>`;

/**
 * Creates a Leaflet divIcon with a pixel-art fruit SVG.
 * Verified markers show a gold "V" badge.
 */
export function createFruitIcon(fruitName: string, verified: boolean): L.DivIcon {
    const svgContent = FRUITS[fruitName as keyof typeof FRUITS]?.svg ?? FALLBACK_SVG;
    const badge = verified
        ? `<div class="absolute -top-2 -right-2 bg-[#F8D820] text-black text-[8px] px-1 border-2 border-black z-10">V</div>`
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
}
