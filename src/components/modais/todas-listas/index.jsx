import { useState } from "react";
import styles from "./index.module.scss";
import ModalViews from "@/components/modais/modal-views";
import TextInput from "@/components/inputs/text-input";
import Button from "@/components/button";
import EditIcon from "@/components/icons/EditIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";

export default function TodasListas({
  onClose,
  onCriar,
  listaSelecionada,
  onSelecionarLista,
}) {
  const { user, renomearLista, deletarLista } = useAuth();
  const isMobile = useIsMobile();
  const [view, setView] = useState(0); // 0 = lista, 1 = editar
  const [listaEditando, setListaEditando] = useState(null);
  const [nome, setNome] = useState("");
  const [salvando, setSalvando] = useState(false);

  const listas = user?.listasQueroVer || [];

  const abrirEditar = (lista) => {
    setListaEditando(lista);
    setNome(lista.nome);
    setView(1);
  };

  const handleVoltar = () => {
    setView(0);
    setListaEditando(null);
  };

  const handleSalvar = async () => {
    if (!nome.trim() || salvando) return;
    setSalvando(true);
    await renomearLista(listaEditando.id, nome.trim());
    setSalvando(false);
    handleVoltar();
  };

  const handleDeletar = async () => {
    await deletarLista(listaEditando.id);
    handleVoltar();
  };

  // View 0 — lista de todas as listas
  const listaContent = (
    <div className={styles.listaItens}>
      <div
        className={`${styles.listaItem} ${!listaSelecionada ? styles.listaItemAtiva : ""}`}
      >
        <div
          className={styles.tituloLista}
          onClick={() => {
            onSelecionarLista(null);
            onClose();
          }}
        >
          {!listaSelecionada && (
            <CheckIcon size={16} color="var(--icon-secondary)" />
          )}
          <span className={styles.listaItemNome}>Quero assistir</span>
        </div>
      </div>
      {listas.map((lista) => {
        const ativa = listaSelecionada?.id === lista.id;
        return (
          <div
            key={lista.id}
            className={`${styles.listaItem} ${ativa ? styles.listaItemAtiva : ""}`}
          >
            <div
              className={styles.tituloLista}
              onClick={() => {
                onSelecionarLista(lista);
                onClose();
              }}
            >
              {ativa && <CheckIcon size={16} color="var(--icon-secondary)" />}
              <span className={styles.listaItemNome}>{lista.nome}</span>
            </div>
            <div className={styles.contentBtn}>
              <button
                className={styles.editBtn}
                onClick={() => abrirEditar(lista)}
                aria-label={`Editar ${lista.nome}`}
              >
                <EditIcon size={18} color="currentColor" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const listaFooter = (
    <Button
      variant="solid"
      label="Criar lista"
      onClick={onCriar}
      width="100%"
    />
  );

  // View 1 — editar lista
  const editarContent = (
    <div className={styles.editContent}>
      <p className={styles.editLabel}>Digite / Altere o nome da lista</p>
      <TextInput
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSalvar()}
        autoFocus={view === 1}
      />
      <Button
        variant="ghost"
        label="Deletar lista"
        icon={<TrashIcon size={18} color="var(--color-error)" />}
        onClick={handleDeletar}
        color="var(--color-error)"
        width="100%"
      />
    </div>
  );

  const editarFooter = (
    <div className={styles.editarFooter}>
      <Button
        variant="ghost"
        label={isMobile ? undefined : "Voltar"}
        icon={isMobile ? <ChevronDownIcon size={20} color="currentColor" style={{ transform: "rotate(90deg)" }} /> : undefined}
        onClick={handleVoltar}
        width={isMobile ? "64px" : "160px"}
      />
      <Button
        variant="solid"
        label={salvando ? "Salvando..." : "Confirmar"}
        onClick={handleSalvar}
        disabled={!nome.trim() || salvando}
        width="100%"
      />
    </div>
  );

  const title =
    view === 1 && listaEditando ? listaEditando.nome : "Todas as listas";

  return (
    <ModalViews
      title={title}
      onClose={onClose}
      onBack={view === 1 ? handleVoltar : undefined}
      activeView={view}
      views={[
        { content: listaContent, footer: listaFooter },
        { content: editarContent, footer: editarFooter },
      ]}
    />
  );
}
