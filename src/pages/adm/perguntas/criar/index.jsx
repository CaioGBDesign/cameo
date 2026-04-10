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
import Tipo12 from "../_tipos/Tipo12";
import Tipo14 from "../_tipos/Tipo14";
import Tipo15 from "../_tipos/Tipo15";
import Tipo16 from "../_tipos/Tipo16";

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
  if (tipo === 12) return <Tipo12 />;
  if (tipo === 14) return <Tipo14 />;
  if (tipo === 15) return <Tipo15 />;
  if (tipo === 16) return <Tipo16 />;

  return (
    <>
      <Head><title>Criar pergunta — Cameo ADM</title></Head>
      <AdmLayout />
    </>
  );
}
