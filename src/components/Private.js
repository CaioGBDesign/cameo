// components/Private.js

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth";

const Private = ({ children }) => {
  const { user, loadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.replace("/login"); // Redireciona para /login se não estiver autenticado
    }
  }, [user, loadingAuth, router]);

  // Se estiver carregando, exibe uma mensagem de carregamento
  if (loadingAuth) {
    return <div>Carregando...</div>;
  }

  // Se não estiver autenticado, retorna null (ou uma página de carregamento, se preferir)
  if (!user) {
    return null;
  }

  // Se estiver autenticado, renderiza o conteúdo da rota privada
  return children;
};

export default Private;
