import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import BotaoVoltar from '@/components/botoes/voltar';
import Miniatura from '@/components/miniatura';
import FotoPerfil from '@/components/perfil/miniatura';

const Header = ({ showMiniatura = true, showFotoPerfil = true }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Função para verificar se o usuário já está rolando para baixo no carregamento da página
    const checkInitialScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      }
    };

    // Adiciona um listener para verificar o scroll inicial quando a página carregar
    checkInitialScroll();
    window.addEventListener('scroll', checkInitialScroll);

    // Remove o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('scroll', checkInitialScroll);
    };
  }, []);

  // Função para verificar o scroll ao longo do tempo
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setIsScrolled(scrollY > 0); // Define o estado isScrolled baseado na posição do scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // [] vazio assegura que o useEffect só será executado uma vez

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContent}>
        <div><BotaoVoltar className={styles.botaoVoltar} /></div>
        <div>{showMiniatura && <Miniatura className={styles.miniatura} />}</div>
        <div>{showFotoPerfil && <FotoPerfil className={styles.fotoPerfil} />}</div>
      </div>
    </header>
  );
};

export default Header;