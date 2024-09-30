import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.scss";

const Confirmacao = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true); // Inicialmente, a modal é exibida

  useEffect(() => {
    // Redireciona após 3 segundos
    const timeout = setTimeout(() => {
      router.push("/");
    }, 3000); // Ajuste o tempo conforme necessário

    // Limpeza do timeout ao desmontar o componente
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main>
      <div className={styles.ContVerificacao}>
        <div className={styles.verificacao}>
          {showModal && (
            <div className={styles.modal}>
              <iframe src="https://lottie.host/embed/e63e127f-b913-48cb-b2f5-408397b5deba/2fa23oBAHX.json"></iframe>

              <span>E-mail verificado com sucesso</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Confirmacao;
