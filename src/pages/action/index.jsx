import { useEffect } from "react";
import { useRouter } from "next/router";

const ActionPage = () => {
  const router = useRouter();
  const { mode, oobCode } = router.query; // Obtém os parâmetros da URL

  useEffect(() => {
    if (mode === "verifyEmail") {
      router.push(`/confirmacao?oobCode=${oobCode}`);
    } else if (mode === "resetPassword") {
      router.push(`/redefinir-senha?oobCode=${oobCode}`);
    } else {
      router.push("/404"); // Redireciona para uma página de erro
    }
  }, [mode, oobCode, router]);

  return null; // Retorna null já que estamos redirecionando
};

export default ActionPage;
