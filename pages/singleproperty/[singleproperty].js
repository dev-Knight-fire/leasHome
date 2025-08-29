import SinglePropertyPage from '@/Components/SinglePropertyPage/SinglePropertyPage';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/Firebase/firestore";
import { Loader } from 'lucide-react';

const SingleProperty = () => {
    const [propertyDetails, setPropertyDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const PropertyId = router.query.singleproperty;

    useEffect(() => {
        const fetchProperty = async () => {
            if (!PropertyId) return;
            setIsLoading(true);
            try {
                const docRef = doc(db, "properties", PropertyId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPropertyDetails({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setPropertyDetails(null);
                }
            } catch (error) {
                setPropertyDetails(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperty();
    }, [PropertyId]);

    return (
        <div>
            {isLoading ? (
                <div className='flex justify-center items-center h-screen'>
                    <Loader className='w-10 h-10 animate-spin' />
                </div>
            ) : propertyDetails ? (
                <SinglePropertyPage propertyDetails={propertyDetails} />
            ) : (
                <div>Property not found.</div>
            )}
        </div>
    );
};

export default SingleProperty;