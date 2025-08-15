import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { VscSearch } from "react-icons/vsc";
// Anik Datta

const Searchfield = () => {
  // implement search field using react-hook-form
  const [propertyPurpose, setPropertyPurpose] = useState("toRent");
  const [defineOption, setDefineOption] = useState("commercial");

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // console.log(data);
    fetch("https://server-fare-bd.vercel.app/search", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((allData) => {
        router.push(
          {
            pathname: "/searchResult",
            query: {
              data: JSON.stringify(allData),
            },
          },
          "/searchResult"
        );
      });
  };

  return (
    <div className="max-w-4xl -mt-10 mb-16 mx-4 md:mx-auto shadow-lg border rounded-2xl p-10 text-white bg-primary bg-opacity-50">
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 md:gap-8 lg:gap-y-0 lg:gap-x-12 w-full">

          {/* Location Input */}
          <div className="relative w-full mb-6 group flex flex-col">
            <label
              htmlFor="location"
              className="font-semibold text-lg pl-1"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="Enter location (city, area, or address)"
              className="focus:outline-none rounded-md py-2.5 px-3 text-primary"
              {...register("location")}
            />
          </div>

          <div className="relative w-full mb-6 group flex flex-col">
            <label htmlFor="purpose" className="font-semibold text-lg pl-1">
              Purpose
            </label>
            <select
              id="purpose"
              className="focus:outline-none rounded-md py-2.5 text-primary"
              {...register("purpose")}
              onChange={(e) => setPropertyPurpose(e.target.value)}
              defaultValue={""}
            >
              <option value="">
                Select Purpose
              </option>
              <option value="lease">Lease</option>
              <option value="rental">Rental</option>
              <option value="long_term">Long-Term Rental</option>
            </select>
          </div>
          <div className="relative w-full mb-6 group flex flex-col">
            <label
              htmlFor="areaType"
              className="font-semibold text-lg pl-1"
            >
              Property Type
            </label>
            <select
              id="areaType"
              className="focus:outline-none rounded-md py-2.5 text-primary"
              {...register("areaType")}
              onChange={(e) => setDefineOption(e.target.value)}
              defaultValue={""}
            >
              <option value="">
                Select Property Type
              </option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div className="relative w-full mb-6 group flex flex-col">
            <label
              htmlFor="category"
              className="font-semibold text-lg pl-1"
            >
              Option to Buy
            </label>
            <select
              id="category"
              className="focus:outline-none rounded-md py-2.5 text-primary"
              {...register("category")}
              defaultValue={""}
            >
              {defineOption === "commercial" ? (
                <>
                  <option value="">
                    Select Option
                  </option>
                  <option value="office">Office</option>
                  <option value="floor">Floor</option>
                  <option value="duplex">Duplex</option>
                  <option value="building">Building</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="shop">Shop</option>
                  <option value="appartment">Appartment</option>
                  <option value="plaza">Plaza</option>
                  <option value="plot">Plot</option>
                  <option value="factory">Factory</option>
                </>
              ) : (
                <>
                  <option value="">
                    Select Division
                  </option>
                  <option value="appartment">Appartment</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="plaza">Plaza</option>
                  <option value="plot">Plot</option>
                  <option value="room">Room</option>
                  <option value="duplex">Duplex</option>
                  <option value="building">Building</option>
                </>
              )}
            </select>
          </div>
          
        </div>
        <button
          type="submit"
          className="focus:outline-none
               text-white
               bg-secondary
               hover:bg-opacity-80
               rounded-md
               focus:ring-4
               focus:ring-green-300
               font-medium
               text-lg px-5 py-2.5
               dark:bg-green-600
               dark:hover:bg-green-700
               dark:focus:ring-green-800
               border
               hover:border-gray-300 
               lg:w-1/5 w-1/2 sm:w-1/3 mt-5 lg:mt-0
               flex items-center gap-2 justify-center"
        >
          <VscSearch className="font-bold" size={24} /> Find
        </button>
      </form>
    </div>
  );
};
// Finished
export default Searchfield;
