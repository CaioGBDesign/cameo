import styles from "./index.module.scss"
import Logo from "@/components/logo"
import EntrarCadastrar from "@/components/botoes/acesso"
import Header from "@/components/Header"

const login = () => {

    function inputControler (evento) {

        console.log(evento.target.value)

    }

    return <main className={styles["background"]}>

    {/* Header */}
    <Header showMiniatura={false} showFotoPerfil={false} />
        
    <div className={styles.login}>

        {/* logo */}
        <Logo></Logo>

        {/* form */}
        <div className={styles.formulario}>
            <form>
                
                <div className={styles.inputCont}>
                    <div className={styles.inputCameo}>
                        <input onChange={inputControler} type="email" placeholder="e-mail" id="email" name="email" required />
                    </div>
                    <div className={styles.inputCameo}>
                        <input type="password" placeholder="senha" id="password" name="password" required />
                        
                        <div className={styles.contSenha}>
                            <a href="#" className={styles.esqueciSenha}>Esqueceu a senha?</a>
                        </div>
                    </div>
                </div>

                <EntrarCadastrar onClick={() => console.log(123)}>Entrar</EntrarCadastrar>

                <div className={styles.loginCadastro}>
                    <span>Ainda não tem cadastro? <a href="/cadastro">Crie imediatamente.</a></span>
                </div>

                <span>Ou</span>

                <div className={styles.loginButtons}>
                    <button>
                        <img src="/social/google.png" alt="login google" />
                    </button>
                    <button>
                        <img src="/social/facebook.png" alt="login facebook" />
                    </button>
                    <button>
                        <img src="/social/apple.png" alt="login apple" />
                    </button>
                </div>

            </form>
        </div>
    </div>

    </main>
}

export default login