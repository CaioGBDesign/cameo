// context/DeviceContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1300); // Ajuste o valor conforme necessário
    };

    handleResize(); // Verifica inicialmente
    window.addEventListener("resize", handleResize); // Adiciona o listener

    return () => {
      window.removeEventListener("resize", handleResize); // Limpa o listener
    };
  }, []);

  return (
    <DeviceContext.Provider value={isMobile}>{children}</DeviceContext.Provider>
  );
};

export const useIsMobile = () => {
  return useContext(DeviceContext);
};
