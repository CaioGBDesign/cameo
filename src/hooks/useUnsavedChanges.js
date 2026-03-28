import { useEffect } from "react";
import { useRouter } from "next/router";

export function useUnsavedChanges(isDirty) {
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      if (!isDirty) return;
      if (!window.confirm("Você tem alterações não salvas. Deseja sair mesmo assim?")) {
        router.events.emit("routeChangeError");
        throw "routeChangeAborted";
      }
    };
    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => router.events.off("routeChangeStart", handleRouteChangeStart);
  }, [isDirty, router.events]);
}
