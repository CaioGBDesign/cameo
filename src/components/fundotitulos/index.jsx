import { useEffect, useState } from 'react';
import styles from "./index.module.scss";

const FundoTitulos = ({ capaAssistidos, tituloAssistidos }) => {
    const [scrollY, setScrollY] = useState(0);
    const [imgSize, setImgSize] = useState(100); // Inicia com tamanho mínimo

    useEffect(() => {
        let requestId;

        const handleScroll = () => {
            requestId = requestAnimationFrame(() => {
                setScrollY(window.scrollY);
                updateImgSize();
            });
        };

        const updateImgSize = () => {
            const minSize = 100; // 100%
            const maxSize = 110; // 110%
            const scrollPercentage = Math.min(scrollY / 200, 1); // Limita a 1 após 200px de scroll
            const newSize = minSize + (maxSize - minSize) * scrollPercentage;
            setImgSize(newSize);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            cancelAnimationFrame(requestId);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrollY]);

    const imgStyle = {
        width: `${imgSize}%`,
        transition: 'width 0.2s ease', // Adiciona transição apenas para a largura da imagem
    };

    return (
        <div className={styles.capaAssistidos}>
            <img src={capaAssistidos} alt={tituloAssistidos} style={imgStyle} />
        </div>
    );
}

export default FundoTitulos;