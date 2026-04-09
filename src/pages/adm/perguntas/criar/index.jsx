import Head from "next/head";
import { useRouter } from "next/router";
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

export default function CriarPergunta() {
  const router = useRouter();

  if (!router.isReady) return null;

  const tipo = router.query.tipo ? parseInt(router.query.tipo) : null;

  if (tipo === 1) return <Tipo1 />;
  if (tipo === 2) return <Tipo2 />;
  if (tipo === 3) return <Tipo3 />;
  if (tipo === 4) return <Tipo4 />;
  if (tipo === 5) return <Tipo5 />;
  if (tipo === 6) return <Tipo6 />;
  if (tipo === 9) return <Tipo9 />;
  if (tipo === 10) return <Tipo10 />;
  if (tipo === 11) return <Tipo11 />;

  return (
    <>
      <Head><title>Criar pergunta — Cameo ADM</title></Head>
      <AdmLayout />
    </>
  );
}
