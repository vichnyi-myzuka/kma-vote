import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="preconnect"
          href="https://fonts.macpaw.com"
          crossOrigin="true"
        />
        <link
          rel="stylesheet"
          href="https://fonts.macpaw.com/css?family=FixelDisplay:300;400;600;700"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
