import Head from "next/head";
import React from "react";

const LoadingPage = () => {
  return (
    <div className="page loading-page loading-screen">
      <Head>
        <title>Loading...</title>
      </Head>
      <div>Loading ...</div>
    </div>
  );
};

export default LoadingPage;
