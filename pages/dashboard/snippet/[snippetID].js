import DashboardLayout from "@component/Dashboard/Layout";
import SnippetDisplay from "@component/Dashboard/SnippetDisplay";

const Snippet = () => {
  return <SnippetDisplay />;
};

Snippet.getLayout = (page) => (
  <DashboardLayout title="Add Snippet | Dashboard">{page}</DashboardLayout>
);

export default Snippet;
