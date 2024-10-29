import { useEffect, useState } from "react";
import { db } from "@/services/firebaseConection";
import { doc, getDoc } from "firebase/firestore";
import { useIsMobile } from "@/components/DeviceProvider";
import styles from "./index.module.scss";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";

const Novidades = () => {
  const [novidades, setNovidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  // Função para buscar o poster do filme a partir do ID
  const fetchMoviePoster = async (movieId) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=c95de8d6070dbf1b821185d759532f05`
    );
    if (!response.ok) {
      throw new Error("Error fetching movie data");
    }
    const data = await response.json();
    return data.poster_path;
  };

  useEffect(() => {
    const fetchNovidades = async () => {
      try {
        const docRef = doc(db, "novidades", "novidades-cameo");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const lancamentos = docSnap.data().lançamentos || [];
          const novisComPosters = await Promise.all(
            lancamentos.map(async (novidade) => {
              const [id, title] = Object.entries(novidade)[0];
              const posterPath = await fetchMoviePoster(id);
              return { id, title, posterPath };
            })
          );
          setNovidades(novisComPosters);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNovidades();
  }, []);

  return (
    <div className={styles.contNovidades}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {novidades.length === 0 ? (
            <p>No novidades found.</p>
          ) : (
            novidades.map(({ id, title, posterPath }) => (
              <div key={id} className={styles.novidade}>
                <h3>{title}</h3>
                {posterPath && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                    alt={title}
                  />
                )}
              </div>
            ))
          )}
        </>
      )}
      {isMobile ? <Header /> : <HeaderDesktop />}
    </div>
  );
};

export default Novidades;
