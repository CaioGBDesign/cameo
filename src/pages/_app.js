import "@/styles/globals.css";
import { Nunito_Sans } from "next/font/google";
import AuthProvider from "@/contexts/auth";
import { ToastProvider } from "@/contexts/toast";
import { DeviceProvider } from "@/components/DeviceProvider";
import { AlertMetaProvider } from "@/contexts/alert-meta";
import AlertMeta from "@/components/alert-meta";

const nunitoSans = Nunito_Sans({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <main className={nunitoSans.className}>
      <ToastProvider>
        <AuthProvider>
          <DeviceProvider>
            <AlertMetaProvider>
              <Component {...pageProps} />
              <AlertMeta />
            </AlertMetaProvider>
          </DeviceProvider>
        </AuthProvider>
      </ToastProvider>
    </main>
  );
}
