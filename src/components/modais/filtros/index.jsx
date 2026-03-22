import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import ModalViews from "@/components/modais/modal-views";
import Button from "@/components/button";
import RadioButton from "@/components/inputs/radio-button";
import Select from "@/components/inputs/select";
import TextInput from "@/components/inputs/text-input";
import ClearFiltersIcon from "@/components/icons/ClearFiltersIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import streamingServices from "@/components/listas/streamings/streaming.json";
import { useIsMobile } from "@/components/DeviceProvider";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const countriesList = [
  { iso_3166_1: "BR", name: "Brasil" },
  { iso_3166_1: "US", name: "Estados Unidos" },
  { iso_3166_1: "GB", name: "Reino Unido" },
  { iso_3166_1: "FR", name: "França" },
  { iso_3166_1: "DE", name: "Alemanha" },
  { iso_3166_1: "IT", name: "Itália" },
  { iso_3166_1: "ES", name: "Espanha" },
];

const currentYear = new Date().getFullYear();

const ls = (key) =>
  typeof window !== "undefined" ? localStorage.getItem(key) || "" : "";

export default function ModalFiltros({ onClose, user, onSelectMovie }) {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState(0); // 0 = filtros, 1 = país

  const [statusFilter, setStatusFilter] = useState(() => ls("filterStatus"));
  const [providerId, setProviderId] = useState(() => ls("filterProvider"));
  const [selectedGenre, setSelectedGenre] = useState(() => ls("filterGenre"));
  const [selectedCertification, setSelectedCertification] = useState(() =>
    ls("filterCert"),
  );
  const [selectedCountry, setSelectedCountry] = useState(() =>
    ls("filterCountry"),
  );
  const [selectedYear, setSelectedYear] = useState(() => ls("filterYear"));
  const [pendingCountry, setPendingCountry] = useState("");

  const [genres, setGenres] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("filterStatus", statusFilter);
    localStorage.setItem("filterProvider", providerId);
    localStorage.setItem("filterGenre", selectedGenre);
    localStorage.setItem("filterCert", selectedCertification);
    localStorage.setItem("filterCountry", selectedCountry);
    localStorage.setItem("filterYear", selectedYear);
  }, [
    statusFilter,
    providerId,
    selectedGenre,
    selectedCertification,
    selectedCountry,
    selectedYear,
  ]);

  const hasFilters = [
    statusFilter,
    providerId,
    selectedGenre,
    selectedCertification,
    selectedCountry,
    selectedYear,
  ].some(Boolean);

  const assistirList = user?.assistir || [];
  const favoritosList = user?.favoritos || [];
  const vistoList = Object.keys(user?.visto || {});

  useEffect(() => {
    const fetchAuxData = async () => {
      try {
        const [genresRes, certRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_KEY}&language=pt-BR`,
          ),
          fetch(
            `https://api.themoviedb.org/3/certification/movie/list?api_key=${TMDB_KEY}`,
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
    if (statusFilter === "NaoAssisti" && assistirList.length) {
      onSelectMovie(
        assistirList[Math.floor(Math.random() * assistirList.length)],
      );
      onClose();
      return;
    }
    if (statusFilter === "JaAssisti" && vistoList.length) {
      onSelectMovie(vistoList[Math.floor(Math.random() * vistoList.length)]);
      onClose();
      return;
    }
    if (statusFilter === "favoritos" && favoritosList.length) {
      onSelectMovie(
        favoritosList[Math.floor(Math.random() * favoritosList.length)],
      );
      onClose();
      return;
    }

    const params = new URLSearchParams({
      api_key: TMDB_KEY,
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
        `https://api.themoviedb.org/3/discover/movie?${params}`,
      );
      const json = await res.json();
      let results = Array.isArray(json.results) ? json.results : [];

      if (statusFilter && statusFilter !== "todos") {
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

      onSelectMovie(results[Math.floor(Math.random() * results.length)].id);
      onClose();
    } catch (e) {
      console.error(e);
    }

    window.dispatchEvent(new Event("filtersChanged"));
  };

  useEffect(() => {
    if (!noResultsMessage) return;
    const timeout = setTimeout(() => setNoResultsMessage(""), 5000);
    return () => clearTimeout(timeout);
  }, [noResultsMessage]);

  const handleClearFilters = () => {
    ["filterStatus", "filterProvider", "filterGenre", "filterCert", "filterCountry", "filterYear"]
      .forEach((k) => localStorage.removeItem(k));
    setStatusFilter("");
    setProviderId("");
    setSelectedGenre("");
    setSelectedCertification("");
    setSelectedCountry("");
    setSelectedYear("");
    window.dispatchEvent(new Event("filtersChanged"));
  };

  const handleOpenCountry = () => {
    setPendingCountry(selectedCountry);
    setActiveView(1);
  };

  const handleBackFromCountry = () => setActiveView(0);

  const handleSelectCountry = () => {
    setSelectedCountry(pendingCountry);
    setActiveView(0);
  };

  const selectedCountryName =
    countriesList.find((c) => c.iso_3166_1 === selectedCountry)?.name ?? "Todos";

  // ── View 0: filtros ──
  const filtrosContent = (
    <div className={styles.contFiltros}>
      <div className={styles.boxFiltros}>
        <div className={styles.filtrosGrupo}>
          <h3>Exibir filmes que</h3>
          <div className={styles.seletor}>
            {[
              { id: "NaoAssisti", label: "Quero assistir" },
              { id: "JaAssisti", label: "Já assisti" },
              { id: "favoritos", label: "Meus favoritos" },
            ].map((o) => (
              <RadioButton
                key={o.id}
                id={o.id}
                name="status"
                label={o.label}
                checked={statusFilter === o.id}
                onChange={() => setStatusFilter(o.id)}
                iconVariant="none"
              />
            ))}
          </div>
        </div>

        <div className={styles.filtrosGrupo}>
          <h3>Streaming</h3>
          <div className={styles.streaming}>
            {streamingServices.map((s) => (
              <RadioButton
                key={s.provider_id}
                id={`prov-${s.provider_id}`}
                name="servicos"
                label={s.provider_name}
                checked={providerId === String(s.provider_id)}
                onChange={() => setProviderId(String(s.provider_id))}
                iconVariant="none"
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.boxFiltros}>
        <div className={styles.filtrosGrupo}>
          <h3>Gênero</h3>
          <div className={styles.seletor}>
            {genres.map((g) => (
              <RadioButton
                key={g.id}
                id={`g-${g.id}`}
                name="genre"
                label={g.name}
                checked={selectedGenre === String(g.id)}
                onChange={() => setSelectedGenre(String(g.id))}
                iconVariant="none"
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.boxFiltros}>
        <div className={styles.filtrosGrupo}>
          <h3>Classificação indicativa</h3>
          <div className={styles.seletor}>
            <RadioButton
              id="cert-todos"
              name="cert"
              label="Todos"
              checked={!selectedCertification}
              onChange={() => setSelectedCertification("")}
              iconVariant="none"
            />
            {certifications.map((c) => (
              <RadioButton
                key={c.certification}
                id={c.certification}
                name="cert"
                label={c.certification}
                checked={selectedCertification === c.certification}
                onChange={() => setSelectedCertification(c.certification)}
                iconVariant="none"
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.boxFiltros}>
        <div className={styles.seletores}>
          <div className={styles.filtrosGrupo}>
            <h3>País de origem</h3>
            {isMobile ? (
              <button
                className={styles.countryBtn}
                onClick={handleOpenCountry}
                type="button"
              >
                <span>{selectedCountryName}</span>
                <ChevronDownIcon
                  size={16}
                  color="var(--text-sub)"
                  className={styles.countryBtnChevron}
                />
              </button>
            ) : (
              <Select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                placeholder="Todos"
                options={[
                  { value: "", label: "Todos" },
                  ...countriesList.map((c) => ({
                    value: c.iso_3166_1,
                    label: c.name,
                  })),
                ]}
                width="100%"
                forceUpward
              />
            )}
          </div>

          <div className={styles.filtrosGrupo}>
            <h3>Ano de lançamento</h3>
            <TextInput
              id="filterYear"
              name="filterYear"
              type="number"
              placeholder="Ex: 2023"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              min="1937"
              max={String(currentYear)}
              width="100%"
            />
          </div>
        </div>
      </div>

      {noResultsMessage && (
        <p className={styles.noResults}>{noResultsMessage}</p>
      )}
    </div>
  );

  const filtrosFooter = (
    <div className={styles.footerBotoes}>
      <Button
        variant={isMobile ? "outline" : "ghost"}
        label={isMobile ? undefined : "Limpar filtros"}
        icon={
          isMobile ? (
            <ClearFiltersIcon size={16} color="currentColor" />
          ) : undefined
        }
        onClick={handleClearFilters}
        disabled={!hasFilters}
        width={isMobile ? "64px" : "220px"}
      />
      <Button
        variant="solid"
        label="Aplicar filtros"
        onClick={handleApply}
        width={isMobile ? "100%" : "220px"}
      />
    </div>
  );

  // ── View 1: país de origem ──
  const paisContent = (
    <div className={styles.contFiltros}>
      <div className={styles.boxFiltros}>
        <div className={styles.filtrosGrupo}>
          <div className={styles.seletor}>
            <RadioButton
              id="country-todos"
              name="country"
              label="Todos"
              checked={pendingCountry === ""}
              onChange={() => setPendingCountry("")}
              iconVariant="none"
            />
            {countriesList.map((c) => (
              <RadioButton
                key={c.iso_3166_1}
                id={`country-${c.iso_3166_1}`}
                name="country"
                label={c.name}
                checked={pendingCountry === c.iso_3166_1}
                onChange={() => setPendingCountry(c.iso_3166_1)}
                iconVariant="none"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const paisFooter = (
    <div className={styles.footerBotoes}>
      {isMobile && (
        <Button
          variant="ghost"
          icon={
            <ChevronDownIcon
              size={20}
              color="currentColor"
              style={{ transform: "rotate(90deg)" }}
            />
          }
          onClick={handleBackFromCountry}
          width="64px"
        />
      )}
      <Button
        variant="solid"
        label="Selecionar"
        onClick={handleSelectCountry}
        width={isMobile ? "100%" : "220px"}
      />
    </div>
  );

  return (
    <ModalViews
      title={activeView === 1 ? "País de origem" : "Filtros"}
      onClose={onClose}
      onBack={activeView === 1 ? handleBackFromCountry : undefined}
      activeView={activeView}
      views={[
        { content: filtrosContent, footer: filtrosFooter },
        { content: paisContent, footer: paisFooter, noScroll: !isMobile },
      ]}
    />
  );
}
