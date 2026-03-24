import { useState } from "react";
import Modal from "@/components/modal";
import TextInput from "@/components/inputs/text-input";
import RadioButton from "@/components/inputs/radio-button";
import Switch from "@/components/inputs/switch";
import { useAuth } from "@/contexts/auth";
import styles from "./index.module.scss";

const PERIODOS = [
  { valor: "dia", label: "Diário" },
  { valor: "semana", label: "Semanal" },
  { valor: "mes", label: "Mensal" },
  { valor: "ano", label: "Anual" },
];

const TEMAS = [
  "Todos",
  "Animação",
  "Aventura",
  "Ação",
  "Cinema TV",
  "Comédia",
  "Crime",
  "Documentários",
  "Drama",
  "Família",
  "Fantasia",
  "Faroeste",
  "Ficção Científica",
  "Guerra",
  "História",
  "Mistério",
  "Musical",
  "Romance",
  "Terror",
  "Thriller",
];

const LOCAIS = ["Em casa", "No cinema", "Em todo canto"];

export default function CriarMeta({ onClose }) {
  const { adicionarMeta } = useAuth();
  const [nome, setNome] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [tema, setTema] = useState("Todos");
  const [local, setLocal] = useState("");
  const [deletarAoExpirar, setDeletarAoExpirar] = useState(false);

  const handleConfirmar = async () => {
    await adicionarMeta({
      nome,
      periodo,
      quantidade: Number(quantidade),
      tema,
      local,
      deletarAoExpirar,
      criadaEm: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Modal
      title="Criar meta"
      onClose={onClose}
      primaryAction={{ label: "Confirmar", onClick: handleConfirmar }}
    >
      <div className={styles.content}>
        <div className={styles.bloco}>
          <TextInput
            id="nome-meta"
            label="Qual será o nome dessa meta"
            placeholder="Ex: Maratonar clássicos"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <div className={styles.grupo}>
            <span className={styles.grupoLabel}>Adicione um período.<span className={styles.obrigatorio}>*</span></span>
            <div className={styles.radios}>
              {PERIODOS.map((p) => (
                <RadioButton
                  key={p.valor}
                  id={`periodo-${p.valor}`}
                  name="periodo"
                  label={p.label}
                  checked={periodo === p.valor}
                  onChange={() => setPeriodo(p.valor)}
                  iconVariant="none"
                />
              ))}
            </div>
          </div>

          <div className={styles.deletarCard}>
            <div className={styles.deletarTexto}>
              <span>Deletar meta concluída</span>
              <p>Essa ação deleta a meta concluída, mesmo sem atingir a quantidade de filmes definida.</p>
            </div>
            <Switch
              id="deletar-ao-expirar"
              checked={deletarAoExpirar}
              onChange={(e) => setDeletarAoExpirar(e.target.checked)}
            />
          </div>

          <TextInput
            id="quantidade-meta"
            label="Adicione a quantidade de filmes.*"
            placeholder="0"
            type="number"
            min={1}
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />

        </div>

        <div className={styles.bloco}>
          <div className={styles.grupo}>
            <span className={styles.grupoLabel}>Quer focar em algum tema?</span>
            <div className={styles.radios}>
              {TEMAS.map((t) => (
                <RadioButton
                  key={t}
                  id={`tema-${t}`}
                  name="tema"
                  label={t}
                  checked={tema === t}
                  onChange={() => setTema(t)}
                  iconVariant="none"
                />
              ))}
            </div>
          </div>

          <div className={styles.grupo}>
            <span className={styles.grupoLabel}>Onde pretende assistir</span>
            <div className={styles.radios}>
              {LOCAIS.map((l) => (
                <RadioButton
                  key={l}
                  id={`local-${l}`}
                  name="local"
                  label={l}
                  checked={local === l}
                  onChange={() => setLocal(l)}
                  iconVariant="none"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
