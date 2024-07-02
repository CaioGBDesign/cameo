import styles from "./index.module.scss";
import Link from "next/link"; 
import Header from "@/components/Header";
import FotoPrincipal from "@/components/perfil/fotoPrincipal";
import NomeUsuario from "@/components/perfil/nomeUsuario";
import Handle from "@/components/perfil/handle";
import Compartilhar from "@/components/botoes/compartilhar";
import Rede from "@/components/perfil/rede";
import Search from "@/components/busca";
import CardsPerfil from "@/components/perfil/cards";

const PerfilUsuario = () => {

    return (
        <div className={styles.perfilUsuario}>

            {/* Header */}
            <Header showFotoPerfil={false}></Header>

            <div className={styles.apresentacao}>
                <FotoPrincipal></FotoPrincipal>

                <div className={styles.contPerfil}>
                    <NomeUsuario></NomeUsuario>
                    
                    <div className={styles.compartilhar}>
                        <Handle></Handle>
                        <Compartilhar></Compartilhar>
                    </div>

                </div>

                <div className={styles.rede}>
                    <Rede iconePerfil={"/icones/seguidores.svg"} linkRede={"#"} titulo="Seguidores" valor={200} />
                    <Rede iconePerfil={"/icones/seguindo.svg"} linkRede={"#"} titulo="Seguindo" valor={200} />
                    <Rede iconePerfil={"/icones/avaliacoes.svg"} linkRede={"#"} titulo="Notas" valor={30} />
                    <Rede iconePerfil={"/icones/potterHead.svg"} linkRede={"#"} titulo="Estilo" valor={"PotterHead"} />
                </div>

                <Search></Search>

                <div className={styles.botoesDados}>

                    <div className={styles.contCards}>
                        <div className={styles.cardsPerfil}>

                            <CardsPerfil linkDadosPerfil={"/dadospessoais"} DadosdoPerfil={"Dados pessoais"} imagemPerfil={"/icones/perfil.svg"} />

                            <CardsPerfil linkDadosPerfil={"/filmesassisti"} DadosdoPerfil={"Filmes que assisti"} imagemPerfil={"/icones/claquete-azul.svg"} />

                        </div>

                        <div className={styles.cardsPerfil}>

                            <CardsPerfil linkDadosPerfil={"/filmesparaver"} DadosdoPerfil={"Filmes para ver"} imagemPerfil={"/icones/claquete-amarela.svg"} />

                            <CardsPerfil linkDadosPerfil={"#"} DadosdoPerfil={"Listas compartilhadas"} imagemPerfil={"/icones/claquete-roxa.svg"} />

                        </div>
                    </div>

                    <Link href="#" className={styles.botaoSair}>
                        <div className={styles.sair}>
                            <span>Sair</span>
                        </div>                    
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default PerfilUsuario;