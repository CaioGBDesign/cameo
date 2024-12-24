import styles from "./index.module.scss";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import HeaderModal from "@/components/modais/header-modais";

const AdicionarMeta = ({ onClose, nomeBotao }) => {
  // Recebe a função onClose
  const { adicionarMeta } = useAuth();
  const [periodo, setPeriodo] = useState("");
  const [quantidade, setQuantidade] = useState("");

  // Estado para controle de erro na quantidade
  const [erroQuantidade, setErroQuantidade] = useState("");

  // Define se está em dispositivo móvel
  const isMobile = useIsMobile();

  // Referência para o modal
  const modalRef = useRef(null);

  // Função para lidar com o clique fora do modal
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose(); // Fecha o modal
    }
  };

  // Adiciona o event listener quando o modal é aberto
  useEffect(() => {
    // Adiciona o listener ao clicar fora do modal
    document.addEventListener("mousedown", handleOutsideClick);

    // Remove o listener quando o componente for desmontado
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Valida a quantidade
    if (quantidade <= 0 || quantidade === "") {
      setErroQuantidade("Por favor, insira uma quantidade válida.");
      return;
    }

    setErroQuantidade(""); // Limpa a mensagem de erro

    // Cria o objeto de meta
    const meta = {
      periodo, // 'ano', 'mes', 'semana', 'dia'
      quantidade: Number(quantidade),
    };

    // Chama a função do contexto para adicionar a meta
    adicionarMeta(meta);

    // Reseta os campos do formulário
    setQuantidade("");
    setPeriodo("");

    // Fecha o modal após o envio
    onClose();

    setTimeout(() => {
      window.location.reload(); // Recarrega a página
    }, 500);
  };

  return (
    <div className={styles.contMetas}>
      <div
        className={styles.modalContent}
        ref={modalRef} // Atribui a referência ao modal
      >
        <HeaderModal
          onClose={onClose}
          titulo="Adicionar Meta"
          icone={"/icones/metas-cameo-02.png"}
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

          <button type="submit">{nomeBotao}</button>
        </form>
      </div>
    </div>
  );
};

export default AdicionarMeta;
