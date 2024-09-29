import { useEffect } from "react";
import { verifyEmail } from "firebase/auth";
import { auth } from "@/services/firebaseConection"; // ou onde seu firebase estiver configurado
import { useRouter } from "next/router";
import styles from "./index.module.scss";

const Confirmacao = () => {
  const router = useRouter();

  useEffect(() => {
    const { oobCode } = router.query;

    if (oobCode) {
      verifyEmail(auth, oobCode)
        .then(() => {
          // E-mail verificado com sucesso
          router.push("/"); // redireciona para o seu site
        })
        .catch((error) => {
          console.error("Erro ao verificar o e-mail:", error);
          // Você pode redirecionar para uma página de erro ou exibir uma mensagem
        });
    }
  }, [router.query]);

  return (
    <main>
      <div className={styles.ContVerificacao}>
        <div className={styles.verificacao}>
          <span>Verificando seu e-mail...</span>
        </div>
      </div>
    </main>
  );
};

export default Confirmacao;
