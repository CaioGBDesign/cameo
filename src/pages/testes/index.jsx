import Head from "next/head";
import Private from "@/components/Private";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardMeta from "@/components/card-meta";
import { useAuth } from "@/contexts/auth";
import styles from "./index.module.scss";

export default function Testes() {
  const { user } = useAuth();

  const metas = Array.isArray(user?.metas) ? user.metas : [];
  const filmesVistos = Object.keys(user?.visto || {}).length;

  return (
    <Private>
      <Head>
        <title>Cameo - Testes</title>
      </Head>

      <Header />

      <main className={styles.page}>
        <div className={styles.allMetas}>
          {metas.length === 0 ? (
            <p>Nenhuma meta cadastrada.</p>
          ) : (
            metas.map((meta) => (
              <CardMeta key={meta.id} meta={meta} filmesVistos={filmesVistos} />
            ))
          )}
        </div>
      </main>

      <Footer />
    </Private>
  );
}
