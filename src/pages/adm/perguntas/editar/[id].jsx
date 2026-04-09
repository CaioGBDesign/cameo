import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "@/services/firebaseConection";
import { doc, getDoc } from "firebase/firestore";
import AdmLayout from "@/components/adm/layout";
import Tipo1 from "../_tipos/Tipo1";
import Tipo2 from "../_tipos/Tipo2";
import Tipo3 from "../_tipos/Tipo3";
import Tipo4 from "../_tipos/Tipo4";
import Tipo5 from "../_tipos/Tipo5";
import Tipo6 from "../_tipos/Tipo6";
import Tipo9 from "../_tipos/Tipo9";
import Tipo10 from "../_tipos/Tipo10";
import Tipo11 from "../_tipos/Tipo11";

export default function EditarPergunta() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [tipo, setTipo] = useState(null);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!id) return;
    const carregar = async () => {
      try {
        const snap = await getDoc(doc(db, "perguntas", id));
        if (!snap.exists()) { router.replace("/adm/perguntas"); return; }
        const data = snap.data();
        setTipo(data.tipo ?? null);
        setInitialData(data);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [id]);

  if (loading) {
    return (
      <>
        <Head><title>Editar pergunta — Cameo ADM</title></Head>
        <AdmLayout />
      </>
    );
  }

  if (tipo === 1) return <Tipo1 id={id} initialData={initialData} />;
  if (tipo === 2) return <Tipo2 id={id} initialData={initialData} />;
  if (tipo === 3) return <Tipo3 id={id} initialData={initialData} />;
  if (tipo === 4) return <Tipo4 id={id} initialData={initialData} />;
  if (tipo === 5) return <Tipo5 id={id} initialData={initialData} />;
  if (tipo === 6) return <Tipo6 id={id} initialData={initialData} />;
  if (tipo === 9) return <Tipo9 id={id} initialData={initialData} />;
  if (tipo === 10) return <Tipo10 id={id} initialData={initialData} />;
  if (tipo === 11) return <Tipo11 id={id} initialData={initialData} />;

  return (
    <>
      <Head><title>Editar pergunta — Cameo ADM</title></Head>
      <AdmLayout />
    </>
  );
}
