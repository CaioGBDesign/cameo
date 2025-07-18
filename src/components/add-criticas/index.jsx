import styles from "./index.module.scss";
import { useState, useEffect, useRef } from "react";
import { db, storage } from "@/services/firebaseConection";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/auth";
import BotaoPrimario from "@/components/botoes/primarios";
import Loading from "@/components/loading";
import HeaderModal from "@/components/modais/header-modais";
import { useRouter } from "next/router";

const AddCriticas = ({ onClose }) => {
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
  const [categoria, setCategoria] = useState("");
  const [classificacao, setClassificacao] = useState("");
  const textareaRefs = useRef([]);

  const TIPO_ELEMENTO = {
    PARAGRAFO: "paragrafo",
    IMAGEM: "imagem",
  };

  const gerarSlug = (titulo) => {
    return titulo
      .toLowerCase()
      .normalize("NFD") // Remove acentos
      .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
      .replace(/[^a-z0-9 ]/g, "") // Mantém apenas letras, números e espaços
      .replace(/\s+/g, "-") // Substitui espaços por hifens
      .replace(/-+/g, "-") // Remove hifens consecutivos
      .trim() // Remove espaços extras no início e fim
      .replace(/^-+|-+$/g, ""); // Remove hifens no início e fim
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
    setClassificacao("");
    setCategoria("");
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

      const slug = gerarSlug(titulo);
      if (!slug) throw new Error("Título inválido para gerar URL");

      // Verifica se o documento já existe
      const docRef = doc(db, "criticas", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        throw new Error("Já existe uma resenha com este título");
      }

      const elementosProcessados = await Promise.all(
        elementos.map(async (elemento) => {
          if (elemento.tipo === TIPO_ELEMENTO.IMAGEM && elemento.file) {
            const storageRef = ref(
              storage,
              `criticas/${Date.now()}_${elemento.file.name}`
            );
            await uploadBytes(storageRef, elemento.file);
            const url = await getDownloadURL(storageRef);
            return { tipo: elemento.tipo, conteudo: url };
          }
          return elemento;
        })
      );

      // Cria o documento com ID customizado
      await setDoc(docRef, {
        titulo,
        subtitulo,
        numero: Number(numero),
        classificacao: Number(classificacao),
        categoria,
        elementos: elementosProcessados,
        autor: {
          id: user.uid,
          nome: userData.nome,
          avatarUrl: userData.avatarUrl,
        },
        dataPublicacao: serverTimestamp(),
        slug,
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

  const aplicarEstilo = (index, tipo) => {
    const textarea = textareaRefs.current[index];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) return;

    // Mapeamento corrigido
    const tagMap = {
      bold: {
        abertura: '<strong class="boldtext">',
        fechamento: "</strong>",
      },
      italic: {
        abertura: '<em class="italictext">',
        fechamento: "</em>",
      },
    };

    const estilo = tagMap[tipo];
    if (!estilo) {
      console.error("Tipo de estilo não reconhecido:", tipo);
      return;
    }

    const textoAtual = elementos[index].conteudo;
    const selectedText = textoAtual.substring(start, end);

    const novoTexto =
      textoAtual.substring(0, start) +
      `${estilo.abertura}${selectedText}${estilo.fechamento}` +
      textoAtual.substring(end);

    const novosElementos = [...elementos];
    novosElementos[index].conteudo = novoTexto;
    setElementos(novosElementos);

    setTimeout(() => {
      textarea.focus();
      const offset = estilo.abertura.length + estilo.fechamento.length;
      textarea.setSelectionRange(end + offset, end + offset);
    }, 0);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className={styles.ContCriticas}>
      <div className={styles.criticasForm}>
        <HeaderModal
          onClose={onClose}
          titulo="Adicionar crítica"
          icone={
            "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Ffiltros-cameo-02.png?alt=media&token=4e691c49-c482-49b7-9f0b-4de953eabe68"
          }
          iconeMobile={
            "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Ffiltros-cameo-mobile-01.png?alt=media&token=fa335112-96ee-4f38-99f9-921cd213f686"
          }
          altIcone={"Filtros Cameo"}
        />
        <div className={styles.AddCriticas}>
          <form onSubmit={handleSubmit} className={styles.FormCriticas}>
            <div className={styles.scrollCriticas}>
              <div className={styles.conteudoCriticas}>
                <div className={styles.FormGroup}>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    placeholder="Título da crítica"
                    maxLength="120"
                  />
                </div>

                <div className={styles.FormGroup}>
                  <input
                    type="text"
                    value={subtitulo}
                    onChange={(e) => setSubtitulo(e.target.value)}
                    placeholder="Subtítulo da crítica"
                    maxLength="200"
                  />
                </div>

                <div className={styles.FormFlex}>
                  <input
                    type="number"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    required
                    placeholder="Tempo de leitura"
                    min="0"
                    max={new Date().getFullYear()}
                  />

                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className={styles.selectInput}
                    required
                  >
                    <option value="">Selecione a categoria</option>
                    {/* <option value="series">Séries de TV</option> */}

                    <option value="filmes">Filmes</option>
                  </select>

                  <select
                    value={classificacao}
                    onChange={(e) => setClassificacao(e.target.value)}
                    className={styles.selectInput}
                    required
                  >
                    <option value="">Selecione a avaliação</option>
                    <option value="1">★ - Zuado</option>
                    <option value="2">★★ - Ok</option>
                    <option value="3">★★★ - Gostei</option>
                    <option value="4">★★★★ - Sinistro</option>
                    <option value="5">★★★★★ - Cabuloso</option>
                  </select>
                </div>

                <div className={styles.FormGroup}>
                  <div className={styles.uploadContainer}>
                    <label className={styles.customFileLabel}>
                      {/* Estado sem imagem */}
                      {!elementos.some(
                        (el) => el.tipo === TIPO_ELEMENTO.IMAGEM
                      ) && (
                        <span className={styles.labelContent}>
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fupload.svg?alt=media&token=2f137f1e-ff02-4400-9096-4812704df4b6"
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
                                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Feditar.svg?alt=media&token=d70d85da-fe9d-4df9-8276-0da123d876a1"
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
                        <div className={styles.editorTools}>
                          <button
                            type="button"
                            onClick={() => aplicarEstilo(index, "bold")} // Alterado de 'b' para 'bold'
                            className={styles.botaoEstilo}
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => aplicarEstilo(index, "italic")} // Alterado de 'i' para 'italic'
                            className={styles.botaoEstilo}
                          >
                            I
                          </button>
                        </div>
                        <textarea
                          value={elemento.conteudo}
                          onChange={(e) =>
                            handleParagrafoChange(index, e.target.value)
                          }
                          rows="4"
                          placeholder={`Parágrafo ${index + 1}`}
                          required
                          ref={(el) => (textareaRefs.current[index] = el)}
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
                loading ? "Publicando..." : "Publicar Crítica"
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

export default AddCriticas;
