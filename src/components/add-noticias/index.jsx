import styles from "./index.module.scss";
import { useState, useEffect, useRef } from "react";
import { db, storage } from "@/services/firebaseConection";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/auth";
import { doc, getDoc } from "firebase/firestore";
import BotaoPrimario from "@/components/botoes/primarios";
import Loading from "@/components/loading";
import HeaderModal from "@/components/modais/header-modais";
import { useRouter } from "next/router";
import { reload } from "firebase/auth";

const AddNoticias = ({ onClose }) => {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [elementos, setElementos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [numero, setNumero] = useState("");
  const [userData, setUserData] = useState(null);

  const TIPO_ELEMENTO = {
    PARAGRAFO: "paragrafo",
    IMAGEM: "imagem",
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUserData(data); // Armazena os dados no state
            console.log("Dados do usuário:", data);
          } else {
            console.log("Documento do usuário não encontrado!");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      }
    };

    if (!user) {
      router.push("/login");
    } else {
      setLoading(false);
      fetchUserData();
    }
  }, [user, router]);

  const limparFormulario = () => {
    elementos.forEach((elemento) => {
      if (elemento.tipo === TIPO_ELEMENTO.IMAGEM && elemento.preview) {
        URL.revokeObjectURL(elemento.preview);
      }
    });

    setTitulo("");
    setSubtitulo("");
    setElementos([]);
    setNumero("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      elementos.forEach((elemento) => {
        if (elemento.tipo === TIPO_ELEMENTO.IMAGEM && elemento.preview) {
          URL.revokeObjectURL(elemento.preview);
        }
      });
    };
  }, [elementos]);

  const adicionarElemento = (tipo) => {
    setElementos([
      ...elementos,
      { tipo, conteudo: "", preview: null, file: null },
    ]);
  };

  const handleParagrafoChange = (index, valor) => {
    const novosElementos = [...elementos];
    novosElementos[index].conteudo = valor;
    setElementos(novosElementos);
  };

  const handleImagemChange = (file) => {
    const novosElementos = elementos.filter(
      (el) => el.tipo !== TIPO_ELEMENTO.IMAGEM
    );

    if (file) {
      const preview = URL.createObjectURL(file);
      novosElementos.push({
        tipo: TIPO_ELEMENTO.IMAGEM,
        conteudo: "uploading",
        preview,
        file,
      });
    }

    setElementos(novosElementos);

    // Limpa o input se remover a imagem
    if (!file && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!user || !userData) {
        throw new Error("Dados do usuário não disponíveis");
      }

      const elementosProcessados = await Promise.all(
        elementos.map(async (elemento) => {
          if (elemento.tipo === TIPO_ELEMENTO.IMAGEM && elemento.file) {
            const storageRef = ref(
              storage,
              `noticias/${Date.now()}_${elemento.file.name}`
            );
            await uploadBytes(storageRef, elemento.file);
            const url = await getDownloadURL(storageRef);
            return { tipo: elemento.tipo, conteudo: url };
          }
          return elemento;
        })
      );

      await addDoc(collection(db, "noticias"), {
        titulo,
        subtitulo,
        numero: Number(numero),
        elementos: elementosProcessados,
        autor: {
          id: user.uid,
          nome: userData.nome,
          avatarUrl: userData.avatarUrl,
        },
        dataPublicacao: serverTimestamp(),
      });

      limparFormulario();
      window.location.reload();
    } catch (err) {
      console.error("Erro ao publicar:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className={styles.ContNoticias}>
      <div className={styles.noticiasForm}>
        <HeaderModal
          onClose={onClose}
          titulo="Adicionar notícia"
          icone={"/icones/filtros-cameo-02.png"}
          iconeMobile={"/icones/filtros-cameo-mobile-01.png"}
          altIcone={"Filtros Cameo"}
        />
        <div className={styles.AddNoticia}>
          <form onSubmit={handleSubmit} className={styles.FormNoticia}>
            <div className={styles.scrollNoticia}>
              <div className={styles.conteudoNoticia}>
                <div className={styles.FormGroup}>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    placeholder="Título da notícia"
                    maxLength="120"
                  />
                </div>

                <div className={styles.FormGroup}>
                  <input
                    type="text"
                    value={subtitulo}
                    onChange={(e) => setSubtitulo(e.target.value)}
                    placeholder="Subtítulo da notícia"
                    maxLength="200"
                  />
                </div>

                <input
                  type="number"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  required
                  placeholder="Tempo de leitura"
                  min="0"
                  max={new Date().getFullYear()}
                />

                <div className={styles.FormGroup}>
                  <div className={styles.uploadContainer}>
                    <label className={styles.customFileLabel}>
                      {/* Estado sem imagem */}
                      {!elementos.some(
                        (el) => el.tipo === TIPO_ELEMENTO.IMAGEM
                      ) && (
                        <span className={styles.labelContent}>
                          <img
                            src="/icones/upload.svg"
                            alt="Ícone upload"
                            className={styles.uploadIcon}
                          />
                          <div className={styles.textos}>
                            <span className={styles.textoLabel}>
                              Selecionar imagem
                            </span>
                            <span className={styles.subTextoLabel}>
                              Dimensões recomendadas 1440x480
                            </span>
                          </div>
                        </span>
                      )}

                      {/* Estado com imagem */}
                      {elementos.some(
                        (el) => el.tipo === TIPO_ELEMENTO.IMAGEM
                      ) && (
                        <div className={styles.previewContainer}>
                          <div className={styles.imagemPreview}>
                            <img
                              src={
                                elementos.find(
                                  (el) => el.tipo === TIPO_ELEMENTO.IMAGEM
                                ).preview
                              }
                              alt="Preview"
                              className={styles.imagePreview}
                            />
                          </div>

                          <div className={styles.actionsOverlay}>
                            <button
                              type="button"
                              className={styles.actionButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current.click();
                              }}
                              title="Alterar imagem"
                            >
                              <img
                                src="/icones/editar.svg"
                                alt="Alterar"
                                className={styles.actionIcon}
                              />
                              <span>Alterar imagem</span>
                            </button>
                          </div>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImagemChange(e.target.files[0])}
                        className={styles.hiddenFileInput}
                        required
                        ref={fileInputRef}
                      />
                    </label>
                  </div>
                </div>

                {elementos.map((elemento, index) =>
                  elemento.tipo === TIPO_ELEMENTO.PARAGRAFO ? (
                    <div key={index} className={styles.FormGroup}>
                      <div className={styles.paragrafoBox}>
                        <textarea
                          value={elemento.conteudo}
                          onChange={(e) =>
                            handleParagrafoChange(index, e.target.value)
                          }
                          rows="4"
                          placeholder={`Parágrafo ${index + 1}`}
                          required
                        />
                      </div>
                    </div>
                  ) : null
                )}

                <div className={styles.BotoesAcao}>
                  <button
                    type="button"
                    onClick={() => adicionarElemento(TIPO_ELEMENTO.PARAGRAFO)}
                    className={styles.BotaoAdicionar}
                    disabled={loading}
                  >
                    + Parágrafo
                  </button>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}
              </div>
            </div>

            <BotaoPrimario
              textoBotaoPrimario={
                loading ? "Publicando..." : "Publicar Notícia"
              }
              type="submit"
              disabled={loading}
            />
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddNoticias;
