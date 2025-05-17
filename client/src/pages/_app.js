import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";

export default function App({ Component, pageProps }) {
  return(
    <NotificationProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </NotificationProvider>
  );
}
