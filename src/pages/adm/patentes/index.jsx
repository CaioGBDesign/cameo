import { useState } from "react";
import Head from "next/head";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import ModalCriarPatente from "@/components/modais/modal-criar-patente";
import styles from "./index.module.scss";

export default function AdmPatentes() {
  const [modalCriarAberto, setModalCriarAberto] = useState(false);

  return (
    <AdmLayout>
      <Head>
        <title>Patentes | Cameo ADM</title>
      </Head>

      {modalCriarAberto && (
        <ModalCriarPatente onClose={() => setModalCriarAberto(false)} />
      )}

      <div className={styles.page}>
        <div className={styles.cabecalho}>
          <h1 className={styles.titulo}>Patentes</h1>
          <Button
            variant="ghost"
            label="Criar patente"
            type="button"
            onClick={() => setModalCriarAberto(true)}
            border="var(--stroke-base)"
          />
        </div>
      </div>
    </AdmLayout>
  );
}