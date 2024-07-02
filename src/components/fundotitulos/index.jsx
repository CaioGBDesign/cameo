import { useEffect, useState } from 'react';
import styles from "./index.module.scss";

const FundoTitulos = ({ capaAssistidos, tituloAssistidos }) => {
    const [scrollY, setScrollY] = useState(0);
    const [imgTop, setImgTop] = useState(0); // Inicia com posição top 0px

    useEffect(() => {
        let requestId;

        const handleScroll = () => {
            requestId = requestAnimationFrame(() => {
                setScrollY(window.scrollY);
                updateImgPosition();
            });
        };

        const updateImgPosition = () => {
            // Ajuste o valor conforme necessário para a posição top desejada
            const maxTop = -50; // Valor máximo do top em pixels
            const minTop = 0; // Valor mínimo do top em pixels
            const scrollPercentage = Math.min(scrollY / 200, 1); // Limita a 1 após 200px de scroll
            const newTop = minTop + (maxTop - minTop) * scrollPercentage;
            setImgTop(newTop);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            cancelAnimationFrame(requestId);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrollY]);

    const imgStyle = {
        position: 'absolute',
        top: `${imgTop}px`, // Define o valor do top conforme o estado imgTop
        transition: 'top 0.2s ease', // Adiciona transição apenas para o top da imagem
    };

    return (
        <div className={styles.contCapa}>
            <div className={styles.capaAssistidos} style={{ position: 'relative' }}>
                <img src={capaAssistidos} alt={tituloAssistidos} style={imgStyle} />
            </div>
        </div>
    );
}

export default FundoTitulos;