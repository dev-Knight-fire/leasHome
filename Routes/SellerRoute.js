import Loader from "@/Components/Shared/Loader/Loader";
import { useAuth } from "@/Contexts/AuthContext";
import { useRouter } from "next/router";
import useSeller from "@/Hooks/useSeller";

function SellerRoute({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSeller, isSellerLoading] = useSeller(user?.email);

  if (loading || isSellerLoading) return <Loader />;

  if (user?.uid && isSeller) return children;
  else router.push("/login");
}

export default SellerRoute;
