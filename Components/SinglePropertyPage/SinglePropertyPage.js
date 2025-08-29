import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import {
  FaBed,
  FaBath,
  FaBorderAll,
  FaMapMarkerAlt,
  FaRegHeart,
  FaComment,
  FaLock,
  FaAngleDown,
  FaHome,
  FaHeart,
} from "react-icons/fa";
import { TbCurrencyTaka, TbCurrencyDollar } from "react-icons/tb";
import { BiInfoCircle, BiPurchaseTagAlt, BiSend } from "react-icons/bi";
import { useAuth } from "@/Contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Comment from "./Comment";
import { Avatar, Button, TextInput } from "flowbite-react";
import Loader from "../Shared/Loader/Loader";
import { IoCall } from "react-icons/io5";
import ConfirmationModal from "../Shared/ConfirmationModal/ConfirmationModal";
import { db } from '@/Firebase/firestore';
import { doc, getDoc, addDoc, collection, setDoc, serverTimestamp } from 'firebase/firestore';
import { MessageCircle, Phone, Mail, User, X, Send } from 'lucide-react';
import { useRouter } from 'next/router';

function numberWithCommas(x) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return x;
}

// const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

const SinglePropertyPage = ({ propertyDetails }) => {
  const data = propertyDetails;
  const [recommendations, setRecommendations] = useState(null);
  const [singleProperty, setSingleProperty] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCallNowModal, setShowCallNowModal] = useState(false);
  const [wishList, setWishList] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ownerData, setOwnerData] = useState(null);
  const [ownerLoading, setOwnerLoading] = useState(true);
  const [showChatModal, setShowChatModal] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const { user } = useAuth();
  const router = useRouter();
  // Fetch owner data from Firestore
  const fetchOwnerData = async (email) => {
    try {
      if (!email) return;
      const userDoc = await getDoc(doc(db, 'users', email));
      if (userDoc.exists()) {
        setOwnerData(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching owner data:', error);
    } finally {
      setOwnerLoading(false);
    }
  };

  useEffect(() => {
    fetch(`https://server-fare-bd.vercel.app/searchByDivision/${data?.division}`)
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data);
      });
  }, [data]);

  // Handle sending initial message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user?.email || !data?.createdBy?.email) return;

    try {
      setSendingMessage(true);

      // Add message to messages collection
      const messageData = {
        senderEmail: user.email,
        toEmail: data.createdBy.email,
        text: messageInput.trim(),
        timestamp: serverTimestamp(),
        read: false
      };

      await addDoc(collection(db, 'messages'), messageData);

      // Close modal and navigate to chat
      setShowChatModal(false);
      setMessageInput("");
      setSendingMessage(false);
      
      toast.success('Message sent successfully!');

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setSendingMessage(false);
    }
  };

  // Fetch owner data when property data changes
  useEffect(() => {
    if (data?.createdBy?.email) {
      fetchOwnerData(data.createdBy.email);
    } else {
      setOwnerLoading(false);
    }
  }, [data?.createdBy?.email]);

  // checking if the wishlist exist or not
  useEffect(() => {
    if (!user?.email) return;
    fetch(`https://server-fare-bd.vercel.app/wishlist/${data?._id}?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.userEmail === user.email) {
          setWishList(true);
        } else setWishList(false);
      });
  }, [data?._id, user?.email]);

  // console.log(data._id);
  const priceWithCommas = numberWithCommas(data.price);

  const {
    property_picture,
    property_type,
    area_type,
    division,
    authorName,
    _id,
    location,
    property_name,
    owner_name,
    price,
    property_condition,
  } = data;
  // console.log(data);

  const { data: comments = [], refetch } = useQuery({
    queryKey: ["comment"],

    queryFn: async () => {
      const res = await fetch(`https://server-fare-bd.vercel.app/comment/${_id}`);
      const data = await res.json();
      // console.log(data);
      return data;
    },
  });

  return (
    <div className="my-16 mb-16 max-w-[1440px] w-[95%] mx-auto overflow-x-auto">
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-1 lg:col-span-4 md:col-span-2">

          {(() => {


            // If no photos, render nothing
            if (!data.photos || data.photos.length === 0) {
              return null;
            }

            const goToSlide = (idx) => setCurrentSlide(idx);
            const prevSlide = () =>
              setCurrentSlide((prev) =>
                prev === 0 ? data.photos.length - 1 : prev - 1
              );
            const nextSlide = () =>
              setCurrentSlide((prev) =>
                prev === data.photos.length - 1 ? 0 : prev + 1
              );

            return (
              <div className="w-full relative">
                <div className="overflow-hidden rounded-lg relative" style={{ maxHeight: "500px" }}>
                  <img
                    src={data.photos[currentSlide]}
                    alt={`property_picture_${currentSlide}`}
                    className="w-full h-[500px] object-cover"
                  />
                  {data.photos.length > 1 && (
                    <>
                      {/* Prev/Next buttons */}
                      <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow focus:outline-none z-10"
                        aria-label="Previous slide"
                        type="button"
                      >
                        &#8592;
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow focus:outline-none z-10"
                        aria-label="Next slide"
                        type="button"
                      >
                        &#8594;
                      </button>
                    </>
                  )}
                </div>
                {data.photos.length > 1 && (
                  <div className="flex justify-center mt-2 space-x-2">
                    {data.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`w-3 h-3 rounded-full border-2 border-secondary focus:outline-none ${idx === currentSlide ? 'bg-secondary' : 'bg-gray-300'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                        onClick={() => goToSlide(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
          <div className="my-5 text-area text-primary">
            <div className="m">
              <div className="flex justify-between">
                <div className="flex flex-col items-start">
                  <div className="flex items-end gap-3 mb-3">
                    <h2 className="text-4xl font-bold text-orange-500 tracking-tight flex items-center">
                      <span>{priceWithCommas}</span>
                      <TbCurrencyDollar className="inline ml-1 text-3xl text-orange-400" />
                      <span className="text-lg font-medium text-gray-500 ml-2">/month</span>
                    </h2>
                    {data.leaseType === "Rental with Option to buy" && data.fullValueOfProperty && (
                      <span className="ml-6 px-3 py-1 rounded-lg bg-orange-50 text-orange-700 text-base font-semibold shadow-sm border border-orange-200 flex items-center">
                        Full Value: <span className="ml-1">{numberWithCommas(data.fullValueOfProperty)}</span>
                        <TbCurrencyDollar className="inline ml-1 text-lg text-orange-400" />
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Lease Type Badge */}
                  {data.leaseType && (
                    <span className="badge bg-primary text-white me-2" style={{ padding: '0.4em 0.8em', borderRadius: '0.5em', fontSize: '1em' }}>
                      {data.leaseType}
                    </span>
                  )}
                  {/* Type Badge */}
                  {data.type && (
                    <span className="badge bg-primary text-white me-2" style={{ padding: '0.4em 0.8em', borderRadius: '0.5em', fontSize: '1em' }}>
                      {data.type}
                    </span>
                  )}

                </div>
              </div>

              <h2 className="mb-2 text-xl font-semibold">
                <FaMapMarkerAlt className="inline mb-1 mr-2" />
                {data.location}
              </h2>

            </div>
            <h2 className="py-3 my-3 text-2xl font-semibold border-t-2 border-secondary">
              {data.title}
            </h2>
            <div className="property-details">
              <p className="my-3 text-lg text-gray-500">{data.description}</p>
            </div>
            <div className="m">
              <h2 className="py-3 mt-3 text-2xl font-semibold">
                PROPERTY INFORMATION
              </h2>

              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {data.type === "plot" ? "Development Plan" : "Type of Building"}
                      </th>
                      <td className="px-6 py-4">
                        {data.type === "plot" ? 
                          Array.isArray(data.developmentPlan) && data.developmentPlan.length > 0 ? (
                            data.developmentPlan.map((plan, idx) => (
                              <span
                                key={idx}
                                className="badge bg-secondary text-white me-2 mr-2"
                                style={{ padding: '0.4em 0.8em', borderRadius: '0.5em', fontSize: '1em', display: 'inline-block', marginBottom: '0.25em' }}
                              >
                                {plan}
                              </span>
                            ))
                          ) : (
                            <span>{data.developmentPlan}</span>
                          )
                          : (
                            <span
                              className="badge bg-secondary text-white me-2"
                              style={{ padding: '0.4em 0.8em', borderRadius: '0.5em', fontSize: '1em', display: 'inline-block', marginBottom: '0.25em' }}
                            >
                              {data.buildingType}
                            </span>
                          )
                        }
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Accessibility
                      </th>
                      <td className="px-6 py-4">{data.accessibility}</td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Public Lighting
                      </th>
                      <td className="px-6 py-4">{data.publicLighting ? "Yes" : "No"}</td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Sidewalk
                      </th>
                      <td className="px-6 py-4">{data.sidewalk ? "Yes" : "No"}</td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Water Supply
                      </th>
                      <td className="px-6 py-4">{data.utilities.water ? "Yes" : "No"}</td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Electricity
                      </th>
                      <td className="px-6 py-4">{data.utilities.electricity ? "Yes" : "No"}</td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Sewer
                      </th>
                      <td className="px-6 py-4">{data.utilities.sewer ? "Yes" : "No"}</td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Gas
                      </th>
                      <td className="px-6 py-4">{data.utilities.gas ? "Yes" : "No"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* comments section ends here  */}

        {/*--------- right sidebar -------- */}
        <div className="col-span-1 mx-auto lg:col-span-2 md:col-span-1">
          {/* Owner Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Property Owner
            </h3>

            {ownerLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : ownerData ? (
              <div className="space-y-4">
                {/* Owner Photo and Name */}
                <div className="flex items-center space-x-4">
                  {ownerData.photoURL || ownerData.img ? (
                    <img
                      src={ownerData.photoURL || ownerData.img}
                      alt={ownerData.name || "Owner"}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {ownerData.name ? ownerData.name.charAt(0).toUpperCase() : 'O'}
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {ownerData.name || 'Property Owner'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {ownerData.role || 'Owner'}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  {/* Email */}
                  {ownerData.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-800 break-all">
                          {ownerData.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {ownerData.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-800">
                          {ownerData.phone}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Member Since */}
                  {ownerData.createdAt && (
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Member Since</p>
                        <p className="text-sm font-medium text-gray-800">
                          {ownerData.createdAt.toDate?.()?.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  {/* Chat Button */}
                  {(user?.email !== ownerData.email) && <button
                    onClick={() => {
                      if (user?.email) {
                        setShowChatModal(true);
                      } else {
                        toast.error('Please login to chat with the owner');
                      }
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat Here
                  </button>}

                  {/* Call Button */}
                  {ownerData.phone && (
                    <button
                      onClick={() => {
                        if (ownerData.phone) {
                          window.open(`tel:${ownerData.phone}`, '_self');
                        }
                      }}
                      className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Owner
                    </button>
                  )}

                  {/* Email Button */}
                  {ownerData.email && (
                    <button
                      onClick={() => {
                        if (ownerData.email) {
                          window.open(`mailto:${ownerData.email}`, '_self');
                        }
                      }}
                      className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </button>
                  )}
                </div>

                {/* Additional Info */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    Contact the owner directly for more information about this property
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Owner information not available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Message to {ownerData?.name || 'Owner'}
                </h3>
                <button
                  onClick={() => {
                    setShowChatModal(false);
                    setMessageInput("");
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Owner Info */}
              <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg">
                {ownerData?.photoURL || ownerData?.img ? (
                  <img
                    src={ownerData.photoURL || ownerData.img}
                    alt={ownerData.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                    {ownerData?.name ? ownerData.name.charAt(0).toUpperCase() : 'O'}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {ownerData?.name || 'Property Owner'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {data?.title || 'Property Owner'}
                  </p>
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={`Hi ${ownerData?.name || 'there'}! I'm interested in your property...`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {messageInput.length}/500 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowChatModal(false);
                      setMessageInput("");
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sendingMessage}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {sendingMessage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Tips for a great message:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Introduce yourself briefly</li>
                  <li>• Mention why you're interested in the property</li>
                  <li>• Ask specific questions about availability, viewing, etc.</li>
                  <li>• Be polite and professional</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePropertyPage;
