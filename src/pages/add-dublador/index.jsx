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
  { value: "Estados Unidos", label: "Estados Unidos" },
  { value: "Italia", label: "Itália" },
];

const statesOptions = {
  Brasil: [
    { value: "", label: "Selecione o estado" },
    { value: "Acre", label: "Acre" },
    { value: "Alagoas", label: "Alagoas" },
    { value: "Amapá", label: "Amapá" },
    { value: "Amazonas", label: "Amazonas" },
    { value: "Bahia", label: "Bahia" },
    { value: "Ceará", label: "Ceará" },
    { value: "Distrito Federal", label: "Distrito Federal" },
    { value: "Espírito Santo", label: "Espírito Santo" },
    { value: "Goiás", label: "Goiás" },
    { value: "Maranhão", label: "Maranhão" },
    { value: "Mato Grosso", label: "Mato Grosso" },
    { value: "Mato Grosso do Sul", label: "Mato Grosso do Sul" },
    { value: "Minas Gerais", label: "Minas Gerais" },
    { value: "Pará", label: "Pará" },
    { value: "Paraíba", label: "Paraíba" },
    { value: "Paraná", label: "Paraná" },
    { value: "Pernambuco", label: "Pernambuco" },
    { value: "Piauí", label: "Piauí" },
    { value: "Rio de Janeiro", label: "Rio de Janeiro" },
    { value: "Rio Grande do Norte", label: "Rio Grande do Norte" },
    { value: "Rio Grande do Sul", label: "Rio Grande do Sul" },
    { value: "Rondônia", label: "Rondônia" },
    { value: "Roraima", label: "Roraima" },
    { value: "Santa Catarina", label: "Santa Catarina" },
    { value: "São Paulo", label: "São Paulo" },
    { value: "Sergipe", label: "Sergipe" },
    { value: "Tocantins", label: "Tocantins" },
  ],
  Italia: [
    { value: "", label: "Selecione o estado" },
    { value: "Piemonte", label: "Piemonte" },
  ],
  "Estados Unidos": [
    { value: "", label: "Selecione o estado" },
    { value: "California", label: "California" },
    { value: "New York", label: "New York" },
    { value: "Texas", label: "Texas" },
    { value: "Florida", label: "Florida" },
    { value: "Illinois", label: "Illinois" },
  ],
};

// Opções de relação para familiares
const relationOptions = [
  { value: "", label: "Selecione a relação" },
  { value: "avô", label: "Avô" },
  { value: "avó", label: "Avó" },
  { value: "Bisneto", label: "Bisneto" },
  { value: "conhada", label: "Conhada" },
  { value: "conhado", label: "Conhado" },
  { value: "cônjuge", label: "Cônjuge" },
  { value: "filha", label: "Filha" },
  { value: "filho", label: "Filho" },
  { value: "irmã", label: "Irmã" },
  { value: "irmão", label: "Irmão" },
  { value: "mãe", label: "Mãe" },
  { value: "neta", label: "Neta" },
  { value: "neto", label: "Neto" },
  { value: "pai", label: "Pai" },
  { value: "prima", label: "Prima" },
  { value: "primo", label: "Primo" },
  { value: "sobrinha", label: "Sobrinha" },
  { value: "sobrinho", label: "Sobrinho" },
  { value: "tia", label: "Tia" },
  { value: "tio", label: "Tio" },
];

// Opções de ocupações
const occupationOptions = [
  { value: "Atuação", label: "Atuação" },
  { value: "Dublagem", label: "Dublagem" },
  { value: "Direção de dublagem", label: "Direção de dublagem" },
  { value: "Apresentação", label: "Apresentação" },
  { value: "Aulas de dublagem", label: "Aulas de dublagem" },
  { value: "Aulas de interpretação", label: "Aulas de interpretação" },
  { value: "Balé", label: "Balé" },
  { value: "Canto", label: "Canto" },
  { value: "Comédia", label: "Comédia" },
  { value: "Coreografia", label: "Coreografia" },
  { value: "Direção teatral", label: "Direção teatral" },
  { value: "Escrita", label: "Escrita" },
  { value: "Influencer Digital", label: "Influencer Digital" },
  { value: "Jornalismo", label: "Jornalismo" },
  { value: "Locução", label: "Locução" },
  { value: "Música", label: "Música" },
  { value: "Narração", label: "Narração" },
  { value: "Produção", label: "Produção" },
  { value: "Radialista", label: "Radialista" },
  { value: "Roteirização", label: "Roteirização" },
  { value: "Tradução", label: "Tradução" },
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
  { value: "twitter", label: "X (twitter)" },
];

const CreateDubladorPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Campos originais
  const [fullName, setFullName] = useState("");
  const [stageName, setStageName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  // Campos de falecimento
  const [dateOfDeath, setDateOfDeath] = useState("");
  const [causeOfDeath, setCauseOfDeath] = useState("");
  // Outros campos…
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
    setDateOfDeath("");
    setCauseOfDeath("");
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

      // Se um dos campos de falecimento estiver preenchido, obriga o outro
      if (
        (dateOfDeath && !causeOfDeath.trim()) ||
        (!dateOfDeath && causeOfDeath.trim())
      ) {
        throw new Error("Informe data e motivo de falecimento juntos.");
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
      const familiaresParaSalvar = familyMembers.map((fam) => {
        const obj = {
          nome: fam.name.trim(),
          relacao: fam.relation,
        };
        if (fam.link && fam.link.trim()) {
          obj.link = fam.link.trim();
        }
        return obj;
      });

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

        // Somente adicionar falecimento se houver
        ...(dateOfDeath && {
          dataFalecimento: dateOfDeath,
          motivoFalecimento: causeOfDeath.trim(),
        }),

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
                dimensoes={"Dimensões recomendadas 1000x1000"}
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

            {/* NOVO: Data e Motivo de Falecimento */}
            <div className={styles.contForm}>
              <div className={styles.formGroup}>
                <label>Falecimento (opcional)</label>
                <div className={styles.inputsForm}>
                  <input
                    type="date"
                    value={dateOfDeath}
                    onChange={(e) => setDateOfDeath(e.target.value)}
                    placeholder="Data de falecimento"
                  />
                  <input
                    type="text"
                    value={causeOfDeath}
                    onChange={(e) => setCauseOfDeath(e.target.value)}
                    placeholder="Motivo do falecimento"
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
                      placeholder="Link do familiar"
                      className={styles.linkInput}
                    />

                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleRemoveFamilyMember(idx)}
                    >
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fdeletar.svg?alt=media&token=8542c24b-5124-4c10-91ee-a4918550dc92"
                        alt="Deletar"
                      />
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
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fdeletar.svg?alt=media&token=8542c24b-5124-4c10-91ee-a4918550dc92"
                        alt="Deletar"
                      />
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
