import '../styles/global.css';
import type { AppProps } from 'next/app';
import { MioFarmoProvider } from '../context/MioFarmoContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MioFarmoProvider>
      <Component {...pageProps} />
    </MioFarmoProvider>
  );
}
