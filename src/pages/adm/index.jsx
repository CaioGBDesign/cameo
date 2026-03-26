import Head from "next/head";
import AdmLayout from "@/components/adm/layout";

export default function AdmDashboard() {
  return (
    <AdmLayout>
      <Head>
        <title>Cameo ADM</title>
      </Head>
      <h1>Dashboard</h1>
    </AdmLayout>
  );
}
