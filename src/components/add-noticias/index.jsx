import styles from "./index.module.scss";
import { useState } from "react";
import { db, storage } from "@/services/firebaseConection";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddNoticiaSimples = () => {
  const [titulo, setTitulo] = useState("");
  const [capa, setCapa] = useState(null);
  const [capaPreview, setCapaPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Gera slug para URL amigável
  const gerarSlug = (titulo) => {
    return titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validações básicas
      if (!titulo.trim()) throw new Error("Digite um título");
      if (!capa) throw new Error("Selecione uma imagem de capa");

      // Upload da imagem
      const storageRef = ref(storage, `capas/${Date.now()}_${capa.name}`);
      const snapshot = await uploadBytes(storageRef, capa);
      const url = await getDownloadURL(snapshot.ref);

      // Criar documento no Firestore
      const slug = gerarSlug(titulo);
      await setDoc(doc(db, "noticias", slug), {
        titulo,
        capa: url,
        slug,
        dataPublicacao: new Date(),
      });

      // Resetar formulário
      setTitulo("");
      setCapa(null);
      setCapaPreview("");
      alert("Notícia salva com sucesso!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCapaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCapa(file);
      setCapaPreview(URL.createObjectURL(file));
    }
  };

  return (
    <main className={styles.ContNoticias}>
      <div className={styles.noticiasForm}>
        <h2>Adicionar Nova Notícia</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Título:</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título da notícia"
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Imagem de Capa:</label>
            <input
              type="file"
              onChange={handleCapaChange}
              accept="image/*"
              style={{ display: "block", margin: "0.5rem 0" }}
            />
            {capaPreview && (
              <img
                src={capaPreview}
                alt="Preview da capa"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  marginTop: "1rem",
                }}
              />
            )}
          </div>

          {error && (
            <div style={{ color: "red", margin: "1rem 0" }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              background: loading ? "#ccc" : "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {loading ? "Salvando..." : "Publicar notícia"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AddNoticiaSimples;
