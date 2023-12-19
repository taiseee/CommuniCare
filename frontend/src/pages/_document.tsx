import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#000" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
