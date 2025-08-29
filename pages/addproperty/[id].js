import AddProperty from '@/Components/Dashboard/AddProperty/AddProperty';
import PleaseLogin from '@/Components/PleaseLogin/PleaseLogin';
import { useAuth } from '@/Contexts/AuthContext';
import { useRouter } from 'next/router';
const addproperty = () => {
   const router = useRouter();
   const { user } = useAuth();
   const { id } = router.query;
   if (!user.email) {
      return <PleaseLogin></PleaseLogin>;
   }
   return (
      <div>
         <AddProperty propertyId={id} />
      </div>
   );
};
export default addproperty;