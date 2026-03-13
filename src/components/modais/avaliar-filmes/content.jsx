import styles from "./content.module.scss";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useAuth } from "@/contexts/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConection";
import StarRatingIcon from "@/components/icons/StarRatingIcon";
import RadioButton from "@/components/inputs/radio-button";
import Switch from "@/components/inputs/switch";

const estrelasDescricao = {
  1: "Zuado",
  2: "Fraco",
  3: "Bom",
  4: "Surpreendeu",
  5: "Foda",
};

const AvaliarFilmeContent = forwardRef(({ filmeId, nota }, ref) => {
  const { user } = useAuth();
  const [avaliacao, setAvaliacao] = useState(nota?.nota ?? null);
  const [comentario, setComentario] = useState("");
  const [ondeAssistiu, setOndeAssistiu] = useState(null);
  const [quadroMetas, setQuadroMetas] = useState(true); // "em-casa" | "no-cinema" | null

  useImperativeHandle(ref, () => ({
    getValues: () => ({ avaliacao, comentario, ondeAssistiu, quadroMetas }),
  }));

  useEffect(() => {
    if (!user || !filmeId) return;
    const fetchComentario = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const visto = snap.data()?.visto?.[filmeId];
        if (visto?.comentario) setComentario(visto.comentario);
      } catch {}
    };
    fetchComentario();
  }, [filmeId, user]);

  useEffect(() => {
    if (nota?.nota) setAvaliacao(nota.nota);
  }, [nota]);

  return (
    <div className={styles.content}>
      <div className={styles.descricao}>
        {avaliacao && <span>{estrelasDescricao[avaliacao]}</span>}
      </div>

      <div className={styles.estrelas}>
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setAvaliacao(v)}
            className={styles.estrela}
          >
            <StarRatingIcon size={40} filled={avaliacao >= v} />
          </button>
        ))}
      </div>

      <div className={styles.conteudoAvaliacao}>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escreva sua avaliação"
          className={styles.textarea}
        />

        <div className={styles.secaoCard}>
          <span className={styles.secaoCardTitulo}>
            Onde assistiu ao filme?
          </span>
          <div className={styles.radioGroup}>
            <RadioButton
              id="em-casa"
              name="onde-assistiu"
              label="Em casa"
              checked={ondeAssistiu === "em-casa"}
              onChange={() => setOndeAssistiu("em-casa")}
              iconVariant="none"
            />
            <RadioButton
              id="no-cinema"
              name="onde-assistiu"
              label="No cinema"
              checked={ondeAssistiu === "no-cinema"}
              onChange={() => setOndeAssistiu("no-cinema")}
              iconVariant="none"
            />
          </div>
        </div>

        <div className={styles.secaoCard}>
          <span className={styles.secaoCardTitulo}>
            Adicionar filme ao quadro de metas?
          </span>
          <Switch
            id="quadro-metas"
            checked={quadroMetas}
            onChange={(e) => setQuadroMetas(e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
});

AvaliarFilmeContent.displayName = "AvaliarFilmeContent";
export default AvaliarFilmeContent;
