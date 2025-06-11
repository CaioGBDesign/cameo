import styles from "./index.module.scss";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import BotaoSecundario from "@/components/botoes/secundarios";
import EstrelasModal from "@/components/estrelas-modal";

const Lista = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Dados simulados (substitua pelos seus dados reais)
  const filmes = [
    {
      titulo: "Lightyear",
      capa: "/background/lightyear.jpg",
      genero: "Aventura/Ficção científica",
      duracao: "1h 45m",
      nota: "0",
      visto: false,
      quem_assistiu: [
        { nome: "Caio", url_imagem: "/usuario/usuario.jpeg" },
        { nome: "Nadia", url_imagem: "/usuario/nadia.jpg" },
      ],
    },
    {
      titulo: "Dois irmãos",
      capa: "/background/dois-irmaos.jpg",
      genero: "Fantasia/Aventura",
      duracao: "1h 42m",
      nota: "0",
      visto: true,
      quem_assistiu: [{ nome: "Caio", url_imagem: "/usuario/usuario.jpeg" }],
    },
    {
      titulo: "Os incríveis",
      capa: "/background/os-incriveis.jpg",
      genero: "Ação/Comédia",
      duracao: "1h 55m",
      nota: "0",
      visto: false,
      quem_assistiu: [{ nome: "Caio", url_imagem: "/usuario/usuario.jpeg" }],
    },
    {
      titulo: "Soul",
      capa: "/background/soul.jpg",
      genero: "Fantasia/Comédia",
      duracao: "1h 40m",
      nota: "4",
      visto: false,
      quem_assistiu: [
        { nome: "Caio", url_imagem: "/usuario/usuario.jpeg" },
        { nome: "Nadia", url_imagem: "/usuario/nadia.jpg" },
      ],
    },
    {
      titulo: "Universidade monstros",
      capa: "/background/universidade-monstros.jpg",
      genero: "Comédia/Aventura",
      duracao: "1h 44m",
      nota: "4",
      visto: true,
      quem_assistiu: [{ nome: "Caio", url_imagem: "/usuario/usuario.jpeg" }],
    },
    {
      titulo: "O bom dinossauro",
      capa: "/background/o-bom-dinossauro.jpg",
      genero: "Aventura/Ficção científica",
      duracao: "1h 33m",
      nota: "0",
      visto: true,
      quem_assistiu: [
        { nome: "Caio", url_imagem: "/usuario/usuario.jpeg" },
        { nome: "Nadia", url_imagem: "/usuario/nadia.jpg" },
      ],
    },
    {
      titulo: "Valente",
      capa: "/background/valente.jpg",
      genero: "Aventura/Fantasia",
      duracao: "1h 33m",
      nota: "4",
      visto: true,
      quem_assistiu: [
        { nome: "Caio", url_imagem: "/usuario/usuario.jpeg" },
        { nome: "Nadia", url_imagem: "/usuario/nadia.jpg" },
      ],
    },
    {
      titulo: "Luca",
      capa: "/background/luca.jpg",
      genero: "Aventura/Fantasia",
      duracao: "1h 35m",
      nota: "0",
      visto: true,
      quem_assistiu: [
        { nome: "Caio", url_imagem: "/usuario/usuario.jpeg" },
        { nome: "Nadia", url_imagem: "/usuario/nadia.jpg" },
      ],
    },
  ];

  // Filtrando filmes vistos e não vistos
  const filmesVistos = filmes.filter((filme) => filme.visto);
  const filmesNaoVistos = filmes.filter((filme) => !filme.visto);

  // Função para obter lista única de usuários sem repetição
  const getUsuariosUnicos = () => {
    const usuarios = [];
    filmes.forEach((filme) => {
      filme.quem_assistiu.forEach((usuario) => {
        if (!usuarios.some((u) => u.nome === usuario.nome)) {
          usuarios.push(usuario);
        }
      });
    });
    return usuarios;
  };

  // Lista de usuários únicos
  const usuariosUnicos = getUsuariosUnicos();

  // Estado para controlar o popup
  const [popupOpen, setPopupOpen] = useState(false);
  const [filmesPopup, setFilmesPopup] = useState([]);
  const [tipoFilmesPopup, setTipoFilmesPopup] = useState("");

  // Função para abrir ou fechar o popup
  const togglePopup = (tipo) => {
    // Filtra os filmes a serem exibidos no popup
    if (tipo === "assistidos") {
      setFilmesPopup(filmesVistos); // Utiliza filmesVistos ao invés de filmes
      setTipoFilmesPopup("assistidos");
    } else if (tipo === "naoAssistidos") {
      setFilmesPopup(filmesNaoVistos); // Utiliza filmesNaoVistos ao invés de filmes
      setTipoFilmesPopup("naoAssistidos");
    }
    setPopupOpen(true);
  };

  return (
    <div className={styles.contPage}>
      <Header />
      <div className={styles.conteudoLista}>
        <h1>{slug}</h1>

        {/* Lista de usuários */}
        <div className={styles.contUsuarios}>
          <div className={styles.usuariosLista}>
            {/* Renderiza os usuários únicos */}
            {usuariosUnicos.map((usuario, index) => (
              <div key={index} className={styles.usuario}>
                <img src={usuario.url_imagem} alt={usuario.nome} />
                <span>{usuario.nome}</span>
              </div>
            ))}
            {/* Botão de adicionar usuário no final da lista */}
            <button>
              <div className={styles.novoUsuario}>
                <span>+</span>
              </div>
            </button>
          </div>
        </div>

        {/* Filmes não vistos */}
        {filmesNaoVistos.length > 0 && (
          <div className={styles.filmesNaoVistos}>
            <h2>Ainda não assisti</h2>
            <div className={styles.listaFilmes}>
              {filmesNaoVistos.map((filme, index) => (
                <div
                  key={index}
                  onClick={() => togglePopup("naoAssistidos")}
                  className={styles.filme}
                >
                  <img src={filme.capa} alt={filme.titulo} />
                  <div className={styles.infoFilmes}>
                    <h3>{filme.titulo}</h3>
                    <p>{filme.genero}</p>
                    <p>{filme.duracao}</p>
                  </div>
                  {/* Usuários que assistiram este filme */}
                  <div className={styles.usuariosAssistiram}>
                    {filme.quem_assistiu.map((usuario, idx) => (
                      <img
                        key={idx}
                        src={usuario.url_imagem}
                        alt={usuario.nome}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filmes vistos */}
        {filmesVistos.length > 0 && (
          <div className={styles.filmesVistos}>
            <h2>Já assisti</h2>
            <div className={styles.listaFilmes}>
              {filmesVistos.map((filme, index) => (
                <div
                  key={index}
                  onClick={() => togglePopup("assistidos")}
                  className={styles.filme}
                >
                  <img src={filme.capa} alt={filme.titulo} />
                  <div className={styles.infoFilmes}>
                    <h3>{filme.titulo}</h3>
                    <p>{filme.genero}</p>
                    <p>{filme.duracao}</p>
                  </div>
                  {/* Usuários que assistiram este filme */}
                  <div className={styles.usuariosAssistiram}>
                    {filme.quem_assistiu.map((usuario, idx) => (
                      <img
                        key={idx}
                        src={usuario.url_imagem}
                        alt={usuario.nome}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.baseBotoes}>
        <div className={styles.contBotaoSecundario}>
          <BotaoSecundario
            textoBotaoSecundario={"Adicionar filme"}
            idBsecundario={"add-filmes"}
          />
        </div>
      </div>

      {/* Popup */}
      {popupOpen && (
        <div className={styles.popup}>
          <div className={styles.popupInner}>
            <div className={styles.listaFilmes}>
              {filmesPopup.map((filme, index) => (
                <div key={index} className={styles.filme}>
                  <div className={styles.infoFilmes}>
                    <h3>{filme.titulo}</h3>
                    <div className={styles.generoDuracao}>
                      <p>{filme.genero}</p>
                      <p>•</p>
                      <p>{filme.duracao}</p>
                    </div>
                  </div>
                  <img src={filme.capa} alt={filme.titulo} />

                  {/* Renderização correta das estrelas */}
                  <div className={styles.avaliacao}>
                    <EstrelasModal
                      estrelas="3"
                      starWidth={"30px"}
                    ></EstrelasModal>
                  </div>

                  {/* Usuários que assistiram este filme */}
                  <div className={styles.usuariosAssistiram}>
                    {filme.quem_assistiu.map((usuario, idx) => (
                      <img
                        key={idx}
                        src={usuario.url_imagem}
                        alt={usuario.nome}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setPopupOpen(false)}>
              <img src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fclose.svg?alt=media&token=c9af99dc-797e-4364-9df2-5ed76897cc92" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lista;
