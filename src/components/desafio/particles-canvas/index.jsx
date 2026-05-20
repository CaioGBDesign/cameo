import { useEffect, useRef } from "react";
import styles from "./index.module.scss";

export default function ParticlesCanvas({ count = 60 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let raf;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const spawn = () =>
      Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vy: -(0.2 + Math.random() * 0.5),
        vx: (Math.random() - 0.5) * 0.3,
        alpha: 0.2 + Math.random() * 0.6,
      }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fillRect(p.x, p.y, 1, 1);

        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    particles = spawn();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}