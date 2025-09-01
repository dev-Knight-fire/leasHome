import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { VscSearch } from "react-icons/vsc";
import { MapPin, X } from "lucide-react";
// Anik Datta

const Searchfield = () => {
  // implement search field using react-hook-form
  const [propertyPurpose, setPropertyPurpose] = useState("toRent");
  const [defineOption, setDefineOption] = useState("commercial");
  const [locationInput, setLocationInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  const router = useRouter();
  const locationInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const watchedLocation = watch("location");

  // Location search and autocomplete functionality
  const searchLocations = async (query) => {
    if (!query || query.length < 2) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingLocations(true);
    try {
      // Using OpenStreetMap Nominatim API for free worldwide location search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&addressdetails=1&accept-language=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        const suggestions = data.map(item => ({
          id: item.place_id,
          displayName: item.display_name,
          name: item.name || item.display_name.split(',')[0],
          city: item.address?.city || item.address?.town || item.address?.village || '',
          state: item.address?.state || '',
          country: item.address?.country || '',
          lat: item.lat,
          lon: item.lon,
          type: item.type
        }));
        
        setLocationSuggestions(suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocationSuggestions([]);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Handle location input change
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    setValue("location", value);
    
    if (value.length >= 2) {
      searchLocations(value);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location.displayName);
    setLocationInput(location.displayName);
    setValue("location", location.displayName);
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          locationInputRef.current && !locationInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear location input
  const clearLocation = () => {
    setLocationInput("");
    setSelectedLocation("");
    setValue("location", "");
    setLocationSuggestions([]);
    setShowSuggestions(false);
  };

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
            <div className="flex flex-col items-center w-full relative" ref={locationInputRef}>
              <label
                htmlFor="location"
                className="font-semibold text-lg text-white mb-2 self-start"
              >
                Location
              </label>
              <div className="relative w-full">
                <input
                  id="location"
                  type="text"
                  placeholder="Enter location (city, area, or address)"
                  className="w-full rounded-lg py-3 pl-4 pr-12 text-primary bg-white bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary transition"
                  value={locationInput}
                  onChange={handleLocationChange}
                  ref={locationInputRef}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {locationInput && (
                    <button
                      type="button"
                      onClick={clearLocation}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                
                {/* Location Suggestions Dropdown */}
                {showSuggestions && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
                  >
                    {isLoadingLocations ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2">Searching locations...</p>
                      </div>
                    ) : locationSuggestions.length > 0 ? (
                      <div className="py-2">
                        {locationSuggestions.map((location) => (
                          <button
                            key={location.id}
                            type="button"
                            onClick={() => handleLocationSelect(location)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-start space-x-3">
                              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">
                                  {location.name}
                                </div>
                                <div className="text-sm text-gray-500 truncate">
                                  {location.city && location.state ? `${location.city}, ${location.state}` : 
                                   location.city || location.state || ''}
                                </div>
                                {location.country && (
                                  <div className="text-xs text-gray-400 truncate">
                                    {location.country}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : locationInput.length >= 2 ? (
                      <div className="p-4 text-center text-gray-500">
                        No locations found
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
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