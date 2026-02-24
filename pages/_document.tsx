import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=IBM+Plex+Sans+Thai:wght@300;400&display=swap"
                    rel="stylesheet"
                />
                
                <meta
                    name="format-detection"
                    content="telephone=no, date=no, email=no, address=no"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}