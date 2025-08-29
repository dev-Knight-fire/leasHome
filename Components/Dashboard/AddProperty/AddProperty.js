import { useAuth } from "@/Contexts/AuthContext";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { db } from "@/Firebase/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

function AddProperty() {
  const router = useRouter();
  const { user } = useAuth();
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [propertyType, setPropertyType] = useState("plot");
  const [leaseType, setLeaseType] = useState("");
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm();

  const watchedLeaseType = watch("leaseType", leaseType);

  // Handle file input change and preview
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotoFiles(files);
    setValue("photos", files, { shouldValidate: true });
    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(previews);
  };

  // Remove a photo from the selection
  const handleRemovePhoto = (idx) => {
    const newFiles = photoFiles.filter((_, i) => i !== idx);
    setPhotoFiles(newFiles);
    setValue("photos", newFiles, { shouldValidate: true });
    setPhotoPreviews(newFiles.map((file) => URL.createObjectURL(file)));
    // Also update the file input's value so it matches the state
    if (fileInputRef.current) {
      // Create a new DataTransfer to update the input's files
      const dt = new DataTransfer();
      newFiles.forEach(file => dt.items.add(file));
      fileInputRef.current.files = dt.files;
    }
  };

  // Upload photos to Firebase Storage and return their download URLs
  const uploadPhotosToStorage = async (files) => {
    if (!files || files.length === 0) return [];
    const storage = getStorage();
    const uploadPromises = files.map(async (file) => {
      // Use a unique path for each photo
      const filePath = `property_photos/${user?.uid || "anonymous"}/${Date.now()}_${Math.random().toString(36).substring(2, 10)}_${file.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    });
    return Promise.all(uploadPromises);
  };

  const handleAddProperty = async (data) => {
    setLoading(true);
    try {
      // Validate that at least one photo is selected
      if (!photoFiles || photoFiles.length === 0) {
        toast.error("At least one photo is required.");
        setLoading(false);
        return;
      }

      // Upload photos to Firebase Storage
      const photoUrls = await uploadPhotosToStorage(photoFiles);

      let developmentPlan = data.developmentPlan;
      if (data.type === "plot") {
        if (!Array.isArray(developmentPlan)) {
          developmentPlan = developmentPlan ? [developmentPlan] : [];
        }
      }

      const propertyData = {
        type: data.type,
        location: data.location,
        title: data.title,
        description: data.description,
        price: Number(data.price),
        leaseType: data.leaseType,
        utilities: {
          water: data.water === "yes",
          electricity: data.electricity === "yes",
          sewer: data.sewer === "yes",
          gas: data.gas === "yes",
        },
        accessibility: data.accessibility,
        publicLighting: data.publicLighting === "yes",
        sidewalk: data.sidewalk === "yes",
        photos: photoUrls,
        createdBy: {
          email: user?.email || "",
          name: user?.displayName || "",
          photoURL: user?.photoURL || "",
        },
        createdAt: serverTimestamp(),
      };

      if (data.leaseType === "Rental with Option to buy") {
        propertyData.fullValueOfProperty = data.fullValueOfProperty ? Number(data.fullValueOfProperty) : null;
      }

      if (data.type === "plot") {
        propertyData.developmentPlan = developmentPlan;
      } else if (data.type === "building") {
        propertyData.buildingType = data.buildingType;
      }

      await addDoc(collection(db, "properties"), propertyData);

      toast.success("Property registered successfully!", {
        position: "top-center",
      });
      reset();
      setPhotoFiles([]);
      setPhotoPreviews([]);
      setLoading(false);
      // Reset file input value so "No file chosen" is shown again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.push("/");
    } catch (err) {
      setLoading(false);
      toast.error("Failed to register property.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-2xl w-full mx-auto my-10">
        <div className="bg-gradient-to-r from-green-700 to-gray-900 rounded-t-2xl shadow-lg">
          <h2 className="uppercase p-8 text-center text-white text-3xl font-extrabold tracking-wider drop-shadow-lg">
            Register Your Property
          </h2>
        </div>
        <form
          onSubmit={handleSubmit(handleAddProperty)}
          className="p-8 rounded-b-2xl shadow-xl bg-white"
        >
          {/* Type, Lease Type & Location */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-gray-900">Type</label>
              <select
                {...register("type", { required: true })}
                value={propertyType}
                onChange={e => setPropertyType(e.target.value)}
                className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.type ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
              >
                <option value="plot">Plot</option>
                <option value="building">Building</option>
              </select>
              {errors.type && (
                <p className="text-red-600 text-xs mt-1">Type is required</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-gray-900">Lease Type</label>
              <select
                {...register("leaseType", { required: true })}
                value={leaseType}
                onChange={e => {
                  setLeaseType(e.target.value);
                  setValue("leaseType", e.target.value, { shouldValidate: true });
                }}
                className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.leaseType ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
              >
                <option value="">Select</option>
                <option value="Lease">Lease</option>
                <option value="Long-term rental">Long-term rental</option>
                <option value="Rental with Option to buy">Rental with Option to buy</option>
              </select>
              {errors.leaseType && (
                <p className="text-red-600 text-xs mt-1">Lease type is required</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-gray-900">Location</label>
              <input
                type="text"
                placeholder="Enter location"
                {...register("location", { required: true })}
                className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.location ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
              />
              {errors.location && (
                <p className="text-red-600 text-xs mt-1">Location is required</p>
              )}
            </div>
          </div>

          {/* Full value of property (conditional) */}
          {watchedLeaseType === "Rental with Option to buy" && (
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-900">Full value of property (USD)</label>
              <input
                type="number"
                min={0}
                step="any"
                placeholder="Enter full value of property"
                {...register("fullValueOfProperty", { required: true, min: 0 })}
                className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.fullValueOfProperty ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
              />
              {errors.fullValueOfProperty && (
                <p className="text-red-600 text-xs mt-1">Full value is required and must be positive</p>
              )}
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-900">Title</label>
            <input
              type="text"
              placeholder="Enter title"
              {...register("title", { required: true })}
              className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.title ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
            />
            {errors.title && (
              <p className="text-red-600 text-xs mt-1">Title is required</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-900">Description</label>
            <textarea
              rows={3}
              placeholder="Enter description"
              {...register("description", { required: true })}
              className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.description ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
            />
            {errors.description && (
              <p className="text-red-600 text-xs mt-1">Description is required</p>
            )}
          </div>

          {/* Price */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-900">Monthly Payment (USD)</label>
            <input
              type="number"
              min={0}
              placeholder="Enter price"
              {...register("price", { required: true, min: 0 })}
              className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.price ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
            />
            {errors.price && (
              <p className="text-red-600 text-xs mt-1">Price is required and must be positive</p>
            )}
          </div>

          {/* Photos */}
          <div className="mb-8">
            <label className="block mb-2 font-semibold text-gray-900">Photos</label>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                // Remove {...register("photos", { required: true })} because react-hook-form does not handle files well
                onChange={handlePhotoChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-900 hover:file:bg-green-100 transition"
                required
                // Show selected file names in a custom way below
              />
              {/* Show selected file names instead of default "No file chosen" */}
              {photoFiles && photoFiles.length > 0 && (
                <div className="flex flex-col gap-1 text-xs text-gray-700">
                  {photoFiles.map((file, idx) => (
                    <span key={idx}>{file.name}</span>
                  ))}
                </div>
              )}
              {(!photoFiles || photoFiles.length === 0) && (
                <span className="text-red-600 text-xs mt-1">At least one photo is required</span>
              )}
            </div>
            {photoPreviews.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {photoPreviews.map((src, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-xl border-2 border-green-200 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 bg-green-600 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Utilities */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-gray-900">Water</label>
              <select
                {...register("water", { required: true })}
                className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.water ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.water && (
                <p className="text-red-600 text-xs mt-1">Required</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-gray-900">Electricity</label>
              <select
                {...register("electricity", { required: true })}
                className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.electricity ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.electricity && (
                <p className="text-red-600 text-xs mt-1">Required</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-gray-900">Sewer</label>
              <select
                {...register("sewer", { required: true })}
                className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.sewer ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.sewer && (
                <p className="text-red-600 text-xs mt-1">Required</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-gray-900">Gas</label>
              <select
                {...register("gas", { required: true })}
                className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.gas ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.gas && (
                <p className="text-red-600 text-xs mt-1">Required</p>
              )}
            </div>
          </div>

          {/* Accessibility, Public Lighting, Sidewalk */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-gray-900">Accessibility</label>
              <select
                {...register("accessibility", { required: true })}
                className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.accessibility ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
              >
                <option value="">Select</option>
                <option value="gravel road">Gravel Road</option>
                <option value="paved road">Paved Road</option>
                <option value="asphalt">Asphalt</option>
                <option value="concrete road">Concrete Road</option>
              </select>
              {errors.accessibility && (
                <p className="text-red-600 text-xs mt-1">Accessibility is required</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-gray-900">Public Lighting</label>
              <select
                {...register("publicLighting", { required: true })}
                className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.publicLighting ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.publicLighting && (
                <p className="text-red-600 text-xs mt-1">Required</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-gray-900">Sidewalk</label>
              <select
                {...register("sidewalk", { required: true })}
                className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.sidewalk ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.sidewalk && (
                <p className="text-red-600 text-xs mt-1">Required</p>
              )}
            </div>
          </div>

          {/* Conditional Fields */}
          {propertyType === "plot" && (
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-900">Development Plan</label>
              <select
                {...register("developmentPlan", { 
                  required: true,
                  validate: value => (Array.isArray(value) ? value.length > 0 : !!value) || "Development plan is required"
                })}
                multiple
                className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.developmentPlan ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
                size={5}
              >
                <option value="single-family homes">Single-family homes</option>
                <option value="multi-family buildings">Multi-family buildings</option>
                <option value="warehouse">Warehouse</option>
                <option value="office buildings">Office buildings</option>
                <option value="industrial and manufacturing">Industrial and manufacturing</option>
              </select>
              {errors.developmentPlan && (
                <p className="text-red-600 text-xs mt-1">{errors.developmentPlan.message || "Development plan is required"}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple options.</p>
            </div>
          )}

          {propertyType === "building" && (
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-900">Type of Building</label>
              <select
                {...register("buildingType", { required: true })}
                className={`w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.buildingType ? "border-green-600" : "border-gray-300"} bg-gray-50 text-gray-900`}
              >
                <option value="">Select</option>
                <option value="house">House</option>
                <option value="terraced house">Terraced house</option>
                <option value="apartment building">Apartment building</option>
                <option value="tenement house">Tenement house</option>
                <option value="skyscraper">Skyscraper</option>
                <option value="office building">Office building</option>
                <option value="other">Other</option>
              </select>
              {errors.buildingType && (
                <p className="text-red-600 text-xs mt-1">Type of building is required</p>
              )}
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={agree}
              onChange={() => setAgree(!agree)}
              required
              className="mr-3 accent-green-600 w-5 h-5"
            />
            <label htmlFor="terms" className="text-sm text-gray-900">
              I agree with the{" "}
              <a href="#" className="text-green-700 underline hover:text-green-900 transition">
                terms and conditions
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r from-green-700 to-gray-900 text-white font-bold text-lg shadow-md transition-all duration-200 ${(!agree || loading) ? "opacity-60 cursor-not-allowed" : "hover:from-green-800 hover:to-black scale-105"}`}
            disabled={!agree || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                Saving...
              </span>
            ) : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProperty;
