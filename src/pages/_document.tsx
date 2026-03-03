import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Meta */}
        <meta name="description" content="Netwearing™ — Put your résumé on a shirt. Dress for the job you'll never get." />
        <meta name="theme-color" content="#0a66c2" />

        {/* Open Graph */}
        <meta property="og:title" content="Netwearing™ | Dress For The Job You'll Never Get" />
        <meta property="og:description" content="Put your résumé on a shirt. Wear your qualifications. Let your credentials do the networking." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://netwearing.com" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Netwearing™ | Dress For The Job You'll Never Get" />
        <meta name="twitter:description" content="Put your résumé on a shirt. Wear your qualifications. Let your credentials do the networking." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
