import Head from "next/head";
import { db } from "@/services/firebaseConection";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./index.module.scss";

export async function getServerSideProps() {
  const configSnap = await getDoc(doc(db, "configuracoes", "site"));
  const config = configSnap.exists() ? configSnap.data() : {};
  if (config.gameHabilitado === false) return { notFound: true };
  return { props: {} };
}

export default function DesafioPage() {
  return (
    <>
      <Head>
        <title>Desafio — Cameo</title>
      </Head>
      <Header />
      <main className={styles.page}>
      </main>
      <Footer />
    </>
  );
}