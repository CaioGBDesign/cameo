// pages/filmesDubladores.jsx
import styles from "./index.module.scss";
import { useState } from "react";
import { db } from "@/services/firebaseConection";
import { doc, setDoc } from "firebase/firestore";
import { useIsMobile } from "@/components/DeviceProvider";
import Head from "next/head";
import dynamic from "next/dynamic";
import BotaoPrimario from "@/components/botoes/primarios";

const Header = dynamic(() => import("@/components/Header"));
const HeaderDesktop = dynamic(() => import("@/components/HeaderDesktop"));

export default function FilmesDubladores() {
  const [codigoFilme, setCodigoFilme] = useState("");
  const [entradas, setEntradas] = useState([
    { dublador: "", personagem: "", atorOriginal: "" },
  ]);
  const [status, setStatus] = useState("");
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);

  const adicionarEntrada = () => {
    setEntradas([
      ...entradas,
      { dublador: "", personagem: "", atorOriginal: "" },
    ]);
  };

  const atualizarEntrada = (index, campo, valor) => {
    const novasEntradas = [...entradas];
    novasEntradas[index][campo] = valor;
    setEntradas(novasEntradas);
  };

  const salvarDados = async () => {
    setLoading(true);
    setStatus("");

    if (
      !codigoFilme.trim() ||
      entradas.some(
        (e) =>
          !e.dublador.trim() || !e.personagem.trim() || !e.atorOriginal.trim()
      )
    ) {
      setStatus("Preencha todos os campos antes de salvar.");
      setLoading(false);
      return;
    }

    try {
      // Salva no Firestore na coleção "filmes", com ID igual ao código do filme
      await setDoc(doc(db, "filmes", codigoFilme), {
        dubladores: entradas.map((e) => ({
          dublador: e.dublador.trim(),
          personagem: e.personagem.trim(),
          atorOriginal: e.atorOriginal.trim(),
        })),
      });

      setStatus("Dubladores salvos com sucesso!");
      setCodigoFilme("");
      setEntradas([{ dublador: "", personagem: "", atorOriginal: "" }]);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setStatus("Erro ao salvar os dados.");
    }
  };

  return (
    <div className={styles.containerFilmeDubladores}>
      <Head>
        <title>Cameo - cadastro de dubladores em filmes</title>
        <meta
          name="description"
          content="Reviva suas experiências cinematográficas! Veja todos os filmes que você já assistiu, avalie suas escolhas e compartilhe suas opiniões com a comunidade."
        />
      </Head>

      {isMobile ? <Header /> : <HeaderDesktop />}

      <div className={styles.formFilmesDubladores}>
        <h1>Cadastro de Dubladores por Filme</h1>

        <div className={styles.codigoFilme}>
          <input
            type="text"
            value={codigoFilme}
            onChange={(e) => setCodigoFilme(e.target.value)}
            placeholder="Código do Filme"
            style={{ marginLeft: 8 }}
          />
        </div>

        {entradas.map((entrada, index) => (
          <div key={index} className={styles.codigoDublador}>
            <input
              type="text"
              placeholder="Código do dublador (ex: DB0001)"
              value={entrada.dublador}
              onChange={(e) =>
                atualizarEntrada(index, "dublador", e.target.value)
              }
              style={{ marginRight: 8 }}
            />
            <input
              type="text"
              placeholder="Nome do personagem (ex: Hermione Granger)"
              value={entrada.personagem}
              onChange={(e) =>
                atualizarEntrada(index, "personagem", e.target.value)
              }
              style={{ marginRight: 8 }}
            />
            <input
              type="text"
              placeholder="Ator original (ex: Emma Watson)"
              value={entrada.atorOriginal}
              onChange={(e) =>
                atualizarEntrada(index, "atorOriginal", e.target.value)
              }
            />
          </div>
        ))}

        <div className={styles.botoes}>
          <button onClick={adicionarEntrada} className={styles.botaoSecundario}>
            + Adicionar Dublador
          </button>

          <BotaoPrimario
            textoBotaoPrimario={loading ? "Salvando..." : "Salvar"}
            typeBprimario="button"
            onClick={salvarDados}
          />
        </div>

        {status && <p style={{ marginTop: 10 }}>{status}</p>}
      </div>
    </div>
  );
}
