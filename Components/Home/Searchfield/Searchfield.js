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
    console.log(data);
    router.push(
      {
        pathname: "/properties",
        query: {
          data: JSON.stringify(data),
        },
      },
      "/properties"
    );
  };

  return (
    <div className="flex justify-center items-center min-h-[350px]">
      <div className="w-full max-w-4xl bg-primary bg-opacity-60 rounded-2xl shadow-xl p-8 md:p-12 mx-4">
        <form
          className="flex flex-col items-center justify-center gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Input */}
            <div className="flex flex-col items-center w-full">
              <label
                htmlFor="location"
                className="font-semibold text-lg text-white mb-2 self-start"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                placeholder="Enter location (city, area, or address)"
                className="w-full rounded-lg py-3 px-4 text-primary bg-white bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary transition"
                {...register("location")}
              />
            </div>
            {/* Purpose Select */}
            <div className="flex flex-col items-center w-full">
              <label
                htmlFor="purpose"
                className="font-semibold text-lg text-white mb-2 self-start"
              >
                Purpose
              </label>
              <select
                id="purpose"
                className="w-full rounded-lg py-3 px-4 text-primary bg-white bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary transition"
                {...register("purpose")}
                onChange={(e) => setPropertyPurpose(e.target.value)}
                defaultValue={""}
              >
                <option value="">Select Purpose</option>
                <option value="lease">Lease</option>
                <option value="rental">Rental with Option to Buy</option>
                <option value="long_term">Long-Term Rental</option>
              </select>
            </div>
            {/* Property Type Select */}
            <div className="flex flex-col items-center w-full md:col-span-2">
              <label
                htmlFor="areaType"
                className="font-semibold text-lg text-white mb-2 self-start"
              >
                Property Type
              </label>
              <select
                id="areaType"
                className="w-full rounded-lg py-3 px-4 text-primary bg-white bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary transition"
                {...register("areaType")}
                onChange={(e) => setDefineOption(e.target.value)}
                defaultValue={""}
              >
                <option value="">Select Property Type</option>
                <option value="plot">Plot</option>
                <option value="building">Building</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-semibold text-lg rounded-lg px-8 py-3 mt-2 shadow-lg transition focus:outline-none focus:ring-4 focus:ring-secondary/30"
          >
            <VscSearch className="font-bold" size={24} /> Find
          </button>
        </form>
      </div>
    </div>
  );
};
// Finished
export default Searchfield;
