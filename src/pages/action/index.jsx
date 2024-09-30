import { useEffect } from "react";
import { useRouter } from "next/router";

const ActionPage = () => {
  const router = useRouter();
  const { mode, oobCode } = router.query;

  useEffect(() => {
    console.log("Modo:", mode);
    console.log("oobCode:", oobCode);

    if (mode && oobCode) {
      if (mode === "verifyEmail") {
        router.push(`/confirmacao?oobCode=${oobCode}`);
      } else if (mode === "resetPassword") {
        router.push(`/redefinir-senha?oobCode=${oobCode}`);
      } else {
        router.push("/404");
      }
    }
  }, [mode, oobCode, router]);

  if (!mode || !oobCode) {
    return <div>Carregando...</div>;
  }

  return null;
};

export default ActionPage;
