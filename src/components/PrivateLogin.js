import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Inclui loading para evitar renderizações prematuras
  const router = useRouter();

  useEffect(() => {
    // Se o usuário está carregando, não faz nada
    if (loading) return;

    // Redireciona se o usuário não estiver autenticado ou se o email não estiver verificado
    if (!user || (user && !user.emailVerified)) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Se o usuário não estiver autenticado, não renderize nada
  if (!user || (user && !user.emailVerified)) {
    return null;
  }

  return children; // Renderiza os filhos se o usuário estiver autenticado
};

export default PrivateRoute;
