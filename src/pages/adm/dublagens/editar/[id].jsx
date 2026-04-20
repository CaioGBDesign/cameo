import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/services/firebaseConection";
import { doc, getDoc } from "firebase/firestore";
import CriarDublagem from "../criar";

export default function EditarDublagem() {
  const router = useRouter();
  const { id } = router.query;

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "filmes", id));
        if (!snap.exists()) {
          setNotFound(true);
          return;
        }
        setInitialData({ id: snap.id, ...snap.data() });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return null;
  if (notFound)
    return (
      <p
        style={{
          padding: "2rem",
          fontStyle: "italic",
          color: "var(--text-sub)",
        }}
      >
        Dublagem não encontrada.
      </p>
    );

  return <CriarDublagem id={id} initialData={initialData} />;
}
