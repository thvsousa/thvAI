import type { AppProps } from 'next/app';
import '../styles/globals.css'; // Importando o CSS global

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;