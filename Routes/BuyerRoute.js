import Loader from "@/Components/Shared/Loader/Loader";
import { useAuth } from "@/Contexts/AuthContext";
import { useRouter } from "next/router";

function BuyerRoute({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (user?.uid) return children;
  else router.push("/login");
}

export default BuyerRoute;
