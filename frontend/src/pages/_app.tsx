// TODO: css設定は後で
// import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/provider/AuthProvider';
import { AuthGurad } from '@/guard/AuthGuard';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AuthGurad>
        <Component {...pageProps} />
      </AuthGurad>
    </AuthProvider>
  );
}
