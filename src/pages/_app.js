import "@/styles/globals.css";
import { Nunito_Sans } from "next/font/google";
import AuthProvider from "@/contexts/auth";
import { ToastContainer } from "react-toastify";
import { DeviceProvider } from "@/components/DeviceProvider";
import "react-toastify/dist/ReactToastify.css";

const nunitoSans = Nunito_Sans({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <main className={nunitoSans.className}>
      <AuthProvider>
        <DeviceProvider>
          <Component {...pageProps} />
          <ToastContainer />
        </DeviceProvider>
      </AuthProvider>
    </main>
  );
}
