import "@/styles/globals.css";
import { Nunito } from "next/font/google";
import { Poppins } from "next/font/google";
import AuthProvider from "@/contexts/auth";
import { MantineProvider } from "@mantine/core";
import { ToastContainer } from "react-toastify"; // Importa o ToastContainer
import { DeviceProvider } from "@/components/DeviceProvider";
import "react-toastify/dist/ReactToastify.css"; // Importa o CSS do Toastify

const nunito = Nunito({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <main className={`${nunito.className} ${poppins.className}`}>
        <AuthProvider>
          <DeviceProvider>
            <Component {...pageProps} />
            <ToastContainer />
          </DeviceProvider>
        </AuthProvider>
      </main>
    </MantineProvider>
  );
}
