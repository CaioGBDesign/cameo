import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/services/firebaseConection";
import { collection, getDocs } from "firebase/firestore";
import { useIsMobile } from "@/components/DeviceProvider";
import Head from "next/head";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/Header"));
const HeaderDesktop = dynamic(() => import("@/components/HeaderDesktop"));

export default function DubladoresPage() {
  const isMobile = useIsMobile();
  const [dubladores, setDubladores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarDubladores() {
      const snapshot = await getDocs(collection(db, "dubladores"));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Dubladores carregados do Firestore:", lista);
      setDubladores(lista);
      setLoading(false);
    }

    buscarDubladores();
  }, []);

  if (loading) return <p className="p-4">Carregando dubladores...</p>;

  return (
    <div className={styles.containerDublador}>
      <Head>
        <title>Cameo - favoritos</title>
        <meta
          name="description"
          content="Encontre seus filmes favoritos em um só lugar! Salve os títulos que você mais ama e tenha sempre à mão suas melhores recomendações."
        />
      </Head>

      {isMobile ? <Header /> : <HeaderDesktop />}

      <div className={styles.contListaDubladores}>
        <div className={styles.conteudoDubladores}>
          <h1>Todos os dubladores</h1>
          <div className={styles.listaDubladores}>
            {dubladores.map((dublador) => (
              <div className={styles.boxDublador}>
                <Link
                  key={dublador.id}
                  href={`/dubladores/detalhes-dubladores/${dublador.id}`}
                  passHref
                >
                  <div className={styles.imagemDublador}>
                    <img
                      src={dublador.imagemUrl}
                      alt={dublador.nomeArtistico}
                    />
                  </div>
                  <h2>{dublador.nomeArtistico}</h2>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
