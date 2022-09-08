import Head from "next/head";
import DashboardHeader from "../Header";
import DashboardNavigation from "../DashboardNavigation";
import { useRouter } from "next/router";
import Header from "../../Generic/Header";
import Container from "../../Generic/Layout/Container";
import { useTheme } from "next-themes";
import { useEffect } from "react";

// import Inspector from "../../App/Inspector";
// import { useSelector } from "react-redux";
// import { selectSnippet } from "../../../redux/slices/appSlice";

const DashboardLayout = ({
  children,
  className,
  title,
  description,
  descriptionName,
  icon,
}) => {
  const { resolvedTheme, setTheme } = useTheme();
  // const snippet = useSelector(selectSnippet);

  useEffect(() => {
    if (resolvedTheme === "light") {
      setTheme("dark");
    }
  }, [resolvedTheme]);

  const router = useRouter();

  const showSidebar = router.pathname === "/dashboard";

  const hideDashboardHeader =
    router.pathname === "/dashboard/snippet/[snippetID]";

  return (
    <div className={`${className} dashboard-container min-h-screen min-w-full`}>
      <Head>
        <title>{title || "Dashboard | Code Godown"}</title>
        <meta
          name={descriptionName || "descritpion"}
          content={
            description || "Code management applicatoin created with NextJs"
          }
        />
        <link rel="icon" href={icon || "/favicon.ico"} />
      </Head>
      <Header />
      <main>
        <Container className="mt-1" maxWidth={false}>
          {!hideDashboardHeader && <DashboardHeader />}
          <div className="w-full flex flex-col space-y-2 lg:flex-row lg:items-start lg:space-y-0 mt-2 lg:space-x-2 mb-2">
            {showSidebar && (
              <div className="hidden md:block w-full bg-backgroundV1 dark:bg-backgroundContrastDark lg:w-1/6 rounded-lg">
                <DashboardNavigation />
              </div>
            )}
            <div
              className={`w-full flex bg-transparent dark:bg-backgroundV1Dark ${
                showSidebar && "lg:w-5/6"
              }`}
            >
              {children}
            </div>
          </div>
        </Container>
        {/* <Inspector code={snippet} className="z-10 mt-4" /> */}
      </main>
    </div>
  );
};

export default DashboardLayout;
