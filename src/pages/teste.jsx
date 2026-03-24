import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/button";
import { useAlertaMeta } from "@/contexts/alert-meta";
import styles from "./teste.module.scss";

const META_FAKE = {
  id: "teste-123",
  nome: "Meta anual",
  periodo: "ano",
  quantidade: 20,
  filmesVistosPeriodo: 0,
};

export default function Teste() {
  const { adicionarAlerta } = useAlertaMeta();

  const disparar = (tipo, extra = {}) => {
    adicionarAlerta({
      tipo,
      meta: META_FAKE,
      progresso: extra.progresso ?? 70,
      milestone: extra.milestone ?? 70,
      dataTermino: "25 de março",
      filmesFaltando: extra.filmesFaltando ?? 6,
      diasRestantes: extra.diasRestantes ?? 2,
      ...extra,
    });
  };

  return (
    <>
      <Head>
        <title>Cameo - Testes</title>
      </Head>

      <Header />
      <main className={styles.page}>
        <div className={styles.testeAlertas}>
          <h2 className={styles.testeTitle}>Alertas de Meta</h2>
          <div className={styles.testeBotoes}>
            <Button
              variant="outline"
              label="⏰ Tempo acabando"
              border="var(--stroke-base)"
              arrowColor="var(--stroke-base)"
              onClick={() =>
                disparar("tempo-acabando", {
                  progresso: 70,
                  filmesFaltando: 6,
                  diasRestantes: 2,
                })
              }
            />
            <Button
              variant="outline"
              label="🗑️ Meta deletada"
              border="var(--stroke-base)"
              arrowColor="var(--stroke-base)"
              onClick={() =>
                disparar("deletada-sistema", {
                  progresso: 90,
                  filmesFaltando: 2,
                })
              }
            />
            <Button
              variant="outline"
              label="📈 Quase concluída (50%)"
              border="var(--stroke-base)"
              arrowColor="var(--stroke-base)"
              onClick={() =>
                disparar("quase-concluida", {
                  progresso: 50,
                  milestone: 50,
                  filmesFaltando: 10,
                })
              }
            />
            <Button
              variant="outline"
              label="📈 Quase concluída (70%)"
              border="var(--stroke-base)"
              arrowColor="var(--stroke-base)"
              onClick={() =>
                disparar("quase-concluida", {
                  progresso: 70,
                  milestone: 70,
                  filmesFaltando: 6,
                })
              }
            />
            <Button
              variant="outline"
              label="📈 Quase concluída (90%)"
              border="var(--stroke-base)"
              arrowColor="var(--stroke-base)"
              onClick={() =>
                disparar("quase-concluida", {
                  progresso: 90,
                  milestone: 90,
                  filmesFaltando: 2,
                })
              }
            />
            <Button
              variant="solid"
              label="🏆 Meta concluída"
              onClick={() => disparar("concluida", { progresso: 100 })}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
