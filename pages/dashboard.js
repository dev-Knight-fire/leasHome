import Dashboard from "@/Components/Dashboard/Dashboard/Dashboard";
import PleaseLogin from "@/Components/PleaseLogin/PleaseLogin";
import Loader from "@/Components/Shared/Loader/Loader";
import { useAuth } from "@/Contexts/AuthContext";

const DashboardPage = () => {
  const { user, loading } = useAuth();
  if (!user?.email) {
    return <PleaseLogin></PleaseLogin>;
  }
  return (
    <div>
      <title>DashBoard</title>
      <Dashboard></Dashboard>
    </div>
  );
};

export default DashboardPage;
