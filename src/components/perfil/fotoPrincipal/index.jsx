import styles from "./index.module.scss";

const fotoUsuario = () => {

    return <div className={styles.fotoUsuario}>

        <div className={styles.fotoPerfil}>
            <img src="/usuario/usuario.jpeg" alt="Nome do usuario" />
        </div>

    </div>
}

export default fotoUsuario