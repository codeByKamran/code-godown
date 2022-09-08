import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

import Layout from "@theme/Layout";
import SnippetDisplay from "@component/Dashboard/SnippetDisplay";

const Snippet = () => {
  const router = useRouter();
  console.log({ router });
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme === "light") {
      setTheme("dark");
    }
  }, [resolvedTheme]);

  return <SnippetDisplay />;
};

Snippet.getLayout = (page) => (
  <Layout title="Code Godown" tranparentHeader={false} themeSwitch={true}>
    {page}
  </Layout>
);

export default Snippet;
