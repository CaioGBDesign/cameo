import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionMetas from "@/components/section-metas";
import { useAuth } from "@/contexts/auth";
import styles from "./teste.module.scss";

export default function Teste() {
  const { limparMetas } = useAuth();

  return (
    <>
      <Head>
        <title>Cameo - Testes</title>
      </Head>

      <Header />
      <main className={styles.page}>
        <div className={styles.metas}>
          <SectionMetas />
        </div>

        <button onClick={limparMetas} style={{ marginTop: 40, cursor: "pointer" }}>
          Deletar todas as metas
        </button>
      </main>
      <Footer />
    </>
  );
}
