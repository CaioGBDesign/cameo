import { useState, useEffect } from "react";
import Head from "next/head";
import { db } from "@/services/firebaseConection";
import { doc, getDoc, setDoc } from "firebase/firestore";
import AdmLayout from "@/components/adm/layout";
import Switch from "@/components/inputs/switch";
import styles from "./index.module.scss";

const CONFIGURACOES = [
  {
    key: "noticiasHabilitado",
    titulo: "Notícias",
    descricao: "Habilita a page de notícias publicamente",
  },
  {
    key: "resenhasHabilitado",
    titulo: "Resenhas",
    descricao: "Habilita a page de resenhas publicamente",
  },
  {
    key: "dubladoresHabilitado",
    titulo: "Dubladores",
    descricao: "Habilita a page de dubladores publicamente",
  },
  {
    key: "estudiosHabilitado",
    titulo: "Estúdios",
    descricao: "Habilita a page de estúdios publicamente",
  },
  {
    key: "gameHabilitado",
    titulo: "Desafio",
    descricao: "Habilita a page de desafio publicamente",
  },
];

export default function Configuracoes() {
  const [valores, setValores] = useState({
    noticiasHabilitado: true,
    resenhasHabilitado: true,
    dubladoresHabilitado: true,
    estudiosHabilitado: true,
    gameHabilitado: true,
  });
  const [salvando, setSalvando] = useState(null);

  useEffect(() => {
    getDoc(doc(db, "configuracoes", "site")).then((snap) => {
      if (snap.exists()) setValores((prev) => ({ ...prev, ...snap.data() }));
    });
  }, []);

  const handleToggle = async (key, novoValor) => {
    setValores((prev) => ({ ...prev, [key]: novoValor }));
    setSalvando(key);
    await setDoc(
      doc(db, "configuracoes", "site"),
      { [key]: novoValor },
      { merge: true },
    );
    setSalvando(null);
  };

  return (
    <AdmLayout>
      <Head>
        <title>Cameo ADM - Configurações</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.pageTitulo}>
          <h1>Configurações</h1>
        </div>
        <div className={styles.container}>
          {CONFIGURACOES.map((config) => (
            <div key={config.key} className={styles.linha}>
              <div className={styles.info}>
                <span className={styles.titulo}>{config.titulo}</span>
                <span className={styles.descricao}>{config.descricao}</span>
              </div>
              <Switch
                id={config.key}
                checked={valores[config.key]}
                onChange={(e) => handleToggle(config.key, e.target.checked)}
              />
              {salvando === config.key && (
                <span className={styles.salvando}>salvando...</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdmLayout>
  );
}
