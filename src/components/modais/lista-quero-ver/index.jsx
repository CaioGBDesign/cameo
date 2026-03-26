import { useState } from "react";
import styles from "./index.module.scss";
import Modal from "@/components/modal";
import TextInput from "@/components/inputs/text-input";
import Button from "@/components/button";
import TrashIcon from "@/components/icons/TrashIcon";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";

export default function ListaQueroVer({ lista, onClose }) {
  const { criarLista, renomearLista, deletarLista, LISTAS_LIMITE, user } = useAuth();
  const isMobile = useIsMobile();
  const [nome, setNome] = useState(lista?.nome || "");
  const [salvando, setSalvando] = useState(false);

  const isEdicao = !!lista;
  const listas = user?.listasQueroVer || [];
  const atingiuLimite = !isEdicao && listas.length >= LISTAS_LIMITE;

  const handleConfirmar = async () => {
    if (!nome.trim() || atingiuLimite) return;
    setSalvando(true);
    if (isEdicao) {
      await renomearLista(lista.id, nome.trim());
    } else {
      await criarLista(nome.trim());
    }
    setSalvando(false);
    onClose();
  };

  const handleDeletar = async () => {
    if (!lista) return;
    await deletarLista(lista.id);
    onClose();
  };

  const deletarAction = isEdicao
    ? {
        variant: "ghost",
        label: "Deletar lista",
        icon: <TrashIcon size={18} color="var(--color-error)" />,
        mobileIcon: <TrashIcon size={18} color="var(--color-error)" />,
        color: "var(--color-error)",
        onClick: handleDeletar,
      }
    : undefined;

  return (
    <Modal
      title={isEdicao ? "Editar lista" : "Criar lista"}
      onClose={onClose}
      primaryAction={{
        label: salvando ? "Salvando..." : "Confirmar",
        onClick: handleConfirmar,
        disabled: !nome.trim() || atingiuLimite || salvando,
      }}
      secondaryAction={!isMobile ? deletarAction : undefined}
    >
      <div className={styles.content}>
        {atingiuLimite ? (
          <p className={styles.aviso}>
            Você atingiu o limite de {LISTAS_LIMITE} listas.
          </p>
        ) : (
          <TextInput
            label="Nome da lista"
            placeholder="Ex: Sessão pipoca"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConfirmar()}
            autoFocus
          />
        )}

        {isEdicao && isMobile && (
          <Button
            variant="ghost"
            label="Deletar lista"
            icon={<TrashIcon size={18} color="var(--color-error)" />}
            color="var(--color-error)"
            onClick={handleDeletar}
            width="100%"
          />
        )}
      </div>
    </Modal>
  );
}
