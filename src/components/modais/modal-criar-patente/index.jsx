import { useState } from "react";
import { useRouter } from "next/router";
import ModalViews from "@/components/modais/modal-views";
import Button from "@/components/button";
import styles from "./index.module.scss";

const TIPOS_PATENTE = [
  { id: "grupo", label: "Grupo" },
  { id: "especial", label: "Especial" },
];

export default function ModalCriarPatente({ onClose }) {
  const router = useRouter();
  const [tipoSelecionado, setTipoSelecionado] = useState(null);

  return (
    <ModalViews
      title="Criar patente"
      onClose={onClose}
      activeView={0}
      views={[
        {
          content: (
            <div className={styles.tiposList}>
              {TIPOS_PATENTE.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={[
                    styles.tipoItem,
                    tipoSelecionado === t.id ? styles.tipoItemSelected : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setTipoSelecionado(t.id)}
                >
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
                  router.push(`/adm/patentes/criar/${tipoSelecionado}`);
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