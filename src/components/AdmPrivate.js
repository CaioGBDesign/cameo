import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth";
import Loading from "@/components/loading";

const AdmPrivate = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) return <Loading />;

  return user?.isAdmin ? children : null;
};

export default AdmPrivate;
