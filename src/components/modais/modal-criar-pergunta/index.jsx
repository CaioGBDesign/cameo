import { useState } from "react";
import { useRouter } from "next/router";
import ModalViews from "@/components/modais/modal-views";
import Button from "@/components/button";
import styles from "./index.module.scss";

const TIPOS_PERGUNTA = [
  { id: 1, label: "Completar a fala" },
  { id: 2, label: "Identificar filme pelo elenco" },
  { id: 3, label: "Identificar filme pelo ano de lançamento" },
  { id: 4, label: "Identificar filme por emoji" },
  { id: 5, label: "Relacionar elementos" },
  { id: 6, label: "Identificar filme por imagem" },
  { id: 7, label: "A definir", disabled: true },
  { id: 8, label: "A definir", disabled: true },
  { id: 9, label: "Identificar diretor" },
  { id: 10, label: "Identificar ator/atriz" },
  { id: 11, label: "Verdadeiro ou falso" },
  { id: 12, label: "Ordem cronológica" },
  { id: 13, label: "A definir", disabled: true },
  { id: 14, label: "Identificar personagem" },
  { id: 15, label: "Identificar gênero do filme" },
  { id: 16, label: "Identificar filme por sinopse" },
  { id: 17, label: "Identificar franquia" },
  { id: 18, label: "Identificar dublador" },
];

export default function ModalCriarPergunta({ onClose }) {
  const router = useRouter();
  const [tipoSelecionado, setTipoSelecionado] = useState(null);

  return (
    <ModalViews
      title="Criar pergunta"
      onClose={onClose}
      activeView={0}
      views={[
        {
          content: (
            <div className={styles.tiposList}>
              {TIPOS_PERGUNTA.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  disabled={t.disabled}
                  className={[
                    styles.tipoItem,
                    tipoSelecionado === t.id ? styles.tipoItemSelected : "",
                    t.disabled ? styles.tipoItemDisabled : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => !t.disabled && setTipoSelecionado(t.id)}
                >
                  <span className={styles.tipoNum}>
                    {String(t.id).padStart(2, "0")}
                  </span>
                  <span className={styles.tipoLabel}>{t.label}</span>
                </button>
              ))}
            </div>
          ),
          footer: (
            <div className={styles.modalFooter}>
              <Button label="Cancelar" variant="ghost" onClick={onClose} />
              <Button
                label="Continuar"
                disabled={!tipoSelecionado}
                onClick={() => {
                  onClose();
                  router.push(`/adm/perguntas/criar?tipo=${tipoSelecionado}`);
                }}
                variant="outline"
              />
            </div>
          ),
        },
      ]}
    />
  );
}
