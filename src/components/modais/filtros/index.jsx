import React, { useState, useEffect, useCallback } from "react";
import styles from "./index.module.scss";
import { useIsMobile } from "@/components/DeviceProvider";
import HeaderModal from "@/components/modais/header-modais";
import streamingServices from "@/components/listas/streamings/streaming.json";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/services/firebaseConection";

// Lista estática de países
const countriesList = [
  { iso_3166_1: "BR", name: "Brasil" },
  { iso_3166_1: "US", name: "Estados Unidos" },
  { iso_3166_1: "GB", name: "Reino Unido" },
  { iso_3166_1: "FR", name: "França" },
  { iso_3166_1: "DE", name: "Alemanha" },
  { iso_3166_1: "IT", name: "Itália" },
  { iso_3166_1: "ES", name: "Espanha" },
];

export default function ModalFiltros({ onClose, user, onSelectMovie }) {
  const isMobile = useIsMobile();

  const [statusFilter, setStatusFilter] = useState(
    () => localStorage.getItem("filterStatus") || ""
  );
  const [providerId, setProviderId] = useState(
    () => localStorage.getItem("filterProvider") || ""
  );
  const [selectedGenre, setSelectedGenre] = useState(
    () => localStorage.getItem("filterGenre") || ""
  );
  const [selectedCertification, setSelectedCertification] = useState(
    () => localStorage.getItem("filterCert") || ""
  );
  const [selectedCountry, setSelectedCountry] = useState(
    () => localStorage.getItem("filterCountry") || ""
  );
  const [selectedYear, setSelectedYear] = useState(
    () => localStorage.getItem("filterYear") || ""
  );

  const [genres, setGenres] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [assistirList, setAssistirList] = useState([]);
  const [vistoList, setVistoList] = useState([]);
  const [favoritosList, setFavoritosList] = useState([]);

  const [noResultsMessage, setNoResultsMessage] = useState("");

  const [filledCount, setFilledCount] = useState(0);
  const hasFilters = filledCount > 0;

  // Persistência no localStorage
  useEffect(() => {
    localStorage.setItem("filterStatus", statusFilter);
  }, [statusFilter]);
  useEffect(() => {
    localStorage.setItem("filterProvider", providerId);
  }, [providerId]);
  useEffect(() => {
    localStorage.setItem("filterGenre", selectedGenre);
  }, [selectedGenre]);
  useEffect(() => {
    localStorage.setItem("filterCert", selectedCertification);
  }, [selectedCertification]);
  useEffect(() => {
    localStorage.setItem("filterCountry", selectedCountry);
  }, [selectedCountry]);
  useEffect(() => {
    localStorage.setItem("filterYear", selectedYear);
  }, [selectedYear]);

  // função para contar filtros
  const countFilters = useCallback(() => {
    const keys = [
      "filterCert",
      "filterCountry",
      "filterGenre",
      "filterProvider",
      "filterStatus",
      "filterYear",
    ];
    return keys.reduce((acc, key) => {
      const val = localStorage.getItem(key);
      return acc + (val && val !== "null" ? 1 : 0);
    }, 0);
  }, []);

  useEffect(() => {
    // atualiza no mount
    setFilledCount(countFilters());

    const onFiltersChanged = () => {
      setFilledCount(countFilters());
    };

    window.addEventListener("filtersChanged", onFiltersChanged);
    window.addEventListener("storage", onFiltersChanged);

    return () => {
      window.removeEventListener("filtersChanged", onFiltersChanged);
      window.removeEventListener("storage", onFiltersChanged);
    };
  }, [countFilters]);

  // Ouvir lists do Firebase
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      const data = snap.data() || {};
      setAssistirList(data.assistir || []);
      setVistoList(data.visto || []);
      setFavoritosList(data.favoritos || []);
    });
    return () => unsub();
  }, [user?.uid]);

  useEffect(() => {
    const fetchAuxData = async () => {
      try {
        const [genresRes, certRes] = await Promise.all([
          fetch(
            "https://api.themoviedb.org/3/genre/movie/list?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR"
          ),
          fetch(
            "https://api.themoviedb.org/3/certification/movie/list?api_key=c95de8d6070dbf1b821185d759532f05"
          ),
        ]);
        const genresData = await genresRes.json();
        const certData = await certRes.json();

        setGenres(genresData.genres || []);
        setCertifications(certData.certifications?.BR || []);
      } catch (err) {
        console.error("Erro ao buscar dados auxiliares:", err);
      }
    };
    fetchAuxData();
  }, []);

  const handleApply = async () => {
    // Se status for uma lista específica, retorna aleatório dessa lista
    if (statusFilter === "NaoAssisti" && assistirList.length) {
      const id = assistirList[Math.floor(Math.random() * assistirList.length)];
      console.log("Quero assistir ID:", id);
      onSelectMovie(id);
      onClose();
      return;
    }
    if (statusFilter === "JaAssisti" && vistoList.length) {
      const id = vistoList[Math.floor(Math.random() * vistoList.length)];
      console.log("Já assisti ID:", id);
      onSelectMovie(id);
      onClose();
      return;
    }
    if (statusFilter === "favoritos" && favoritosList.length) {
      const id =
        favoritosList[Math.floor(Math.random() * favoritosList.length)];
      console.log("Favoritos ID:", id);
      onSelectMovie(id);
      onClose();
      return;
    }

    // build discover params
    const key = "c95de8d6070dbf1b821185d759532f05";
    const params = new URLSearchParams({
      api_key: key,
      language: "pt-BR",
      sort_by: "popularity.desc",
      watch_region: "BR",
    });
    if (providerId) params.append("with_watch_providers", providerId);
    if (selectedGenre) params.append("with_genres", selectedGenre);
    if (selectedCertification) {
      params.append("certification_country", "BR");
      params.append("certification", selectedCertification);
    }
    if (selectedCountry) params.append("with_origin_country", selectedCountry);
    if (selectedYear) {
      params.append("primary_release_date.gte", `${selectedYear}-01-01`);
      params.append("primary_release_date.lte", `${selectedYear}-12-31`);
    }

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?${params}`
      );
      const json = await res.json();
      let results = Array.isArray(json.results) ? json.results : [];
      // aplica status filter acumulado
      if (statusFilter !== "todos") {
        const list =
          statusFilter === "NaoAssisti"
            ? assistirList
            : statusFilter === "JaAssisti"
            ? vistoList
            : favoritosList;
        results = results.filter((m) => list.includes(String(m.id)));
      }

      if (results.length === 0) {
        setNoResultsMessage("Nenhum resultado encontrado.");
        return;
      }

      const film = results[Math.floor(Math.random() * results.length)];
      console.log("Filme filtrado ID:", film.id);
      onSelectMovie(film.id);
      onClose();
    } catch (e) {
      console.error(e);
    }
    window.dispatchEvent(new Event("filtersChanged"));
  };

  useEffect(() => {
    if (!noResultsMessage) return;

    const timeout = setTimeout(() => {
      setNoResultsMessage("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [noResultsMessage]);

  const handleClearFilters = () => {
    // Remover cada chave individualmente
    localStorage.removeItem("filterStatus");
    localStorage.removeItem("filterProvider");
    localStorage.removeItem("filterGenre");
    localStorage.removeItem("filterCert");
    localStorage.removeItem("filterCountry");
    localStorage.removeItem("filterYear");
    // Se quiser limpar tudo (cuidado se houver outras coisas no LS!)
    // localStorage.clear();

    // Resetar estados para valores iniciais
    setStatusFilter("todos");
    setProviderId("");
    setSelectedGenre("");
    setSelectedCertification("");
    setSelectedCountry("");
    setSelectedYear("");

    window.dispatchEvent(new Event("filtersChanged"));
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <HeaderModal
          onClose={onClose}
          titulo="Filtros"
          icone="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Ffiltros-cameo-02.png?alt=media&token=4e691c49-c482-49b7-9f0b-4de953eabe68"
          iconeMobile="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Ffiltros-cameo-mobile-01.png?alt=media&token=fa335112-96ee-4f38-99f9-921cd213f686"
          altIcone="Filtros Cameo"
        />

        <div className={styles.contFiltros}>
          {/* Status */}
          <div className={styles.filtrosGrupo}>
            <h3>Exibir filmes que</h3>
            <div className={styles.seletor}>
              {[
                { id: "NaoAssisti", label: "Quero assistir" },
                { id: "JaAssisti", label: "Já assisti" },
                { id: "favoritos", label: "Meus favoritos" },
              ].map((o) => (
                <div key={o.id} className={styles.opcao}>
                  <input
                    type="radio"
                    id={o.id}
                    name="status"
                    checked={statusFilter === o.id}
                    onChange={() => setStatusFilter(o.id)}
                  />
                  <label htmlFor={o.id}>{o.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Streaming */}
          <div className={styles.filtrosGrupo}>
            <h3>Streaming</h3>
            <div className={styles.streaming}>
              {streamingServices.map((s) => (
                <div key={s.provider_id} className={styles.opcao}>
                  <input
                    type="radio"
                    id={`prov-${s.provider_id}`}
                    name="servicos"
                    checked={providerId === String(s.provider_id)}
                    onChange={() => setProviderId(String(s.provider_id))}
                  />
                  <label htmlFor={`prov-${s.provider_id}`}>
                    {s.provider_name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Gênero */}
          <div className={styles.filtrosGrupo}>
            <h3>Gênero</h3>
            <div className={styles.seletor}>
              {genres.map((g) => (
                <div key={g.id} className={styles.opcao}>
                  <input
                    type="radio"
                    id={`g-${g.id}`}
                    name="genre"
                    checked={selectedGenre === String(g.id)}
                    onChange={() => setSelectedGenre(String(g.id))}
                  />
                  <label htmlFor={`g-${g.id}`}>{g.name}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Classificação indicativa */}
          <div className={styles.filtrosGrupo}>
            <h3>Classificação indicativa</h3>
            <div className={styles.seletor}>
              <div className={styles.opcao}>
                <input
                  type="radio"
                  id="cert-todos"
                  name="cert"
                  checked={!selectedCertification}
                  onChange={() => setSelectedCertification(null)}
                />
                <label htmlFor="cert-todos">Todos</label>
              </div>
              {certifications.map((c) => (
                <div key={c.certification} className={styles.opcao}>
                  <input
                    type="radio"
                    id={c.certification}
                    name="cert"
                    checked={selectedCertification === c.certification}
                    onChange={() => setSelectedCertification(c.certification)}
                  />
                  <label htmlFor={c.certification}>{c.certification}</label>
                </div>
              ))}
            </div>
          </div>

          {/* País e Ano */}
          <div className={styles.seletores}>
            <div className={styles.filtrosGrupo}>
              <h3>País de origem</h3>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">Todos</option>
                {countriesList.map((c) => (
                  <option key={c.iso_3166_1} value={c.iso_3166_1}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filtrosGrupo}>
              <h3>Ano de lançamento</h3>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">Todos</option>
                {Array.from(
                  { length: new Date().getFullYear() - 1937 + 1 },
                  (_, i) => new Date().getFullYear() - i
                ).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.botoesFiltro}>
          <div className={styles.baseBotoes}>
            <button
              className={styles.limparFiltros}
              type="button"
              onClick={handleClearFilters}
              disabled={!hasFilters}
              style={{
                backgroundColor: hasFilters ? "#3b2544" : "#2C1435",
                color: hasFilters ? "#FFFFFF" : "#66556D",
                pointerEvents: hasFilters ? "auto" : "none",
              }}
            >
              Limpar filtros
            </button>
            <button className={styles.aplicar} onClick={handleApply}>
              Aplicar filtros
              {noResultsMessage && (
                <div className={styles.noResults}>{noResultsMessage}</div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
