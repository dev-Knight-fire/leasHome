import AddProperty from '@/Components/Dashboard/AddProperty/AddProperty';
import PleaseLogin from '@/Components/PleaseLogin/PleaseLogin';
import { useAuth } from '@/Contexts/AuthContext';

const addproperty = () => {
   const { user } = useAuth();
   if (!user.email) {
      return <PleaseLogin></PleaseLogin>;
   }

   return (

      <div>
         <AddProperty></AddProperty>
      </div>
   );
};

export default addproperty;