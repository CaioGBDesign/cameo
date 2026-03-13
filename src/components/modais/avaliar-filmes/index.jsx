import { useRef } from "react";
import { useAuth } from "@/contexts/auth";
import Modal from "@/components/modal";
import AvaliarFilmeContent from "./content";

const ModalAvaliar = ({ filmeId, nota, onClose }) => {
  const { darNota } = useAuth();
  const contentRef = useRef();

  const handleConfirm = () => {
    const { avaliacao, comentario } = contentRef.current.getValues();
    darNota(String(filmeId), avaliacao, comentario);
    onClose();
  };

  return (
    <Modal
      title="Avaliar filme"
      onClose={onClose}
      primaryAction={{ label: "Confirmar avaliação", onClick: handleConfirm }}
    >
      <AvaliarFilmeContent ref={contentRef} filmeId={filmeId} nota={nota} />
    </Modal>
  );
};

export default ModalAvaliar;
