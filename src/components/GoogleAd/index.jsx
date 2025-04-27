import { useEffect } from "react";
import Script from "next/script";

export default function GoogleAd({ adClient, adSlot, style }) {
  // dispara o push do adsbygoogle após montar
  useEffect(() => {
    // dá tempo do React inserir o <ins> no DOM e o CSS aplicar
    setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Adsense push error", e);
      }
    }, 0);
  }, []);

  return (
    <>
      {/* carregue a library do AdSense */}
      <Script
        id="adsense-script"
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
        crossOrigin="anonymous"
      />

      {/* insere o bloco de anúncio */}
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: "300px", height: "250px" }}
        data-ad-client="ca-pub-…"
        data-ad-slot="…"
      ></ins>
    </>
  );
}
