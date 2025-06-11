import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { useRouter } from "next/router";

const BannerNoticias = ({ noticias, tipo }) => {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % noticias.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [noticias.length]);

  const encontrarImagem = (noticia) => {
    return (
      noticia.elementos.find((el) => el.tipo === "imagem")?.conteudo ||
      "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fplaceholder.jpg?alt=media&token=1b8dfa35-bcaa-487c-8ddc-8dec7482cfe5"
    );
  };

  return (
    <article
      className={`${styles.bannerNoticiasECriticas} ${
        tipo === "noticias" ? styles.larguraNoticias : styles.larguraPadrao
      }`}
    >
      <div className={styles.ultimasNoticias}>
        <div className={styles.dotsCarrossel}>
          {noticias.map((_, index) => (
            <button
              key={index}
              className={`${styles.dots} ${
                index === activeSlide ? styles.dotsAtivo : ""
              }`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>

        <div className={styles.carrossel}>
          <div
            className={styles.slidesContainer}
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {noticias.map((noticia) => (
              <div
                key={noticia.id}
                className={styles.resumoNoticia}
                onClick={() => router.push(`/noticias/detalhes/${noticia.id}`)}
              >
                <div className={styles.informacoesNoticia}>
                  <div className={styles.tagNoticia}>
                    <span>Notícia</span>
                  </div>

                  <h1>{noticia.titulo}</h1>
                  <div className={styles.numeroNoticia}>
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Frelogio.svg?alt=media&token=5ca19f7c-5421-408d-ae41-15b351db2c38"
                      alt="Tempo de leitura"
                    />
                    {noticia.numero} min de leitura
                  </div>
                </div>

                <div className={styles.imagemNoticia}>
                  <div className={styles.fundoA}></div>
                  <div className={styles.fundoB}></div>
                  <div className={styles.fundoC}></div>
                  <div className={styles.fundoD}></div>
                  <img
                    src={encontrarImagem(noticia)}
                    alt="Capa Noticia"
                    onError={(e) => {
                      e.target.src =
                        "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fplaceholder.jpg?alt=media&token=1b8dfa35-bcaa-487c-8ddc-8dec7482cfe5";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default BannerNoticias;
