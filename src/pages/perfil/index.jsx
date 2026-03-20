import styles from "./index.module.scss";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AvatarEdit from "@/components/avatar/edit";
import NomeUsuario from "@/components/perfil/nomeUsuario";
import Handle from "@/components/perfil/handle";
import Private from "@/components/Private";
import Button from "@/components/button";
import EditIcon from "@/components/icons/EditIcon";
import LogOutIcon from "@/components/icons/LogOutIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import capaDesktop from "@/components/background/capa-perfil-default-desktop.jpg";
import capaMobile from "@/components/background/capa-perfil-default-mobile.jpg";
import SectionCard from "@/components/section-card";
import TextInput from "@/components/inputs/text-input";
import Select from "@/components/inputs/select";
import Modal from "@/components/modal";
import RadioButton from "@/components/inputs/radio-button";
import { useAuth } from "@/contexts/auth";
import PopoverConfirmar from "@/components/popover-confirmar";
import Breadcrumb from "@/components/breadcrumb";
import { useIsMobile } from "@/components/DeviceProvider";
import { useState, useEffect } from "react";

const GENERO_OPTIONS = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "nao-binario", label: "Não-binário" },
  { value: "prefiro-nao-informar", label: "Prefiro não informar" },
];

const ESTILO_OPTIONS = [
  { value: "potterhead", label: "Potterhead" },
  { value: "meio-sangue", label: "Meio Sangue" },
  { value: "tolkienistas", label: "Tolkienistas" },
  { value: "whovians", label: "Whovians" },
  { value: "trekkies", label: "Trekkies" },
  { value: "jedis-padawans", label: "Jedis/Padawans" },
  { value: "jack-sparrows-crew", label: "Jack Sparrow's Crew" },
  { value: "twilighters", label: "Twilighters" },
  { value: "iniciados", label: "Iniciados" },
  { value: "narnianos", label: "Narnianos" },
  { value: "marvelmaniaco", label: "Marvelmaníaco" },
  { value: "dcnautas", label: "DCnautas" },
];

const normalizeGenero = (val) => {
  if (!val) return "";
  const exact = GENERO_OPTIONS.find((o) => o.value === val);
  if (exact) return val;
  const byLabel = GENERO_OPTIONS.find(
    (o) => o.label.toLowerCase() === val.toLowerCase()
  );
  return byLabel?.value ?? "";
};

const PerfilUsuario = () => {
  const { user, atualizarPerfil, logout } = useAuth();
  const isMobile = useIsMobile();

  const [nome, setNome] = useState(user?.nome ?? "");
  const [handle, setHandle] = useState(user?.handle ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [genero, setGenero] = useState(normalizeGenero(user?.genero));
  const [estilo, setEstilo] = useState(user?.estilo ?? "");

  useEffect(() => {
    if (!user) return;
    setNome(user.nome ?? "");
    setHandle(user.handle ?? "");
    setEmail(user.email ?? "");
    setGenero(normalizeGenero(user.genero));
    setEstilo(user.estilo ?? "");
    setPendingGenero(normalizeGenero(user.genero));
    setPendingEstilo(user.estilo ?? "");
  }, [user?.uid, user?.genero, user?.estilo, user?.nome, user?.handle]);

  const handleSalvar = () => atualizarPerfil({ nome, handle, genero, estilo });

  const [generoModalOpen, setGeneroModalOpen] = useState(false);
  const [confirmarSaida, setConfirmarSaida] = useState(false);
  const [pendingGenero, setPendingGenero] = useState(genero);
  const generoLabel = GENERO_OPTIONS.find((o) => o.value === genero)?.label;

  const handleOpenGeneroModal = () => {
    setPendingGenero(genero);
    setGeneroModalOpen(true);
  };

  const handleConfirmGenero = () => {
    setGenero(pendingGenero);
    setGeneroModalOpen(false);
  };

  const [estiloModalOpen, setEstiloModalOpen] = useState(false);
  const [pendingEstilo, setPendingEstilo] = useState(estilo);

  const handleOpenEstiloModal = () => {
    setPendingEstilo(estilo);
    setEstiloModalOpen(true);
  };

  const handleConfirmEstilo = () => {
    setEstilo(pendingEstilo);
    setEstiloModalOpen(false);
  };

  const estiloLabel = ESTILO_OPTIONS.find((o) => o.value === estilo)?.label;

  return (
    <Private>
      <Head>
        <title>Cameo - Perfil</title>
        <meta
          name="description"
          content="Gerencie suas informações pessoais e preferências de filmes no seu perfil."
        />
      </Head>
      <div className={styles.container}>
        <Header />
        <Breadcrumb items={[{ label: "Perfil" }]} />
        <div className={styles.TopoInfoPerfil}>
          <div className={styles.alterarCapa}>
            <Button
              variant="outline"
              label="Alterar capa"
              icon={<EditIcon size={16} color="currentColor" />}
              width="100%"
              arrowColor="var(--stroke-base)"
              border="var(--stroke-base)"
              bg="var(--bg-base)"
            />
          </div>
          <div className={styles.infoPrincipal}>
            <AvatarEdit />
            <NomeUsuario />
            <Handle />
          </div>

          <div className={styles.progresso}>
            <div className={styles.perfilStatus}>
              <span>Perfil iniciante</span>
            </div>
            <div className={styles.barProgresso}>
              <div className={styles.percentual}></div>
            </div>
          </div>

          <div className={styles.backgroundPerfil}>
            <img
              src={capaDesktop.src}
              alt="Capa do perfil"
              className={styles.capaDesktop}
            />
          </div>
        </div>

        <div className={styles.sectionsCards}>
          <SectionCard title="Dados pessoais">
            <div className={styles.conteudoSectionCard}>
              <TextInput
                id="nome"
                name="nome"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                width="100%"
              />
              <TextInput
                id="handle"
                name="handle"
                placeholder="seuhandle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                width="100%"
              />
              <TextInput
                id="email"
                name="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                width="100%"
              />
              {isMobile ? (
                <button
                  className={styles.selectBtn}
                  onClick={handleOpenGeneroModal}
                >
                  <span>{generoLabel || "Selecione o gênero"}</span>
                  <ChevronDownIcon size={16} color="currentColor" />
                </button>
              ) : (
                <Select
                  placeholder={generoLabel || "Selecione o gênero"}
                  value={genero}
                  onChange={setGenero}
                  width="100%"
                  options={GENERO_OPTIONS}
                />
              )}
            </div>
          </SectionCard>

          <SectionCard title="Configurações">
            <div className={styles.conteudoSectionCard}>
              {isMobile ? (
                <button
                  className={styles.selectBtn}
                  onClick={handleOpenEstiloModal}
                >
                  <span>{estiloLabel || "Estilo cinéfilo"}</span>
                  <ChevronDownIcon
                    size={16}
                    color="currentColor"
                    className={styles.selectBtnChevron}
                  />
                </button>
              ) : (
                <Select
                  placeholder={estiloLabel || "Estilo cinéfilo"}
                  value={estilo}
                  onChange={setEstilo}
                  width="100%"
                  options={ESTILO_OPTIONS}
                />
              )}
              {!isMobile && (
                <Button
                  variant="soft"
                  label="Sair"
                  icon={<LogOutIcon size={16} color="currentColor" />}
                  width="100%"
                  bg="var(--bg-base)"
                  onClick={() => setConfirmarSaida(true)}
                />
              )}
              <Button
                variant="outline"
                label="Alterar senha"
                width="100%"
                border="var(--stroke-base)"
                arrowColor="var(--stroke-base)"
              />
              <Button variant="solid" label="Salvar alterações" width="100%" onClick={handleSalvar} />
            </div>
          </SectionCard>
        </div>
      </div>

      <div className={styles.backgroundPerfilMobile}>
        <img
          src={capaMobile.src}
          alt="Capa do perfil"
          className={styles.capaMobile}
        />
      </div>
      <Footer />

      {generoModalOpen && (
        <Modal
          title="Gênero"
          onClose={() => setGeneroModalOpen(false)}
          primaryAction={{
            label: "Selecionar",
            onClick: handleConfirmGenero,
          }}
        >
          <div className={styles.estiloOpcoes}>
            {GENERO_OPTIONS.map((op) => (
              <RadioButton
                key={op.value}
                label={op.label}
                checked={pendingGenero === op.value}
                onChange={() => setPendingGenero(op.value)}
                iconVariant="none"
              />
            ))}
          </div>
        </Modal>
      )}

      {estiloModalOpen && (
        <Modal
          title="Estilo cinéfilo"
          onClose={() => setEstiloModalOpen(false)}
          primaryAction={{
            label: "Selecionar",
            onClick: handleConfirmEstilo,
          }}
        >
          <div className={styles.estiloOpcoes}>
            {ESTILO_OPTIONS.map((op) => (
              <RadioButton
                key={op.value}
                label={op.label}
                checked={pendingEstilo === op.value}
                onChange={() => setPendingEstilo(op.value)}
                iconVariant="none"
              />
            ))}
          </div>
        </Modal>
      )}
      {confirmarSaida && (
        <PopoverConfirmar
          mensagem="Tem certeza que deseja sair?"
          labelConfirmar="Sair"
          onConfirmar={logout}
          onCancelar={() => setConfirmarSaida(false)}
        />
      )}
    </Private>
  );
};

export default PerfilUsuario;
