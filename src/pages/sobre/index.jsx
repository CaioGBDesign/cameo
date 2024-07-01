import Button from "@/components/botoes/voltar"
import Header from "@/components/Header"

const Cachorro = () => {

    return <div>
        <Header/>
        Hello world!
        <Button>
        <a href="#">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19.9999L8.48 13.4799C7.71 12.7099 7.71 11.4499 8.48 10.6799L15 4.15991" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </a>
        </Button>
    </div>
}

export default Cachorro