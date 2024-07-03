import styles from "./index.module.scss";
import NomeServico from "@/components/detalhesfilmes/NomeServico";

const Servicos = () => {

    const simulacaoBack = [
        {
            url:"/icones/servicos/netflix.svg"
        },
        {
            url:"/icones/servicos/hbo.svg"
        },
        {
            url:"/icones/servicos/prime-video.svg"
        },
        {
            url:"/icones/servicos/youtube.svg"
        },
        {
            url:"/icones/servicos/paramount.svg"
        },
        {
            url:"/icones/servicos/apple-tv.svg"
        },
        {
            url:"/icones/servicos/star-plus.svg"
        },
        {
            url:"/icones/servicos/disney-plus.svg"
        }
    ]

    return (
        <div className={styles.servicos}>

            <div className={styles.contServicos}>
                <h3>Serviços</h3>

                <div className={styles.todosServicos}>
                    { simulacaoBack.map((servicos) => <NomeServico streaming={servicos.url} ></NomeServico> )}
                </div>
            </div>

        </div>
    );
}

export default Servicos;