import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/services/firebaseConection";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/auth";
import AdmLayout from "@/components/adm/layout";
import CriarEstudio from "@/pages/adm/estudios/criar";

export default function EditarEstudio() {
  useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const carregar = async () => {
      try {
        const snap = await getDoc(doc(db, "estudios", id));
        if (!snap.exists()) {
          router.push("/adm/estudios");
          return;
        }
        setInitialData({ id: snap.id, ...snap.data() });
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [id]);

  if (loading) {
    return (
      <AdmLayout>
        <p
          style={{
            padding: "var(--space-2xl)",
            fontStyle: "italic",
            color: "var(--text-sub)",
          }}
        >
          Carregando...
        </p>
      </AdmLayout>
    );
  }

  return <CriarEstudio id={id} initialData={initialData} />;
}
