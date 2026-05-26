import { useState, useEffect } from "react";
import Head from "next/head";
import { db } from "@/services/firebaseConection";
import { doc, getDoc, setDoc } from "firebase/firestore";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import Switch from "@/components/inputs/switch";
import styles from "./index.module.scss";

const CONFIGURACOES = [
  {
    titulo: "Notícias",
    descricao: "Habilita a page de notícias publicamente",
    keyProducao: "noticiasHabilitado",
    keyTeste: "noticiasModoTeste",
  },
  {
    titulo: "Resenhas",
    descricao: "Habilita a page de resenhas publicamente",
    keyProducao: "resenhasHabilitado",
    keyTeste: "resenhasModoTeste",
  },
  {
    titulo: "Dubladores",
    descricao: "Habilita a page de dubladores publicamente",
    keyProducao: "dubladoresHabilitado",
    keyTeste: "dubladoresModoTeste",
  },
  {
    titulo: "Estúdios",
    descricao: "Habilita a page de estúdios publicamente",
    keyProducao: "estudiosHabilitado",
    keyTeste: "estudiosModoTeste",
  },
  {
    titulo: "Desafio",
    descricao: "Habilita a page de desafio publicamente",
    keyProducao: "gameHabilitado",
    keyTeste: "desafioModoTeste",
  },
];

const DEFAULTS = {
  noticiasHabilitado: true,
  noticiasModoTeste: false,
  resenhasHabilitado: true,
  resenhasModoTeste: false,
  dubladoresHabilitado: true,
  dubladoresModoTeste: false,
  estudiosHabilitado: true,
  estudiosModoTeste: false,
  gameHabilitado: true,
  desafioModoTeste: false,
};

export default function Configuracoes() {
  const [valores, setValores] = useState(DEFAULTS);
  const [salvos, setSalvos] = useState(DEFAULTS);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "configuracoes", "site")).then((snap) => {
      if (snap.exists()) {
        const data = { ...DEFAULTS, ...snap.data() };
        setValores(data);
        setSalvos(data);
      }
    });
  }, []);

  const handleToggle = (key, novoValor) => {
    setValores((prev) => ({ ...prev, [key]: novoValor }));
  };

  const hasChanges = JSON.stringify(valores) !== JSON.stringify(salvos);

  const handlePublicar = async () => {
    setSalvando(true);
    await setDoc(doc(db, "configuracoes", "site"), valores, { merge: true });
    setSalvos(valores);
    setSalvando(false);
  };

  const headerActions = (
    <Button
      variant="ghost"
      label={salvando ? "Publicando..." : "Publicar"}
      onClick={handlePublicar}
      disabled={salvando || !hasChanges}
      border="var(--stroke-base)"
    />
  );

  return (
    <AdmLayout headerActions={headerActions}>
      <Head>
        <title>Cameo ADM - Configurações</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.pageTitulo}>
          <h1>Configurações</h1>
        </div>
        <div className={styles.container}>
          <div className={styles.cabecalho}>
            <span className={styles.cabecalhoTitulo}>Páginas</span>
            <span className={styles.cabecalhoColuna}>Teste</span>
            <span className={styles.cabecalhoColuna}>Produção</span>
          </div>

          {CONFIGURACOES.map((config) => (
            <div key={config.keyProducao} className={styles.linha}>
              <div className={styles.info}>
                <span className={styles.titulo}>{config.titulo}</span>
                <span className={styles.descricao}>{config.descricao}</span>
              </div>

              <div className={styles.switchCell}>
                <Switch
                  id={config.keyTeste}
                  checked={valores[config.keyTeste] ?? false}
                  onChange={(e) =>
                    handleToggle(config.keyTeste, e.target.checked)
                  }
                />
              </div>

              <div className={styles.switchCell}>
                <Switch
                  id={config.keyProducao}
                  checked={valores[config.keyProducao] ?? true}
                  onChange={(e) =>
                    handleToggle(config.keyProducao, e.target.checked)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdmLayout>
  );
}
