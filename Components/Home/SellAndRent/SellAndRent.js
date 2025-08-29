import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/Firebase/firestore";

const SellAndRent = () => {
  const [recentProperties, setRecentProperties] = useState([]);

  useEffect(() => {
    const fetchRecentProperties = async () => {
      try {
        const q = query(
          collection(db, "properties"),
          orderBy("createdAt", "desc"),
          limit(6)
        );
        const querySnapshot = await getDocs(q);
        const properties = [];
        querySnapshot.forEach((doc) => {
          properties.push({ id: doc.id, ...doc.data() });
        });
        console.log(properties);
        setRecentProperties(properties);
      } catch (error) {
        // Optionally handle error
        setRecentProperties([]);
      }
    };

    fetchRecentProperties();
  }, []);

  return (
    <div className="max-w-[1440px] w-[95%] mx-auto mt-24">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-primary">Recent Properties</h2>
      </div>
      <div className="gap-8 grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1">
        {recentProperties.map((propertyData) => (
          <PropertyCard
            key={propertyData.id}
            propertyData={propertyData}
          />
        ))}
      </div>
    </div>
  );
};

export default SellAndRent;