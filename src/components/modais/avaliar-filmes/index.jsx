import { useRef, useState } from "react";
import { useAuth } from "@/contexts/auth";
import Modal from "@/components/modal";
import AvaliarFilmeContent from "./content";

const ModalAvaliar = ({ filmeId, nota, onClose }) => {
  const { darNota } = useAuth();
  const contentRef = useRef();
  const [erroNota, setErroNota] = useState(false);

  const handleConfirm = () => {
    const { avaliacao, comentario, ondeAssistiu, quadroMetas, dataAssistido } =
      contentRef.current.getValues();
    if (!avaliacao || avaliacao === 0) {
      setErroNota(true);
      return;
    }
    setErroNota(false);
    darNota(String(filmeId), avaliacao, comentario, ondeAssistiu, quadroMetas, dataAssistido);
    onClose();
  };

  return (
    <Modal
      title="Avaliar filme"
      onClose={onClose}
      primaryAction={{ label: "Confirmar avaliação", onClick: handleConfirm }}
      erro={erroNota ? "Você precisa avaliar o filme para confirmar" : null}
    >
      <AvaliarFilmeContent
        ref={contentRef}
        filmeId={filmeId}
        nota={nota}
        onAvaliacaoChange={() => setErroNota(false)}
      />
    </Modal>
  );
};

export default ModalAvaliar;
