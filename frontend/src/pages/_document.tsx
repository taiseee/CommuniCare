import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="ja">
            <Head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#000" />
                <meta http-equiv="Content-Language" content="ja" />
                <meta name="google" content="notranslate" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
