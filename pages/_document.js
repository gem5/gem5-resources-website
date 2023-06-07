import { Html, Head, Main, NextScript } from 'next/document'

/**
 * @component
 * @description The document component which is used to render the HTML document. It is used to inject the CSS and JS files.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
export default function Document() {
  return (
    <Html lang="en">
      <Head >
        <link rel="shortcut icon" type="image/x-icon" href={process.env.BASE_PATH + "/favicon.png"} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
