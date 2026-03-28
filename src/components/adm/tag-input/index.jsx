import { useState, useRef, useEffect } from "react";
import { db } from "@/services/firebaseConection";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import styles from "./index.module.scss";

const MAX_LENGTH = 50;

const normalizar = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();

const gerarSlug = (str) =>
  normalizar(str)
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const TagInput = ({ label, selected = [], onChange, width }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [focado, setFocado] = useState(false);
  const [todasTags, setTodasTags] = useState([]);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFocado(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Atualiza sugestões sempre que input, seleção ou cache mudar
  useEffect(() => {
    const slug = gerarSlug(inputValue);
    if (!slug) {
      setSuggestions(todasTags.filter((t) => !selected.some((s) => s.id === t.id)));
      return;
    }

    const timer = setTimeout(async () => {
      const q = query(
        collection(db, "tags"),
        where("slug", ">=", slug),
        where("slug", "<=", slug + "\uf8ff"),
      );
      const snap = await getDocs(q);
      const results = snap.docs
        .map((d) => d.data())
        .filter((t) => !selected.some((s) => s.id === t.id));
      setSuggestions(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, selected, todasTags]);

  const handleFocus = async () => {
    setFocado(true);
    if (todasTags.length > 0 || gerarSlug(inputValue)) return;
    const snap = await getDocs(collection(db, "tags"));
    const tags = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setTodasTags(tags);
  };

  const adicionarTag = async (tagExistente) => {
    if (tagExistente) {
      onChange([...selected, tagExistente]);
      setInputValue("");
      inputRef.current?.focus();
      return;
    }

    const slug = gerarSlug(inputValue);
    if (!slug) return;

    if (selected.some((s) => s.id === slug)) {
      setInputValue("");
      return;
    }

    const name = normalizar(inputValue).replace(/\s+/g, " ").trim();
    const novaTag = { id: slug, name, slug };
    await setDoc(
      doc(db, "tags", slug),
      { ...novaTag, criadaEm: serverTimestamp() },
      { merge: true },
    );
    onChange([...selected, novaTag]);
    setInputValue("");
    inputRef.current?.focus();
  };

  const removerTag = (id) => onChange(selected.filter((t) => t.id !== id));

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const slug = gerarSlug(inputValue);
      if (!slug) return;
      const exata = suggestions.find((s) => s.slug === slug);
      adicionarTag(exata || null);
    } else if (e.key === "Backspace" && !inputValue && selected.length > 0) {
      removerTag(selected[selected.length - 1].id);
    } else if (e.key === "Escape") {
      setFocado(false);
    }
  };

  const inputSlug = gerarSlug(inputValue);
  const mostrarCriar =
    inputSlug &&
    !suggestions.some((s) => s.slug === inputSlug) &&
    !selected.some((s) => s.id === inputSlug);

  const mostrarDropdown = focado && (suggestions.length > 0 || mostrarCriar);

  return (
    <div className={styles.wrapper} ref={wrapperRef} style={width ? { width } : undefined}>
      {label && (
        <div className={styles.labelRow}>
          <label className={styles.label}>{label}</label>
          {selected.length > 0 && (
            <span className={styles.counter}>{selected.length}</span>
          )}
        </div>
      )}

      <div className={styles.field} onClick={() => inputRef.current?.focus()}>
        <div className={styles.pills}>
          {selected.map((tag) => (
            <span key={tag.id} className={styles.pill}>
              {tag.name}
              <button
                type="button"
                className={styles.pillRemove}
                onClick={(e) => { e.stopPropagation(); removerTag(tag.id); }}
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.slice(0, MAX_LENGTH))}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={() => setFocado(false)}
            placeholder={selected.length === 0 ? "Adicionar tag…" : ""}
          />
        </div>
      </div>

      {mostrarDropdown && (
        <ul className={styles.dropdown}>
          {suggestions.map((tag) => (
            <li
              key={tag.id}
              className={styles.option}
              onMouseDown={(e) => { e.preventDefault(); adicionarTag(tag); }}
            >
              {tag.name}
            </li>
          ))}
          {mostrarCriar && (
            <li
              className={`${styles.option} ${styles.criar}`}
              onMouseDown={(e) => { e.preventDefault(); adicionarTag(null); }}
            >
              Criar tag <strong>"{normalizar(inputValue).replace(/\s+/g, " ").trim()}"</strong>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default TagInput;
