// context/DeviceContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

// Criamos um contexto que guarda se é mobile (true/false)
const DeviceContext = createContext(false);

// Provider que envolve a aplicação
export const DeviceProvider = ({ children }) => {
  const isMobile = useIsMobile();
  return (
    <DeviceContext.Provider value={isMobile}>{children}</DeviceContext.Provider>
  );
};

// Hook para consumir o contexto
export const useDevice = () => useContext(DeviceContext);

// Hook robusto para detectar mobile: combina feature-detect de touch + media-query
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined")
      return;

    // 1) Detecta suporte a touch
    const hasTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;

    // 2) MediaQuery para pointer:coarse (dedo) + largura típica mobile
    const mql = window.matchMedia("(pointer: coarse) and (max-width: 768px)");

    const evaluate = () => {
      setIsMobile(hasTouch && mql.matches);
    };

    // Avalia no mount
    evaluate();

    // Escuta mudanças na media query
    mql.addEventListener("change", evaluate);
    // Escuta resize (caso maxTouchPoints mude)
    window.addEventListener("resize", evaluate);

    return () => {
      mql.removeEventListener("change", evaluate);
      window.removeEventListener("resize", evaluate);
    };
  }, []);

  return isMobile;
}
