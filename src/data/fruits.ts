export type FruitType =
    | "Goiaba"
    | "Limão"
    | "Jaca"
    | "Manga"
    | "Mamão"
    | "Amora"
    | "Tomate"
    | "Jabuticaba"
    | "Pitanga"
    | "Acerola"
    | "Banana"
    | "Abacate"
    | "Ervas";

export interface FruitData {
    svg: string;
}

/** Single source of truth for all fruits: name → pixel-art SVG */
export const FRUITS: Record<FruitType, FruitData> = {
    Goiaba: {
        svg: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 2h2v2H7z" fill="#3f6212"/><path d="M5 4h6v8H5z" fill="#fcd34d"/><path d="M4 5h8v6H4z" fill="#fcd34d"/><path d="M6 12h4v1H6z" fill="#fcd34d"/><path d="M6 6h4v4H6z" fill="#f472b6"/><path d="M7 7h2v2H7z" fill="#be185d"/><path d="M5 5h1v1H5zm5 0h1v1h-1z" fill="#fef9c3"/></svg>`,
    },
    Limão: {
        svg: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M8 2h2v2H8z" fill="#4ade80"/><path d="M3 6h2v4H3zm8 0h2v4h-2z" fill="#facc15"/><path d="M5 4h6v8H5z" fill="#facc15"/><path d="M5 12h6v2H5z" fill="#eab308"/><path d="M5 4h6v1H5z" fill="#fef08a"/><path d="M5 5h1v6H5z" fill="#fde047"/></svg>`,
    },
    Jaca: {
        svg: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 1h2v2H7z" fill="#3f6212"/><path d="M5 3h6v10H5z" fill="#65a30d"/><path d="M4 4h8v8H4z" fill="#65a30d"/><path d="M3 5h10v6H3z" fill="#65a30d"/><path d="M5 4h1v1H5zm2 0h1v1H7zm2 0h1v1H9zm-3 2h1v1H6zm2 0h1v1H8zm-3 2h1v1H5zm2 0h1v1H7zm2 0h1v1H9zm-3 2h1v1H6zm2 0h1v1H8z" fill="#365314" fill-opacity="0.3"/><path d="M6 3h1v1H6zm2 0h1v1H8z" fill="#bef264"/></svg>`,
    },
    Manga: {
        svg: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 1h2v2H7z" fill="#15803d"/><path d="M6 3h5v3H6z" fill="#facc15"/><path d="M5 6h7v7H5z" fill="#facc15"/><path d="M4 7h8v5H4z" fill="#facc15"/><path d="M6 13h5v1H6z" fill="#facc15"/><path d="M9 4h2v8h-1v1H9z" fill="#fb923c"/><path d="M6 4h1v1H6zm-1 3h1v4H5zm1 5h2v1H6z" fill="#fef08a" fill-opacity="0.6"/></svg>`,
    },
    Mamão: {
        svg: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 1h2v2H7z" fill="#15803d"/><path d="M6 3h4v3H6z" fill="#fb923c"/><path d="M5 6h6v7H5z" fill="#fb923c"/><path d="M4 7h8v5H4z" fill="#fb923c"/><path d="M6 13h4v1H6z" fill="#fb923c"/><path d="M6 4h1v1H6zm-1 3h1v4H5zm1 5h2v1H6z" fill="#fcd34d" fill-opacity="0.6"/><path d="M9 4h1v2h1v5h-1v2H9v1H8" fill="#ea580c" fill-opacity="0.3"/><path d="M7 3h2v1H7z" fill="#86efac"/></svg>`,
    },
    Amora: {
        svg: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 2h2v2H7z" fill="#15803d"/><path d="M6 4h4v2H6z" fill="#4c0519"/><path d="M5 6h6v2H5z" fill="#4c0519"/><path d="M6 8h4v2H6z" fill="#4c0519"/><path d="M7 10h2v2H7z" fill="#4c0519"/><path d="M6 4h1v1H6zm2 0h1v1H8zm-2 2h1v1H6zm2 0h1v1H8zm2 0h1v1h-1zm-2 2h1v1H6zm2 0h1v1H8z" fill="#be123c" fill-opacity="0.3"/></svg>`,
    },
    Tomate: {
        svg: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 2h2v2H7z" fill="#22c55e"/><path d="M6 3h4v2H6z" fill="#4ade80"/><path d="M4 5h8v6H4z" fill="#dc2626"/><path d="M5 11h6v1H5z" fill="#dc2626"/><path d="M4 5h2v2H4z" fill="#fca5a5"/><path d="M9 11h1v1h-1z" fill="#991b1b" fill-opacity="0.2"/></svg>`,
    },
    Jabuticaba: {
        svg: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 2h2v12H7z" fill="#78350f"/><path d="M5 5h3v3H5z" fill="#1e1b4b"/><path d="M8 8h3v3H8z" fill="#1e1b4b"/><path d="M5 11h3v3H5z" fill="#1e1b4b"/><path d="M5 5h1v1H5zm3 3h1v1H8zm-3 3h1v1H5z" fill="#4c1d95"/></svg>`,
    },
    Pitanga: {
        svg: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 2h2v3H7z" fill="#15803d"/><path d="M4 5h8v2H4z" fill="#dc2626"/><path d="M3 7h10v4H3z" fill="#dc2626"/><path d="M4 11h8v2H4z" fill="#dc2626"/><path d="M6 5h1v8H6zm3 0h1v8H9z" fill="#991b1b" fill-opacity="0.4"/><path d="M4 6h1v1H4zm4 0h1v1H8zm4 0h1v1h-1z" fill="#fca5a5"/></svg>`,
    },
    Acerola: {
        svg: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M8 2h1v4H8z" fill="#15803d"/><path d="M6 3h2v1H6z" fill="#15803d"/><path d="M9 3h2v1H9z" fill="#15803d"/><path d="M4 4h2v1H4z" fill="#15803d"/><path d="M11 4h2v1h-2z" fill="#15803d"/><path d="M3 5h3v3H3z" fill="#dc2626"/><path d="M11 5h3v3h-3z" fill="#dc2626"/><path d="M7 7h3v3H7z" fill="#dc2626"/><path d="M3 5h1v1H3zm8 0h1v1h-1zm-4 2h1v1H7z" fill="#fca5a5"/></svg>`,
    },
    Banana: {
        svg: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M11 2h2v2h-2z" fill="#15803d"/><path d="M10 4h2v2h-2z" fill="#facc15"/><path d="M9 6h2v3H9z" fill="#facc15"/><path d="M7 9h3v2H7z" fill="#facc15"/><path d="M5 10h3v2H5z" fill="#facc15"/><path d="M3 10h2v2H3z" fill="#facc15"/><path d="M2 9h2v2H2z" fill="#15803d"/></svg>`,
    },
    Abacate: {
        svg: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 1h2v2H7z" fill="#3f6212"/><path d="M6 3h4v3H6z" fill="#166534"/><path d="M5 6h6v7H5z" fill="#166534"/><path d="M4 7h8v5H4z" fill="#166534"/><path d="M6 13h4v1H6z" fill="#166534"/><path d="M6 7h4v4H6z" fill="#fcd34d"/><path d="M7 8h2v2H7z" fill="#78350f"/><path d="M6 4h1v1H6zm-1 3h1v4H5zm1 5h2v1H6z" fill="#86efac" fill-opacity="0.4"/></svg>`,
    },
    Ervas: {
        svg: `<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path d="M7 10h2v4H7z" fill="#fcd34d"/><path d="M6 2h4v2H6z" fill="#4ade80"/><path d="M4 4h8v3H4z" fill="#22c55e"/><path d="M5 7h6v3H5z" fill="#16a34a"/><path d="M6 3h1v1H6zm-1 2h1v1H5zm6 0h-1v1h1z" fill="#bbf7d0"/><path d="M4 4h1v3H4zm7 0h1v3h-1z" fill="#14532d" fill-opacity="0.3"/></svg>`,
    },
};

/** Ordered list of all fruit names */
export const FRUIT_NAMES = Object.keys(FRUITS) as FruitType[];
