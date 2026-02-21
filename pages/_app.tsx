import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import type { ReactElement, ReactNode } from 'react'
import Layout from '@/components/Layout'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'

/**
 * Extend NextPage type to support optional noLayout flag
 */
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
        {Component.noLayout ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </AuthProvider>
    </LanguageProvider>
  )
}