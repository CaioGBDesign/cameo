import "@/styles/globals.css";
import { Nunito } from "next/font/google";
import AuthProvider from "@/contexts/auth";
import { MantineProvider } from "@mantine/core";

const nunito = Nunito({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <main className={nunito.className}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </main>
    </MantineProvider>
  );
}
