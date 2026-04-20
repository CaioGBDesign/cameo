import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/services/firebaseConection";
import { doc, getDoc } from "firebase/firestore";

const ConfiguracoesContext = createContext({
  noticiasHabilitado: true,
  resenhasHabilitado: true,
  dubladoresHabilitado: true,
  estudiosHabilitado: true,
  gameHabilitado: true,
});

export function ConfiguracoesProvider({ children }) {
  const [config, setConfig] = useState({
    noticiasHabilitado: true,
    resenhasHabilitado: true,
    dubladoresHabilitado: true,
    estudiosHabilitado: true,
    gameHabilitado: true,
  });

  useEffect(() => {
    getDoc(doc(db, "configuracoes", "site"))
      .then((snap) => {
        if (snap.exists()) setConfig((prev) => ({ ...prev, ...snap.data() }));
      })
      .catch(() => {});
  }, []);

  return (
    <ConfiguracoesContext.Provider value={config}>
      {children}
    </ConfiguracoesContext.Provider>
  );
}

export function useConfiguracoes() {
  return useContext(ConfiguracoesContext);
}
