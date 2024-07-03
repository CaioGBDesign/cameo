import styles from "./index.module.scss";
import Header from "@/components/Header";
import InputInfo from "@/components/perfil/dadosinput";
import BotaoSecundario from "@/components/botoes/secundarios";
import BaseBotoes from "@/components/botoes/base";
import SelectInfo from "@/components/perfil/dadosselect";

const DadosPessoais = () => {
  const selectGenero = [
    { value: "genero", label: "Masculino" },
    { value: "genero", label: "Feminino" },
    { value: "genero", label: "Outro" },
  ];

  const estiloCinefilo = [
    { value: "PotterHead", label: "PotterHead" },
    { value: "MeioSangue", label: "Meio Sangue" },
    { value: "Tolkienianos", label: "Tolkienianos" },
    { value: "GeekStarWars", label: "Geek de Star Wars" },
    { value: "Trekker", label: "Trekker" },
    { value: "Thronie", label: "Thronie" },
    { value: "Sherlockiano", label: "Sherlockiano" },
    { value: "Caçador", label: "Caçador" },
    { value: "Marvelita", label: "Marvelita" },
    { value: "FaDC", label: "Fã da DC" },
    { value: "Twihard", label: "Twihard" },
    { value: "Tributo", label: "Tributo" },
    { value: "Walker", label: "Walker" },
  ];

  return (
    <div className={styles.dadosPessoais}>
      {/* Header */}
      <Header showFotoPerfil={false} />

      <div className={styles.formDadosPessoais}>
        <InputInfo infoDados={"Caio Goulart"} />
        <InputInfo infoDados={"@caio.go"} isEnabled={true} />
        <InputInfo infoDados={"caio@cameo.fan"} />
        <BotaoSecundario
          textoBotaoSecundario={"Redefinir senha"}
          typeBsecundario={"submit"}
          idBsecundario={"redefinirSenha"}
        />
        <SelectInfo
          idSelect="genero"
          nameSelect="genero"
          titulo="Com qual gênero você se identifica?"
          opcoes={selectGenero}
        />
        <SelectInfo
          idSelect="estiloCinefilo"
          nameSelect="estiloCinefilo"
          titulo="Estilo cinéfilo"
          opcoes={estiloCinefilo}
        />
      </div>

      <BaseBotoes TextoBotao={"Salvar alterações"} botaoSecundario={false} />
    </div>
  );
};

export default DadosPessoais;
