import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { db } from "@/services/firebaseConection";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loading from "@/components/loading";
import AvatarDublador from "@/components/avatar-dublador";
import Badge from "@/components/badge";
import styles from "./index.module.scss";

export async function getServerSideProps() {
  const configSnap = await getDoc(doc(db, "configuracoes", "site"));
  const config = configSnap.exists() ? configSnap.data() : {};
  if (config.estudiosHabilitado === false) return { notFound: true };
  return { props: {} };
}

export default function EstudiosPage() {
  const [estudios, setEstudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    getDocs(collection(db, "estudios")).then((snap) => {
      const lista = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.nome ?? "").localeCompare(b.nome ?? "", "pt"));
      setEstudios(lista);
      setLoading(false);
    });
  }, []);

  const normalizar = (str) =>
    (str ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filtrados = busca.trim()
    ? estudios.filter((e) =>
        normalizar(e.nome).includes(normalizar(busca)) ||
        normalizar(e.nomePopular).includes(normalizar(busca)),
      )
    : estudios;

  return (
    <>
      <Head>
        <title>Estúdios de dublagem — Cameo</title>
      </Head>
      <Header />

      <main className={styles.page}>
        <div className={styles.topo}>
          <h1>Estúdios de dublagem</h1>
          <input
            className={styles.busca}
            type="text"
            placeholder="Buscar estúdio..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className={styles.grid}>
            {filtrados.map((estudio) => (
              <Link
                key={estudio.id}
                href={`/estudios/${estudio.id}`}
                className={styles.card}
              >
                <AvatarDublador
                  src={estudio.imagemUrl}
                  alt={estudio.nome}
                  size={72}
                />
                <div className={styles.cardInfo}>
                  <span className={styles.nome}>{estudio.nome}</span>
                  {estudio.nomePopular && (
                    <span className={styles.nomePopular}>
                      {estudio.nomePopular}
                    </span>
                  )}
                  <Badge
                    label={estudio.ativo ? "Ativo" : "Inativo"}
                    variant="outline"
                    borda={
                      estudio.ativo
                        ? "--primitive-azul-01"
                        : "--primitive-erro-01"
                    }
                    color={
                      estudio.ativo
                        ? "--primitive-azul-01"
                        : "--primitive-erro-01"
                    }
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}