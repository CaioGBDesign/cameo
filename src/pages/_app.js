import "@/styles/globals.css";
import { Nunito } from "next/font/google";
import AuthProvider from "@/contexts/auth";

const nunito = Nunito({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <main className={nunito.className}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </main>
  );
}
