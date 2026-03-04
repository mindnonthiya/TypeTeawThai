import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import { IBM_Plex_Sans_Thai, Playfair_Display } from 'next/font/google'
import Layout from '@/components/Layout'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'

const ibmThai = IBM_Plex_Sans_Thai({
  subsets: ['thai'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-playfair', // 👈 ต้องเพิ่มอันนี้
})

export type NextPageWithLayout = NextPage & {
  noLayout?: boolean
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className={`${ibmThai.className} ${playfair.variable}`}>
          {Component.noLayout ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </div>
      </AuthProvider>
    </LanguageProvider>
  )
}