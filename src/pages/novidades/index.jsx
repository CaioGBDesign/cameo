import { useEffect, useState, lazy, Suspense } from "react";
import { db } from "@/services/firebaseConection";
import { doc, getDoc } from "firebase/firestore";
import { useIsMobile } from "@/components/DeviceProvider";
import styles from "./index.module.scss";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import Loading from "@/components/Loading";
import Sinopse from "@/components/detalhesfilmes/sinopse";

const Miniaturafilmes = lazy(() => import("@/components/miniaturafilmes"));

const Novidades = () => {
  const [novidades, setNovidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();

  const certificationMap = {
    L: <div className={styles.livre}>Livre</div>,
    10: <div className={styles.dezAnos}>10 anos</div>,
    12: <div className={styles.dozeAnos}>12 anos</div>,
    14: <div className={styles.quatorzeAnos}>14 anos</div>,
    16: <div className={styles.dezesseisAnos}>16 anos</div>,
    18: <div className={styles.dezoitoAnos}>18 anos</div>,
  };

  const fetchMovieDetails = async (movieId) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR&append_to_response=release_dates`
    );
    if (!response.ok) {
      throw new Error("Error fetching movie data");
    }
    const data = await response.json();

    const releaseInfo = data.release_dates?.results?.find(
      (release) => release.iso_3166_1 === "BR"
    );

    const classification =
      releaseInfo && releaseInfo.release_dates.length > 0
        ? releaseInfo.release_dates[0].certification
        : "N/A";

    return {
      title: data.title || data.original_title || "Título não disponível",
      posterPath: data.poster_path,
      overview: data.overview,
      genres: data.genres.map((genre) => genre.name),
      releaseDate: data.release_date,
      classification,
      runtime: data.runtime || "Duração não disponível", // Adicionando a duração
    };
  };

  useEffect(() => {
    const fetchNovidades = async () => {
      try {
        const docRef = doc(db, "novidades", "novidades-cameo");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const lancamentos = docSnap.data().lançamentos || [];
          const novisComDetalhes = await Promise.all(
            lancamentos.map(async (novidade) => {
              const [id] = Object.entries(novidade)[0];
              const {
                title,
                posterPath,
                overview,
                genres,
                releaseDate,
                classification,
                runtime, // Capturando a duração
              } = await fetchMovieDetails(id);
              return {
                id,
                title,
                posterPath,
                overview,
                genres,
                releaseDate,
                classification,
                runtime, // Garantindo que a duração seja armazenada
              };
            })
          );
          setNovidades(novisComDetalhes);
        } else {
          setError("No such document!");
        }
      } catch (error) {
        setError("Erro ao buscar novidades.");
      } finally {
        setLoading(false);
      }
    };

    fetchNovidades();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.contNovidades}>
      {isMobile ? <Header /> : <HeaderDesktop />}
      <div className={styles.novidadeList}>
        {novidades.map(
          ({
            id,
            title,
            posterPath,
            overview,
            genres,
            releaseDate,
            classification,
            runtime, // Acessando a duração
          }) => (
            <div key={id} className={styles.novidade}>
              <Suspense fallback={<Loading />}>
                <Miniaturafilmes
                  capaminiatura={`https://image.tmdb.org/t/p/w500${posterPath}`}
                  mostrarEstrelas={false}
                />
              </Suspense>
              <div className={styles.sobreOFilme}>
                <h2 className={styles.titulo}>{title}</h2>
                <div className={styles.detalhes}>
                  <div className={styles.generosLancamentoClassificacao}>
                    <div className={styles.classificacao}>
                      {certificationMap[classification] || (
                        <p>Classificação não disponível</p>
                      )}
                    </div>

                    <div className={styles.generos}>
                      {genres.map((genre, index) => (
                        <div key={index} className={styles.genero}>
                          <span>{genre}</span>
                        </div>
                      ))}
                    </div>
                    <div className={styles.duracao}>
                      <p>
                        {runtime ? `${runtime} min` : "Duração não disponível"}
                      </p>
                    </div>
                  </div>
                </div>
                <Sinopse sinopse={overview} />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Novidades;
