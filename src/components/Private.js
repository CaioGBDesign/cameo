// components/Private.js

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth";

const Private = ({ children }) => {
  const { user, loadingAuth } = useAuth();
  const router = useRouter();

  // Verifique se a URL atual é uma das que podem ser acessadas sem autenticação
  const publicPaths = ["/", "/login", "/cadastro"];

  useEffect(() => {
    // Se não estiver carregando e não estiver autenticado
    if (!loadingAuth && !user) {
      // Se a rota atual não for pública, redireciona para /login
      if (!publicPaths.includes(router.pathname)) {
        router.replace("/login");
      }
    }
  }, [user, loadingAuth, router]);

  // Se estiver carregando, exibe uma mensagem de carregamento
  if (loadingAuth) {
    return <div>Carregando...</div>;
  }

  // Se não estiver autenticado e a rota for pública, renderiza o conteúdo
  if (!user && publicPaths.includes(router.pathname)) {
    return children;
  }

  // Se estiver autenticado, renderiza o conteúdo da rota privada
  return user ? children : null;
};

export default Private;
