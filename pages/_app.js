import Head from "next/head";
import Router from "next/router";
import ProgressBar from "@badrap/bar-of-progress";
import Wrappers from "../components/App/Wrappers";
import "../styles/globals.css";

const progress = new ProgressBar({
  size: 2,
  color: "#ff6d00",
  className: "z-10",
  delay: 0,
});

Router?.events?.on("routeChangeStart", progress.start);
Router?.events?.on("routeChangeComplete", progress.finish);
Router?.events?.on("routeChangeError", progress.finish);

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>

      <Wrappers>{getLayout(<Component {...pageProps} />)}</Wrappers>
    </>
  );
}

export default MyApp;
