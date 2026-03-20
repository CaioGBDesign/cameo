import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useAuth } from "@/contexts/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConection";
import StarRatingIcon from "@/components/icons/StarRatingIcon";
import RadioButton from "@/components/inputs/radio-button";
import TextInput from "@/components/inputs/text-input";
import Switch from "@/components/inputs/switch";
import styles from "./content.module.scss";

const estrelasDescricao = {
  1: "Zuado",
  2: "Fraco",
  3: "Bom",
  4: "Surpreendeu",
  5: "Foda",
};

const hojeFormatado = () => {
  const d = new Date();
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const mascararData = (valor) => {
  const numeros = valor.replace(/\D/g, "").slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
};

const AvaliarFilmeContent = forwardRef(({ filmeId, nota }, ref) => {
  const { user } = useAuth();
  const [avaliacao, setAvaliacao] = useState(nota?.nota > 0 ? nota.nota : null);
  const [comentario, setComentario] = useState("");
  const [ondeAssistiu, setOndeAssistiu] = useState(null);
  const [quadroMetas, setQuadroMetas] = useState(true);
  const [dataAssistido, setDataAssistido] = useState(hojeFormatado());

  useImperativeHandle(ref, () => ({
    getValues: () => ({
      avaliacao,
      comentario,
      ondeAssistiu,
      quadroMetas,
      dataAssistido,
    }),
  }));

  useEffect(() => {
    if (!user || !filmeId) return;
    const fetchDados = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const visto = snap.data()?.visto?.[filmeId];
        if (!visto) return;
        if (visto.comentario) setComentario(visto.comentario);
        if (visto.ondeAssistiu) setOndeAssistiu(visto.ondeAssistiu);
        if (visto.data) setDataAssistido(visto.data);
      } catch {}
    };
    fetchDados();
  }, [filmeId, user]);

  useEffect(() => {
    if (nota?.nota) setAvaliacao(nota.nota);
  }, [nota]);

  return (
    <div className={styles.content}>
      <div className={styles.descricao}>
        {avaliacao ? (
          <span>{estrelasDescricao[avaliacao]}</span>
        ) : (
          <span className={styles.semNota}>
            Você ainda não deu uma nota minha lenda
          </span>
        )}
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
            Quando assistiu ao filme?
          </span>
          <TextInput
            value={dataAssistido}
            onChange={(e) => setDataAssistido(mascararData(e.target.value))}
            placeholder="dd/mm/aaaa"
            inputMode="numeric"
            width="100%"
          />
        </div>

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
