import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/auth";
import { contarFilmesPorPeriodo, calcularDiasRestantes } from "@/utils/metas";
import { v4 as uuidv4 } from "uuid";

const AlertMetaContext = createContext({});
export const useAlertaMeta = () => useContext(AlertMetaContext);

export function AlertMetaProvider({ children }) {
  const { user } = useAuth();
  const [alertas, setAlertas] = useState([]);
  const metasConcluidasRef = useRef(new Set());
  const userRef = useRef(null);

  const adicionarAlerta = (alerta) => {
    setAlertas((prev) => [...prev, { ...alerta, uid: uuidv4() }]);
  };

  const removerAlerta = (uid) => {
    setAlertas((prev) => prev.filter((a) => a.uid !== uid));
  };

  const verificarAlertas = useCallback((currentUser) => {
    if (!currentUser) return;
    const metas = Array.isArray(currentUser.metas) ? currentUser.metas : [];
    const visto = currentUser.visto || {};

    // "deletada-sistema" — metas deletadas pelo auto-delete no auth.js
    try {
      const deletadas = JSON.parse(
        localStorage.getItem("cameo_alertas_deletadas") || "[]"
      );
      deletadas.forEach(({ meta, progresso, dataTermino }) => {
        adicionarAlerta({ tipo: "deletada-sistema", meta, progresso, dataTermino });
      });
      if (deletadas.length > 0) {
        localStorage.removeItem("cameo_alertas_deletadas");
      }
    } catch {}

    metas.forEach((meta) => {
      const filmesVistos = contarFilmesPorPeriodo(visto, meta.periodo);
      const progresso = meta.quantidade > 0
        ? Math.round((filmesVistos / meta.quantidade) * 100)
        : 0;
      const diasRestantes = calcularDiasRestantes(meta.periodo);
      const dataTermino = formatarDataTermino(meta.periodo);
      const filmesFaltando = Math.max(0, meta.quantidade - filmesVistos);

      // "concluída" — 100% e ainda não reconhecida
      if (progresso >= 100) {
        const key = `cameo_concluida_${meta.id}`;
        if (!localStorage.getItem(key) && !metasConcluidasRef.current.has(meta.id)) {
          metasConcluidasRef.current.add(meta.id);
          adicionarAlerta({ tipo: "concluida", meta, progresso: 100, dataTermino });
        }
        return;
      }

      // "tempo acabando"
      if (meta.periodo !== "dia" && diasRestantes !== null) {
        const threshold = meta.periodo === "semana" ? 2 : 7;
        if (diasRestantes <= threshold && diasRestantes > 0) {
          const hoje = new Date().toDateString();
          const key = `cameo_prazo_${meta.id}`;
          if (localStorage.getItem(key) !== hoje) {
            adicionarAlerta({ tipo: "tempo-acabando", meta, progresso, diasRestantes, dataTermino, filmesFaltando });
            localStorage.setItem(key, hoje);
          }
        }
      }

      // "quase concluída" — a cada 10% de milestone (10% a 90%)
      const milestone = Math.floor(progresso / 10) * 10;
      if (milestone >= 10 && milestone < 100) {
        const key = `cameo_quase_${meta.id}`;
        const ultimoMilestone = parseInt(localStorage.getItem(key) || "0");
        if (milestone > ultimoMilestone) {
          adicionarAlerta({ tipo: "quase-concluida", meta, progresso, milestone, dataTermino, filmesFaltando });
          localStorage.setItem(key, String(milestone));
        }
      }
    });
  }, []);

  // Roda quando user/metas carregam (cobre login e retorno ao site com sessão ativa)
  useEffect(() => {
    if (!user?.metas) return;
    userRef.current = user;
    verificarAlertas(user);
  }, [user?.uid, user?.metas, verificarAlertas]);

  // Detecta meta concluída em tempo real quando filmes são adicionados/removidos na sessão
  useEffect(() => {
    if (!user) return;
    const metas = Array.isArray(user.metas) ? user.metas : [];
    const visto = user.visto || {};

    metas.forEach((meta) => {
      const filmesVistos = contarFilmesPorPeriodo(visto, meta.periodo);
      const progresso = meta.quantidade > 0
        ? Math.round((filmesVistos / meta.quantidade) * 100)
        : 0;
      const key = `cameo_concluida_${meta.id}`;

      if (progresso >= 100) {
        if (!localStorage.getItem(key) && !metasConcluidasRef.current.has(meta.id)) {
          metasConcluidasRef.current.add(meta.id);
          const dataTermino = formatarDataTermino(meta.periodo);
          adicionarAlerta({ tipo: "concluida", meta, progresso: 100, dataTermino });
        }
      } else {
        // Progresso caiu abaixo de 100%: reseta para permitir novo alerta ao re-atingir
        metasConcluidasRef.current.delete(meta.id);
        localStorage.removeItem(key);
      }
    });
  }, [user?.visto]);

  // Roda quando o usuário volta à aba/janela (cobre sessões longas sem reload)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && userRef.current) {
        verificarAlertas(userRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [verificarAlertas]);

  return (
    <AlertMetaContext.Provider value={{ alertas, adicionarAlerta, removerAlerta }}>
      {children}
    </AlertMetaContext.Provider>
  );
}

function formatarDataTermino(periodo) {
  const hoje = new Date();
  let fim;

  switch (periodo) {
    case "dia":
      fim = hoje;
      break;
    case "semana": {
      const diasAteDomingo = hoje.getDay() === 0 ? 0 : 7 - hoje.getDay();
      fim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + diasAteDomingo);
      break;
    }
    case "mes":
      fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      break;
    case "ano":
      fim = new Date(hoje.getFullYear(), 11, 31);
      break;
    default:
      return "";
  }

  return fim.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
}
