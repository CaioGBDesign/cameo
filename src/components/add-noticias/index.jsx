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
  const textareaRefs = useRef([]);

  const TIPO_ELEMENTO = {
    PARAGRAFO: "paragrafo",
    IMAGEM: "imagem",
    INSTAGRAM: "instagram",
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
      const docRef = doc(db, "noticias", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        throw new Error("Já existe uma notícia com este título");
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

      // Cria o documento com ID customizado
      await setDoc(docRef, {
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

  // função para adicionar o embed
  const adicionarInstagramEmbed = () => {
    const url = prompt("Cole a URL do post do Instagram:");
    if (url) {
      setElementos([
        ...elementos,
        {
          tipo: TIPO_ELEMENTO.INSTAGRAM,
          conteudo: url,
        },
      ]);
    }
  };

  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [elementos]);

  // No mapa de estilos, adicione o link
  const tagMap = {
    bold: {
      abertura: '<strong class="boldtext">',
      fechamento: "</strong>",
    },
    italic: {
      abertura: '<em class="italictext">',
      fechamento: "</em>",
    },
    link: {
      abertura: (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer">`,
      fechamento: "</a>",
    },
  };

  // Modifique a função aplicarEstilo
  const aplicarEstilo = (index, tipo) => {
    const textarea = textareaRefs.current[index];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end && tipo === "link") {
      alert("Selecione um texto para adicionar o link");
      return;
    }

    const textoAtual = elementos[index].conteudo;
    const selectedText = textoAtual.substring(start, end);

    let novoTexto = "";

    if (tipo === "link") {
      const url = prompt("Insira a URL do link:");
      if (!url) return;

      novoTexto =
        textoAtual.substring(0, start) +
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>` +
        textoAtual.substring(end);
    } else {
      const estilo = tagMap[tipo];
      novoTexto =
        textoAtual.substring(0, start) +
        `${estilo.abertura}${selectedText}${estilo.fechamento}` +
        textoAtual.substring(end);
    }

    const novosElementos = [...elementos];
    novosElementos[index].conteudo = novoTexto;
    setElementos(novosElementos);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(end, end);
    }, 0);
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

                {elementos.map((elemento, index) => {
                  // Elemento: Parágrafo
                  if (elemento.tipo === TIPO_ELEMENTO.PARAGRAFO) {
                    return (
                      <div key={index} className={styles.FormGroup}>
                        <div className={styles.paragrafoBox}>
                          <div className={styles.editorTools}>
                            <button
                              type="button"
                              onClick={() => aplicarEstilo(index, "bold")}
                              className={styles.botaoEstilo}
                            >
                              B
                            </button>
                            <button
                              type="button"
                              onClick={() => aplicarEstilo(index, "italic")}
                              className={styles.botaoEstilo}
                            >
                              I
                            </button>
                            <button
                              type="button"
                              onClick={() => aplicarEstilo(index, "link")}
                              className={styles.botaoEstilo}
                            >
                              Link
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
                    );
                  }

                  // Elemento: Instagram Embed
                  if (elemento.tipo === TIPO_ELEMENTO.INSTAGRAM) {
                    return (
                      <div key={index} className={styles.FormGroup}>
                        <div className={styles.instagramEmbed}>
                          <blockquote
                            className="instagram-media"
                            data-instgrm-captioned
                            data-instgrm-permalink={elemento.conteudo}
                            data-instgrm-version="14"
                          >
                            <div style={{ padding: "16px" }}>
                              <a
                                href={elemento.conteudo}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  background: "#FFFFFF",
                                  lineHeight: 0,
                                  padding: "0 0",
                                  textAlign: "center",
                                  textDecoration: "none",
                                  width: "100%",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      backgroundColor: "#F4F4F4",
                                      borderRadius: "50%",
                                      flexGrow: 0,
                                      height: 40,
                                      marginRight: 14,
                                      width: 40,
                                    }}
                                  />
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      flexGrow: 1,
                                      justifyContent: "center",
                                    }}
                                  >
                                    <div
                                      style={{
                                        backgroundColor: "#F4F4F4",
                                        borderRadius: 4,
                                        flexGrow: 0,
                                        height: 14,
                                        marginBottom: 6,
                                        width: 100,
                                      }}
                                    />
                                    <div
                                      style={{
                                        backgroundColor: "#F4F4F4",
                                        borderRadius: 4,
                                        flexGrow: 0,
                                        height: 14,
                                        width: 60,
                                      }}
                                    />
                                  </div>
                                </div>
                                <div style={{ padding: "19% 0" }} />
                                <div
                                  style={{
                                    display: "block",
                                    height: 50,
                                    margin: "0 auto 12px",
                                    width: 50,
                                  }}
                                >
                                  <svg
                                    width="50px"
                                    height="50px"
                                    viewBox="0 0 60 60"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g
                                      stroke="none"
                                      strokeWidth="1"
                                      fill="none"
                                      fillRule="evenodd"
                                    >
                                      <g
                                        transform="translate(-511.000000, -20.000000)"
                                        fill="#000000"
                                      >
                                        <g>
                                          <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                                        </g>
                                      </g>
                                    </g>
                                  </svg>
                                </div>
                                <div style={{ paddingTop: 8 }}>
                                  <div
                                    style={{
                                      color: "#3897f0",
                                      fontFamily: "Arial,sans-serif",
                                      fontSize: 14,
                                      fontStyle: "normal",
                                      fontWeight: 550,
                                      lineHeight: 18,
                                    }}
                                  >
                                    Ver essa foto no Instagram
                                  </div>
                                </div>
                              </a>
                            </div>
                          </blockquote>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}

                <div className={styles.BotoesAcao}>
                  <button
                    type="button"
                    onClick={() => adicionarElemento(TIPO_ELEMENTO.PARAGRAFO)}
                    className={styles.BotaoAdicionar}
                    disabled={loading}
                  >
                    + Parágrafo
                  </button>

                  <button
                    type="button"
                    onClick={adicionarInstagramEmbed}
                    className={styles.BotaoAdicionar}
                    disabled={loading}
                  >
                    + Embed do Instagram
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
