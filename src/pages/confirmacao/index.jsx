import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth, applyActionCode, onAuthStateChanged } from "firebase/auth";
import styles from "./index.module.scss";

const Confirmacao = () => {
  const router = useRouter();
  const { oobCode } = router.query;
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("oobCode:", oobCode); // Verifique o valor do oobCode
    if (oobCode) {
      const auth = getAuth();
      applyActionCode(auth, oobCode)
        .then(() => {
          setShowModal(true);
        })
        .catch((error) => {
          console.error(
            "Erro ao verificar o e-mail:",
            error.code,
            error.message
          );
          setErrorMessage(
            "Erro ao verificar o e-mail. Tente novamente mais tarde."
          );
        });
    }
  }, [oobCode, router]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Se o usuário estiver autenticado, redirecione para a home
        const timeout = setTimeout(() => {
          router.push("/"); // Redireciona para a página inicial
        }, 3000); // Aguarda 3 segundos para mostrar a mensagem de sucesso

        // Limpeza do timeout ao desmontar o componente
        return () => clearTimeout(timeout);
      }
    });

    return () => unsubscribe(); // Limpa a assinatura ao desmontar
  }, [router]);

  return (
    <main>
      <div className={styles.ContVerificacao}>
        <div className={styles.verificacao}>
          {errorMessage && <span className={styles.error}>{errorMessage}</span>}
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
