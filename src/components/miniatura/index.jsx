import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import Link from 'next/link';

const Miniatura = ({ children }) => {
  const [logoSize, setLogoSize] = useState('normal'); // estado para controlar o tamanho da logo

  useEffect(() => {
    const handleScroll = () => {
      // Calcula a posição atual do scroll
      const scrollY = window.scrollY || window.pageYOffset;
      
      // Define o tamanho da logo baseado na posição do scroll
      if (scrollY > 0) {
        setLogoSize('small');
      } else {
        setLogoSize('normal');
      }
    };

    // Adiciona um listener para o evento de scroll
    window.addEventListener('scroll', handleScroll);

    // Remove o listener quando o componente é desmontado
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // [] vazio assegura que o useEffect só será executado uma vez

  return (
    <Link href="home" className={`${styles['miniatura']} ${styles[logoSize]}`}>
      <img src="logo/cameo-logo-miniatura.svg" alt="Cameo logo" />
      {children}
    </Link>
  );
};

export default Miniatura;