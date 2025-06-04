import styles from "./index.module.scss";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { db, storage } from "@/services/firebaseConection";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/auth";
import BotaoPrimario from "@/components/botoes/primarios";
import Loading from "@/components/loading";
import UploadImagem from "@/components/upload-imagem";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import SelectInput from "@/components/SelectInput";
import MultiSelectCheckbox from "@/components/multi-select-checkbox";

const countryOptions = [
  { value: "", label: "Selecione o país" },
  { value: "Brasil", label: "Brasil" },
];

const statesOptions = {
  Brasil: [
    { value: "", label: "Selecione o estado" },
    { value: "São Paulo", label: "São Paulo" },
    { value: "Rio de Janeiro", label: "Rio de Janeiro" },
    { value: "Minas Gerais", label: "Minas Gerais" },
    { value: "Bahia", label: "Bahia" },
    { value: "Paraná", label: "Paraná" },
  ],
};

// Opções de relação para familiares
const relationOptions = [
  { value: "", label: "Selecione a relação" },
  { value: "mãe", label: "Mãe" },
  { value: "pai", label: "Pai" },
  { value: "irmão", label: "Irmão" },
  { value: "irmã", label: "Irmã" },
];

// Opções de ocupações
const occupationOptions = [
  { value: "Atuação", label: "Atuação" },
  { value: "Dublagem", label: "Dublagem" },
  { value: "Direção de dublagem", label: "Direção de dublagem" },
  { value: "Influencer Digital", label: "Influencer Digital" },
  { value: "Canto", label: "Canto" },
  { value: "Locução", label: "Locução" },
  { value: "Tradução", label: "Tradução" },
  { value: "Música", label: "Música" },
];

// Opções de status
const statusOptions = [
  { value: "", label: "Selecione o status" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
];

// Opções de tipos de link
const linkTypeOptions = [
  { value: "", label: "Selecione o tipo" },
  { value: "site", label: "Site" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "imdb", label: "IMDB" },
];

const CreateDubladorPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [stageName, setStageName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("");
  const [stateBirth, setStateBirth] = useState("");
  const [startDubYear, setStartDubYear] = useState("");
  const [workStates, setWorkStates] = useState([]);
  const [status, setStatus] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [linkEntries, setLinkEntries] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Função para gerar o próximo código sequencial em /counters/dubladores
  const gerarProximoCodigoSequencial = async () => {
    const counterRef = doc(db, "counters", "dubladores");
    const novoNumero = await runTransaction(db, async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      if (!counterSnap.exists()) {
        // Se não existir, cria com last = 1
        transaction.set(counterRef, { last: 1 });
        return 1;
      }
      const data = counterSnap.data();
      const ultimo = data.last || 0;
      const proximo = ultimo + 1;
      transaction.update(counterRef, { last: proximo });
      return proximo;
    });
    const codigoFormatado = String(novoNumero).padStart(4, "0"); // ex: "0003"
    return `DB${codigoFormatado}`; // ex: "DB0003"
  };

  // Busca dados do usuário e verifica login
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        router.push("/login");
        return;
      }
      try {
        const userDocSnap = await getDoc(doc(db, "users", user.uid));
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, router]);

  // Limpar formulário (revoga preview e reseta estados)
  const limparFormulario = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setFullName("");
    setStageName("");
    setDateOfBirth("");
    setCountry("");
    setStateBirth("");
    setStartDubYear("");
    setWorkStates([]);
    setStatus("");
    setImageFile(null);
    setImagePreview(null);
    setFamilyMembers([]);
    setOccupations([]);
    setLinkEntries([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Ao mudar o arquivo de imagem, atualiza state e cria preview
  const handleImageChange = (file) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(previewUrl);
    } else {
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Adiciona novo par de inputs para familiar
  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: "", relation: "" }]);
  };

  // Atualiza nome de um familiar no índice dado
  const handleFamilyNameChange = (index, value) => {
    const updated = [...familyMembers];
    updated[index].name = value;
    setFamilyMembers(updated);
  };

  // Atualiza relação de um familiar no índice dado
  const handleFamilyRelationChange = (index, value) => {
    const updated = [...familyMembers];
    updated[index].relation = value;
    setFamilyMembers(updated);
  };

  // Atualiza link de um familiar no índice dado
  const handleFamilyLinkChange = (index, value) => {
    const updated = [...familyMembers];
    updated[index].link = value;
    setFamilyMembers(updated);
  };

  // Remove familiar no índice dado
  const handleRemoveFamilyMember = (index) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  // Altera seleção de ocupação
  const handleOccupationChange = (value) => {
    if (occupations.includes(value)) {
      setOccupations(occupations.filter((occ) => occ !== value));
    } else {
      setOccupations([...occupations, value]);
    }
  };

  // Adiciona novo par de inputs para link
  const addLinkEntry = () => {
    setLinkEntries([...linkEntries, { url: "", type: "" }]);
  };

  // Atualiza URL de um link
  const handleLinkUrlChange = (index, value) => {
    const updated = [...linkEntries];
    updated[index].url = value;
    setLinkEntries(updated);
  };

  // Atualiza tipo de um link
  const handleLinkTypeChange = (index, value) => {
    const updated = [...linkEntries];
    updated[index].type = value;
    setLinkEntries(updated);
  };

  // Remove link no índice dado
  const handleRemoveLinkEntry = (index) => {
    setLinkEntries(linkEntries.filter((_, i) => i !== index));
  };

  // Envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!user || !userData) {
        throw new Error("Dados do usuário não disponíveis.");
      }

      if (!fullName.trim()) {
        throw new Error("Informe o nome completo do dublador.");
      }
      if (!stageName.trim()) {
        throw new Error("Informe o nome artístico do dublador.");
      }
      if (!dateOfBirth) {
        throw new Error("Informe a data de nascimento do dublador.");
      }
      if (!country) {
        throw new Error("Selecione o país de nascimento.");
      }
      if (!stateBirth) {
        throw new Error("Selecione o estado de nascimento.");
      }
      if (!startDubYear) {
        throw new Error("Informe o ano de início na dublagem.");
      }
      if (workStates.length === 0) {
        throw new Error("Selecione ao menos um estado onde exerce dublagem.");
      }
      if (!status) {
        throw new Error("Selecione o status (ativo/inativo).");
      }

      // Valida cada familiar (nome, relação e link obrigatórios se o par existir)
      for (let i = 0; i < familyMembers.length; i++) {
        const fam = familyMembers[i];
        if (!fam.name.trim()) {
          throw new Error(`Informe o nome do familiar #${i + 1}.`);
        }
        if (!fam.relation) {
          throw new Error(`Selecione a relação do familiar #${i + 1}.`);
        }
        if (!fam.link.trim()) {
          throw new Error(`Informe o link do familiar #${i + 1}.`);
        }
      }

      // Valida cada link
      for (let i = 0; i < linkEntries.length; i++) {
        const link = linkEntries[i];
        if (!link.url.trim()) {
          throw new Error(`Informe o URL do link #${i + 1}.`);
        }
        if (!link.type) {
          throw new Error(`Selecione o tipo do link #${i + 1}.`);
        }
      }

      // 1. Gera o próximo código sequencial
      const codigoUnico = await gerarProximoCodigoSequencial();

      // 2. Faz upload da imagem, se existir
      let imageUrl = "";
      if (imageFile) {
        const storageRef = ref(
          storage,
          `dubladores/${codigoUnico}_${imageFile.name}`
        );
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // 3. Prepara o array de familiares (filtra apenas os preenchidos)
      const familiaresParaSalvar = familyMembers.map((fam) => ({
        nome: fam.name.trim(),
        relacao: fam.relation,
        link: fam.link.trim(),
      }));

      // 4. Prepara array de links
      const linksParaSalvar = linkEntries.map((lnk) => ({
        url: lnk.url.trim(),
        type: lnk.type,
      }));

      // 5. Prepara objeto do dublador
      const novoDublador = {
        codigo: codigoUnico,
        nomeCompleto: fullName.trim(),
        nomeArtistico: stageName.trim(),
        dataNascimento: dateOfBirth,
        paisNascimento: country,
        estadoNascimento: stateBirth,
        anoInicioDublagem: startDubYear,
        lugarDublagem: workStates,
        status: status,
        ocupacoes: occupations,
        imagemUrl: imageUrl,
        familiares: familiaresParaSalvar,
        links: linksParaSalvar,
        autor: {
          id: user.uid,
          nome: userData.nome || "",
          avatarUrl: userData.avatarUrl || "",
        },
        dataCadastro: serverTimestamp(),
      };

      // 5. Insere o documento em "dubladores" usando o código sequencial como ID
      await setDoc(doc(db, "dubladores", codigoUnico), novoDublador);

      limparFormulario();
      router.reload();
    } catch (err) {
      console.error("Erro ao cadastrar dublador:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Cadastrar Dublador</title>
        <meta
          name="description"
          content="Página para adicionar dubladores à base de dados"
        />
      </Head>

      {/** Header responsivo */}
      {typeof window !== "undefined" && window.innerWidth < 768 ? (
        <Header />
      ) : (
        <HeaderDesktop />
      )}

      <main className={styles.containerDublador}>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit} className={styles.formDublador}>
            <div className={styles.imagemNomeDublador}>
              <UploadImagem
                imagem={
                  imagePreview
                    ? { tipo: "imagem", preview: imagePreview }
                    : null
                }
                onImagemChange={handleImageChange}
                dimensoes={"Dimensões recomendadas 400x400"}
                ref={fileInputRef}
              />

              <div className={styles.nomeCompletoeArtistico}>
                <h1>Adicionar Dublador</h1>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Nome completo"
                  maxLength={100}
                />

                <input
                  type="text"
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  required
                  placeholder="Nome artístico"
                  maxLength={60}
                />
              </div>
            </div>

            <div className={styles.contForm}>
              <div className={styles.formGroup}>
                <label htmlFor="dataNascimento">Data de Nascimento:</label>
                <div className={styles.inputsForm}>
                  <input
                    type="date"
                    id="dataNascimento"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />

                  <SelectInput
                    name="paisNascimento"
                    required
                    options={countryOptions}
                    onValue={(val) => {
                      setCountry(val);
                      setStateBirth(""); // limpa o estado quando o país mudar
                    }}
                  />

                  <SelectInput
                    name="estadoNascimento"
                    required
                    disabled={!country}
                    options={
                      country
                        ? statesOptions[country]
                        : [{ value: "", label: "Selecione o país primeiro" }]
                    }
                    onValue={(val) => setStateBirth(val)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.contForm}>
              <div className={styles.formGroup}>
                <div className={styles.tituloBotao}>
                  <h2>Familiares</h2>

                  <button
                    type="button"
                    className={styles.botaoAdicionarFamiliar}
                    onClick={addFamilyMember}
                  >
                    <span>+ Adicionar familiar</span>
                  </button>
                </div>

                {familyMembers.map((fam, idx) => (
                  <div key={idx} className={styles.inputsForm}>
                    <input
                      type="text"
                      value={fam.name}
                      onChange={(e) =>
                        handleFamilyNameChange(idx, e.target.value)
                      }
                      required
                      placeholder={`Nome do familiar ${idx + 1}`}
                      maxLength={80}
                    />

                    <SelectInput
                      name={`relacaoFamiliar_${idx}`}
                      required
                      options={relationOptions}
                      onValue={(val) => handleFamilyRelationChange(idx, val)}
                    />

                    <input
                      type="url"
                      value={fam.link}
                      onChange={(e) =>
                        handleFamilyLinkChange(idx, e.target.value)
                      }
                      required
                      placeholder="Link do familiar"
                      className={styles.linkInput}
                    />

                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleRemoveFamilyMember(idx)}
                    >
                      <img src="icones/deletar.svg" alt="Deletar" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.contForm}>
              <div className={styles.formGroup}>
                <div className={styles.tituloBotao}>
                  <h2>Ocupações</h2>
                  <div className={styles.ocupacoesGrid}>
                    {occupationOptions.map((opt) => {
                      const id = `ocup_${opt.value}`; // id único para cada checkbox
                      return (
                        <div key={opt.value} className={styles.opcoes}>
                          <input
                            type="checkbox"
                            id={id}
                            value={opt.value}
                            checked={occupations.includes(opt.value)}
                            onChange={() => handleOccupationChange(opt.value)}
                            className={styles.ocupacaoCheckbox}
                          />
                          <label
                            htmlFor={id}
                            className={styles.ocupacaoItem}
                            style={{ cursor: "pointer" }}
                          >
                            {opt.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.contForm}>
              <div className={styles.formGroup}>
                <h2>Ano de Início na Dublagem</h2>
                <div className={styles.inputsForm}>
                  <input
                    type="number"
                    id="anoInicioDublagem"
                    value={startDubYear}
                    onChange={(e) => setStartDubYear(e.target.value)}
                    placeholder="2020"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />

                  <MultiSelectCheckbox
                    options={statesOptions.Brasil}
                    selected={workStates}
                    onChange={setWorkStates}
                    placeholder="Selecione um ou mais estados…"
                  />

                  <SelectInput
                    name="statusDublador"
                    required
                    options={statusOptions}
                    onValue={(val) => setStatus(val)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.contForm}>
              <div className={styles.formGroup}>
                <div className={styles.tituloBotao}>
                  <h2>Links</h2>
                  <button
                    type="button"
                    className={styles.botaoAdicionarLink}
                    onClick={addLinkEntry}
                  >
                    <span>+ Adicionar link</span>
                  </button>
                </div>
                {linkEntries.map((lnk, idx) => (
                  <div key={idx} className={styles.inputsForm}>
                    <input
                      type="url"
                      value={lnk.url}
                      onChange={(e) => handleLinkUrlChange(idx, e.target.value)}
                      required
                      placeholder={`URL do link ${idx + 1}`}
                      className={styles.linkInput}
                    />

                    <SelectInput
                      name={`linkType_${idx}`}
                      required
                      options={linkTypeOptions}
                      onValue={(val) => handleLinkTypeChange(idx, val)}
                    />

                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleRemoveLinkEntry(idx)}
                    >
                      <img src="icones/deletar.svg" alt="Deletar" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <BotaoPrimario
              textoBotaoPrimario={
                loading ? "Cadastrando..." : "Cadastrar Dublador"
              }
              type="submit"
              disabled={loading}
            />
          </form>
        </div>
      </main>
    </>
  );
};

export default CreateDubladorPage;
