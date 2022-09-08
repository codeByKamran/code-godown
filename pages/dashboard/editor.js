import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSnippet } from "../../redux/slices/appSlice";
import DashboardLayout from "../../components/Dashboard/Layout";
import Editor from "../../components/Dashboard/Editor";

const AddCodePanel = () => {
  const router = useRouter();

  const snippet = useSelector(selectSnippet);

  useEffect(() => {
    if (!snippet.files || snippet.files.length === 0) {
      router.replace("/dashboard");
    }
  }, [router, snippet.files]);

  return (
    <div className="page sub-page dashboard-page editor-page w-full rounded bg-backgroundContrast dark:bg-backgroundContrastDark">
      <Editor />
    </div>
  );
};

AddCodePanel.getLayout = (page) => (
  <DashboardLayout
    title="Add Snippet | Dashboard"
    className={`min-w-full bg-slate-900`}
  >
    {page}
  </DashboardLayout>
);

export default AddCodePanel;
