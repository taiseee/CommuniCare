// TODO: css設定は後で
// import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/provider/AuthProvider';
import { AuthGurad } from '@/guard/AuthGuard';
import { ChakraProvider } from '@chakra-ui/react';
import Navbar from '@/components/Nabvar'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthProvider>
        <AuthGurad>
          <Navbar/>
          <Component {...pageProps} />
        </AuthGurad>
      </AuthProvider>
    </ChakraProvider>
  );
}
