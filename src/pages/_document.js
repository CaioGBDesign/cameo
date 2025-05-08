// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZH2ZPY8V8D"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZH2ZPY8V8D');
        `,
          }}
        />

        {/* AMP Auto Ads for AdSense */}
        <script
          async
          custom-element="amp-auto-ads"
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
        ></script>

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6964667377891288"
          crossOrigin="anonymous"
        ></script>

        {/* canonical */}
        <link rel="canonical" href="https://cameo.fun/noticias" />

        {/* JSON-LD: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://cameo.fun/",
              name: "Cameo",
              description:
                "Descubra o filme perfeito com a Cameo! Oferecemos sugestões aleatórias e personalizadas…",
              publisher: {
                "@type": "Organization",
                name: "Cameo.fun",
                logo: {
                  "@type": "ImageObject",
                  url: "https://cameo.fun/logo/cameo-logo-miniatura.svg",
                },
              },
            }),
          }}
        />

        {/* JSON-LD: NewsMediaOrganization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              name: "Cameo",
              url: "https://cameo.fun",
              logo: {
                "@type": "ImageObject",
                url: "https://cameo.fun/logo/cameo-logo-miniatura.svg",
              },
              sameAs: [
                "https://www.instagram.com/seucameo",
                "https://www.twitter.com/seucameo",
              ],
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />

        {/* AMP Auto Ads placeholder */}
        <amp-auto-ads
          type="adsense"
          data-ad-client="ca-pub-6964667377891288"
        ></amp-auto-ads>

        {/* Microsoft Clarity */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ouk1r2jidv");`,
          }}
        />
      </body>
    </Html>
  );
}
