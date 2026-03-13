import { useState, useEffect } from "react";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import styles from "./index.module.scss";

const ArrowButton = ({ scrollRef, scrollAmount = 250, showOnMobile = false }) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = () => {
    const el = scrollRef?.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef?.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scrollRef]);

  const scrollLeft = () =>
    scrollRef?.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });

  const scrollRight = () =>
    scrollRef?.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });

  if (!canScrollLeft && !canScrollRight) return null;

  return (
    <div className={`${styles.arrowButton} ${!showOnMobile ? styles.hideMobile : ""}`}>
      <button
        className={`${styles.arrow} ${canScrollLeft ? styles.active : styles.inactive}`}
        onClick={scrollLeft}
        aria-label="Rolar para a esquerda"
      >
        <ChevronDownIcon
          size={24}
          color="var(--icon-base)"
          style={{ transform: "rotate(90deg)" }}
        />
      </button>
      <button
        className={`${styles.arrow} ${canScrollRight ? styles.active : styles.inactive}`}
        onClick={scrollRight}
        aria-label="Rolar para a direita"
      >
        <ChevronDownIcon
          size={24}
          color="var(--icon-base)"
          style={{ transform: "rotate(-90deg)" }}
        />
      </button>
    </div>
  );
};

export default ArrowButton;
