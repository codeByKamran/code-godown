import DashboardLayout from "../../components/Dashboard/Layout";
import SnippetsArchivePanel from "../../components/Dashboard/SnippetsArchivePanel";

const Dashboard = () => {
  return <SnippetsArchivePanel />;
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
