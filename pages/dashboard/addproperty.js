import AddProperty from '@/Components/Dashboard/AddProperty/AddProperty';
import PleaseLogin from '@/Components/PleaseLogin/PleaseLogin';
import useSeller from "@/Hooks/useSeller";
import { useAuth } from '@/Contexts/AuthContext';

const addproperty = () => {
   const { user, loading } = useAuth();
   const [isSeller, isSellerLoading] = useSeller(user?.email)
   if (!user?.email || user?.role === "seller") {
      return <PleaseLogin></PleaseLogin>;
   }

   return (

      <div>
         <AddProperty></AddProperty>
      </div>
   );
};

export default addproperty;