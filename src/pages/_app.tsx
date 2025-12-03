import AOS from 'aos';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { DefaultSeo } from 'next-seo';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import 'tailwindcss/tailwind.css';
import 'aos/dist/aos.css';
import '@/common/styles/globals.css';

import AuthGuard from '@/common/components/AuthGuard';
import CommandPalette from '@/common/components/elements/CommandPalette';
import Layout from '@/common/components/layouts';
import { AuthProvider } from '@/common/context/AuthContext';
import { CommandPaletteProvider } from '@/common/context/CommandPaletteContext';
import { jakartaSans } from '@/common/styles/fonts';
import Head from 'next/head';

import defaultSEOConfig from '../../next-seo.config';

const ProgressBar = dynamic(
  () => import('src/common/components/elements/ProgressBar'),
  { ssr: false },
);

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      delay: 50,
    });
  }, []);

  return (
    <>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap'
          rel='stylesheet'
        />
      </Head>
      <style jsx global>
        {`
          html {
            --jakartaSans-font: ${jakartaSans.style.fontFamily};
          }
        `}
      </style>
      <DefaultSeo {...defaultSEOConfig} />
      <AuthProvider>
        <AuthGuard>
          <ThemeProvider attribute='class' defaultTheme='dark'>
            <CommandPaletteProvider>
              <Layout>
                <CommandPalette />
                <ProgressBar />
                <Component {...pageProps} />
                <Toaster
                  position='top-right'
                  toastOptions={{
                    duration: 4000,
                    className: '',
                    style: {
                      background: 'var(--toast-bg)',
                      color: 'var(--toast-color)',
                      border: '1px solid var(--toast-border)',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#10B981',
                        secondary: '#FFFFFF',
                      },
                    },
                    error: {
                      duration: 4000,
                      iconTheme: {
                        primary: '#EF4444',
                        secondary: '#FFFFFF',
                      },
                    },
                    loading: {
                      duration: Infinity,
                    },
                  }}
                  containerStyle={{
                    top: 20,
                    right: 20,
                    zIndex: 9999,
                  }}
                  reverseOrder={false}
                  gutter={8}
                />
              </Layout>
            </CommandPaletteProvider>
          </ThemeProvider>
        </AuthGuard>
      </AuthProvider>
    </>
  );
};

export default App;
