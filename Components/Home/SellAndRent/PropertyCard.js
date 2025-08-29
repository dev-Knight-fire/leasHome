import { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineFullscreen } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import soldImg from "../../../assets/images/sold.png";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/Firebase/firestore";

const PropertyCard = ({ propertyData }) => {
  const [ownerInfo, setOwnerInfo] = useState(null);

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      if (propertyData?.createdBy?.email) {
        try {
          const ownerDocRef = doc(db, "users", propertyData.createdBy.email);
          const ownerSnap = await getDoc(ownerDocRef);
          if (ownerSnap.exists()) {
            setOwnerInfo(ownerSnap.data());
          } else {
            setOwnerInfo(null);
          }
        } catch (error) {
          setOwnerInfo(null);
        }
      }
    };
    fetchOwnerInfo();
  }, [propertyData?.createdBy?.email]);

  function numberWithCommas(x) {
    if (!x) return "";
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
    return x;
  }
  const priceWithCommas = numberWithCommas(propertyData?.price);

  return (
    <div className="w-full rounded-2xl shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300 overflow-hidden group relative">
      {/* Sold badge */}
      {propertyData?.paid && (
        <img
          className="absolute top-3 right-3 z-20 w-16 drop-shadow-lg"
          src={soldImg.src}
          alt="sold"
        />
      )}

      {/* Card Image & Overlay */}
      <Link href={`/singleproperty/${propertyData?.id}`} className="block relative">
        {/* To Rent badge */}
        {!propertyData?.paid && propertyData?.property_condition === "toRent" && (
          <span className="absolute top-4 left-4 z-10 bg-secondary text-white px-4 py-1 rounded-br-2xl text-sm font-semibold shadow-lg">
            To Rent
          </span>
        )}

        <img
          className="w-full h-64 object-cover object-center transition-transform duration-300 group-hover:scale-105"
          src={propertyData?.photos?.[0]}
          alt={propertyData?.title || "Property"}
        />

        {/* Overlay gradient */}
        <div className="absolute bottom-0 left-0 w-full px-6 pt-16 pb-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
          <div className="flex items-center justify-between">
            {/* Owner Info */}
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full border-2 border-secondary object-cover"
                src={ownerInfo?.photoURL || ownerInfo?.img || "https://via.placeholder.com/100x100?text=Profile"}
                alt={ownerInfo?.name || ownerInfo?.displayName || "Owner"}
              />
              <div>
                <div className="font-semibold text-base">{ownerInfo?.name || ownerInfo?.displayName}</div>
                <div className="flex items-center text-xs text-gray-200 mt-1">
                  <CiLocationOn className="mr-1 text-lg" />
                  <span>{propertyData?.location}</span>
                </div>
              </div>
            </div>
            {/* Fullscreen Icon */}
            <div className="p-2 rounded-full bg-white/20 hover:bg-secondary/80 transition-colors cursor-pointer">
              <AiOutlineFullscreen className="text-2xl text-white group-hover:text-secondary transition-colors" />
            </div>
          </div>
        </div>
      </Link>

      {/* Card Details */}
      <div className="bg-white px-6 py-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-primary truncate">{propertyData?.title}</h3>
            <p className="text-xs text-gray-500 capitalize mt-1">
              Owner: {ownerInfo?.name || ownerInfo?.displayName}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-orange-600">
              $ {priceWithCommas}
            </span>
          </div>
        </div>
        <p className="text-gray-700 text-sm mt-2 min-h-[56px]">
          {propertyData?.description?.length > 90
            ? propertyData?.description.slice(0, 90) + "..."
            : propertyData?.description}
        </p>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t">
        <span className="text-xs text-gray-500">
          {propertyData?.post_date?.slice(0, 10)}
        </span>
        <Link href={`/singleproperty/${propertyData?.id}`}>
          <button
            type="button"
            className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-6 py-2 rounded-full shadow transition-colors"
          >
            More Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
