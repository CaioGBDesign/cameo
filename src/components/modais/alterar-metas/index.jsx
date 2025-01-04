import styles from "./index.module.scss";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import HeaderModal from "@/components/modais/header-modais";

const AlterarMeta = ({ onClose, meta = {}, onAlterarMeta }) => {
  const { atualizarMeta } = useAuth();
  const isMobile = useIsMobile();
  const modalRef = useRef(null);
  const [periodo, setPeriodo] = useState(meta?.periodo || "");
  const [quantidade, setQuantidade] = useState(meta?.quantidade || "");
  const [erroQuantidade, setErroQuantidade] = useState("");

  useEffect(() => {
    if (!meta.id) {
      console.error("A meta fornecida está indefinida ou incompleta.");
    }
  }, [meta]);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose(); // Fecha o modal ao clicar fora
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantidade || quantidade <= 0) {
      setErroQuantidade("A quantidade deve ser maior que zero.");
      return;
    }

    setErroQuantidade("");

    const metaAtualizada = {
      id: meta.id,
      periodo: periodo || meta.periodo,
      quantidade: Number(quantidade),
    };

    try {
      await atualizarMeta(metaAtualizada);
      onAlterarMeta(metaAtualizada);
      onClose(); // Fecha o modal após sucesso
    } catch (error) {
      console.error("Erro ao atualizar meta:", error);
    }
  };

  return (
    <div className={styles.contMetas}>
      <div className={styles.modalContent} ref={modalRef}>
        <HeaderModal
          onClose={onClose}
          titulo="Alterar Meta"
          icone={"/icones/alterar-metas-cameo-02.png"}
          altIcone={"Metas Cameo"}
        />

        <form onSubmit={handleSubmit}>
          <div className={styles.criacaoMeta}>
            <div className={styles.separador}>
              <h3>Selecione o período</h3>
              <div className={styles.metasPeriodo}>
                <input
                  type="radio"
                  id="ano"
                  name="periodo"
                  checked={periodo === "ano"}
                  onChange={() => setPeriodo("ano")}
                />
                <label htmlFor="ano">Ano</label>
                <input
                  type="radio"
                  id="mes"
                  name="periodo"
                  checked={periodo === "mes"}
                  onChange={() => setPeriodo("mes")}
                />
                <label htmlFor="mes">Mês</label>
                <input
                  type="radio"
                  id="semana"
                  name="periodo"
                  checked={periodo === "semana"}
                  onChange={() => setPeriodo("semana")}
                />
                <label htmlFor="semana">Semana</label>
                <input
                  type="radio"
                  id="dia"
                  name="periodo"
                  checked={periodo === "dia"}
                  onChange={() => setPeriodo("dia")}
                />
                <label htmlFor="dia">Dia</label>
              </div>
            </div>

            <div className={styles.separador}>
              <div className={styles.metasQuantidade}>
                <input
                  id="quantidade"
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  min="1"
                  placeholder="Adicione a quantidade de filmes"
                />
              </div>
              {erroQuantidade && (
                <p className={styles.erroMensagem}>{erroQuantidade}</p>
              )}
            </div>
          </div>

          <div className={styles.botoesFooter}>
            <div className={styles.cancelar} onClick={onClose}>
              <span>Cancelar</span>
            </div>
            <button type="submit">
              <span>Alterar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlterarMeta;
